"""
price_tracker.py - run it over data/parsed after each unit update.

    python price_tracker.py                 # reads ../data/parsed, writes price_tracking/prices.json + changes.md
    python price_tracker.py --root ../data/parsed --out price_tracking --top 40

What it does
  1. Records EVERY price in the unit files into price_tracking/prices.json: each model's points and stats, each
     option choice's points, plus what the points calculator (price_calculator.py) says for the same stats:
     the body, the best ranged weapon, the best pistol, the best melee weapon, and the sum ("estimate").
     The file is stable (sorted keys, no timestamp) so it can be committed and diffed.
  2. Compares with the previous prices.json and writes price_tracking/changes.md: which prices changed, which
     STATS changed while the price did not (the thing that is easy to forget), new and removed units/options.
  3. Prints the models whose sheet price is furthest from the estimate. The formula prices stats only (special
     rules are priced by hand), so a gap is a question for the designer, never an automatic correction.

Nothing in data/parsed is ever modified.
"""
import argparse
import json
import re
import statistics
import sys
from datetime import date
from pathlib import Path

import price_calculator as pc

HERE = Path(__file__).parent


def load_units(root):
    units = []
    for faction_dir in sorted(p for p in Path(root).iterdir() if p.is_dir()):
        units_dir = faction_dir / "units"
        if not units_dir.is_dir():
            continue
        for path in sorted(units_dir.rglob("*.json")):
            try:
                data = json.loads(path.read_text(encoding="utf-8"))
            except (ValueError, OSError):
                continue
            for u in (data if isinstance(data, list) else [data]):
                if isinstance(u, dict) and u.get("name") and u.get("models") is not None:
                    units.append((faction_dir.name, u))
    return units


def r2(x):
    return None if x is None else round(x, 2)


def model_record(unit, model):
    body = pc.model_body_price(unit, model)
    ranged, pistol, melee = pc.loadout_weapon_price(unit, model)
    est = None
    if body is not None:
        est = body + ranged + (0.0 if ranged else pistol) + melee
    pts = model.get("points")
    return {
        "points": pts,
        "stats": {k: model["stats"][k] for k in sorted(model.get("stats") or {})},
        "vehicle": bool(unit.get("is_vehicle")),
        "body": r2(body),
        "ranged": r2(ranged),
        "pistol": r2(pistol),
        "melee": r2(melee),
        "estimate": r2(est),
        "ratio": r2(pts / est) if (pts and est) else None,
    }


def option_records(unit):
    out = {}
    base = None
    first = next((m for m in unit.get("models", []) if (m.get("max") or 0) > 0), None)
    if first:
        st = first.get("stats") or {}
        base = (pc.num(st.get("S")), pc.num(st.get("BS")), pc.num(st.get("WS")))
    groups = {}
    for wp in unit.get("weapons") or []:
        groups.setdefault(pc.base_name(wp.get("name")), []).append(wp)
    for gi, g in enumerate(unit.get("option_groups") or []):
        header = (g.get("header") or "").strip()
        old_name = None
        m = re.search(r"swap (?:their|its|both|the)?\s*([A-Za-z0-9' -]+?)(?:[:.,]|$| for | with )", header, re.I)
        if m:
            old_name = pc.base_name(m.group(1))
        if g.get("inline_pts") is not None:
            out["%d|%s|(inline)" % (gi, header[:80])] = {"points": g["inline_pts"], "formula_delta": None}
        for c in g.get("choices") or []:
            fd = None
            if base and pc.base_name(c["name"]) in groups:
                new = pc.weapon_group_price(groups[pc.base_name(c["name"])], *base)
                old = pc.weapon_group_price(groups[old_name], *base) if old_name in groups else 0.0
                if new is not None and old is not None:
                    fd = new - old
            out["%d|%s|%s" % (gi, header[:80], c["name"])] = {"points": c.get("points"), "formula_delta": r2(fd)}
    return out


def build(root):
    result = {}
    for faction, unit in load_units(root):
        key = faction + "/" + unit["name"]
        rec = {"models": {}, "options": option_records(unit)}
        for model in (unit.get("models") or []) + (unit.get("variant_models") or []):
            if model.get("name") and model.get("stats"):
                rec["models"][model["name"]] = model_record(unit, model)
        result[key] = rec
    return result


def diff(old, new):
    lines = []
    def head(t):
        lines.extend(["", "## " + t, ""])
    price_only, stats_only, both, added, removed, opts = [], [], [], [], [], []
    for key in sorted(set(old) | set(new)):
        if key not in new:
            removed.append("- " + key + " (unit removed)")
            continue
        if key not in old:
            added.append("- " + key + " (new unit, " + ", ".join(
                "%s %s pts" % (n, m["points"]) for n, m in new[key]["models"].items()) + ")")
            continue
        for name in sorted(set(old[key]["models"]) | set(new[key]["models"])):
            o, n = old[key]["models"].get(name), new[key]["models"].get(name)
            label = "%s / %s" % (key, name)
            if o is None:
                added.append("- %s: new model, %s pts" % (label, n["points"]))
                continue
            if n is None:
                removed.append("- %s: model removed" % label)
                continue
            sc, pcg = o["stats"] != n["stats"], o["points"] != n["points"]
            delta = "" if (o["body"] is None or n["body"] is None) else " (formula body %s -> %s)" % (o["body"], n["body"])
            if pcg and not sc:
                price_only.append("- %s: %s -> %s pts, stats unchanged" % (label, o["points"], n["points"]))
            elif sc and not pcg:
                diffs = ", ".join("%s %s->%s" % (k, o["stats"].get(k), n["stats"].get(k)) for k in sorted(set(o["stats"]) | set(n["stats"])) if o["stats"].get(k) != n["stats"].get(k))
                stats_only.append("- %s: stats changed (%s) but the price stayed %s%s" % (label, diffs, n["points"], delta))
            elif sc and pcg:
                both.append("- %s: %s -> %s pts, stats changed%s" % (label, o["points"], n["points"], delta))
        for ok in sorted(set(old[key]["options"]) | set(new[key]["options"])):
            o, n = old[key]["options"].get(ok), new[key]["options"].get(ok)
            label = "%s / %s" % (key, ok.split("|", 1)[1].replace("|", " | "))
            if o and n and o["points"] != n["points"]:
                opts.append("- %s: %s -> %s pts" % (label, o["points"], n["points"]))
            elif o and not n:
                opts.append("- %s: option removed" % label)
            elif n and not o:
                opts.append("- %s: new option, %s pts" % (label, n["points"]))
    for title, items in (("Stats changed but the price did NOT (check these first)", stats_only),
                         ("Price changed, stats unchanged", price_only),
                         ("Stats and price both changed", both),
                         ("Option prices", opts), ("New", added), ("Removed", removed)):
        head("%s (%d)" % (title, len(items)))
        lines.extend(items if items else ["(none)"])
    return lines


def report(new, top):
    rows = []
    for key, rec in new.items():
        for name, m in rec["models"].items():
            if m["ratio"] is not None and m["estimate"] and m["estimate"] > 3:
                rows.append((m["ratio"], key + " / " + name, m))
    if not rows:
        return
    ratios = [r[0] for r in rows]
    med = statistics.median(ratios)
    within = sum(1 for r in ratios if 0.8 <= r / med <= 1.25) / len(ratios)
    print("models with a formula estimate: %d | median sheet/estimate: %.2f | within -20%%/+25%% of the median: %.0f%%" % (len(rows), med, within * 100))
    rows.sort(key=lambda r: abs(r[0] / med - 1), reverse=True)
    print("furthest from the median (a gap is a question, not an error):")
    for ratio, label, m in rows[:top]:
        print("  %-62s sheet %6s  formula %7s  ratio %.2f" % (label[:62], m["points"], m["estimate"], ratio))


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=str(HERE.parent / "data" / "parsed"))
    ap.add_argument("--out", default=str(HERE / "price_tracking"))
    ap.add_argument("--top", type=int, default=25)
    args = ap.parse_args(argv)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    prices_path = out / "prices.json"
    old = {}
    if prices_path.exists():
        try:
            old = json.loads(prices_path.read_text(encoding="utf-8"))
        except ValueError:
            old = {}
    new = build(args.root)
    prices_path.write_text(json.dumps(new, indent=1, sort_keys=True, ensure_ascii=False) + "\n", encoding="utf-8")
    if old:
        body = diff(old, new)
        (out / "changes.md").write_text("# Price changes since the previous run (%s)\n%s\n" % (date.today().isoformat(), "\n".join(body)), encoding="utf-8")
        print("wrote %s and changes.md (%d units compared with the previous run)" % (prices_path.name, len(old)))
    else:
        print("wrote %s (first run: nothing to compare with)" % prices_path.name)
    report(new, args.top)
    return 0


if __name__ == "__main__":
    sys.exit(main())

"""
price_calculator.py - the Custom40k points formulas (Dominic's "Points calculator", sheet "Punkterechner v5"),
in plain Python so the update pipeline can run them.

WHERE THIS COMES FROM: Codex/Points calculator_v5.5.xlsx. The tables are in price_tables.json (copied cell
for cell; v5.4 and v5.5 have identical tables and formulas, only the sample rows differ). The formulas were
read out of the cells N5 (creature), N9 (vehicle), I13 (ranged weapon) and I17 (melee weapon):

    creature = (S + T + I + A + LD + Movement) x Wounds x SaveMultiplier x WardMultiplier     (flying: Movement x 2)
    vehicle  = (S + Front + Side + Back + I + A + Movement) x HullPoints x WardMultiplier + Transport   (armour RAW)
    ranged   = (Range + Strength + AP) x Shots x Damage x BS multiplier
    melee    = (Strength + AP) x Damage x WS multiplier

WHAT IT IS NOT: a verdict. His own words: the formula prices stats, it does not read a datasheet; special rules
are priced by hand (sheet "Sonderregeln & Punkte"). Everything built on it here is "formula says X, the sheet says
Y": a number for the designer to look at, never an automatic correction.

His homebrew notes (column Q of the calculator) that this module applies:
  - a pistol is calculated with a 50% discount, and is free when the model also has a regular ranged weapon;
  - only the most expensive profile of a weapon counts; a weapon with an "Overheating" profile takes the average
    of its profiles;
  - Blast(4) and Blast(6) weapons take 2.7425 and 3.8395 shots;
  - a weapon that hits automatically takes the OPPOSITE BS value (BS 2+ pays like BS 5+);
  - if a model has a save and a ward save, the better one is the "Sv" and the other the ward.

Self test (the sample row of the workbook): python price_calculator.py
"""
import json
import re
from pathlib import Path

_TABLES = None


def tables():
    global _TABLES
    if _TABLES is None:
        raw = json.loads((Path(__file__).parent / "price_tables.json").read_text(encoding="utf-8"))
        _TABLES = {k: v for k, v in raw.items() if not k.startswith("_")}
    return _TABLES


def _lookup(name, value, fallback=0.0):
    t = tables()[name]
    key = str(int(round(value)))
    return t[key] if key in t else fallback


def _ladder(name, value):
    rows = tables()[name]
    for at, cost in rows:
        if value <= at:
            return cost
    return rows[-1][1] + (1.5 if value > 72 else 0)


def creature_points(s, t, w, i, a, ld, sv, ward, move, flying=False):
    """sv / ward as their numbers: 3 for "3+"; sv 1 = no save, ward 0 = none."""
    base = (_lookup("strength", s) + _lookup("toughness", t) + _lookup("initiative", i) + _lookup("attacks", a)
            + _lookup("leadership", ld) + _ladder("movement", move) * (2 if flying else 1))
    return base * max(1, w) * _lookup("save", sv, 1) * _lookup("ward", ward, 1)


def vehicle_points(s, front, side, back, i, a, hp, ward, move, transport=0, anti_grav=False):
    base = (_lookup("strength", s) + front + side + back + _lookup("initiative", i) + _lookup("attacks", a)
            + _ladder("movement", move) * (2 if anti_grav else 1))
    return base * max(1, hp) * _lookup("ward", ward, 1) + transport


def ranged_points(range_, shots, s, ap, damage, bs):
    bracket = _ladder("range", range_) + _lookup("sRanged", s) + _lookup("apRanged", ap)
    return bracket * shots * damage * _lookup("skill", bs, 1)


def melee_points(s, ap, damage, ws):
    return (_lookup("sMelee", s) + _lookup("apMelee", ap)) * damage * _lookup("skill", ws, 1)


# ---------------------------------------------------------------- reading the app's unit JSON

def num(text):
    """3 from '3', '3+', '6"', '+3'; None from '-' or ''."""
    m = re.search(r"\d+(?:\.\d+)?", str(text if text is not None else ""))
    return float(m.group(0)) if m else None


def _damage(text):
    t = str(text or "1").strip().upper()
    m = re.match(r"D(\d+)(?:\s*\+\s*(\d+))?", t)
    if m:
        return (int(m.group(1)) + 1) / 2.0 + (int(m.group(2)) if m.group(2) else 0)
    n = num(t)
    return n if n is not None else 1.0


def _shots(wp):
    ab = str(wp.get("abilities") or "")
    blast = re.search(r"Blast\((\d+)\)", ab)
    if blast:
        return {"4": 2.7425, "6": 3.8395}.get(blast.group(1), 2.7425)
    m = re.match(r"\s*(?:Pistol|Assault|Heavy|Rapid Fire|Grenade)\s*(\d+)", str(wp.get("type") or ""))
    return float(m.group(1)) if m else 1.0


def is_melee(wp):
    return str(wp.get("type") or "").strip().lower() == "melee" or str(wp.get("range") or "").strip().lower() in ("melee", "-", "")


def weapon_price(wp, model_s, bs, ws):
    """Price of ONE weapon profile for a model with these S / BS / WS, or None when it cannot be read."""
    ab = str(wp.get("abilities") or "")
    ap_raw = num(wp.get("ap"))
    ap = abs(ap_raw) if ap_raw is not None else 0
    dmg = _damage(wp.get("d"))
    if is_melee(wp):
        st = str(wp.get("s") or "").strip()
        if st.upper() == "U":
            s = model_s
        elif st.startswith("+") and model_s is not None:
            s = model_s + (num(st) or 0)
        elif st.lower().startswith("x") and model_s is not None:
            s = model_s * (num(st) or 1)
        else:
            s = num(st)
        if s is None or ws is None:
            return None
        return melee_points(s, ap, dmg, ws)
    s = num(wp.get("s"))
    rng = num(wp.get("range"))
    if s is None or rng is None or bs is None:
        return None
    use_bs = bs
    if re.search(r"Auto Hit", ab, re.I):
        use_bs = max(1, min(6, 7 - bs))
    price = ranged_points(rng, _shots(wp), s, ap, dmg, use_bs)
    if re.match(r"\s*Pistol", str(wp.get("type") or "")):
        price *= 0.5
    return price


def weapon_group_price(profiles, model_s, bs, ws):
    """A weapon with several profiles ('Plasma gun - Standard' / '- Overheating'): the most expensive profile,
    or the average of the profiles when one of them has Overheating."""
    prices = [weapon_price(p, model_s, bs, ws) for p in profiles]
    prices = [p for p in prices if p is not None]
    if not prices:
        return None
    if any(re.search(r"Overheating", str(p.get("abilities") or ""), re.I) for p in profiles) and len(prices) > 1:
        return sum(prices) / len(prices)
    return max(prices)


def base_name(name):
    return re.split(r"\s+-\s+|\s*\(", str(name))[0].strip().lower()


def _ward(unit, model):
    best = 0
    text = " ".join(str(a) for a in (unit.get("abilities") or []))
    for m in re.finditer(r"Ward\((\d)\+\)", text):
        v = int(m.group(1))
        best = v if best == 0 or v < best else best
    return best


def model_body_price(unit, model):
    """Formula price of the model's body (no weapons, no special rules), or None if the stats are incomplete."""
    st = model.get("stats") or {}
    g = lambda k: num(st.get(k))
    ward = _ward(unit, model)
    ab = " ".join(str(a) for a in (unit.get("abilities") or []))
    if unit.get("is_vehicle"):
        need = [g("S"), g("FRONT"), g("SIDE"), g("REAR"), g("I"), g("A"), g("HP"), g("M")]
        if any(x is None for x in need):
            return None
        cap = re.search(r"transport capacity of (\d+)", ab)
        return vehicle_points(g("S"), g("FRONT"), g("SIDE"), g("REAR"), g("I"), g("A"), g("HP"), ward, g("M"),
                              int(cap.group(1)) if cap else 0, bool(re.search(r"Anti-Grav", ab)))
    need = [g("S"), g("T"), g("W"), g("I"), g("A"), g("LD"), g("M")]
    if any(x is None for x in need):
        return None
    sv = g("SV") or 1
    if ward and ward < sv:
        sv, ward = ward, int(sv) if sv > 1 else 0
    flying = "flyer" in str(unit.get("unit_type") or "").lower()
    return creature_points(g("S"), g("T"), g("W"), g("I"), g("A"), g("LD"), sv, ward, g("M"), flying)


def loadout_weapon_price(unit, model):
    """(ranged, pistol, melee) = most expensive of each kind among the weapons the datasheet names in its
    'equipped_with' sentence. Pistols only count (at 50%) when there is no regular ranged weapon."""
    st = model.get("stats") or {}
    bs, ws, s = num(st.get("BS")), num(st.get("WS")), num(st.get("S"))
    eq = str(unit.get("equipped_with") or "").lower()
    groups = {}
    for wp in unit.get("weapons") or []:
        groups.setdefault(base_name(wp.get("name")), []).append(wp)
    best = {"ranged": 0.0, "pistol": 0.0, "melee": 0.0}
    for name, profiles in groups.items():
        if not name or name not in eq:
            continue
        price = weapon_group_price(profiles, s, bs, ws)
        if price is None:
            continue
        kind = "melee" if is_melee(profiles[0]) else ("pistol" if re.match(r"\s*Pistol", str(profiles[0].get("type") or "")) else "ranged")
        best[kind] = max(best[kind], price)
    return best["ranged"], best["pistol"], best["melee"]


def selftest():
    cases = [
        ("creature", creature_points(3, 3, 3, 4, 2, 7, 5, 0, 6, False), 19.0),
        ("vehicle", vehicle_points(7, 14, 14, 11, 3, 1, 4, 0, 6, 0, False), 200.0),
        ("ranged", ranged_points(24, 2.7425, 5, 2, 1, 1), 30.1675),
        ("melee", melee_points(10, 3, 3, 1), 36.0),
    ]
    bad = 0
    for name, got, want in cases:
        ok = abs(got - want) < 1e-3
        bad += 0 if ok else 1
        print(("PASS " if ok else "FAIL ") + name + ": got " + str(round(got, 4)) + ", workbook says " + str(want))
    return bad


if __name__ == "__main__":
    raise SystemExit(selftest())

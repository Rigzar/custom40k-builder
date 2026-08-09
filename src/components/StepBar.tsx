import { useT } from '../i18n';

/**
 * The four steps of building an army. This replaced the old browser-style tab bar, which showed
 * "what windows are open" (Home / Config / <army name> / Allied: X) rather than "where you are and
 * what is left". Those tabs had close buttons, mixed a place, a step and two documents on one row,
 * and — worst of all — the bar was hidden for the whole first half of the flow and then appeared
 * out of nowhere. See `Step` in App.tsx for how the steps map onto the old tabs.
 */
export type Step = 'faction' | 'config' | 'units' | 'review';

const STEP_ORDER: Step[] = ['faction', 'config', 'units', 'review'];

export function StepBar({
  step, unlocked, onGo, onHome,
  loggedIn, username, onAccountClick, onCampaignClick,
}: {
  step: Step;
  /** Steps 2-4 stay locked (and say why) until a faction's data has actually loaded. */
  unlocked: boolean;
  onGo: (s: Step) => void;
  onHome: () => void;
  loggedIn: boolean;
  username: string | null;
  onAccountClick: () => void;
  onCampaignClick: () => void;
}) {
  const t = useT();

  const LABEL: Record<Step, string> = {
    faction: t('stepFaction'),
    config:  t('stepConfig'),
    units:   t('stepUnits'),
    review:  t('stepReview'),
  };

  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <div className="flex items-stretch h-[38px] bg-zinc-950 border-b border-zinc-800">
      {/* Home — leaving the flow never discards anything, so this needs no confirmation. */}
      <button
        onClick={onHome}
        title={t('homeLabel')}
        className="flex items-center shrink-0 px-3 text-zinc-500 hover:text-amber-400 border-r border-zinc-800 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </button>

      <div className="flex items-stretch overflow-x-auto flex-1 min-w-0 px-1">
        {STEP_ORDER.map((s, i) => {
          const active   = s === step;
          const done     = i < currentIndex;
          const locked   = i > 0 && !unlocked;
          const disabled = locked;
          return (
            <div key={s} className="flex items-stretch shrink-0">
              {i > 0 && (
                <span className="flex items-center px-0.5 text-zinc-700 text-[10px] select-none" aria-hidden="true">▸</span>
              )}
              <button
                onClick={() => { if (!disabled) onGo(s); }}
                disabled={disabled}
                title={locked ? t('stepLockedHint') : undefined}
                aria-current={active ? 'step' : undefined}
                className={`
                  flex items-center gap-1.5 px-2.5 sm:px-3 text-[11px] uppercase tracking-wide font-cinzel
                  select-none border-b-2 transition-colors
                  ${active
                    ? 'border-amber-600 text-amber-300 bg-zinc-900/70'
                    : disabled
                      ? 'border-transparent text-zinc-700 cursor-not-allowed'
                      : done
                        ? 'border-transparent text-zinc-400 hover:text-amber-400 hover:bg-zinc-900/30 cursor-pointer'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30 cursor-pointer'
                  }
                `}
              >
                <span
                  className={`
                    flex items-center justify-center w-[15px] h-[15px] text-[9px] leading-none shrink-0 rounded-full border
                    ${active
                      ? 'border-amber-500 text-amber-300'
                      : done
                        ? 'border-amber-800 bg-amber-900/40 text-amber-500'
                        : 'border-zinc-700 text-zinc-600'
                    }
                  `}
                >
                  {done ? '✓' : i + 1}
                </span>
                {/* The label of the step you are ON always stays visible, even on a narrow phone;
                    the others collapse to their number so all four still fit without scrolling. */}
                <span className={active ? '' : 'hidden sm:inline'}>{LABEL[s]}</span>
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={onCampaignClick}
        title={t('campaignAlphaTooltip')}
        className="flex items-center shrink-0 gap-1 px-2 sm:px-3 text-[11px] uppercase tracking-wide font-cinzel text-zinc-500 hover:text-red-400 transition-colors border-l border-zinc-800"
      >
        <span>⚔</span>
        <span className="hidden md:inline">{t('campaign')}</span>
        <span className="hidden md:inline text-[9px] text-red-500/70">ALPHA</span>
      </button>
      <button
        onClick={onAccountClick}
        className="flex items-center shrink-0 gap-1.5 px-2 sm:px-3 text-[11px] uppercase tracking-wide font-cinzel text-zinc-400 hover:text-amber-400 transition-colors border-l border-zinc-800"
      >
        <span>☁</span>
        <span className="hidden md:inline">{loggedIn ? username : t('login')}</span>
      </button>
    </div>
  );
}

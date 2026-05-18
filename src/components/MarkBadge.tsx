const MARK_COLORS: Record<string, string> = {
  Khorne:    'bg-red-800 text-white',
  Nurgle:    'bg-green-800 text-white',
  Slaanesh:  'bg-purple-700 text-white',
  Tzeentch:  'bg-blue-700 text-white',
  Undivided: 'bg-zinc-600 text-white',
};

interface Props { mark: string; suffix?: string; }

export function MarkBadge({ mark, suffix }: Props) {
  const cls = MARK_COLORS[mark] ?? 'bg-zinc-700 text-white';
  return (
    <span className={`inline-block px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded ${cls}`}>
      {mark}{suffix ? ` ${suffix}` : ''}
    </span>
  );
}

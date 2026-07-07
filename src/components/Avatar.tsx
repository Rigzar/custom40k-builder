interface AvatarProps {
  username: string;
  avatar?: string | null;
  size?: number;
  className?: string;
}

function hue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h) % 360;
}

export function Avatar({ username, avatar, size = 32, className = '' }: AvatarProps) {
  const initial = (username[0] ?? '?').toUpperCase();
  const h = hue(username);

  if (avatar) {
    return (
      <div
        className={`rounded-full overflow-hidden flex items-center justify-center bg-zinc-800 border border-zinc-700 shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={`/faction-symbols/${avatar}.svg`}
          alt={username}
          style={{ width: size * 0.7, height: size * 0.7, filter: 'brightness(0) invert(1) opacity(0.85)' }}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 font-bold select-none ${className}`}
      style={{
        width: size, height: size,
        background: `hsl(${h}, 55%, 25%)`,
        border: `1px solid hsl(${h}, 55%, 38%)`,
        color: `hsl(${h}, 60%, 70%)`,
        fontSize: size * 0.42,
      }}
    >
      {initial}
    </div>
  );
}

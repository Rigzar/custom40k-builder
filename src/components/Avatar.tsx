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

/** Parse stored avatar string into a typed descriptor. */
export function parseAvatar(avatar: string | null | undefined):
  | { type: 'faction'; key: string; color: string }
  | { type: 'custom';  src: string }
  | null {
  if (!avatar) return null;
  if (avatar.startsWith('data:')) return { type: 'custom', src: avatar };
  const hi = avatar.indexOf('#');
  if (hi >= 0) return { type: 'faction', key: avatar.slice(0, hi), color: avatar.slice(hi) };
  return { type: 'faction', key: avatar, color: '#ffffff' };
}

export function Avatar({ username, avatar, size = 32, className = '' }: AvatarProps) {
  const initial = (username[0] ?? '?').toUpperCase();
  const h = hue(username);
  const parsed = parseAvatar(avatar);

  if (parsed?.type === 'custom') {
    return (
      <div
        className={`rounded-full overflow-hidden shrink-0 bg-zinc-800 border border-zinc-700 ${className}`}
        style={{ width: size, height: size }}
      >
        <img src={parsed.src} alt={username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
      </div>
    );
  }

  if (parsed?.type === 'faction') {
    // key is either "faction-symbols/orks" (new) or bare "orks" (legacy → faction-symbols/)
    const svgPath = parsed.key.includes('/') ? `/${parsed.key}.svg` : `/faction-symbols/${parsed.key}.svg`;
    return (
      <div
        className={`rounded-full flex items-center justify-center shrink-0 bg-zinc-900 border border-zinc-700 ${className}`}
        style={{ width: size, height: size }}
      >
        <div style={{
          width:  size * 0.65,
          height: size * 0.65,
          backgroundColor: parsed.color,
          WebkitMaskImage: `url(${svgPath})`,
          maskImage:        `url(${svgPath})`,
          WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
          WebkitMaskSize:   'contain',   maskSize:   'contain',
          WebkitMaskPosition: 'center',  maskPosition: 'center',
        }} />
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

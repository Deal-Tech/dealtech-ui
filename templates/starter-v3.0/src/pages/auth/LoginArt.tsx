/* Ilustrasi panel kanan: jendela aplikasi dengan simpul modul yang terhubung. */
export default function LoginArt() {
  return (
    <svg
      className="login-art"
      viewBox="0 0 340 260"
      fill="none"
      role="img"
      aria-label="Ilustrasi panel admin"
    >
      <defs>
        <filter id="la-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#001f3d" floodOpacity="0.28" />
        </filter>
      </defs>

      {/* garis penghubung */}
      <path
        d="M74 74h34a14 14 0 0 1 14 14v42a14 14 0 0 0 14 14h20"
        stroke="rgba(255,255,255,.38)"
        strokeWidth="2"
      />
      <path d="M74 130h60" stroke="rgba(255,255,255,.38)" strokeWidth="2" />
      <path
        d="M74 186h34a14 14 0 0 0 14-14v-28a14 14 0 0 1 14-14h20"
        stroke="rgba(255,255,255,.38)"
        strokeWidth="2"
      />

      {/* jendela aplikasi */}
      <g filter="url(#la-shadow)">
        <rect x="156" y="52" width="164" height="156" rx="12" fill="#ffffff" />
        <rect x="156" y="52" width="164" height="26" rx="12" fill="#eef2f7" />
        <rect x="156" y="66" width="164" height="12" fill="#eef2f7" />
        <circle cx="171" cy="65" r="3.4" fill="#f87171" />
        <circle cx="182" cy="65" r="3.4" fill="#fbbf24" />
        <circle cx="193" cy="65" r="3.4" fill="#34d399" />

        <rect x="170" y="92" width="62" height="8" rx="4" fill="#cbd5e1" />

        <rect x="170" y="112" width="136" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="184" cy="124" r="6" fill="var(--color-primary)" opacity=".8" />
        <rect x="198" y="120" width="60" height="7" rx="3.5" fill="#cbd5e1" />
        <rect x="276" y="119" width="22" height="9" rx="4.5" fill="#dbeafe" />

        <rect x="170" y="144" width="136" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="184" cy="156" r="6" fill="var(--color-primary)" opacity=".55" />
        <rect x="198" y="152" width="78" height="7" rx="3.5" fill="#cbd5e1" />
        <rect x="286" y="151" width="12" height="9" rx="4.5" fill="#dcfce7" />

        <rect x="170" y="176" width="136" height="24" rx="6" fill="#f1f5f9" />
        <circle cx="184" cy="188" r="6" fill="var(--color-primary)" opacity=".3" />
        <rect x="198" y="184" width="48" height="7" rx="3.5" fill="#cbd5e1" />
        <rect x="276" y="183" width="22" height="9" rx="4.5" fill="#fef9c3" />
      </g>

      {/* simpul modul */}
      <g filter="url(#la-shadow)">
        <rect x="30" y="50" width="48" height="48" rx="14" fill="#ffffff" />
        <path
          d="M46 74a8 8 0 1 1 16 0M54 66a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
          stroke="var(--color-primary)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        <rect x="30" y="106" width="48" height="48" rx="14" fill="#ffffff" />
        <rect x="44" y="122" width="20" height="16" rx="3" stroke="var(--color-primary)" strokeWidth="2.4" />
        <path d="M44 128h20M52 122v16" stroke="var(--color-primary)" strokeWidth="2.4" />

        <rect x="30" y="162" width="48" height="48" rx="14" fill="#ffffff" />
        <path
          d="M46 186h16M46 178h16M46 194h9"
          stroke="var(--color-primary)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

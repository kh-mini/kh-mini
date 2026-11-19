import parse from 'html-react-parser';

const markup = String.raw`<section class="screen themed" id="home" aria-label="Home">
  <div class="stripe"></div>
  <div class="left">
    <svg width="620" height="552" viewBox="0 0 620 552" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9d6f5"/><stop offset="1" stop-color="#e4f3fd"/></linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b9be6"/><stop offset="1" stop-color="#1a63b6"/></linearGradient>
        <radialGradient id="glow" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
        <g id="paddler">
          <path d="M18 108 Q28 152 80 160 L190 160 Q242 150 272 52 Q236 104 202 112 Z" fill="var(--hull)"/>
          <path d="M18 108 L202 114 Q240 110 272 52 Q238 96 200 100 L18 98 Z" fill="var(--hull2)"/>
          <path d="M62 126 L196 134" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/>
          <path d="M150 96 L16 142" stroke="#7a4a22" stroke-width="7" stroke-linecap="round"/>
          <ellipse cx="12" cy="144" rx="8" ry="14" fill="#7a4a22" transform="rotate(20 12 144)"/>
          <ellipse cx="102" cy="100" rx="30" ry="34" fill="var(--body)"/>
          <circle cx="102" cy="52" r="33" fill="var(--body)"/>
          <path d="M69 48 A33 33 0 0 1 135 48 Z" fill="#fbf6ea"/>
          <rect x="69" y="43" width="66" height="11" fill="var(--band)"/>
          <circle cx="90" cy="60" r="8" fill="#fff"/><circle cx="114" cy="60" r="8" fill="#fff"/>
          <circle cx="92" cy="61" r="4" fill="#111"/><circle cx="116" cy="61" r="4" fill="#111"/>
          <path d="M92 76 Q102 85 112 76" stroke="#3a1d10" stroke-width="3" fill="none" stroke-linecap="round"/>
        </g>
      </defs>
      <rect width="620" height="552" fill="url(#sky)"/>
      <rect width="620" height="552" fill="url(#glow)"/>
      <rect y="272" width="620" height="280" fill="url(#sea)"/>
      <path d="M0 274 Q60 262 120 274 T240 274 T360 274 T480 274 T620 274" stroke="#fff" stroke-opacity=".75" stroke-width="3" fill="none"/>
      <ellipse cx="205" cy="340" rx="150" ry="10" fill="#0e3c80" opacity=".25"/>
      <ellipse cx="420" cy="510" rx="210" ry="14" fill="#0e3c80" opacity=".3"/>
      <use href="#paddler" transform="translate(96 168) scale(.86)" style="--hull:#cf4a46;--hull2:#b83a37;--body:#d9534f;--band:#8a2f2c"/>
      <use href="#paddler" transform="translate(226 306) scale(1.26)" style="--hull:#d9a23b;--hull2:#bd8a2a;--body:#d9a23b;--band:#7d5a26"/>
    </svg>
  </div>
  <h1 class="logo" style="margin:0">kh-mini</h1>
  <div class="chip">Khmer games for 2-4 friends</div>
  <div class="tools">
    <button class="tool" data-act="star" aria-label="Total wins"><span class="star">⭐</span></button>
    <button class="tool" data-act="leaders" style="margin-top:6px"><span class="ti">🏆</span>Leaders</button>
    <button class="tool" data-act="settings" style="margin-top:6px"><span class="ti">⚙️</span>Settings</button>
  </div>
  <div class="menu">
    <button class="btn big" data-act="play" style="margin-left:0"><span><i class="ic">🎮</i>Let's play</span></button>
    <button class="btn big" data-act="surprise" style="margin-left:14px"><span><i class="ic">🎲</i>Surprise me</span></button>
    <button class="btn big" data-act="leaders" style="margin-left:28px"><span><i class="ic">🏆</i>Leaderboard</span></button>
    <button class="btn big cyan" data-act="more" style="margin-left:42px"><span><i class="ic">🧩</i>More games</span><em class="soon">SOON</em></button>
  </div>
  <div class="corner">
    <button class="round" data-act="mute" id="muteBtn" aria-label="Mute sound">🔊</button>
    <button class="round" data-act="share" aria-label="Share game link">📤</button>
  </div>
</section>`;

export default function HomeScreen() {
  return <>{parse(markup)}</>;
}

import parse from 'html-react-parser';

const markup = String.raw`<section class="screen themed" id="players" aria-label="Players">
  <button class="btn small backbtn" data-act="to-home"><span><i class="ic">◀</i>Back</span></button>
  <button class="round gear" data-act="settings" aria-label="Settings">⚙️</button>
  <div class="title" style="top:48px;font-size:46px">How many players?</div>
  <div class="sub" style="top:112px">Grab your friends and pick a number!</div>
  <div class="pcards">
    <button class="pcard" data-n="2"><div class="dots"><span class="dot" style="background:var(--p1)"></span><span class="dot" style="background:var(--p2)"></span></div><b>2P</b><i>Duel!</i></button>
    <button class="pcard" data-n="3"><div class="dots"><span class="dot" style="background:var(--p1)"></span><span class="dot" style="background:var(--p2)"></span><span class="dot" style="background:var(--p3)"></span></div><b>3P</b><i>Triple fun!</i></button>
    <button class="pcard" data-n="4"><div class="dots"><span class="dot" style="background:var(--p1)"></span><span class="dot" style="background:var(--p2)"></span><span class="dot" style="background:var(--p3)"></span><span class="dot" style="background:var(--p4)"></span></div><b>4P</b><i>Full party!</i></button>
  </div>
</section>`;

export default function PlayerSelectionScreen() {
  return <>{parse(markup)}</>;
}

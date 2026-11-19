import parse from 'html-react-parser';

const markup = String.raw`<section class="screen themed" id="random" aria-label="Surprise me">
  <button class="btn small backbtn" data-act="to-players"><span><i class="ic">◀</i>Back</span></button>
  <button class="round gear" data-act="settings" aria-label="Settings">⚙️</button>
  <div class="title" id="rTitle" style="top:56px;font-size:46px">Feeling lucky?</div>
  <div class="sub" id="rSub" style="top:122px">We'll choose a game for you!</div>
  <div class="slots" id="slots"></div>
  <div class="rbtns" id="rbtns"></div>
</section>`;

export default function RandomGameScreen() {
  return <>{parse(markup)}</>;
}

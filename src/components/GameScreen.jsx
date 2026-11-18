import parse from 'html-react-parser';

const markup = String.raw`<section class="screen themed" id="pick" aria-label="Pick a game">
  <button class="btn small backbtn" data-act="to-players"><span><i class="ic">◀</i>Back</span></button>
  <div class="title" style="top:26px">Pick a game!</div>
  <button class="btn small" data-act="surprise-now" style="right:104px;top:26px;width:200px"><span><i class="ic">🎲</i>Surprise me</span></button>
  <button class="round gear" data-act="settings" aria-label="Settings">⚙️</button>
  <div class="grid" id="grid"></div>
</section>`;

export default function GameSelectionScreen() {
  return <>{parse(markup)}</>;
}

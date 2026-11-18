import parse from 'html-react-parser';

const markup = String.raw`<section class="screen" id="game" aria-label="Game">
  <canvas id="cv" width="2400" height="1104"></canvas>
  <div class="capbar"><button data-act="quit">✕ Quit</button><span id="capText"></span></div>
  <div id="padlayer"></div>
  <div id="count"><span></span></div>
  <div id="banner"><b></b><i></i></div>
</section>`;

export default function GameScreen() {
  return <>{parse(markup)}</>;
}

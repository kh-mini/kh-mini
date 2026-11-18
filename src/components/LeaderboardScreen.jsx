import parse from 'html-react-parser';

const markup = String.raw`<section class="screen themed" id="leaders" aria-label="Leaderboard">
  <button class="btn small backbtn" data-act="to-home"><span><i class="ic">◀</i>Back</span></button>
  <div class="title" style="top:30px;font-size:46px">🏆 Leaderboard</div>
  <div class="tbl lbtbl" id="lbTbl"></div>
  <div class="lbnote" id="lbNote"></div>
  <button class="reset" data-act="reset">Reset scores</button>
</section>`;

export default function LeaderboardScreen() {
  return <>{parse(markup)}</>;
}

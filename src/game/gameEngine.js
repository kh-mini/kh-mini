export function initGame(){
'use strict';
var W=1200,H=552;
var FONT="'Fredoka','Trebuchet MS',Verdana,sans-serif";
var PCOL=['#d9a23b','#d9534f','#3b7dd8','#3aa35c'];
var PN=['P1','P2','P3','P4'];
var KEYS=['z','p','m','q'];
var KEYLBL=['Z','P','M','Q'];
var NAVY='#17358a';
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}

/* ---------- storage ---------- */
var S={music:.5,sfx:true,muted:false};
try{var j=JSON.parse(localStorage.getItem('khmini.set'));if(j){S.music=typeof j.music==='number'?j.music:.5;S.sfx=j.sfx!==false;S.muted=!!j.muted}}catch(e){}
function saveS(){try{localStorage.setItem('khmini.set',JSON.stringify(S))}catch(e){}}
function lbLoad(){try{var j=JSON.parse(localStorage.getItem('khmini.lb'));if(j&&j.length===4)return j}catch(e){}return [0,1,2,3].map(function(){return{p:0,w:0,g:0}})}
var LB=lbLoad();
function lbSave(){try{localStorage.setItem('khmini.lb',JSON.stringify(LB))}catch(e){}}

/* ---------- audio ---------- */
var AC=null,mg=null,mTimer=null,mi=0,mNext=0;
var SCALE=[261.6,293.7,329.6,392,440,523.3,587.3,659.3];
var PAT=[0,2,4,2,1,3,5,3,2,4,6,4,1,3,4,2];
function audioInit(){
  if(AC){if(AC.state==='suspended')AC.resume();return}
  try{
    AC=new (window.AudioContext||window.webkitAudioContext)();
    mg=AC.createGain();mg.connect(AC.destination);applyVol();musicStart();
  }catch(e){AC=null}
}
function applyVol(){if(mg)mg.gain.value=S.muted?0:S.music*.11}
function musicStart(){
  if(!AC||mTimer)return;
  mNext=AC.currentTime+.15;
  mTimer=setInterval(function(){
    if(!AC||AC.state!=='running')return;
    while(mNext<AC.currentTime+.5){
      var f=SCALE[PAT[mi%16]]*(mi%32>=16?1.5:1),t=mNext;
      var o=AC.createOscillator(),g=AC.createGain();o.type='triangle';o.frequency.value=f;
      g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(1,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.3);
      o.connect(g);g.connect(mg);o.start(t);o.stop(t+.32);
      if(mi%4===0){var b=AC.createOscillator(),bg=AC.createGain();b.type='sine';b.frequency.value=f/2;
        bg.gain.setValueAtTime(.0001,t);bg.gain.exponentialRampToValueAtTime(1.2,t+.03);bg.gain.exponentialRampToValueAtTime(.0001,t+.8);
        b.connect(bg);bg.connect(mg);b.start(t);b.stop(t+.85)}
      mi++;mNext+=.24;
    }
  },160);
}
function tone(f,d,type,v,t0,slide){
  if(!AC||S.muted||!S.sfx)return;
  var t=AC.currentTime+(t0||0),o=AC.createOscillator(),g=AC.createGain();
  o.type=type||'square';o.frequency.setValueAtTime(f,t);
  if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,f+slide),t+d);
  g.gain.setValueAtTime(v||.1,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d+.03);
}
var SFX={
  click:function(){tone(660,.07,'triangle',.12)},
  tap:function(i){tone(280+i*60,.045,'square',.05)},
  count:function(){tone(520,.14,'triangle',.16)},
  go:function(){tone(784,.3,'triangle',.2)},
  win:function(){[523,659,784,1047].forEach(function(f,k){tone(f,.22,'triangle',.16,k*.12)})},
  bad:function(){tone(170,.22,'sawtooth',.09,0,-60)},
  hit:function(){tone(300,.2,'square',.1,0,-180)},
  light:function(){tone(880,.12,'triangle',.14)}
};
document.addEventListener('visibilitychange',function(){if(AC){if(document.hidden)AC.suspend();else AC.resume()}});

/* ---------- toast / screens ---------- */
var toastT=null;
function toast(msg){var t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('show')},1900)}
var cur='home';
function go(id){
  if(cur==='game'&&id!=='game')stopGame();
  $$('.screen').forEach(function(s){s.classList.toggle('active',s.id===id)});
  cur=id;$('#settings').classList.remove('open');
  if(id==='leaders')renderLB();
}
var SPARKS=[[60,92,22,0],[1120,430,26,.8],[1090,500,16,1.6],[44,500,24,.4],[600,500,14,1.2],[1130,60,16,2]];
$$('.themed').forEach(function(s){
  SPARKS.forEach(function(p){
    if(s.id==='home'&&p[0]<640)return;
    var n=document.createElementNS('http://www.w3.org/2000/svg','svg');n.setAttribute('viewBox','0 0 24 24');n.setAttribute('class','spark');
    n.style.cssText='left:'+p[0]+'px;top:'+p[1]+'px;--s:'+p[2]+'px;--d:'+p[3]+'s';
    n.innerHTML='<path d="M12 0Q13.5 10.5 24 12Q13.5 13.5 12 24Q10.5 13.5 0 12Q10.5 10.5 12 0Z"/>';
    s.appendChild(n);
  });
});

/* ---------- game catalogue + thumbnails ---------- */
var GAMES=[
 {id:'tp',name:'Teanh Prot',tag:'⚡ Speed',cap:'tap your pad as fast as you can to pull the flag to your side!'},
 {id:'ba',name:'Bos Angkunh',tag:'⚡ Speed',cap:'wait for a seed to light up, then tap your pad first. Tap too early and you freeze!'},
 {id:'ot',name:'Oum Touk',tag:'⚡ Speed',cap:'tap your pad again and again to row! First boat across the line wins!'}
];
function stick(x,col,dir){
  return '<g stroke="'+col+'" stroke-width="3.5" stroke-linecap="round" fill="none"><circle cx="'+x+'" cy="70" r="6" fill="'+col+'"/>'+
  '<path d="M'+(x+dir*1)+' 77L'+(x-dir*3)+' 99M'+(x-dir*3)+' 99L'+(x-dir*11)+' 117M'+(x-dir*3)+' 99L'+(x+dir*6)+' 117M'+(x+dir*2)+' 82L'+(x-dir*16)+' 66"/></g>';
}
var THUMB={
 tp:'<svg viewBox="0 0 260 130" preserveAspectRatio="xMidYMid slice"><rect width="260" height="130" fill="#8ec6e8"/><rect y="74" width="260" height="56" fill="#d9b46c"/><path d="M20 64H240" stroke="#1a1a1a" stroke-width="3"/><path d="M130 44V64" stroke="#fff" stroke-width="2"/><rect x="130" y="40" width="16" height="9" fill="#d9534f"/>'+stick(108,'#e8a23a',-1)+stick(152,'#d9534f',1)+'</svg>',
 ba:(function(){var s='<svg viewBox="0 0 260 130" preserveAspectRatio="xMidYMid slice"><rect width="260" height="130" fill="#d9b46c"/><circle cx="130" cy="65" r="38" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2" stroke-dasharray="5 5"/><circle cx="130" cy="65" r="14" fill="#e0a52f" stroke="#fff" stroke-width="3"/>';
   [[60,34],[196,38],[70,98],[170,106],[212,84]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="11" fill="#7a3f1c"/>'});return s+'</svg>'})(),
 ot:(function(){var s='<svg viewBox="0 0 260 130" preserveAspectRatio="xMidYMid slice"><rect width="260" height="130" fill="#48a2dc"/>';
   [['#d9a23b',50],['#d9534f',66],['#3b7dd8',46],['#3aa35c',60]].forEach(function(b,i){var y=18+i*28,x=b[1];
     s+='<path d="M'+(x)+' '+(y+2)+'L'+(x+70)+' '+(y+2)+'Q'+(x+88)+' '+(y-2)+' '+(x+96)+' '+(y-10)+'Q'+(x+84)+' '+(y+10)+' '+(x+66)+' '+(y+10)+'L'+x+' '+(y+10)+'Z" fill="'+b[0]+'"/>';
     for(var k=0;k<5;k++)s+='<circle cx="'+(x+10+k*11)+'" cy="'+(y-3)+'" r="3" fill="#111"/>'});
   return s+'<rect x="238" width="3" height="130" fill="#fff"/></svg>'})()
};

/* ---------- flow ---------- */
var flow='pick',nPlayers=2,lastGame=null,chosen=null;
function buildGrid(){
  var h='';
  GAMES.forEach(function(g){h+='<button class="gcard" data-g="'+g.id+'"><div class="th">'+THUMB[g.id]+'</div><b>'+g.name+'</b><small>'+g.tag+'</small></button>'});
  for(var i=4;i<=8;i++)h+='<div class="gcard locked"><div class="th">?</div><b>Game '+i+'</b><small>Coming soon!</small></div>';
  $('#grid').innerHTML=h;
}
buildGrid();

function slotHTML(g,tilt){return '<div class="th">'+THUMB[g.id]+'</div>'+g.name+'<small>'+g.tag+'</small>'}
var shuffleIv=null;
function randomReset(){
  clearInterval(shuffleIv);chosen=null;
  $('#rTitle').textContent='Feeling lucky?';$('#rSub').textContent="We'll choose a game for you!";
  $('#slots').innerHTML='<div class="slot q">?</div><div class="slot q">?</div><div class="slot q">?</div><div class="slot q">?</div>';
  $('#rbtns').innerHTML='<button class="btn" data-act="shuffle"><span><i class="ic">🎲</i>Shuffle!</span></button>';
}
function doShuffle(){
  var b=$('#rbtns .btn');b.classList.add('disabled');b.querySelector('span').innerHTML='Shuffling…';
  $('#rTitle').textContent='Shuffling…';$('#rSub').textContent='Fingers crossed!';
  var ticks=0,slots=$$('#slots .slot');
  shuffleIv=setInterval(function(){
    ticks++;SFX.tap(ticks%4);
    slots.forEach(function(s){var g=GAMES[Math.floor(Math.random()*GAMES.length)];s.className='slot';s.innerHTML=slotHTML(g);s.style.transform='rotate('+(Math.random()*12-6)+'deg)'});
    if(ticks>=14){
      clearInterval(shuffleIv);
      chosen=GAMES[Math.floor(Math.random()*GAMES.length)];
      slots.forEach(function(s,i){s.style.transform='';if(i===1){s.className='slot chosen';s.innerHTML=slotHTML(chosen)}else{s.className='slot q';s.textContent='?'}});
      $('#rTitle').textContent="It's "+chosen.name+'!';$('#rSub').textContent='Great pick! Ready to play?';
      $('#rbtns').innerHTML='<button class="btn cyan" data-act="letsgo"><span><i class="ic">▶</i>Let\'s go!</span></button><button class="btn" data-act="shuffle"><span><i class="ic">🎲</i>Shuffle again</span></button>';
      SFX.win();
    }
  },130);
}

/* ---------- game engine ---------- */
var cv=$('#cv'),ctx=cv.getContext('2d');ctx.setTransform(2,0,0,2,0,0);
var G=null;
var PADPOS=[{left:14,bottom:14},{right:14,top:34,flip:1},{right:14,bottom:14},{left:14,top:34,flip:1}];
function buildPads(n){
  var h='';
  for(var i=0;i<n;i++){
    var p=PADPOS[i],st='--c:'+PCOL[i]+';';
    ['left','right','top','bottom'].forEach(function(k){if(p[k]!==undefined)st+=k+':'+p[k]+'px;'});
    h+='<button class="pad'+(p.flip?' flip':'')+'" data-p="'+i+'" style="'+st+'" aria-label="Player '+(i+1)+' pad"><span class="lbl"><span>'+PN[i]+'</span><small>'+KEYLBL[i]+'</small></span></button>';
  }
  $('#padlayer').innerHTML=h;
}
$('#padlayer').addEventListener('pointerdown',function(e){
  var p=e.target.closest('.pad');if(!p)return;e.preventDefault();tap(+p.dataset.p);
});
$('#padlayer').addEventListener('contextmenu',function(e){e.preventDefault()});
document.addEventListener('keydown',function(e){
  if(!G||e.repeat)return;var i=KEYS.indexOf(e.key.toLowerCase());if(i>=0){e.preventDefault();tap(i)}
  if(e.key==='Escape')go('pick');
});
function padEl(i){return $('.pad[data-p="'+i+'"]')}
function tap(i){
  if(!G||i>=G.n)return;
  var el=padEl(i);if(el){el.classList.add('hit');setTimeout(function(){el.classList.remove('hit')},90)}
  if(G.phase==='play')G.logic.tap(i);
}
function say(t,color,sub){var b=$('#banner');b.style.setProperty('--bc',color||'#fff');b.querySelector('b').textContent=t;b.querySelector('i').textContent=sub||'';b.classList.remove('show');void b.offsetWidth;b.classList.add('show')}
function hideBanner(){$('#banner').classList.remove('show')}
function showCount(t){var c=$('#count');c.classList.add('show');var s=c.querySelector('span');s.textContent=t;s.style.animation='none';void s.offsetWidth;s.style.animation=''}
function stopGame(){if(G){cancelAnimationFrame(G.raf);G=null}$('#count').classList.remove('show');hideBanner()}
function startGame(id){
  stopGame();lastGame=id;go('game');
  var def=GAMES.filter(function(g){return g.id===id})[0],n=nPlayers;
  $('#capText').textContent=def.name+' · '+def.cap;
  buildPads(n);
  G={id:id,def:def,n:n,phase:'count',cd:0,cdT:0,last:performance.now(),endT:0,result:null,raf:0};
  G.logic=LOGIC[id](n);
  G.finish=function(res){
    if(G.phase!=='play')return;G.phase='end';G.endT=1.9;G.result=res;
    say(res.banner,res.color,res.sub||'');SFX.win();
  };
  showCount('3');SFX.count();
  G.raf=requestAnimationFrame(frame);
}
var COUNT=['3','2','1','GO!'];
function frame(t){
  if(!G)return;
  var dt=Math.min(.05,Math.max(0,(t-G.last)/1000));G.last=t;
  if(G.phase==='count'){
    G.cdT+=dt;
    if(G.cdT>=.75){G.cdT=0;G.cd++;
      if(G.cd>=4){G.phase='play';$('#count').classList.remove('show')}
      else{showCount(COUNT[G.cd]);if(G.cd===3)SFX.go();else SFX.count()}
    }
  }else{G.logic.update(dt)}
  G.logic.draw(ctx);
  if(G.phase==='end'){G.endT-=dt;if(G.endT<=0){var r=G.result,id=G.id;stopGame();finishMatch(r,id);return}}
  G.raf=requestAnimationFrame(frame);
}

/* drawing helpers */
function txt(c,s,x,y,size,col,shadow){
  c.font='700 '+size+'px '+FONT;c.textAlign='center';c.textBaseline='middle';
  if(shadow){c.lineWidth=size/5;c.strokeStyle=shadow;c.lineJoin='round';c.strokeText(s,x,y)}
  c.fillStyle=col;c.fillText(s,x,y);
}
function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function sortBy(arr,cmp){return arr.slice().sort(cmp)}

var LOGIC={};

/* ---- Teanh Prot (tug of war) ---- */
LOGIC.tp=function(n){
  var team=function(i){return i%2};
  var members=[[],[]];for(var i=0;i<n;i++)members[team(i)].push(i);
  var pw=[members[0].length===1?1.7:1,members[1].length===1?1.7:1];
  var pos=0,shown=0,time=30,taps=[],pull=[];for(i=0;i<n;i++){taps.push(0);pull.push(0)}
  function tname(t){return n===2?PN[members[t][0]]:'Team '+(t+1)}
  function tlabel(t){return 'Team '+(t+1)+' ('+members[t].map(function(p){return PN[p]}).join(', ')+')'}
  function end(wt){
    var ids=[];for(var k=0;k<n;k++)ids.push(k);
    var win=ids.filter(function(p){return team(p)===wt}).sort(function(a,b){return taps[b]-taps[a]});
    var lose=ids.filter(function(p){return team(p)!==wt}).sort(function(a,b){return taps[b]-taps[a]});
    var col=PCOL[members[wt][0]];
    G.finish({rank:win.concat(lose),score:taps.slice(),winners:win,
      banner:tname(wt)+' wins!',color:'#fff',sub:'The flag crosses the line',
      text:(n===2?PN[win[0]]+' wins':tlabel(wt)+' win')+' Teanh Prot!'});
  }
  function drawFig(c,x,t,col,pl,name){
    var s=t?1:-1,sh={x:x+s*(14+22*pl),y:356},hip={x:x,y:402};
    c.lineCap='round';c.lineJoin='round';c.lineWidth=9;c.strokeStyle='rgba(15,40,100,.35)';
    for(var pass=0;pass<2;pass++){
      c.strokeStyle=pass?col:'rgba(23,53,138,.55)';c.lineWidth=pass?6:10;
      c.beginPath();c.moveTo(hip.x,hip.y);c.lineTo(sh.x,sh.y);
      c.moveTo(hip.x,hip.y);c.lineTo(x-s*30,448);c.moveTo(hip.x,hip.y);c.lineTo(x+s*6,448);
      c.moveTo(sh.x,sh.y+4);c.lineTo(x-s*34,324);c.moveTo(sh.x,sh.y+9);c.lineTo(x-s*22,326);c.stroke();
    }
    c.fillStyle=col;c.strokeStyle='rgba(23,53,138,.55)';c.lineWidth=3;c.beginPath();c.arc(sh.x+s*6,338,12,0,7);c.fill();c.stroke();
    txt(c,name,x,470,17,'#fff',NAVY);
  }
  return{
    tap:function(i){
      taps[i]++;pull[i]=1;SFX.tap(i);
      pos+=(team(i)?1:-1)*.034*pw[team(i)];
      if(Math.abs(pos)>=1){pos=pos<0?-1:1;end(pos<0?0:1)}
    },
    update:function(dt){
      for(var i=0;i<n;i++)pull[i]=Math.max(0,pull[i]-dt*4.5);
      shown+=(pos-shown)*Math.min(1,dt*14);
      if(G.phase==='play'){
        time-=dt;
        if(time<=0){var a=0,b=0;members[0].forEach(function(p){a+=taps[p]});members[1].forEach(function(p){b+=taps[p]});
          end(pos<0?0:pos>0?1:(a>=b?0:1))}
      }
    },
    draw:function(c){
      c.fillStyle='#8ec6e8';c.fillRect(0,0,W,H);
      c.fillStyle='rgba(255,255,255,.35)';[[200,100,120],[640,80,150],[980,130,110]].forEach(function(o){c.beginPath();c.ellipse(o[0],o[1],o[2],22,0,0,7);c.fill()});
      c.fillStyle='#d9b46c';c.fillRect(0,372,W,H-372);c.fillStyle='rgba(120,80,20,.12)';c.fillRect(0,372,W,5);
      c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=3;
      [170,1030].forEach(function(x){c.beginPath();c.moveTo(x,26);c.lineTo(x,H);c.stroke()});
      txt(c,tlabel(0),360,62,21,'#fff',NAVY);txt(c,tlabel(1),840,62,21,'#fff',NAVY);
      txt(c,Math.max(0,Math.ceil(time))+'s',600,62,24,'#fff',NAVY);
      c.strokeStyle='#1a1a1a';c.lineWidth=5;c.beginPath();c.moveTo(60,322);c.lineTo(1140,322);c.stroke();
      var fx=600+shown*430;
      c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(fx,280);c.lineTo(fx,322);c.stroke();
      c.fillStyle='#e0443f';c.fillRect(fx,278,46,24);c.strokeStyle='rgba(0,0,0,.25)';c.lineWidth=2;c.strokeRect(fx,278,46,24);
      for(var t=0;t<2;t++)members[t].forEach(function(p,k){drawFig(c,fx+(t?1:-1)*(74+k*62),t,PCOL[p],pull[p],PN[p])});
    }
  };
};

/* ---- Bos Angkunh (reaction) ---- */
LOGIC.ba=function(n){
  var GOAL=4,score=[],lock=[],rt=[],fs=[];for(var i=0;i<n;i++){score.push(0);lock.push(0);rt.push([]);fs.push(0)}
  var seeds=[];for(var k=0;k<6;k++){var a=(-90+k*60)*Math.PI/180;seeds.push({x:600+Math.cos(a)*250,y:306+Math.sin(a)*140,s:1})}
  var phase='wait',timer=rand(1.3,3),lit=-1,litT=0,fly=null,fx=[],msg='';
  var ORIG=[{x:60,y:492},{x:1140,y:92},{x:1140,y:492},{x:60,y:92}];
  function rand(a,b){return a+Math.random()*(b-a)}
  function next(){phase='wait';timer=rand(1.3,3);lit=-1;msg=''}
  function avg(p){var a=rt[p];return a.length?a.reduce(function(x,y){return x+y},0)/a.length:9999}
  function end(){
    var ids=[];for(var k=0;k<n;k++)ids.push(k);
    var rank=sortBy(ids,function(a,b){return score[b]-score[a]||avg(a)-avg(b)});
    G.finish({rank:rank,score:score.slice(),winners:[rank[0]],banner:PN[rank[0]]+' wins!',color:PCOL[rank[0]],sub:'First to '+GOAL+' seeds',text:PN[rank[0]]+' wins Bos Angkunh!'});
  }
  return{
    tap:function(i){
      if(lock[i]>0)return;
      if(phase==='wait'){lock[i]=1.1;fs[i]++;SFX.bad();msg=PN[i]+' tapped too early!';fx.push({x:ORIG[i].x,y:ORIG[i].y,r:10,a:1,col:'#fff'});return}
      if(phase==='lit'){
        var ms=Math.round(litT*1000);rt[i].push(ms);
        phase='fly';fly={p:i,t:0,fx:ORIG[i].x,fy:ORIG[i].y,tx:seeds[lit].x,ty:seeds[lit].y,ms:ms};SFX.tap(i);
      }
    },
    update:function(dt){
      for(var i=0;i<n;i++){lock[i]=Math.max(0,lock[i]-dt);var el=padEl(i);if(el)el.classList.toggle('lock',lock[i]>0)}
      seeds.forEach(function(s,k){var tgt=(phase==='fly'&&k===lit)?0:1;s.s+=(tgt-s.s)*Math.min(1,dt*9)});
      fx.forEach(function(f){f.r+=dt*180;f.a-=dt*2});fx=fx.filter(function(f){return f.a>0});
      if(G.phase!=='play')return;
      if(phase==='wait'){timer-=dt;if(timer<=0){phase='lit';lit=Math.floor(Math.random()*6);litT=0;SFX.light();msg='NOW!'}}
      else if(phase==='lit'){litT+=dt;if(litT>2.6){msg='Too slow!';phase='res';timer=.8;lit=-1}}
      else if(phase==='fly'){
        fly.t+=dt/.28;
        if(fly.t>=1){score[fly.p]++;SFX.hit();fx.push({x:fly.tx,y:fly.ty,r:20,a:1,col:PCOL[fly.p]});
          msg=PN[fly.p]+' +1  ·  '+fly.ms+' ms';phase='res';timer=1;
          if(score[fly.p]>=GOAL){end()}
        }
      }
      else if(phase==='res'){timer-=dt;if(timer<=0){lit=-1;next()}}
    },
    draw:function(c){
      var g=c.createRadialGradient(600,300,60,600,300,720);g.addColorStop(0,'#e6c382');g.addColorStop(1,'#bf914a');
      c.fillStyle=g;c.fillRect(0,0,W,H);
      c.strokeStyle='rgba(120,80,20,.14)';c.lineWidth=3;for(var r=120;r<760;r+=110){c.beginPath();c.ellipse(600,306,r*1.2,r*.7,0,0,7);c.stroke()}
      c.strokeStyle='rgba(255,255,255,.7)';c.lineWidth=3;c.setLineDash([9,9]);c.beginPath();c.ellipse(600,306,150,90,0,0,7);c.stroke();c.setLineDash([]);
      /* center angkunh */
      c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(600,318,34,12,0,0,7);c.fill();
      c.fillStyle='#e0a52f';c.strokeStyle='#fff';c.lineWidth=5;c.beginPath();c.arc(600,306,30,0,7);c.fill();c.stroke();
      c.fillStyle='rgba(255,255,255,.45)';c.beginPath();c.arc(590,296,9,0,7);c.fill();
      seeds.forEach(function(s,k){
        if(s.s<.02)return;var on=(k===lit&&phase==='lit');
        if(on){var p=.5+.5*Math.sin(litT*18);var gr=c.createRadialGradient(s.x,s.y,6,s.x,s.y,70);gr.addColorStop(0,'rgba(255,230,90,.95)');gr.addColorStop(1,'rgba(255,230,90,0)');c.fillStyle=gr;c.beginPath();c.arc(s.x,s.y,70+p*10,0,7);c.fill()}
        c.fillStyle='rgba(0,0,0,.22)';c.beginPath();c.ellipse(s.x+3,s.y+int(22*s.s),22*s.s,8*s.s,0,0,7);c.fill();
        c.fillStyle=on?'#ffcf3a':'#7a3f1c';c.beginPath();c.arc(s.x,s.y,22*s.s,0,7);c.fill();
        c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.arc(s.x-7*s.s,s.y-7*s.s,6*s.s,0,7);c.fill();
        if(on){c.strokeStyle='#fff';c.lineWidth=4;c.beginPath();c.arc(s.x,s.y,22+p*12,0,7);c.stroke()}
      });
      function int(v){return Math.round(v)}
      fx.forEach(function(f){c.globalAlpha=Math.max(0,f.a);c.strokeStyle=f.col;c.lineWidth=6;c.beginPath();c.arc(f.x,f.y,f.r,0,7);c.stroke();c.globalAlpha=1});
      if(fly){var t=Math.min(1,fly.t),x=fly.fx+(fly.tx-fly.fx)*t,y=fly.fy+(fly.ty-fly.fy)*t-Math.sin(t*Math.PI)*70;
        if(phase==='fly'){c.fillStyle='#e0a52f';c.strokeStyle=PCOL[fly.p];c.lineWidth=6;c.beginPath();c.arc(x,y,17,0,7);c.fill();c.stroke()}}
      /* scoreboard */
      var w=n*130,x0=600-w/2;
      for(var i=0;i<n;i++){
        var cx=x0+i*130+65;c.fillStyle='rgba(255,255,255,.88)';rrect(c,cx-60,38,120,44,22);c.fill();
        c.fillStyle=PCOL[i];c.beginPath();c.arc(cx-38,60,13,0,7);c.fill();
        for(var q=0;q<GOAL;q++){c.fillStyle=q<score[i]?PCOL[i]:'rgba(23,53,138,.2)';c.beginPath();c.arc(cx-12+q*17,60,6,0,7);c.fill()}
      }
      var m=phase==='lit'?'NOW!':(phase==='wait'?(msg||'Wait for it…'):msg);
      txt(c,m,600,118,phase==='lit'?58:30,phase==='lit'?'#fff':'#fff',phase==='lit'?'#c0392b':'#7a4a1a');
    }
  };
};

/* ---- Oum Touk (rowing race) ---- */
LOGIC.ot=function(n){
  var prog=[],disp=[],taps=[],row=[],spd=[];for(var i=0;i<n;i++){prog.push(0);disp.push(0);taps.push(0);row.push(0);spd.push(0)}
  var laneH=Math.min(132,500/n),y0=26+(526-laneH*n)/2;
  function end(){
    var ids=[];for(var k=0;k<n;k++)ids.push(k);
    var rank=sortBy(ids,function(a,b){return prog[b]-prog[a]||taps[b]-taps[a]});
    G.finish({rank:rank,score:taps.slice(),winners:[rank[0]],banner:PN[rank[0]]+' wins!',color:PCOL[rank[0]],sub:'First across the line',text:PN[rank[0]]+' wins Oum Touk!'});
  }
  return{
    tap:function(i){
      taps[i]++;row[i]+=1.1;SFX.tap(i);prog[i]=Math.min(1,prog[i]+.021);
      if(prog[i]>=1)end();
    },
    update:function(dt){for(var i=0;i<n;i++){var d=(prog[i]-disp[i])*Math.min(1,dt*10);disp[i]+=d;spd[i]+=((d/Math.max(dt,.001))-spd[i])*Math.min(1,dt*8)}},
    draw:function(c){
      c.fillStyle='#48a2dc';c.fillRect(0,0,W,H);
      for(var i=0;i<n;i++){c.fillStyle=i%2?'rgba(255,255,255,.07)':'rgba(0,40,120,.07)';c.fillRect(0,y0+i*laneH,W,laneH)}
      c.strokeStyle='rgba(255,255,255,.45)';c.lineWidth=2;
      for(i=0;i<=n;i++){c.beginPath();c.moveTo(0,y0+i*laneH);c.lineTo(W,y0+i*laneH);c.stroke()}
      c.fillStyle='#fff';c.fillRect(1060,26,5,H);
      c.fillStyle='#8a4a1e';rrect(c,1090,y0+laneH*Math.min(1,n-1)+laneH/2-26,26,52,5);c.fill();
      for(i=0;i<n;i++){
        var cy=y0+i*laneH+laneH/2,nose=300+disp[i]*740;
        txt(c,PN[i],140,cy,28,'#fff',NAVY);
        c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.lineCap='round';
        var wl=30+Math.min(80,Math.abs(spd[i])*.25);
        for(var k=-1;k<=1;k++){c.beginPath();c.moveTo(nose-128,cy+k*9+6);c.lineTo(nose-128-wl,cy+k*9+6);c.stroke()}
        c.fillStyle=PCOL[i];c.beginPath();
        c.moveTo(nose-124,cy-2);c.lineTo(nose-4,cy-2);c.quadraticCurveTo(nose+24,cy-4,nose+40,cy-26);c.quadraticCurveTo(nose+22,cy+14,nose-4,cy+14);c.lineTo(nose-124,cy+14);c.closePath();c.fill();
        c.fillStyle='rgba(255,255,255,.3)';c.fillRect(nose-110,cy+3,100,3);
        c.fillStyle='#111';
        for(k=0;k<5;k++){var bob=Math.sin(row[i]*2.4+k*.7)*3.5;c.beginPath();c.arc(nose-104+k*22,cy-10+bob,6.5,0,7);c.fill()}
      }
    }
  };
};

/* ---------- results + leaderboard ---------- */
var BASE=[10,7,5,3],MEDAL=['🥇','🥈','🥉','🎈'];
function tableHTML(){
  var ids=[0,1,2,3].sort(function(a,b){return LB[b].p-LB[a].p||LB[b].w-LB[a].w||a-b});
  var h='<table><thead><tr><th>#</th><th>Player</th><th>Points</th><th>Wins</th><th>Games</th></tr></thead><tbody>';
  ids.forEach(function(p,r){
    var played=LB[p].g>0;
    h+='<tr><td>'+(played&&r<3?['🥇','🥈','🥉'][r]:r+1)+'</td><td><span class="dot" style="background:'+PCOL[p]+'"></span>'+PN[p]+'</td><td>'+LB[p].p+'</td><td>'+LB[p].w+'</td><td>'+LB[p].g+'</td></tr>';
  });
  return h+'</tbody></table>';
}
function renderLB(){
  $('#lbTbl').innerHTML=tableHTML();
  var any=LB.some(function(x){return x.g>0});
  $('#lbNote').textContent=any?'':'Play a match and your points show up here.';
}
function finishMatch(res,id){
  var n=res.rank.length,maxS=Math.max.apply(null,res.score.concat([1])),pts=[];
  res.rank.forEach(function(p,r){pts[p]=BASE[r]+Math.round(4*res.score[p]/maxS);LB[p].p+=pts[p];LB[p].g++});
  res.winners.forEach(function(p){LB[p].w++});lbSave();
  $('#resSub').textContent=res.text+' 👑';
  var h='';res.rank.forEach(function(p,r){
    h+='<div class="rrow" style="animation-delay:'+(r*.1)+'s"><span class="m">'+MEDAL[r]+'</span><span class="dot" style="background:'+PCOL[p]+'"></span><span class="nm">'+PN[p]+'</span><span class="pt">'+pts[p]+'</span></div>';
  });
  $('#resRows').innerHTML=h;$('#resTbl').innerHTML=tableHTML();
  go('results');
}

/* ---------- settings ---------- */
function syncSettings(){
  var v=Math.round(S.music*100);$('#vol').value=v;$('#vol').style.setProperty('--v',v+'%');
  $('#sfx').setAttribute('aria-checked',S.sfx);$('#muteBtn').textContent=S.muted?'🔇':'🔊';applyVol();
}
$('#vol').addEventListener('input',function(e){S.music=e.target.value/100;e.target.style.setProperty('--v',e.target.value+'%');applyVol();saveS()});
$('#sfx').addEventListener('click',function(){S.sfx=!S.sfx;syncSettings();saveS();SFX.click()});
syncSettings();

/* ---------- clicks ---------- */
document.addEventListener('pointerdown',function(){audioInit()},{once:false,passive:true});
document.addEventListener('click',function(e){
  var st=$('#settings');
  if(st.classList.contains('open')&&!e.target.closest('#settings')&&!e.target.closest('[data-act="settings"]'))st.classList.remove('open');
  var pc=e.target.closest('.pcard');
  if(pc){SFX.click();nPlayers=+pc.dataset.n;if(flow==='random'){randomReset();go('random')}else go('pick');return}
  var gc=e.target.closest('.gcard[data-g]');
  if(gc){SFX.click();startGame(gc.dataset.g);return}
  var b=e.target.closest('[data-act]');if(!b)return;
  var a=b.dataset.act;if(a!=='quit')SFX.click();
  switch(a){
    case 'play':flow='pick';go('players');break;
    case 'surprise':flow='random';go('players');break;
    case 'surprise-now':randomReset();flow='random';go('random');break;
    case 'leaders':go('leaders');break;
    case 'settings':st.classList.toggle('open');break;
    case 'more':toast('More games are coming soon!');break;
    case 'star':toast('⭐ '+LB.reduce(function(s,x){return s+x.w},0)+' matches won so far');break;
    case 'mute':S.muted=!S.muted;syncSettings();saveS();break;
    case 'share':
      try{navigator.clipboard.writeText(location.href).then(function(){toast('Game link copied!')},function(){toast('Copy the link from your address bar')})}catch(err){toast('Copy the link from your address bar')}break;
    case 'to-home':go('home');break;
    case 'to-players':clearInterval(shuffleIv);go('players');break;
    case 'shuffle':doShuffle();break;
    case 'letsgo':if(chosen)startGame(chosen.id);break;
    case 'quit':go(flow==='random'?'random':'pick');if(flow==='random')randomReset();break;
    case 'again':startGame(lastGame);break;
    case 'another':if(flow==='random'){randomReset();go('random')}else go('pick');break;
    case 'reset':LB=[0,1,2,3].map(function(){return{p:0,w:0,g:0}});lbSave();renderLB();toast('Scores cleared');break;
  }
});
document.addEventListener('keydown',function(e){if(e.key==='Escape')$('#settings').classList.remove('open')});

/* ---------- fit to screen ---------- */
var rotDismissed=false,wrap=$('#wrap'),stage=$('#stage');
function fit(){
  var w=wrap.clientWidth,h=wrap.clientHeight,s=Math.min(w/W,h/H);
  stage.style.transform='translate('+((w-W*s)/2)+'px,'+((h-H*s)/2)+'px) scale('+s+')';
  $('#rot').hidden=!(h>w*1.05&&!rotDismissed);
}
$('#rotOk').addEventListener('click',function(){rotDismissed=true;fit()});
window.addEventListener('resize',fit);fit();
go('home');
}
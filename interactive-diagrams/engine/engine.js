/* ══════════════════════════════════════════════════════════════════════
   INTERACTIVE DIAGRAMS ENGINE: SCRIPT
   1. Construction: reads the content (<template id="content">) and builds the widget.
   2. Behavior: sections, explanations, grids, drawn lines, readings,
      text size, remembered state (key 'diag-state-' + identifier).
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var D=document,B=D.body,R=D.documentElement,W=D.getElementById('w');
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var WIDE=matchMedia('(min-width:640px)');
var E_IN='cubic-bezier(.2,.7,.3,1)',E_OUT='cubic-bezier(.4,0,1,1)';
var TZ=[.85,.925,1,1.08,1.16,1.25];
var PAL=['#ff3b5c','#3d9bff','#ffb020','#2ee59d','#b46bff','#ff7a2f','#20d4e6','#ff4fd8'];

/* ══ 1. CONSTRUCTION ══ */
var T=D.getElementById('content'),SRC=T.content.querySelector('diagram');
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function kids(s,name){return [].filter.call(s.children,function(c){return !name||c.localName===name})}
function lvl(s,d){['breadth','depth'].forEach(function(k){var v=s.getAttribute(k);if(v==='2'||v==='3')d.setAttribute('data-'+k,v)})}
function lvlAll(c){lvl(c,c);c.removeAttribute('breadth');c.removeAttribute('depth');
  [].forEach.call(c.querySelectorAll('[breadth],[depth]'),function(e){lvl(e,e);e.removeAttribute('breadth');e.removeAttribute('depth')})}
function txt(html){var t=el('div',null,html||'');return t.textContent.replace(/\s+/g,' ').trim()}
function rgb(h){h=(h||'').trim().replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');
  var n=parseInt(h,16);if(isNaN(n)||h.length!==6)return '255,255,255';return [(n>>16)&255,(n>>8)&255,n&255].join(',')}
function slug(s){return (s||'diagram').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'diagram'}

/* explanation panel taken from the <explanation> that is a direct child of s */
function panel(s,cardSep){
  var x=kids(s,'explanation')[0],w=el('div','xw'),r=el('div','xr'),i=el('div','xin'),p=el('div','xpl');
  if(cardSep)i.appendChild(el('div','xsep'));
  if(x){while(x.firstChild){var c=x.firstChild;if(c.nodeType===1)lvlAll(c);p.appendChild(c)}x.remove()}
  i.appendChild(p);r.appendChild(i);w.appendChild(r);return {w:w,empty:!x}}
function expandable(d,w,cls){d.classList.add('exp');d._xw=w;d._xc=cls||'xo'}

function card(s){
  var c=el('div','crd'),b=el('div','crd-b'),t=s.getAttribute('title')||'',ds=s.getAttribute('desc');
  b.appendChild(el('div','crd-t',t));if(ds)b.appendChild(el('div','crd-d',ds));
  var x=panel(s,true);b.appendChild(x.w);c.appendChild(b);
  c.setAttribute('data-name',txt(t));lvl(s,c);if(!x.empty)expandable(c,x.w);return c}
function grid(par){return el('div','grd'+(par?' par':''))}
function group(s,par){
  var m=s.getAttribute('layout');if(m)par=(m==='parallel');
  var w=el('div','sgr'),h=el('div','sg hx'),t=el('div','sg-t'),ti=s.getAttribute('title')||'',d=s.getAttribute('desc');
  lvl(s,w);t.appendChild(el('span','sg-p'));t.appendChild(el('span','sg-n',ti));if(d)t.appendChild(el('span','sg-s',d));
  h.appendChild(t);var x=panel(s);h.appendChild(x.w);if(!x.empty)expandable(h,x.w);h.setAttribute('data-name',txt(ti));
  w.appendChild(h);var g=grid(par);kids(s,'card').forEach(function(k){g.appendChild(card(k))});w.appendChild(g);return w}
function free(s){
  var l=el('div','free');lvl(s,l);while(s.firstChild)l.appendChild(s.firstChild);
  [].forEach.call(l.querySelectorAll('[expand]'),function(d){var x=panel(d,false);d.appendChild(x.w);if(!x.empty)expandable(d,x.w)});
  return l}
function standard(s,cnt,par){
  var g=null;
  kids(s).forEach(function(c){var n=c.localName;
    if(n==='card'){if(!g){g=grid(par);cnt.appendChild(g)}g.appendChild(card(c))}
    else if(n==='group'){g=null;cnt.appendChild(group(c,par))}
    else if(n==='free'){g=null;cnt.appendChild(free(c))}})}
function bifurcation(s,cnt){
  var b=el('div','bif'),g=el('div','bif-g');
  ['tr','ba','jl','jr'].forEach(function(k){b.appendChild(el('span','bif-y bif-'+k))});
  b.appendChild(g);
  kids(s,'branch').slice(0,2).forEach(function(br){
    var c=el('div','bif-c'),h=el('div','brh hx'),t=el('div','brh-t'),ti=br.getAttribute('title')||'',d=br.getAttribute('desc'),n=el('div','brh-n');
    n.appendChild(el('span','brh-l',ti));t.appendChild(n);if(d)t.appendChild(el('div','brh-d',d));
    h.appendChild(t);var x=panel(br);h.appendChild(x.w);if(!x.empty)expandable(h,x.w);h.setAttribute('data-name',txt(ti));
    c.appendChild(h);kids(br,'card').forEach(function(k){c.appendChild(card(k))});g.appendChild(c)});
  b.appendChild(el('div','bif-j'));
  var com=kids(s,'common')[0];
  if(com){var k=el('div','bif-com');kids(com,'card').forEach(function(x){k.appendChild(card(x))});b.appendChild(k)}
  cnt.appendChild(b)}
function tension(s,cnt){
  var t=el('div','ten'),cols=kids(s,'column');
  if(cols.length){var lb=el('div','ten-lb');
    cols.slice(0,2).forEach(function(c){var h=el('div','tlb hx'),ti=c.getAttribute('title')||'';h.appendChild(el('div','tlb-t',ti));
      var x=panel(c);h.appendChild(x.w);if(!x.empty)expandable(h,x.w);h.setAttribute('data-name',txt(ti));lb.appendChild(h)});
    t.appendChild(lb)}
  kids(s).forEach(function(c){
    if(c.localName==='pair'){
      var p=el('div','ten-p'),r=el('div','ten-r'),ks=kids(c,'card'),gl=(c.getAttribute('glyph')||'↔').trim(),cn=el('div','ten-c');
      lvl(c,p);cn.appendChild(el('span',null,gl));if(gl==='↔'||gl==='→')cn.classList.add('rot');
      if(ks[0])r.appendChild(card(ks[0]));r.appendChild(cn);if(ks[1])r.appendChild(card(ks[1]));
      p.appendChild(r);var x=panel(c);x.w.classList.add('ten-x');p.appendChild(x.w);if(!x.empty)expandable(cn,x.w);
      cn.setAttribute('data-name',c.getAttribute('name')||((ks[0]?ks[0].getAttribute('title'):'')+' '+gl+' '+(ks[1]?ks[1].getAttribute('title'):'')));
      t.appendChild(p)}
    else if(c.localName==='card'){var k=card(c);k.classList.add('ten-f');t.appendChild(k)}});
  cnt.appendChild(t)}
function timeline(s,cnt){
  var t=el('div','tml');t.appendChild(el('div','tml-ax'));
  kids(s,'card').forEach(function(c){var i=el('div','tml-i');lvl(c,i);i.appendChild(el('span','tml-p'));
    var k=card(c);k.removeAttribute('data-breadth');k.removeAttribute('data-depth');i.appendChild(k);t.appendChild(i)});
  cnt.appendChild(t)}
var nSec=0;
function section(s,color){
  var sec=el('section','sec'),t=s.getAttribute('title')||'';
  sec.setAttribute('data-key',s.getAttribute('key')||('section-'+(++nSec)));lvl(s,sec);
  if(color){sec.classList.add('col');sec.style.setProperty('--acr',rgb(color))}
  var h=el('div','sch'),st=el('span','sct');h.setAttribute('data-tog','');
  h.appendChild(el('span','tag'));st.appendChild(el('span','sct-t',t));
  var x=panel(s);
  if(!x.empty){var g=el('span','sgn','<span>+</span>');g.setAttribute('role','button');g.setAttribute('aria-label','Title explanation');st.appendChild(g)}
  h.appendChild(st);h.appendChild(el('span','chv','›'));h.appendChild(el('div','sep'));sec.appendChild(h);
  x.w.classList.add('sxw');sec.appendChild(x.w);sec._xw=x.w;sec._xc='sxo';sec.setAttribute('data-name',txt(t));
  var env=el('div','env'),clip=el('div','clip'),cnt=el('div','cnt');clip.appendChild(cnt);env.appendChild(clip);sec.appendChild(env);
  sec._env=env;sec._clip=clip;sec._cnt=cnt;sec._an=[];
  var m=(s.getAttribute('layout')||'sequential').toLowerCase();
  if(m==='bifurcation')bifurcation(s,cnt);else if(m==='tension')tension(s,cnt);else if(m==='timeline')timeline(s,cnt);
  else standard(s,cnt,m==='parallel');
  return sec}

var title=SRC.getAttribute('title')||'',sub=SRC.getAttribute('subtitle')||'';
var GLB=el('span','glb','→');GLB.tabIndex=0;GLB.setAttribute('role','button');GLB.setAttribute('aria-label','Expand or collapse all');W.appendChild(GLB);
var BN=el('div','bnr hx');['tl','tr','bl','br'].forEach(function(k){BN.appendChild(el('span','bcn bcn-'+k))});
BN.appendChild(el('div','bnr-ttl',title));if(sub)BN.appendChild(el('div','bnr-sub',sub));
(function(){var x=panel(SRC);BN.appendChild(x.w);if(!x.empty)expandable(BN,x.w)})();
BN.setAttribute('data-name',txt(title));W.appendChild(BN);
function button(cls,attr,v,label){return '<button type="button" class="'+cls+'" '+attr+'="'+v+'">'+label+'</button>'}
var RG=el('div','stg');
RG.innerHTML='<div class="stg-g"><span class="stg-l">Breadth</span><span class="rdb-s">'+button('rdb','data-set-breadth',1,'Focused')+button('rdb','data-set-breadth',2,'Broader')+button('rdb','data-set-breadth',3,'Complete')+'</span></div>'
 +'<div class="stg-g"><span class="stg-l">Depth</span><span class="rdb-s">'+button('rdb','data-set-depth',1,'Abridged')+button('rdb','data-set-depth',2,'Standard')+button('rdb','data-set-depth',3,'Unabridged')+'</span></div>'
 +'<div class="stg-g"><span class="stg-l">Text size</span><span class="tzb-s">'+button('tzb','data-tz',-1,'A−')+button('tzb','data-tz',0,'A')+button('tzb','data-tz',1,'A+')+'</span></div>';
W.appendChild(RG);
var nb=0;
kids(SRC).forEach(function(c){
  if(c.localName==='block'){
    var color=c.getAttribute('color')||PAL[nb%PAL.length],secs=kids(c,'section'),h=el('div','blk hx'),t=el('div','blk-t'),nm=c.getAttribute('name')||'',br=3,dp=3;nb++;
    t.appendChild(el('span','blk-n',nm));t.appendChild(el('span','blk-r'));h.appendChild(t);h.setAttribute('data-name',txt(nm));
    secs.forEach(function(s){br=Math.min(br,+(s.getAttribute('breadth')||1));dp=Math.min(dp,+(s.getAttribute('depth')||1))});
    if(br>1)h.setAttribute('data-breadth',br);if(dp>1)h.setAttribute('data-depth',dp);
    if(secs.length>1){var x=panel(c);h.appendChild(x.w);if(!x.empty)expandable(h,x.w)}
    W.appendChild(h);secs.forEach(function(s){W.appendChild(section(s,color))})}
  else if(c.localName==='section')W.appendChild(section(c,null))});
T.remove();
if(!D.title)D.title=txt(title);

/* ══ 2. BEHAVIOR ══ */
var SECS=[].slice.call(W.querySelectorAll('.sec'));
var KEY='diag-state-'+slug(txt(title));
var FRAMED=(function(){try{return parent!==window}catch(e){return true}})();
var breadth=2,depth=3,tzi=TZ.length-1,GESTURE=false,G_TARGET=null,TIMERS=[];
function vis(e){return !!e&&e.offsetParent!==null}
function rendered(){return SECS.filter(vis)}
function isOpen(s){return s.classList.contains('exd')}

/* ── Animated height: actual end of the transition ── */
function transitionEnd(sec){
  return new Promise(function(res){
    if(RM){res();return}
    var env=sec._env,done=false,to;
    function f(e){if(e&&e.target!==env)return;if(done)return;done=true;env.removeEventListener('transitionend',f);clearTimeout(to);sec._off=null;res()}
    env.addEventListener('transitionend',f);to=setTimeout(f,560);
    sec._off=function(){done=true;env.removeEventListener('transitionend',f);clearTimeout(to)}})}

/* ── Lock ── */
function stop(sec){
  (sec._an||[]).forEach(function(a){a.cancel()});sec._an=[];
  if(sec._to){clearTimeout(sec._to);sec._to=0}
  if(sec._off){sec._off();sec._off=null}
  sec._tok=(sec._tok||0)+1}

/* ── Animated items of a section, with their nominal interval ── */
function items(sec){
  var L=[];function add(e,g){if(vis(e))L.push({e:e,g:g})}
  kids(sec._cnt).forEach(function(k){var c=k.classList;
    if(c.contains('grd'))kids(k).forEach(function(x){add(x,40)});
    else if(c.contains('sgr')){if(!vis(k))return;add(k.firstChild,80);kids(k.lastChild).forEach(function(x){add(x,40)})}
    else if(c.contains('bif')){
      [].forEach.call(k.querySelectorAll('.bif-y,.bif-s'),function(x){add(x,40)});
      [].forEach.call(k.querySelectorAll('.brh,.bif-c>.crd,.bif-com>.crd'),function(x){add(x,40)})}
    else if(c.contains('ten'))[].forEach.call(k.querySelectorAll('.tlb,.ten-p,.ten-f'),function(x){add(x,40)});
    else if(c.contains('tml')){add(k.firstChild,40);[].forEach.call(k.querySelectorAll('.tml-i'),function(x){add(x,40)})}
    else add(k,40)});
  return L}
function delays(gaps,cap,floor){
  var tot=gaps.reduce(function(a,b){return a+b},0),f=tot>cap?cap/tot:1,d=0;
  return gaps.map(function(g){d+=Math.max(floor,g*f);return d})}
var K_IN=[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}];
var K_OUT=[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px)'}];

function openSec(sec){
  stop(sec);var tok=sec._tok,clip=sec._clip,sep=sec.querySelector('.sep');
  sec.classList.add('exd','opn');clip.style.visibility='visible';clip.style.overflow='hidden';
  arrangeAll(sec);draw(sec);
  var L=items(sec),an=[];
  var gaps=L.map(function(x,i){return i===0?80:x.g});
  var ds=RM?gaps.map(function(){return 0}):delays(gaps,600,12);
  var o={duration:RM?.01:450,easing:E_IN,fill:'both'};
  an.push(sep.animate(K_IN,Object.assign({},o,{delay:0})));
  L.forEach(function(x,i){an.push(x.e.animate(K_IN,Object.assign({},o,{delay:ds[i]})))});
  sec._an=an;
  Promise.all(an.map(function(a){return a.finished}).concat([transitionEnd(sec)])).then(function(){
    if(sec._tok!==tok)return;clip.style.overflow='';an.forEach(function(a){a.cancel()});sec._an=[];draw(sec)},function(){})}

function align(sec){if(!sec)return;var r=sec.getBoundingClientRect();if(r.top<0&&r.bottom>0)window.scrollTo(0,(window.pageYOffset||0)+r.top)}
function closeSec(sec,noAlign){
  stop(sec);var tok=sec._tok,clip=sec._clip,sep=sec.querySelector('.sep');
  if(!noAlign)align(sec);
  clip.style.visibility='visible';clip.style.overflow='hidden';
  var L=items(sec).reverse(),an=[];
  var gaps=L.map(function(x,i){return i===0?0:(x.g===80?30:15)});gaps.push(15);
  var ds=RM?gaps.map(function(){return 0}):delays(gaps,150,0);
  var o={duration:RM?.01:250,easing:E_OUT,fill:'both'};
  L.forEach(function(x,i){an.push(x.e.animate(K_OUT,Object.assign({},o,{delay:ds[i]})))});
  an.push(sep.animate([{opacity:1},{opacity:0}],Object.assign({},o,{delay:ds[ds.length-1]})));
  sec.classList.remove('exd');sec._an=an;
  Promise.all(an.map(function(a){return a.finished}).concat([transitionEnd(sec)])).then(function(){
    if(sec._tok!==tok)return;sec.classList.remove('opn');clip.style.visibility='hidden';clip.style.overflow='';
    an.forEach(function(a){a.cancel()});sec._an=[];updateArrow()},function(){})}

function toggleSec(sec){G_TARGET=null;if(isOpen(sec))closeSec(sec);else openSec(sec);updateArrow();save()}
function updateArrow(){var up=G_TARGET!==null?G_TARGET:rendered().some(isOpen);GLB.classList.toggle('up',up)}

/* ── Global arrow: cascade ── */
function globalToggle(){
  TIMERS.forEach(clearTimeout);TIMERS=[];
  var S=rendered(),O=S.filter(isOpen),closing=O.length>0,L=closing?O.slice().reverse():S.slice(),n=L.length;
  var step=(RM||n<2)?0:(closing?Math.min(60,500/(n-1)):Math.min(120,1000/(n-1)));
  if(closing)align(O.filter(function(s){var r=s.getBoundingClientRect();return r.top<0&&r.bottom>0})[0]);
  var final=SECS.filter(function(s){return closing?(isOpen(s)&&L.indexOf(s)<0):(isOpen(s)||L.indexOf(s)>=0)});
  save(final.map(function(s){return s.dataset.key}));
  if(!n){G_TARGET=null;updateArrow();return}
  G_TARGET=!closing;updateArrow();
  L.forEach(function(s,i){
    function go(){s._to=0;if(closing)closeSec(s,true);else openSec(s);if(i===n-1){G_TARGET=null;updateArrow()}}
    if(i===0||step===0)go();else{var t=setTimeout(go,i*step);TIMERS.push(t);s._to=t}})}

/* ── Expanding an explanation ── */
function expand(d){
  var cls=d._xc,w=d._xw;if(!w)return;
  var on=!d.classList.contains(cls),g=(d.classList.contains('crd')&&d.parentNode.classList.contains('par'))?d.parentNode:null;
  var before=g?measure(g):null;
  clearTimeout(d._rt);
  if(g&&!on)d.classList.add('fld');
  d.classList.toggle(cls,on);w.classList.toggle('on',on);
  var t=w.firstChild.firstChild;
  if(d._xa){d._xa.cancel();d._xa=null}
  if(!RM)d._xa=on?t.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:350,easing:E_IN})
               :t.animate([{opacity:1},{opacity:0}],{duration:200,easing:E_OUT,fill:'forwards'});
  if(g){if(on){d.classList.remove('fld');arrange(g,before,d)}
    else d._rt=setTimeout(function(){var bm=measure(g);d.classList.remove('fld');arrange(g,bm,d)},RM?0:260)}
  var bf=d.closest('.bif');if(bf)follow(bf)}
function follow(bf){var t0=performance.now();(function f(){drawBif(bf);if(performance.now()-t0<450)requestAnimationFrame(f)})()}

/* ── Parallel grids: equal height per row, full rows, FLIP ── */
function gcd(a,b){return b?gcd(b,a%b):a}
function cols(g){var s=getComputedStyle(g).gridTemplateColumns;return (s&&s!=='none')?s.split(' ').filter(Boolean).length:1}
function measure(g){
  var m=new Map();kids(g).forEach(function(c){if(!vis(c))return;var r=c.getBoundingClientRect(),b=c.firstChild.getBoundingClientRect();m.set(c,{x:r.left,y:r.top,w:b.width,h:b.height})});
  (g._fl||[]).forEach(function(a){a.cancel()});g._fl=[];return m}
function arrange(g,before,focus){
  var C=kids(g).filter(vis);if(!C.length)return;
  C.forEach(function(c){c.style.gridColumn='';c.firstChild.style.minHeight=''});
  g.style.gridTemplateColumns='';
  var n=cols(g),L=1,q,row=[],full=function(c){return c.classList.contains('xo')||c.classList.contains('fld')};
  for(q=2;q<=n;q++)L=L*q/gcd(L,q);
  function flush(){row.forEach(function(c){c.style.gridColumn='span '+(n*L/row.length)});row=[]}
  if(n>1){
    g.style.gridTemplateColumns='repeat('+(n*L)+',minmax(0,1fr))';
    C.forEach(function(c){if(full(c)){flush();c.style.gridColumn='1/-1'}else{row.push(c);if(row.length===n)flush()}});flush();
    g.style.alignItems='start';var lg=new Map();
    C.forEach(function(c){if(full(c))return;var b=c.firstChild,x=b.querySelector('.xw'),y=Math.round(c.offsetTop),h=b.offsetHeight-(x?x.offsetHeight:0);lg.set(y,Math.max(lg.get(y)||0,h))});
    C.forEach(function(c){if(!full(c))c.firstChild.style.minHeight=lg.get(Math.round(c.offsetTop))+'px'});g.style.alignItems=''}
  if(before&&!RM){g._fl=g._fl||[];
    C.forEach(function(c){var o=before.get(c);if(!o)return;var r=c.getBoundingClientRect(),b=c.firstChild.getBoundingClientRect(),dx=o.x-r.left,dy=o.y-r.top;
      if(Math.abs(dx)>.5||Math.abs(dy)>.5)g._fl.push(c.animate([{transform:'translate('+dx+'px,'+dy+'px)'},{transform:'none'}],{duration:340,easing:E_IN}));
      var dw=Math.abs(o.w-b.width)>.5,dh=c!==focus&&Math.abs(o.h-b.height)>.5;
      if(dw||dh){var k0={overflow:'hidden'},k1={overflow:'hidden'};
        if(dw){k0.width=o.w+'px';k1.width=b.width+'px'}if(dh){k0.height=o.h+'px';k1.height=b.height+'px'}
        g._fl.push(c.firstChild.animate([k0,k1],{duration:340,easing:E_IN}))}})}}
function arrangeAll(root){[].forEach.call(root.querySelectorAll('.grd.par'),function(g){arrange(g)})}

/* ── Bifurcation lines ── */
function draw(sec){if(sec.classList.contains('opn'))[].forEach.call(sec.querySelectorAll('.bif'),drawBif)}
function drawBif(b){
  var S=b._seg||(b._seg={}),used={};
  function seg(k,x,y,w,h){var s=S[k];if(!s){s=el('span','bif-s');b.appendChild(s);S[k]=s}
    s.style.left=x+'px';s.style.top=y+'px';s.style.width=Math.max(0,w)+'px';s.style.height=Math.max(0,h)+'px';used[k]=1}
  var g=b.querySelector('.bif-g'),j=b.querySelector('.bif-j'),com=b.querySelector('.bif-com'),cs=kids(g);
  var comK=com?kids(com).filter(vis):[];
  j.style.height='0px';
  var Bx=b.getBoundingClientRect(),G=g.getBoundingClientRect();
  if(WIDE.matches){
    var cx=Bx.width/2;
    if(comK.length&&cs.length===2){
      var bottoms=cs.map(function(c){var k=kids(c).filter(vis),l=k[k.length-1];return l.getBoundingClientRect().bottom-Bx.top});
      var bar=Math.max(bottoms[0],bottoms[1])+32,gb=G.bottom-Bx.top,xl=Bx.width*.25-12,xr=Bx.width*.75+12-1;
      j.style.height=Math.max(0,bar+16-gb)+'px';
      seg('cont',cx-.5,16,1,bar);
      seg('bar',xl,bar-.5,xr+1-xl,1);
      seg('jl',xl,bottoms[0]+12,1,bar-bottoms[0]-12+.5);
      seg('jr',xr,bottoms[1]+12,1,bar-bottoms[1]-12+.5)}
    else seg('cont',cx-.5,16,1,G.bottom-Bx.top-16)}
  else{
    var hs=cs.map(function(c){return c.querySelector('.brh')}).filter(Boolean);
    var ys=hs.map(function(h){var l=h.querySelector('.brh-l'),r=(l.getClientRects()[0])||l.getBoundingClientRect();return (r.top+r.bottom)/2-Bx.top});
    if(ys.length){
      var y1=comK.length?comK[0].getBoundingClientRect().top-Bx.top:ys[ys.length-1];
      seg('mv',11.5,ys[0],1,y1-ys[0]);
      hs.forEach(function(h,i){seg('mh'+i,11.5,ys[i]-.5,h.getBoundingClientRect().left-Bx.left-11.5,1)})}}
  for(var k in S)if(!used[k]){S[k].remove();delete S[k]}}

function redraw(){arrangeAll(W);SECS.forEach(draw)}

/* ── Readings and text size ── */
function reading(b,d){
  breadth=b;depth=d;B.classList.remove('b1','b2','b3','d1','d2','d3');B.classList.add('b'+b,'d'+d);
  [].forEach.call(RG.querySelectorAll('[data-set-breadth]'),function(x){x.classList.toggle('act',+x.dataset.setBreadth===b)});
  [].forEach.call(RG.querySelectorAll('[data-set-depth]'),function(x){x.classList.toggle('act',+x.dataset.setDepth===d)});
  redraw();updateArrow()}
function size(i){
  tzi=i;R.style.setProperty('--tz',TZ[i]);
  RG.querySelector('[data-tz="-1"]').classList.toggle('end',i===0);
  RG.querySelector('[data-tz="1"]').classList.toggle('end',i===TZ.length-1);
  redraw()}

/* ── Remembered state ── */
function state(list){return {v:1,breadth:breadth,depth:depth,size:TZ[tzi],open:list||SECS.filter(isOpen).map(function(s){return s.dataset.key})}}
function save(list){
  var e=state(list);
  try{localStorage.setItem(KEY,JSON.stringify(e))}catch(x){}
  if(FRAMED){try{parent.postMessage({lvState:e},'*')}catch(x){}}}
function apply(e){
  if(!e||typeof e!=='object')return;
  var b=[1,2,3].indexOf(e.breadth)>=0?e.breadth:2,d=[1,2,3].indexOf(e.depth)>=0?e.depth:3,ti=TZ.indexOf(e.size);
  if(ti<0)ti=TZ.length-1;
  var op=Array.isArray(e.open)?e.open:[];
  B.classList.add('nt');
  SECS.forEach(function(s){stop(s);var o=op.indexOf(s.dataset.key)>=0;
    s.classList.toggle('exd',o);s.classList.toggle('opn',o);s._clip.style.visibility=o?'visible':'hidden';s._clip.style.overflow=''});
  G_TARGET=null;tzi=ti;R.style.setProperty('--tz',TZ[ti]);
  RG.querySelector('[data-tz="-1"]').classList.toggle('end',ti===0);
  RG.querySelector('[data-tz="1"]').classList.toggle('end',ti===TZ.length-1);
  reading(b,d);
  void B.offsetHeight;B.classList.remove('nt')}

/* ── Gestures ── */
W.addEventListener('click',function(e){
  var t=e.target;if(t&&t.nodeType!==1)t=t.parentElement;if(!t)return;
  var b=t.closest('[data-set-breadth]');if(b){GESTURE=true;reading(+b.dataset.setBreadth,depth);save();return}
  b=t.closest('[data-set-depth]');if(b){GESTURE=true;reading(breadth,+b.dataset.setDepth);save();return}
  b=t.closest('[data-tz]');if(b){GESTURE=true;var d=+b.dataset.tz;size(d===0?TZ.length-1:Math.max(0,Math.min(TZ.length-1,tzi+d)));save();return}
  if(t.closest('.glb')){GESTURE=true;globalToggle();return}
  var xi=t.closest('.xin');if(xi){if(window.getSelection&&String(window.getSelection()))return;var dx=xi.parentElement;while(dx&&W.contains(dx)&&!(dx._xw&&dx._xw.contains(xi)))dx=dx.parentElement;if(dx&&dx._xw)expand(dx);return}
  var s=t.closest('.sgn');if(s){expand(s.closest('.sec'));return}
  var h=t.closest('.sch');if(h){GESTURE=true;toggleSec(h.parentNode);return}
  var dp=t.closest('.exp');if(dp&&W.contains(dp))expand(dp)});
W.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target===GLB){e.preventDefault();GESTURE=true;globalToggle()}});
D.addEventListener('touchstart',function(){},{passive:true});

var lw=window.innerWidth,lh=window.innerHeight,rt;
window.addEventListener('resize',function(){
  var w=window.innerWidth,h=window.innerHeight;
  if(w===lw&&Math.abs(h-lh)<150)return;lw=w;lh=h;clearTimeout(rt);rt=setTimeout(redraw,120)});
D.addEventListener('visibilitychange',function(){if(D.visibilityState==='hidden')save()});
window.addEventListener('pagehide',function(){save()});

/* ── Startup ── */
var ST=D.createElement('style');ST.textContent='body.nt *,body.nt *::before,body.nt *::after{transition:none !important}';D.head.appendChild(ST);
var STATE=null;try{STATE=JSON.parse(localStorage.getItem(KEY))}catch(x){}
reading(2,3);size(TZ.length-1);
if(STATE)apply(STATE);
window.addEventListener('message',function(ev){
  if(ev.source!==parent)return;var d=ev.data;
  if(d&&typeof d==='object'&&d.lvState&&!GESTURE){STATE=d.lvState;apply(STATE)}});
if(FRAMED){try{parent.postMessage({lvStateWanted:1},'*')}catch(x){}}
[150,500,1200].forEach(function(t){setTimeout(function(){if(GESTURE)return;if(STATE)apply(STATE);else redraw()},t)});
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){redraw()});
})();

/* ══════════════════════════════════════════════════════════════════════
   BOOK ENGINE: SCRIPT
   1. Building: reads the content (<template id="content">), builds the
      cover, the part dividers, the chapters and the table of contents.
   2. Pagination: 330 words per page, each section opens a page, a
      pagination of its own for each of the nine readings (scope+depth key).
   3. Reading: scope, depth, text size, table of contents, page field,
      progress bar, tracking of the current section.
   4. Remembered state: local storage ('book-state-' + identifier) and host
      page through the messages {bkState} / {bkStateRequest}.
   Positions are cached and read back by binary search: scrolling stays
   smooth on a book of several hundred pages.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var D=document,B=D.body,R=D.documentElement;
var T=D.getElementById('content'),L=T&&T.content.querySelector('book');
if(!L)return;
var TZ=[.85,.925,1,1.08,1.16,1.25],TZD=TZ[TZ.length-1];
var LIMIT=330,TOP=120;
var KEYS=['11','12','13','21','22','23','31','32','33'];
var PAL=['#ff4d6d','#3fa7ff','#ffb627','#35e0a1','#b77bff','#ff7f3f','#22d3ee','#ff5bd6'];
var NEUTRAL='#f2f2f2';
var FRAMED=(function(){try{return parent!==window}catch(e){return true}})();
var SMOOTH=!matchMedia('(prefers-reduced-motion:reduce)').matches;
/* quotation marks of the book's language */
var LANG=(L.getAttribute('lang')||R.getAttribute('lang')||'en').toLowerCase();
var QO,QC;
if(/^(de|cs|sk|sl|hr|lt|et|is|bg)/.test(LANG)){QO='\u201e';QC='\u201c'}
else{QO='\u201c';QC='\u201d'}

/* ── helpers ── */
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function kids(s){return [].filter.call(s.children,function(){return true})}
function lv(s,k){var v=s.getAttribute(k)||s.getAttribute('data-'+k);return v==='2'?2:v==='3'?3:1}
function mark(e,s,d){if(s>1)e.setAttribute('data-s',s);if(d>1)e.setAttribute('data-d',d)}
function slug(s){return (s||'book').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'book'}
function text(h){var t=el('div',null,h||'');return t.textContent.replace(/\s+/g,' ').trim()}
var WORD=/[0-9A-Za-z\u00c0-\u00ff]/;
function words(t){var n=0,w=t.split(/[\s\u00a0\u202f]+/);for(var i=0;i<w.length;i++)if(WORD.test(w[i]))n++;return n}
function pad(n){return n<10?'0'+n:''+n}

/* numbers written out in words */
var U=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen',
  'fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
var TENS=['','ten','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function inWords(n){
  if(n<20)return U[n];
  if(n<100){var d=Math.floor(n/10),u=n%10;return TENS[d]+(u?'-'+U[u]:'')}
  if(n<1000){var c=Math.floor(n/100),r=n%100;return U[c]+' hundred'+(r?' '+inWords(r):'')}
  return String(n)}
function cap(w){return w.charAt(0).toUpperCase()+w.slice(1)}

/* ══ 1. BUILDING ══ */
var MAIN=D.getElementById('reader'),UL=D.getElementById('toc-list'),TOC=D.getElementById('toc');
var TITLE=L.getAttribute('title')||'Book';
var KEY='book-state-'+slug(text(TITLE));
D.getElementById('eyebrow').innerHTML=L.getAttribute('eyebrow')||'A book';
D.getElementById('title').innerHTML=TITLE;
var st=L.getAttribute('subtitle');
if(st)D.getElementById('subtitle').innerHTML=st;else D.getElementById('subtitle').remove();
var tg=L.getAttribute('tagline');
D.getElementById('brand').innerHTML='<b>'+text(TITLE)+'</b>'+(tg?'\u2002\u00b7\u2002'+text(tg):'');

var SECS=[];          /* sections in order: {el,id,s,d,blocks,li,num,part,lab,kick} */
var nch=0,npt=0,colors=[];

/* a block of text: rendered element, words, levels, carrier of a page number */
function block(e,s,d,carrier){return {el:e,words:words(e.textContent),s:s,d:d,carrier:carrier}}

function quote(s){
  var f=el('figure','quote-card'),ref=s.getAttribute('ref');
  var ps=kids(s).filter(function(c){return c.localName==='p'});
  if(!ps.length){var p=D.createElement('p');while(s.firstChild)p.appendChild(s.firstChild);ps=[p]}
  var o=QO.trim(),c=QC.trim();
  ps.forEach(function(p,i){
    var q=el('p','q');while(p.firstChild)q.appendChild(p.firstChild);
    var t=q.textContent.trim();
    if(i===0&&t.charAt(0)!==o)q.insertBefore(D.createTextNode(QO),q.firstChild);
    if(i===ps.length-1&&t.charAt(t.length-1)!==c&&!new RegExp(c+'[.!?\u2026]?$').test(t))q.appendChild(D.createTextNode(QC));
    f.appendChild(q)});
  if(ref)f.appendChild(el('p','ref',ref));
  return f}

function chapter(s,part){
  var lab=s.getAttribute('label'),ps=part?part.s:1,pd=part?part.d:1;
  var sc=Math.max(lv(s,'s'),ps),dp=Math.max(lv(s,'d'),pd);
  var sec=el('section','chap');sec.id='ch'+(++nch);
  var acc=part?part.color:NEUTRAL;sec.style.setProperty('--a',acc);
  mark(sec,sc,dp);
  var cn=el('p','chap-num');if(lab)cn.innerHTML=lab;sec.appendChild(cn);
  var h=el('h2',null,s.getAttribute('title')||'');sec.appendChild(h);
  var blocks=[block(h,1,1,true)];
  kids(s).forEach(function(c){
    var nm=c.localName,bs=lv(c,'s'),bd=lv(c,'d'),e,carrier=true;
    if(nm==='p'){e=c;c.removeAttribute('s');c.removeAttribute('d')}
    else if(nm==='lede'){e=el('p','lede');while(c.firstChild)e.appendChild(c.firstChild)}
    else if(nm==='subhead'){e=el('h3');while(c.firstChild)e.appendChild(c.firstChild)}
    else if(nm==='quote'){e=quote(c);carrier=false}
    else if(nm==='free'){e=el('div','free');while(c.firstChild)e.appendChild(c.firstChild);carrier=false}
    else{e=c;carrier=false;c.removeAttribute('s');c.removeAttribute('d')}
    mark(e,bs,bd);sec.appendChild(e);blocks.push(block(e,bs,bd,carrier))});
  MAIN.appendChild(sec);
  var li=el('li',lab?'toc-front':'toc-chap');li.setAttribute('data-id',sec.id);li.style.setProperty('--a',acc);mark(li,sc,dp);
  var an=el('a');an.href='#'+sec.id;
  var tn=null;if(!lab){tn=el('span','tn');an.appendChild(tn)}
  an.appendChild(el('span',null,s.getAttribute('title')||''));
  var tp=el('span','tp');an.appendChild(tp);li.appendChild(an);UL.appendChild(li);
  var o={el:sec,id:sec.id,s:sc,d:dp,blocks:blocks,li:li,tp:tp,tn:tn,num:!lab,lab:cn,acc:acc};
  SECS.push(o);return o}

function part(s){
  var k=npt++,c=s.getAttribute('color')||PAL[k%PAL.length];colors.push(c);
  var pt={color:c,s:lv(s,'s'),d:lv(s,'d')};
  var sec=el('section','partsep');sec.id='p'+(k+1);sec.style.setProperty('--a',c);
  var kick=el('p','part-kicker'),h=el('h2','part-title',s.getAttribute('title')||'');
  sec.appendChild(kick);sec.appendChild(h);sec.appendChild(el('div','sep'));
  var blocks=[block(h,1,1,true)],sm=s.getAttribute('summary');
  if(sm){var pb=el('p','part-blurb',sm);sec.appendChild(pb);blocks.push(block(pb,1,1,true))}
  MAIN.appendChild(sec);
  var li=el('li','toc-part');li.style.setProperty('--a',c);
  var an=el('a');an.href='#'+sec.id;an.appendChild(el('span',null,s.getAttribute('title')||''));
  var tp=el('span','tp');an.appendChild(tp);li.appendChild(an);UL.appendChild(li);
  var o={el:sec,id:sec.id,s:3,d:3,blocks:blocks,li:li,tp:tp,num:false,kick:kick,acc:c,part:true};
  SECS.push(o);
  var ch=kids(s).filter(function(x){return x.localName==='chapter'}).map(function(x){return chapter(x,pt)});
  /* the divider appears as soon as one of its chapters appears */
  if(ch.length){o.s=Math.min.apply(null,ch.map(function(x){return x.s}));o.d=Math.min.apply(null,ch.map(function(x){return x.d}))}
  else{o.s=pt.s;o.d=pt.d}
  mark(sec,o.s,o.d);mark(li,o.s,o.d)}

kids(L).forEach(function(c){
  if(c.localName==='part')part(c);
  else if(c.localName==='chapter')chapter(c,null)});
D.getElementById('rule').style.background=colors.length
  ?'linear-gradient(90deg,'+colors.join(',')+(colors.length===1?','+colors[0]+' 40%':'')+',transparent)'
  :'linear-gradient(90deg,'+NEUTRAL+',transparent)';
T.remove();

/* ══ 2. PAGINATION: one pass per reading, over the blocks it keeps ══ */
var PAG={},TOT={};
KEYS.forEach(function(k){
  var S=+k[0],V=+k[1],marks=[],start={},page=0;
  SECS.forEach(function(s){
    if(s.s>S||s.d>V)return;
    page++;start[s.id]=page;
    var count=0,carry=false,first=true;
    s.blocks.forEach(function(b){
      if(b.s>S||b.d>V)return;
      if(first){marks.push([b.el,page]);first=false;count=b.words;return}
      if(b.carrier&&(carry||(count&&count+b.words>LIMIT))){page++;count=0;carry=false;marks.push([b.el,page])}
      else if(!b.carrier&&count+b.words>LIMIT)carry=true;
      count+=b.words});
  });
  PAG[k]={marks:marks,start:start};TOT[k]=page});

/* ══ 3. READING ══ */
var btn=D.getElementById('tocbtn'),mask=D.querySelector('.tocmask'),bar=D.querySelector('.bar i'),
    pgin=D.getElementById('pgin'),pgtot=D.getElementById('pgtot');
var scope='2',depth='3',tz=TZD,pgs=[],nbpg=0;
var vis=[],visTop=[],pgTop=[],blocksVis=[],current=-1;
function wide(){return innerWidth>980}
function key(){return scope+depth}

/* table of contents */
function sync(){
  var hid=wide()?B.classList.contains('tochid'):!B.classList.contains('tocopen');
  btn.setAttribute('aria-expanded',hid?'false':'true')}
function closeToc(){B.classList.remove('tocopen');sync()}
btn.addEventListener('click',function(){
  if(wide())B.classList.toggle('tochid');else B.classList.toggle('tocopen');
  sync();saveState();setTimeout(measure,320)});
mask.addEventListener('click',closeToc);
TOC.addEventListener('click',function(e){if(e.target.closest('a')&&!wide())closeToc()});

/* cached measurements: top of each section and of each page number */
function top(e){return e.getBoundingClientRect().top+scrollY}
function measure(){
  visTop=vis.map(function(s){return top(s.el)});
  pgTop=pgs.map(top);
  current=-1;onScroll()}
function last(tops,y){var lo=0,hi=tops.length-1,r=-1;
  while(lo<=hi){var m=(lo+hi)>>1;if(tops[m]<=y){r=m;lo=m+1}else hi=m-1}return r}

/* reading marker: the block passing under the top bar, and the share of it already read */
function marker(){
  var lo=0,hi=blocksVis.length-1,r=-1;
  while(lo<=hi){var m=(lo+hi)>>1,bb=blocksVis[m].getBoundingClientRect();
    if(bb.bottom>60){r=m;hi=m-1}else lo=m+1}
  if(r<0)return null;
  var e=blocksVis[r],rc=e.getBoundingClientRect();
  return {el:e,f:rc.height?(60-rc.top)/rc.height:0}}
function restore(p){
  if(!p)return false;
  if(p.el.offsetParent===null)return false;
  var rc=p.el.getBoundingClientRect();
  scrollTo(0,Math.max(0,scrollY+rc.top+Math.max(0,p.f)*rc.height-60));return true}

function view(a,v,keep){
  var place=keep?marker():null,anchor=keep?section():'';
  scope=String(a);depth=String(v);
  var S=+scope,V=+depth,k=key();
  B.classList.remove('s1','s2','s3','d1','d2','d3');B.classList.add('s'+scope,'d'+depth);
  [].forEach.call(D.querySelectorAll('.picker span[data-scope]'),function(sp){
    var x=sp.getAttribute('data-scope');sp.classList.toggle('on',x===scope);sp.querySelector('b').textContent=TOT[x+depth]+' pp.'});
  [].forEach.call(D.querySelectorAll('.picker span[data-depth]'),function(sp){
    var x=sp.getAttribute('data-depth');sp.classList.toggle('on',x===depth);sp.querySelector('b').textContent=TOT[scope+x]+' pp.'});
  /* chapter numbers and part ranks, counted in the chosen reading */
  var nc=0,np=0;vis=[];blocksVis=[];
  SECS.forEach(function(s){
    var ok=s.s<=S&&s.d<=V,d=PAG[k].start[s.id];
    s.tp.textContent=d?d:'';
    if(!ok)return;
    vis.push(s);
    s.blocks.forEach(function(b){if(b.s<=S&&b.d<=V)blocksVis.push(b.el)});
    if(s.part){np++;s.kick.textContent='Part '+cap(inWords(np))}
    else if(s.num){nc++;s.lab.textContent='Chapter '+inWords(nc);if(s.tn)s.tn.textContent=pad(nc)}});
  /* page markers of the active reading */
  [].forEach.call(MAIN.querySelectorAll('.pg'),function(p){p.remove()});
  pgs=PAG[k].marks.map(function(m){
    var s=el('span','pg pg'+k+' on');s.id='pg'+k+'-'+m[1];s.setAttribute('data-pg',m[1]);s.textContent=m[1];
    m[0].insertBefore(s,m[0].firstChild);return s});
  nbpg=TOT[k];pgtot.textContent=nbpg;
  if(keep&&!restore(place)&&anchor){
    /* the current section has left the reading: go to the nearest one before it */
    var j=0;while(j<SECS.length&&SECS[j].id!==anchor)j++;
    while(j>0&&(j>=SECS.length||SECS[j].el.offsetParent===null))j--;
    if(SECS[j])SECS[j].el.scrollIntoView({block:'start'})}
  measure()}
function choose(sp){
  if(sp.hasAttribute('data-scope'))view(sp.getAttribute('data-scope'),depth,true);
  else view(scope,sp.getAttribute('data-depth'),true);
  saveState()}
D.addEventListener('click',function(e){var sp=e.target.closest&&e.target.closest('.picker span');if(sp)choose(sp)});
D.addEventListener('keydown',function(e){
  if(e.key!=='Enter'&&e.key!==' ')return;
  var sp=e.target.closest&&e.target.closest('.picker span');if(sp){e.preventDefault();choose(sp)}});

/* text size: the --bkz factor, the reader's place kept */
function size(v,keep){
  var place=keep?marker():null;
  tz=v;R.style.setProperty('--bkz',v);
  var i=TZ.indexOf(v);
  [].forEach.call(D.querySelectorAll('[data-tz]'),function(t){
    var d=t.getAttribute('data-tz');t.classList.toggle('at-end',(d==='-1'&&i===0)||(d==='1'&&i===TZ.length-1))});
  if(place)restore(place)}
D.addEventListener('click',function(e){
  var t=e.target.closest?e.target.closest('[data-tz]'):null;if(!t)return;
  var d=t.getAttribute('data-tz'),v=TZD;
  if(d!=='0'){var i=TZ.indexOf(tz);if(i<0)i=TZ.length-1;i=Math.max(0,Math.min(TZ.length-1,i+(d==='1'?1:-1)));v=TZ[i]}
  size(v,true);measure();saveState()});

/* go to a page: in a frame that does not scroll, the host page carries the reading */
function bring(e,smooth){
  if(FRAMED&&R.scrollHeight<=innerHeight+1){
    try{parent.postMessage({bkAnchor:Math.round(top(e)-70)},'*')}catch(x){}return}
  e.scrollIntoView({block:'start',behavior:smooth&&SMOOTH?'smooth':'auto'})}
function goTo(n){
  n=Math.max(1,Math.min(nbpg,parseInt(n,10)||1));
  var e=D.getElementById('pg'+key()+'-'+n);
  if(e){bring(e,true);e.classList.add('hit');setTimeout(function(){e.classList.remove('hit')},1500);if(!wide())closeToc()}
  return n}
pgin.addEventListener('focus',function(){pgin.select()});
pgin.addEventListener('keydown',function(e){
  if(e.key==='Enter'){e.preventDefault();pgin.value=goTo(pgin.value);pgin.blur()}
  if(e.key==='Escape')pgin.blur()});
pgin.addEventListener('change',function(){pgin.value=goTo(pgin.value)});
pgin.addEventListener('blur',function(){onScroll()});

/* scrolling: progress, current section, current page */
var rafS=0;
function onScroll(){
  var h=R.scrollHeight-innerHeight,y=scrollY+TOP;
  bar.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';
  var c=last(visTop,y),s=vis[c<0?0:c];
  if(s&&c!==current){
    current=c;
    /* the table of contents highlights the current chapter (or the one before a divider) */
    var j=Math.max(c,0);while(j>0&&vis[j].part)j--;
    var on=vis[j]&&!vis[j].part?vis[j].li:null;
    SECS.forEach(function(x){x.li.classList.toggle('on',x.li===on)});
    R.style.setProperty('--acur',s.acc);
    if(on&&wide()&&!B.classList.contains('tochid')){
      var r=on.getBoundingClientRect(),t=TOC.getBoundingClientRect();
      if(r.top<t.top+40||r.bottom>t.bottom-40)TOC.scrollTop+=(r.top+r.height/2)-(t.top+t.height/2)}}
  if(nbpg&&D.activeElement!==pgin){
    var p=last(pgTop,y),v=String(p<0?1:pgs[p].getAttribute('data-pg'));
    if(pgin.value!==v)pgin.value=v}}
function section(){var c=last(visTop,scrollY+TOP);return c<0?'':vis[c].id}
function currentPage(){var p=last(pgTop,scrollY+TOP);return p<0?1:+pgs[p].getAttribute('data-pg')}

/* ══ 4. REMEMBERED STATE ══ */
var statePlan=0,retries=[],touched=false;
function state(){return {v:1,scope:scope,depth:depth,size:tz,
  toc:B.classList.contains('tochid')?1:0,section:section(),page:currentPage()}}
function saveState(){
  clearTimeout(statePlan);statePlan=0;var e=state();
  try{localStorage.setItem(KEY,JSON.stringify(e))}catch(x){}
  if(FRAMED){try{parent.postMessage({bkState:e},'*')}catch(x){}}}
function planState(){if(statePlan)return;statePlan=setTimeout(saveState,250)}
function applyState(e,noPlace){
  if(!e||e.v!==1)return;
  size(TZ.indexOf(e.size)<0?TZD:e.size,false);
  view(/^[123]$/.test(e.scope)?e.scope:scope,/^[123]$/.test(e.depth)?e.depth:depth,false);
  B.classList.toggle('tochid',e.toc===1);sync();
  if(!noPlace){
    var s=e.section&&D.getElementById(e.section),pe=e.page&&D.getElementById('pg'+key()+'-'+e.page);
    if(pe&&s&&pe.closest('section')===s)pe.scrollIntoView({block:'start'});
    else if(s&&s.offsetParent!==null)s.scrollIntoView({block:'start'})}
  measure()}
function stop(){retries.forEach(clearTimeout);retries=[]}
function resume(e){
  stop();applyState(e);
  retries=[150,500,1200].map(function(t){return setTimeout(function(){applyState(e)},t)})}
function release(){touched=true;stop()}
['wheel','touchstart','keydown','pointerdown'].forEach(function(n){addEventListener(n,release,{passive:true,once:true})});
addEventListener('message',function(ev){
  var d=ev.data;if(ev.source===parent&&FRAMED&&!touched&&d&&d.bkState)resume(d.bkState)});

/* citable address: #pg33-42 opens page 42 of the complete unabridged reading */
function address(){
  var m=/^#pg([123])([123])-(\d+)$/.exec(location.hash||'');if(!m)return false;
  view(m[1],m[2],false);var n=goTo(m[3]);pgin.value=n;return true}

var saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||'null')}catch(x){}
size(TZD,false);
view(scope,depth,false);
sync();
if(/^#pg/.test(location.hash||'')){
  if(saved)applyState(saved,true);
  address();
  [150,500,1200].forEach(function(t){retries.push(setTimeout(function(){measure();address()},t))})}
else if(saved)resume(saved);
if(FRAMED){try{parent.postMessage({bkStateRequest:1},'*')}catch(x){}}
addEventListener('hashchange',function(){if(address())saveState()});
addEventListener('visibilitychange',function(){if(D.visibilityState==='hidden')saveState()});
addEventListener('pagehide',saveState);
addEventListener('scroll',function(){
  if(!rafS)rafS=requestAnimationFrame(function(){rafS=0;onScroll()});planState()},{passive:true});
var rafM=0;function planMeasure(){if(!rafM)rafM=requestAnimationFrame(function(){rafM=0;measure()})}
addEventListener('resize',function(){sync();planMeasure()});
if(window.ResizeObserver)new ResizeObserver(planMeasure).observe(MAIN);
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(planMeasure);
measure();
})();

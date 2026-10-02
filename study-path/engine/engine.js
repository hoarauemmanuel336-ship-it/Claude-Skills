/* ══════════════════════════════════════════════════════════════════════
   STUDY PATH ENGINE: SCRIPT
   0. Copy of the file's source, before anything is built.
   1. Building: reads the content (<template id="content">) and builds the page.
   2. Behavior: themes, explanations, topic states, copying, text size.
   3. Progress: lv-progress block, local storage (key 'study-path:'
      + subject), host page (lvState, lvStateWanted, lvProgress), saving.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
/* ══ 0. SOURCE COPY: the file as it was delivered ══ */
var SOURCE='<!DOCTYPE html>\n'+document.documentElement.outerHTML;

var D=document,R=D.documentElement,W=D.getElementById('w');
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var E_IN='cubic-bezier(.2,.7,.3,1)',E_OUT='cubic-bezier(.4,0,1,1)';
var STEPS=[.9,1,1.1,1.2,1.3],Z0=1.3;
/* vivid hues ranged from cool to warm */
var PAL=['#8f6bff','#3d8bff','#1fc8e8','#22e0a0','#b8e62e','#ffc21f','#ff8a2a','#ff4567'];
var STATES=['to-do','in-progress','done','to-review'];
var LABELS={'to-do':'To do','in-progress':'In progress','done':'Done','to-review':'To review'};
var FRAMED=(function(){try{return parent!==window}catch(e){return true}})();
function ms(n){return RM?0.01:n}

/* ══ Typography of the content's language (copied text) ══ */
function typo(t){
  return t.replace(/(^|[\s(\[{\u2014\u2013\u201c-])'/g,'$1\u2018').replace(/'/g,'\u2019')
    .replace(/(^|[\s(\[{\u2014\u2013\u2018-])"/g,'$1\u201c').replace(/"/g,'\u201d')}

/* ══ 1. BUILDING ══ */
var SRC=D.getElementById('content').content.querySelector('study-path');
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function kids(s,name){return [].filter.call(s.children,function(c){return c.localName===name})}
function txt(h){var t=el('div',null,h||'');return t.textContent.replace(/\s+/g,' ').trim()}
function slug(s){return (s||'study-path').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)||'study-path'}
function rgb(h){h=(h||'').trim().replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');
  var n=parseInt(h,16);if(isNaN(n)||h.length!==6)return '255 255 255';return [(n>>16)&255,(n>>8)&255,n&255].join(' ')}
function tint(e,c){e.style.setProperty('--a',c);e.style.setProperty('--r',rgb(c))}
function two(n){return (n<10?'0':'')+n}
function button(cls,label){var b=el('button',cls,label);b.type='button';return b}
/* explanation panel drawn from the <explanation> direct child of s */
function panel(s,cls){
  var x=kids(s,'explanation')[0];if(!x)return null;
  var w=el('div','xw'+(cls?' '+cls:'')),r=el('div','xr'),i=el('div','xin'),p=el('div','xpl');
  while(x.firstChild)p.appendChild(x.firstChild);
  i.appendChild(p);r.appendChild(i);w.appendChild(r);return w}

var TITLE=SRC.getAttribute('subject')||SRC.getAttribute('title')||'Study path';
var ID=slug(txt(TITLE));
var LOCAL_KEY='study-path:'+ID;
var UNFOLDS={};      // stable key -> element that carries the unfolding
var THEMES=[],TOPICS={},BLOCKS=[];

/* global arrow */
var GLB=el('span','glb','\u2192');GLB.tabIndex=0;GLB.setAttribute('role','button');GLB.setAttribute('aria-label','Open or collapse everything');
W.appendChild(GLB);

/* banner */
var BNR=el('div','bnr');BNR.setAttribute('role','button');BNR.tabIndex=0;
['tl','tr','bl','br'].forEach(function(k){BNR.appendChild(el('span','bcn '+k))});
BNR.appendChild(el('h1','bnr-t',TITLE));
var blocksSrc=kids(SRC,'block'),nbTh=0;
blocksSrc.forEach(function(b){nbTh+=kids(b,'theme').length});
BNR.appendChild(el('div','bnr-s',SRC.getAttribute('subtitle')||('Study plan in '+nbTh+' major themes')));
var bx=panel(SRC);if(bx){BNR.appendChild(bx);BNR._xw=bx;UNFOLDS.b=BNR}
W.appendChild(BNR);

/* progress bars and save button */
var PRG=el('div','prg');W.appendChild(PRG);
var SAV=null;
if(!FRAMED){var ew=el('div','sav-w');SAV=button('sav');SAV.innerHTML='<span class="pt-s"></span><span class="sav-l">Save</span>';ew.appendChild(SAV);W.appendChild(ew)}

/* blocks, themes, topics */
var num=0;
blocksSrc.forEach(function(bs,ib){
  var name=bs.getAttribute('name')||'',col=bs.getAttribute('color');
  if(!col){var n=blocksSrc.length;col=PAL[n<2?1:Math.round(ib*(PAL.length-1)/(n-1))]}
  var ths=kids(bs,'theme'),mul=ths.length>1;
  var B={name:name,themes:[]};BLOCKS.push(B);
  var bh=el('div','bh'),bk='bl:'+slug(txt(name));tint(bh,col);
  bh.appendChild(el('span','bh-n',name));bh.appendChild(el('span','bh-l'));W.appendChild(bh);
  var bp=mul?panel(bs,'bp'):null;
  if(mul){bh.classList.add('mul');bh.setAttribute('role','button');bh.tabIndex=0;
    if(!bp){bp=el('div','xw bp');bp.innerHTML='<div class="xr"><div class="xin"><div class="xpl"></div></div></div>'}
    tint(bp,col);var cw=el('div','cpw'),cb=button('cp','Copy block');cb._copy=function(){return blockText(B)};
    cw.appendChild(cb);bp.querySelector('.xin').appendChild(cw);W.appendChild(bp);bh._xw=bp;UNFOLDS[bk]=bh}
  else{var only=kids(bs,'explanation')[0];if(only&&ths[0]&&!kids(ths[0],'explanation').length)ths[0].insertBefore(only,ths[0].firstChild)}
  ths.forEach(function(ts){
    num++;var tt=ts.getAttribute('title')||'',tk=ts.getAttribute('key')||slug(txt(tt));
    var T={num:num,title:tt,key:tk,topics:[],color:col};B.themes.push(T);THEMES.push(T);
    var th=el('div','th');tint(th,col);T.el=th;th._T=T;
    var h=el('div','th-h');h.setAttribute('role','button');h.tabIndex=0;
    h.appendChild(el('span','tag',two(num)));
    var t=el('div','th-t',tt);h.appendChild(t);
    var x=panel(ts,'th-x');
    if(x){var p=el('span','th-p','+');p.setAttribute('role','button');p.tabIndex=0;p.setAttribute('aria-label','Theme explanation');t.appendChild(p);th._xw=x;UNFOLDS['th:'+tk]=th}
    h.appendChild(el('span','th-v','\u203a'));th.appendChild(h);if(x)th.appendChild(x);
    var sep=el('div','th-sep');th.appendChild(sep);
    var c=el('div','th-c'),ci=el('div','th-ci'),cp=el('div','th-cp'),cbt=button('cp','Copy theme');
    cbt._copy=function(){return themeText(T)};cp.appendChild(cbt);ci.appendChild(cp);
    var rl=el('div','rail'),rt=el('span','rail-t'),rf=el('span','rail-f');rl.appendChild(rt);rl.appendChild(rf);
    kids(ts,'topic').forEach(function(ss,is){
      var st=ss.getAttribute('title')||'',k=ss.getAttribute('key')||(tk+'.'+(is+1));
      k=k.replace(/[^A-Za-z0-9._-]/g,'-').slice(0,80);
      var S={key:k,title:st,theme:T,points:[],state:'to-do'};
      var cw=el('div','cw'),pt=el('span','pt'),cb=el('div','cb'),ch=el('div','ch'),ct=el('div','ct');
      cw.appendChild(pt);ct.setAttribute('role','button');ct.tabIndex=0;
      ct.appendChild(el('div','ct-t','<span class="code">'+two(num)+'.'+(is+1)+'</span>'+st));
      var ds=ss.getAttribute('desc');if(ds)ct.appendChild(el('div','ct-d',ds));
      var sel=el('div','sel');STATES.forEach(function(e){var b=button('',LABELS[e]);b.setAttribute('data-s',e);sel.appendChild(b)});
      ch.appendChild(ct);ch.appendChild(sel);cb.appendChild(ch);
      var xw=el('div','xw'),xr=el('div','xr'),xi=el('div','xin');
      xi.appendChild(el('div','xsep'));xi.appendChild(el('div','cx-h','What you will learn'));
      var ul=el('ul','pts');
      kids(ss,'p').forEach(function(pp){ul.appendChild(el('li',null,pp.innerHTML));S.points.push(txt(pp.innerHTML))});
      xi.appendChild(ul);var w2=el('div','cpw'),bs2=button('cp','Copy topic');bs2._copy=function(){return topicText(S)};
      w2.appendChild(bs2);xi.appendChild(w2);xr.appendChild(xi);xw.appendChild(xr);cb.appendChild(xw);cw.appendChild(cb);
      cw._xw=xw;cw._S=S;S.el=cw;S.pt=pt;UNFOLDS['s:'+k]=cw;
      rl.appendChild(cw);T.topics.push(S);TOPICS[k]=S});
    ci.appendChild(rl);c.appendChild(ci);th.appendChild(c);W.appendChild(th);
    T.c=c;T.ci=ci;T.sep=sep;T.rail=rl;T.rt=rt;T.rf=rf;T.cp=cp;T.cpBtn=cbt;
    /* bar segment */
    var sg=el('div','seg'),br=el('div','bar'),fl=el('span','fill'),hc=el('span','hatch');tint(sg,col);
    br.appendChild(fl);br.appendChild(hc);sg.appendChild(br);sg.appendChild(el('div','num',two(num)));PRG.appendChild(sg);
    T.fill=fl;T.hatch=hc});
});

/* footer: text size */
var FOOT=el('div','foot');FOOT.appendChild(el('span','foot-l','Text size'));
[['-1','A\u2212'],['0','A'],['1','A+']].forEach(function(a){var b=button('tz',a[1]);b.setAttribute('data-tz',a[0]);FOOT.appendChild(b)});
W.appendChild(FOOT);

/* copied texts */
function topicText(S){return txt(S.title)+'\n\n'+S.points.map(function(p){return '\u00b7 '+p}).join('\n')}
function themeText(T){return txt(T.title)+'\n\n'+T.topics.map(topicText).join('\n\n')}
function blockText(B){return txt(B.name).toUpperCase()+'\n\n'+B.themes.map(themeText).join('\n\n\n')}

/* ══ 2. BEHAVIOR ══ */

/* ── unfolding an explanation ── */
function unfold(o,on,instant){
  var w=o._xw;if(!w)return;var i=w.querySelector('.xin');
  if(o._xa){o._xa.cancel();o._xa=null}
  o.classList.toggle('xo',on);w.classList.toggle('on',on);
  if(instant||RM)return;
  o._xa=on?i.animate([{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'none'}],{duration:350,easing:E_IN})
          :i.animate([{opacity:1},{opacity:0}],{duration:200,easing:E_OUT,fill:'forwards'});
  if(on){var a=o._xa;a.onfinish=function(){if(o._xa===a)o._xa=null}}}

/* ── opening and collapsing a theme ── */
var PENDING=[];
function cancel(T){
  (T.anims||[]).forEach(function(a){a.cancel()});T.anims=[];
  clearTimeout(T.safety);if(T.end){T.c.removeEventListener('transitionend',T.end);T.end=null}}
/* delays of a cascade: intervals shrunk in the same proportion
   when the last start would exceed the cap, with a floor */
function delays(iv,cap,floor){
  var S=iv.reduce(function(a,v){return a+v},0),f=S>cap?cap/S:1,t=0;
  return iv.map(function(v,i){t+=i?Math.max(floor,v*f):v*f;return t})}
function series(n,first,step){var iv=[0];for(var i=1;i<n;i++)iv.push(i===1?first:step);return iv}
function endOfMotion(T,tok,then){
  var tr=new Promise(function(res){
    T.end=function(e){if(e.target===T.c&&e.propertyName==='grid-template-rows')res()};
    T.c.addEventListener('transitionend',T.end);T.safety=setTimeout(res,RM?0:700)});
  Promise.all([tr].concat(T.anims.map(function(a){return a.finished.catch(function(){})}))).then(function(){
    if(T.tok!==tok)return;cancel(T);then()})}
function cascadeElements(T){return [T.sep,T.rt,T.rf,T.cp].concat(T.topics.map(function(s){return s.el}))}
function open(T,on,cascade){
  var th=T.el;cancel(T);var tok=T.tok=(T.tok||0)+1;
  if(on){
    th.classList.add('exp','op');T.ci.style.visibility='visible';T.ci.style.overflow='hidden';
    var els=cascadeElements(T),
        ds=delays(series(els.length,80,40),600,12);
    T.anims=RM?[]:els.map(function(e,i){return e.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],
      {duration:450,delay:ds[i],easing:E_IN,fill:'both'})});
    endOfMotion(T,tok,function(){T.ci.style.overflow='visible';rail(T)});
  }else{
    /* the header is pinned at the top: the page first settles on the top of the theme */
    var r=th.getBoundingClientRect();
    if(th.classList.contains('op')&&r.top<0)window.scrollTo({top:Math.round(r.top+(window.pageYOffset||0)),behavior:'instant'});
    th.classList.remove('exp');T.ci.style.visibility='visible';T.ci.style.overflow='hidden';
    var el2=cascadeElements(T).reverse(),dr=delays(series(el2.length,15,15),150,0);
    T.anims=RM?[]:el2.map(function(e,i){return e.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-6px)'}],
      {duration:250,delay:dr[i],easing:E_OUT,fill:'both'})});
    endOfMotion(T,tok,function(){th.classList.remove('op');T.ci.style.visibility='hidden';T.ci.style.overflow='hidden';rail(T)});
  }
  if(!cascade)arrow()}
function arrow(){GLB.classList.toggle('up',THEMES.some(function(T){return T.el.classList.contains('exp')}))}
function globalCascade(){
  PENDING.forEach(clearTimeout);PENDING=[];
  var opened=THEMES.filter(function(T){return T.el.classList.contains('exp')}),
      list=opened.length?opened.reverse():THEMES.slice(),on=!opened.length,
      d=on?delays(series(list.length,120,120),1000,0):delays(series(list.length,60,60),500,0);
  GLB.classList.toggle('up',on);
  list.forEach(function(T,i){function go(){open(T,on,true);send()}
    if(i===0||RM)go();else PENDING.push(setTimeout(go,d[i]))})}

/* ── progress rail of a theme ── */
function rail(T){
  var n=0;while(n<T.topics.length&&T.topics[n].state==='done')n++;
  var h=0,H=T.rail.offsetHeight-16-26;
  if(n===T.topics.length&&n)h=H;
  else if(n){var s=T.topics[n-1];h=s.el.offsetTop+s.pt.offsetTop+5.5-16}
  T.rf.style.height=Math.max(0,h)+'px'}
function rails(){THEMES.forEach(rail)}
function bars(){THEMES.forEach(function(T){
  var n=T.topics.length||1,f=0,m=0;
  T.topics.forEach(function(s){if(s.state==='done')f++;else if(s.state!=='to-do')m++});
  T.fill.style.width=(f/n*100)+'%';T.hatch.style.left=(f/n*100)+'%';T.hatch.style.width=(m/n*100)+'%'})}

/* ── state of a topic ── */
function setState(S,e){
  S.state=e;S.el.setAttribute('data-s',e);
  [].forEach.call(S.el.querySelectorAll('.sel button'),function(b){b.classList.toggle('on',b.getAttribute('data-s')===e)})}
function pulse(S){
  if(RM)return;var c=S.theme.color,r=rgb(c);
  S.pt.animate([{transform:'scale(1)'},{transform:'scale(1.45)',offset:.33},{transform:'scale(1)'}],{duration:650,easing:E_IN});
  var a=el('span','ring');S.el.appendChild(a);
  a.animate([{boxShadow:'0 0 0 4px rgb('+r+' / .7)'},{boxShadow:'0 0 0 16px rgb('+r+' / 0)'}],{duration:650,easing:E_IN}).onfinish=function(){a.remove()}}

/* ── text size ── */
var Z=Z0;
function setZ(z){Z=STEPS.indexOf(z)<0?Z0:z;R.style.setProperty('--z',Z);
  [].forEach.call(FOOT.querySelectorAll('.tz'),function(b){var d=b.getAttribute('data-tz');
    b.classList.toggle('end',(d==='-1'&&Z===STEPS[0])||(d==='1'&&Z===STEPS[STEPS.length-1]))})}

/* ── copying ── */
function copy(b){
  var t=typo(b._copy());
  function ok(){b._label=b._label||b.textContent;b.textContent='Copied';b.classList.add('ok');clearTimeout(b._t);
    b._t=setTimeout(function(){b.textContent=b._label;b.classList.remove('ok')},1600)}
  function fallback(){var a=el('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;left:0;opacity:0';
    D.body.appendChild(a);a.select();try{D.execCommand('copy')}catch(e){}a.remove();ok()}
  try{navigator.clipboard.writeText(t).then(ok,fallback)}catch(e){fallback()}}

/* ══ 3. PROGRESS ══ */
var BLOCK=D.getElementById('lv-progress');
function clean(p){var s={},src=p&&p.topics&&typeof p.topics==='object'?p.topics:{};
  Object.keys(src).forEach(function(k){if(/^[\w.-]{1,80}$/.test(k)&&STATES.indexOf(src[k])>0)s[k]=src[k]});
  return {updated:Math.max(0,+(p&&p.updated)||0),topics:s}}
var WRITTEN=(function(){try{return clean(JSON.parse(BLOCK.textContent))}catch(e){return {updated:0,topics:{}}}})();
var UPDATED=0;
function currentTopics(){var s={};Object.keys(TOPICS).forEach(function(k){if(TOPICS[k].state!=='to-do')s[k]=TOPICS[k].state});return s}
function state(){
  var d=[];Object.keys(UNFOLDS).forEach(function(k){if(UNFOLDS[k].classList.contains('xo'))d.push(k)});
  return {updated:UPDATED,topics:currentTopics(),opened:THEMES.filter(function(T){return T.el.classList.contains('exp')}).map(function(T){return T.key}),unfolded:d,z:Z}}
function send(){var e=state();
  try{localStorage.setItem(LOCAL_KEY,JSON.stringify(e))}catch(x){}
  if(FRAMED){try{parent.postMessage({lvState:e},'*')}catch(x){}}}
function sendProgress(){
  if(FRAMED){try{parent.postMessage({lvProgress:{updated:UPDATED,topics:currentTopics()}},'*')}catch(x){}}
  saveDot()}
function saveDot(){if(SAV)SAV.classList.toggle('dirty',UPDATED!==WRITTEN.updated)}
function same(a,b){var ka=Object.keys(a),kb=Object.keys(b);return ka.length===kb.length&&ka.every(function(k){return a[k]===b[k]})}

/* applies a whole state at once, without transitions */
function apply(e){
  e=e||{};R.classList.add('still');
  var p=clean(e);if(WRITTEN.updated>=p.updated)p=WRITTEN;
  UPDATED=p.updated;Object.keys(TOPICS).forEach(function(k){setState(TOPICS[k],p.topics[k]||'to-do')});
  var op=Array.isArray(e.opened)?e.opened:[];
  THEMES.forEach(function(T){cancel(T);T.tok=(T.tok||0)+1;var on=op.indexOf(T.key)>=0;
    T.el.classList.toggle('exp',on);T.el.classList.toggle('op',on);
    T.ci.style.visibility=on?'visible':'hidden';T.ci.style.overflow=on?'visible':'hidden'});
  var unf=Array.isArray(e.unfolded)?e.unfolded:[];
  Object.keys(UNFOLDS).forEach(function(k){unfold(UNFOLDS[k],unf.indexOf(k)>=0,true)});
  setZ(typeof e.z==='number'?e.z:Z0);bars();arrow();
  requestAnimationFrame(function(){requestAnimationFrame(function(){R.classList.remove('still');rails()})});
  if(UPDATED!==WRITTEN.updated||!same(p.topics,WRITTEN.topics)){if(!TOLD){TOLD=true;sendProgress()}}else saveDot()}
var TOLD=false;

/* resuming: the written block and local storage */
var LOCAL=null;try{LOCAL=JSON.parse(localStorage.getItem(LOCAL_KEY)||'null')}catch(x){}
apply(LOCAL);

/* ── saving the file ── */
function updatedFile(){
  var j=JSON.stringify({updated:UPDATED,topics:currentTopics()}).replace(/</g,'\\u003c');
  return SOURCE.replace(/(<script\b[^>]*\bid=["']lv-progress["'][^>]*>)[\s\S]*?(<\/script>)/i,function(m,a,b){return a+'\n'+j+'\n'+b})}
function fileName(){var n='';try{n=decodeURIComponent(location.pathname.split('/').pop()||'')}catch(e){}
  return /\.html$/i.test(n)?n:ID+'.html'}
var DB='study-path-'+ID;
function idb(mode,fn){return new Promise(function(res){try{var q=indexedDB.open(DB,1);
  q.onupgradeneeded=function(){q.result.createObjectStore('h')};
  q.onsuccess=function(){try{var tx=q.result.transaction('h',mode),r=fn(tx.objectStore('h'));
    tx.oncomplete=function(){res(r&&r.result)};tx.onerror=function(){res(null)}}catch(e){res(null)}};
  q.onerror=function(){res(null)}}catch(e){res(null)}})}
function readHandle(){return idb('readonly',function(s){return s.get('file')})}
function keepHandle(h){return idb('readwrite',function(s){s.put(h,'file')})}
function write(h,data){return h.createWritable().then(function(w){return w.write(data).then(function(){return w.close()})})}
function save(){
  var src=updatedFile(),blob=new Blob([src],{type:'text/html;charset=utf-8'});
  function done(){SOURCE=src;WRITTEN={updated:UPDATED,topics:currentTopics()};saveDot();
    SAV.classList.add('ok');var l=SAV.querySelector('.sav-l');l.textContent='Saved';clearTimeout(SAV._t);
    SAV._t=setTimeout(function(){SAV.classList.remove('ok');l.textContent='Save'},1600)}
  if(window.showSaveFilePicker){
    function choose(){return window.showSaveFilePicker({suggestedName:fileName(),
        types:[{description:'Study path HTML',accept:{'text/html':['.html']}}]})
      .then(function(h){return write(h,blob).then(function(){keepHandle(h);done()})},function(){})}
    readHandle().then(function(h){
      if(!h)return choose();
      return Promise.resolve(h.queryPermission({mode:'readwrite'})).then(function(p){
        return p==='granted'?p:h.requestPermission({mode:'readwrite'})})
      .then(function(p){if(p!=='granted')throw 0;return write(h,blob).then(done)})
      .catch(function(){return choose()})});
  }else{
    var u=URL.createObjectURL(blob),a=el('a');a.href=u;a.download=fileName();a.style.display='none';
    D.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1000);done()}}

/* ── gestures ── */
var GESTURE=false;
D.addEventListener('pointerdown',function(){GESTURE=true},true);
D.addEventListener('keydown',function(){GESTURE=true},true);
W.addEventListener('click',function(ev){
  var t=ev.target;if(t&&t.nodeType!==1)t=t.parentElement;if(!t)return;
  var b;
  if((b=t.closest('.cp'))){copy(b);return}
  if(t.closest('.sav')){save();return}
  if((b=t.closest('.tz'))){var d=+b.getAttribute('data-tz'),i=STEPS.indexOf(Z);
    setZ(d===0?Z0:STEPS[Math.max(0,Math.min(STEPS.length-1,i+d))]);requestAnimationFrame(rails);send();return}
  if((b=t.closest('.sel button'))){var cw=b.closest('.cw'),S=cw._S,e=b.getAttribute('data-s');if(e===S.state)return;
    setState(S,e);UPDATED=Date.now();if(e==='done')pulse(S);bars();rail(S.theme);sendProgress();send();return}
  if(t.closest('.xw'))return;          // unfolded content keeps its clicks
  if(t===GLB){globalCascade();return}
  if(t.closest('.th-p')){var th=t.closest('.th');unfold(th,!th.classList.contains('xo'));send();return}
  if((b=t.closest('.th-h'))){var T=b.parentNode._T;open(T,!T.el.classList.contains('exp'));send();return}
  if((b=t.closest('.ct'))){var c=b.closest('.cw');unfold(c,!c.classList.contains('xo'));send();return}
  if((b=t.closest('.bh.mul'))||(b=t.closest('.bnr'))){unfold(b,!b.classList.contains('xo'));send();return}
});
W.addEventListener('keydown',function(e){
  if((e.key==='Enter'||e.key===' ')&&e.target.getAttribute&&e.target.getAttribute('role')==='button'){e.preventDefault();e.target.click()}});
D.addEventListener('touchstart',function(){},{passive:true});
D.addEventListener('visibilitychange',function(){if(D.visibilityState==='hidden')send()});
addEventListener('pagehide',send);
/* a word of the title wider than the banner: the title tightens until it fits */
function fitTitle(){var t=BNR.querySelector('.bnr-t'),r=D.createRange();t.style.fontSize='';
  var cs=getComputedStyle(t),fs=parseFloat(cs.fontSize),room=t.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
  function widest(){r.selectNodeContents(t);return Math.max.apply(null,[0].concat([].map.call(r.getClientRects(),function(c){return c.width})))}
  while(widest()>room+1&&fs>14){fs-=1;t.style.fontSize=fs+'px'}}
fitTitle();
addEventListener('resize',function(){requestAnimationFrame(function(){fitTitle();rails()})});
if(window.ResizeObserver){var ro=new ResizeObserver(function(){rails()});THEMES.forEach(function(T){ro.observe(T.rail)})}

/* ── host page: the state kept by the page ── */
addEventListener('message',function(ev){
  if(ev.source!==parent)return;var d=ev.data;
  if(d&&typeof d==='object'&&d.lvState&&!GESTURE)apply(d.lvState)});
if(FRAMED){try{parent.postMessage({lvStateWanted:1},'*')}catch(x){}}
})();

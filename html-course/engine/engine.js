/* ══════════════════════════════════════════════════════════════════════
   COURSE ENGINE: SCRIPT
   0. Copy of the source, before any action (for the Save button).
   1. Construction: reads the content (the "content" template) and builds
      the pages of each course, the top bar and the contents panel.
   2. Behavior: pages, fold-outs, keywords, self-assessment, progress,
      text size, remembered state (key 'html-course:' + subject), messages
      to the host page, saving the up-to-date file.
   ══════════════════════════════════════════════════════════════════════ */
(function(){
'use strict';
var D=document,R=D.documentElement,W=D.getElementById('w');

/* ══ 0. THE SOURCE AS IT WAS DELIVERED ══ */
var SOURCE='<!DOCTYPE html>\n'+R.outerHTML;

var FRAMED=(function(){try{return window.parent!==window}catch(e){return true}})();
var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
var E_IN='cubic-bezier(.2,.7,.3,1)',E_OUT='cubic-bezier(.4,0,1,1)';
var TZ=[.85,.925,1,1.08,1.16,1.25],TZ0=5;
var LANG=R.lang||'en';
/* lesson colors, from cool to warm */
var PAL=['#7a5cff','#4d7dff','#3da8ff','#1fd0ea','#22e0b0','#3ee87a','#b4e83a','#ffd23a','#ffaa22','#ff7a2f','#ff4d4d','#ff3b6e'];
if(FRAMED)R.classList.add('framed');

/* ── helpers ── */
function el(tag,cls,html){var e=D.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
function kids(n,name){return [].filter.call(n.children,function(c){return !name||c.localName===name})}
function one(n,name){return kids(n,name)[0]||null}
function at(n,a){return n&&n.getAttribute(a)||''}
function txt(h){var t=el('div',null,h||'');return t.textContent.replace(/\s+/g,' ').trim()}
function rgb(h){h=(h||'').trim().replace('#','');if(h.length===3)h=h.replace(/(.)/g,'$1$1');
  var n=parseInt(h,16);if(isNaN(n)||h.length!==6)return '255 255 255';return [(n>>16)&255,(n>>8)&255,n&255].join(' ')}
function tint(e,hex){e.style.setProperty('--a',hex);e.style.setProperty('--r',rgb(hex))}
function two(n){return (n<10?'0':'')+n}
function roman(n){var v=[[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']],s='';v.forEach(function(p){while(n>=p[0]){s+=p[1];n-=p[0]}});return s}
function slug(s){return (s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60)}
var UNITS=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
var TENS={2:'twenty',3:'thirty',4:'forty',5:'fifty',6:'sixty'};
function words(n){if(n<20)return UNITS[n];var d=Math.floor(n/10),u=n%10;
  if(d<7&&TENS[d])return TENS[d]+(u?'-'+UNITS[u]:'');return String(n)}
function lessonCount(n){return words(n)+(n===1?' lesson':' lessons')}
function anim(e,k,o){if(!e||!e.animate)return null;o=o||{};if(RM){o.duration=.01;o.delay=0}
  var a=e.animate(k,o);a.onfinish=function(){a.cancel()};return a}
function colors(n){var r=[],i;for(i=0;i<n;i++)r.push(n>PAL.length?PAL[i%PAL.length]:PAL[n<2?0:Math.round(i*(PAL.length-1)/(n-1))]);return r}
var CHECK='<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4.2 9.4l3.1 3.1 6.5-7"/></svg>';

/* ══ 1. CONSTRUCTION ══ */
var T=D.getElementById('content').content;
var F=T.querySelector('file');
var SRC=[].slice.call(T.querySelectorAll('course'));
var SUBJECT=at(F,'subject')||at(SRC[0],'title')||'Course';
var KEY='html-course:'+(slug(at(SRC[0],'title'))||'course');
var COURSES=[],PAGES=[];

/* a text block: paragraphs stay, bare text becomes a paragraph */
function block(n,dst){
  var hasBlock=[].some.call(n.childNodes,function(c){return c.nodeType===1&&/^(p|ul|ol|table|h4|div|blockquote)$/.test(c.localName)});
  if(hasBlock){while(n.firstChild)dst.appendChild(n.firstChild)}
  else{var p=el('p');while(n.firstChild)p.appendChild(n.firstChild);if(p.textContent.trim()||p.children.length)dst.appendChild(p)}
  return dst}
function label(name,g){var l=el('div','lab cc',name);l.setAttribute('data-g',g);return l}
function fold(cont,lab,lab2,cls){
  var b=el('button','reveal cc',lab),fd=el('div','fold'+(cls?' '+cls:'')),r=el('div'),i=el('div','fold-i ans');
  b.type='button';b.setAttribute('aria-expanded','false');
  if(cont)block(cont,i);r.appendChild(i);fd.appendChild(r);
  b._fd=fd;b._lab=[lab,lab2];return {b:b,fd:fd}}
function table(t){
  var tb=el('table','tb'),w=el('div','tbw'),names=[];
  var rows=[].slice.call(t.querySelectorAll('tr'));
  if(!rows.length)return w;
  var h=rows[0];if([].every.call(h.children,function(c){return c.localName==='th'})){
    names=[].map.call(h.children,function(c){return c.textContent.trim()});
    var th=el('thead');th.appendChild(h);tb.appendChild(th);rows.shift()}
  var bd=el('tbody');rows.forEach(function(r){[].forEach.call(r.children,function(c,i){c.setAttribute('data-l',names[i]||'')});bd.appendChild(r)});
  tb.appendChild(bd);w.appendChild(tb);return w}

/* the body of a part: free text and boxes */
function body(n,dst,C){
  [].slice.call(n.childNodes).forEach(function(c){
    if(c.nodeType!==1){if(c.nodeType===3&&c.textContent.trim()){var p=el('p');p.appendChild(c);dst.appendChild(p)}else if(c.nodeType===3)dst.appendChild(c);return}
    var k=c.localName,b;
    if(k==='definition'){b=el('div','bx def');b.appendChild(label('Definition','■'));
      var tm=at(c,'term');block(c,b);
      if(tm){var p0=b.querySelector('p')||b.appendChild(el('p'));var s=el('b','term',tm);p0.insertBefore(D.createTextNode(': '),p0.firstChild);p0.insertBefore(s,p0.firstChild)}
      dst.appendChild(b)}
    else if(k==='example'){b=el('div','bx ex');b.appendChild(label('Example','◆'));dst.appendChild(block(c,b))}
    else if(k==='caution'){b=el('div','bx cau');b.appendChild(label('Caution','▲'));dst.appendChild(block(c,b))}
    else if(k==='remember'){b=el('div','bx rem');b.appendChild(label('Remember','●'));dst.appendChild(block(c,b))}
    else if(k==='landmarks'){var ls=kids(c,'landmark');b=el('div','bx lmk');b.appendChild(label(ls.length>1?'Landmarks':'Landmark','◇'));
      var f=el('div','tline');ls.forEach(function(r){var it=el('div','lm');it.appendChild(el('span','lm-t',at(r,'title')));
        var x=el('div','lm-x');while(r.firstChild)x.appendChild(r.firstChild);it.appendChild(x);f.appendChild(it)});
      b.appendChild(f);dst.appendChild(b)}
    else if(k==='check'){b=el('div','bx chk');b.appendChild(label('Check','○'));
      var ans=one(c,'answer');if(ans)ans.remove();var q=el('div','qst');block(c,q);b.appendChild(q);
      var d=fold(ans,'Show the answer','Hide the answer');b.appendChild(d.b);b.appendChild(d.fd);dst.appendChild(b)}
    else if(k==='cards'){var g=el('div','grid g250 cards'),i=0;
      kids(c,'card').forEach(function(k2){i++;var cl=el('div','crd');cl.appendChild(el('span','tag',at(k2,'tag')||two(i)));
        cl.appendChild(el('div','crd-t',at(k2,'title')));var ds=el('div','crd-d');while(k2.firstChild)ds.appendChild(k2.firstChild);
        if(ds.textContent.trim())cl.appendChild(ds);g.appendChild(cl)});dst.appendChild(g)}
    else if(k==='table'){dst.appendChild(table(c))}
    else if(k==='free'){b=el('div','free');while(c.firstChild)b.appendChild(c.firstChild);dst.appendChild(b)}
    else dst.appendChild(c)})
  return dst}

function subheading(name,id){var t=el('div','sub',name);if(id)t.id=id;return t}
function note(t){return el('div','sub-n',t)}
function exercise(x,id,num,col,C){
  var e=el('div','exr');e.id=id;var h=el('div','exr-h');
  h.appendChild(el('span','exr-n','Exercise '+num));
  var lv=+at(x,'level')||1,li=el('span','lvl');li.setAttribute('aria-label','Difficulty '+lv+' of 3');
  for(var i=1;i<=3;i++)li.appendChild(el('i',i<=lv?'on':''));h.appendChild(li);
  if(at(x,'name'))h.appendChild(el('span','exr-name',at(x,'name')));e.appendChild(h);
  if(C&&at(x,'lessons')){var tg=el('div','exr-tags');at(x,'lessons').split(/[\s,;]+/).forEach(function(s){var L=C.lessons[(+s)-1];if(!L)return;
      var a=el('a','',' Lesson '+two(L.n));a.href='#'+L.id;a.style.setProperty('--c',L.col);tg.appendChild(a)});e.appendChild(tg)}
  var sol=one(x,'solution');if(sol)sol.remove();var q=el('div','qst');block(x,q);e.appendChild(q);
  var d=fold(sol,'Show the solution','Hide the solution');e.appendChild(d.b);e.appendChild(d.fd);return e}

function page(C,type,id,col){var s=el('section','pg '+type);s.id=id;s.setAttribute('data-course',C.L);tint(s,col);
  s.style.setProperty('--arc',C.arc);s.style.setProperty('--arcx',C.arcx);W.appendChild(s);return s}
function header(p,lab,tag,title,arc){var h=el('header','ph'),l=el('div','ph-l');
  if(arc)l.appendChild(el('span','square'));l.appendChild(el('span',null,lab));if(tag)l.appendChild(el('span','tag',tag));h.appendChild(l);
  h.appendChild(el('h2','ph-t',title));h.appendChild(el('div','sep'+(arc?' arc':'')));p.appendChild(h)}
function controls(){var r=el('div','ctl'),z=el('div','tz');
  [['-1','A−','Smaller text'],['0','A','Default size'],['1','A+','Larger text']].forEach(function(b){var x=el('button','cc',b[1]);x.type='button';x.setAttribute('data-tz',b[0]);x.setAttribute('aria-label',b[2]);z.appendChild(x)});
  r.appendChild(z);var s=el('button','sv cc','<span class="dot"></span><span class="sv-l">Save</span>');s.type='button';r.appendChild(s);return r}

/* ── each course ── */
SRC.forEach(function(S,ci){
  var C={i:ci,L:at(S,'letter')||'l',title:at(S,'title'),sub:at(S,'subtitle'),src:S,lessons:[],gl:{},pages:[]};
  var LS=kids(S,'lesson'),cols=colors(LS.length);
  C.arc='linear-gradient(90deg,'+(cols.length>1?cols.join(','):cols[0]+','+cols[0])+')';
  C.arcx='linear-gradient(90deg,transparent,'+cols.join(',')+',transparent)';
  LS.forEach(function(Ls,li){C.lessons.push({n:li+1,id:C.L+(li+1),title:at(Ls,'title'),desc:at(Ls,'desc'),col:at(Ls,'color')||cols[li],src:Ls,ic:[],parts:[],ess:[],kws:[]})});
  /* the course glossary: each word keeps the definition of the lesson that explains it */
  C.lessons.forEach(function(L){var kw=one(L.src,'keywords');if(!kw)return;
    kids(kw,'keyword').forEach(function(m){var t=at(m,'term')||m.textContent.trim(),k=t.toLowerCase();
      if(m.innerHTML.trim()&&!C.gl[k])C.gl[k]={term:t,def:m.innerHTML.trim(),L:L};L.kws.push(k)})});
  COURSES.push(C)});
var NC=COURSES.length;
/* a word with no definition in its course takes it from an earlier course in the file */
function wordDef(C,k){if(C.gl[k])return C.gl[k];for(var i=0;i<NC;i++)if(COURSES[i].gl[k])return COURSES[i].gl[k];return null}

COURSES.forEach(function(C){
  var S=C.src,n=C.lessons.length;
  /* ── opening page ── */
  var P=page(C,'opening','opening-'+C.L,'#ffffff');
  var bn=el('header','bnr');['tl','tr','bl','br'].forEach(function(k){bn.appendChild(el('span','bcn '+k))});
  bn.appendChild(el('div','bnr-kicker',(NC>1?'Course '+(C.i+1)+' of '+NC:'Introductory course')+' · '+lessonCount(n)));
  bn.appendChild(el('h1','bnr-title',C.title));if(C.sub)bn.appendChild(el('div','bnr-sub',C.sub));
  bn.appendChild(el('div','bnr-rule'));bn.appendChild(controls());
  bn.appendChild(el('div','bnr-note','Your progress is kept automatically in this browser, and in the file itself with the Save button.'));
  P.appendChild(bn);
  var intro=one(S,'introduction');if(intro){var iw=el('div','intro col');body(intro,iw,C);P.appendChild(iw)}
  P.appendChild(subheading('Course outline','outline-'+C.L));
  var pg=el('div','allp'),pb=el('div','allp-b');C.allp=pb;pg.appendChild(pb);C.cntG=el('span','cnt');pg.appendChild(C.cntG);P.appendChild(pg);
  var gr=el('div','grid');C.lessons.forEach(function(L){
    var a=el('a','oc');a.href='#'+L.id;tint(a,L.col);a.appendChild(el('span','tag',two(L.n)));
    a.appendChild(el('div','oc-t',L.title));if(L.desc)a.appendChild(el('div','oc-d',L.desc));
    var pp=el('div','oc-p'),sg=el('div','segs');pp.appendChild(sg);var cc=el('span','oc-c');pp.appendChild(cc);pp.appendChild(el('span','mst','✓ Mastered'));
    a.appendChild(pp);L.card=a;L.segO=sg;L.cntO=cc;gr.appendChild(a)});
  var end=el('div','oc full oc-end');
  end.innerHTML='<a href="#capstone-'+C.L+'"><span class="oc-l"><span class="square"></span>To finish</span><span class="oc-t">Capstone</span></a>'
    +'<a href="#review-'+C.L+'"><span class="oc-l">To review</span><span class="oc-t">Sheets and glossary</span></a>';
  gr.appendChild(end);
  COURSES.forEach(function(O){if(O===C)return;var a=el('a','oc full oc-other');a.href='#opening-'+O.L;
    var d=el('div');d.appendChild(el('span','oc-l','Course '+(O.i+1)+' · another course'));d.appendChild(el('span','oc-t',O.title));
    if(O.sub)d.appendChild(el('span','oc-d',O.sub));a.appendChild(d);a.appendChild(el('span','arr','→'));gr.appendChild(a)});
  P.appendChild(gr);
  if(C.i===0)boxLegend(P,C);
  C.pages.push({el:P,type:'opening',lab:'Opening',title:'Opening',col:'#ffffff'});

  /* ── lessons ── */
  C.lessons.forEach(function(L){
    var Q=page(C,'lesson',L.id,L.col),s=L.src;L.page=Q;
    header(Q,'Lesson',two(L.n),L.title);
    var o=el('div','lopen'),ob=one(s,'objectives'),pr=one(s,'prerequisites');
    function list(n2,cls,lab){var d=el('div',cls);d.appendChild(el('div','lopen-l',lab));var u=el('ul');
      if(n2)[].slice.call(n2.children).forEach(function(li){var x=el('li');while(li.firstChild)x.appendChild(li.firstChild);u.appendChild(x)});
      d.appendChild(u);return d}
    o.appendChild(list(ob,'obj','Objectives'));o.appendChild(list(pr,'pre','Prerequisites'));Q.appendChild(o);
    var st=one(s,'start');if(st){var b=el('div','start');b.appendChild(label('To begin','→'));
      if(at(st,'question'))b.appendChild(el('div','start-q',at(st,'question')));block(st,b);Q.appendChild(b)}
    kids(s,'part').forEach(function(pt,k){var id=L.id+'-'+(k+1),h=el('div','part-h'),r=el('div','part-r');h.id=id;
      r.appendChild(el('span','tag',roman(k+1)));r.appendChild(el('h3','part-t',at(pt,'title')));h.appendChild(r);Q.appendChild(h);
      Q.appendChild(body(pt,el('div','col'),C));L.parts.push({id:id,title:at(pt,'title'),n:k+1})});
    /* closing */
    var es=one(s,'essentials');if(es){Q.appendChild(subheading('Essentials'));var e=el('div','ess col'),u=el('ul');
      kids(es).forEach(function(x){var li=el('li');while(x.firstChild)li.appendChild(x.firstChild);u.appendChild(li);L.ess.push(li.innerHTML)});
      e.appendChild(u);Q.appendChild(e)}
    if(L.kws.length){Q.appendChild(subheading('Keywords'));var m=el('div','kws col');
      L.kws.forEach(function(k){var g=wordDef(C,k);var bt=el('button','kw cc',g?g.term:k);bt.type='button';bt._k=k;bt._C=C;m.appendChild(bt)});
      var w2=el('div','col');w2.appendChild(m);var fd=el('div','fold kwdef'),r2=el('div'),i2=el('div','fold-i');r2.appendChild(i2);fd.appendChild(r2);w2.appendChild(fd);m._fd=fd;Q.appendChild(w2)}
    var ex=one(s,'exercises');if(ex){Q.appendChild(subheading('Exercises'));var xw=el('div','col');
      kids(ex,'exercise').forEach(function(x,k){xw.appendChild(exercise(x,L.id+'-ex'+(k+1),k+1,L.col))});Q.appendChild(xw)}
    var sa=one(s,'self-assessment');if(sa){Q.appendChild(subheading('Self-assessment'));
      Q.appendChild(note(at(sa,'note')||'Check a statement once you have succeeded at the exercises it names: the check then stands for tested knowledge.'));
      var aw=el('div','col'),hd=el('div','sa-h'),sg=el('div','segs');hd.appendChild(sg);L.cntA=el('span','cnt');hd.appendChild(L.cntA);aw.appendChild(hd);L.segA=sg;
      kids(sa,'i-can').forEach(function(j){var key=at(j,'key'),x=el('div','ican');x.setAttribute('role','checkbox');x.setAttribute('aria-checked','false');x.tabIndex=0;x._key=key;x._L=L;
        var cw=el('div','cbw'),cb=el('span','cb',CHECK);cw.appendChild(cb);cw.appendChild(el('span','cbr'));x.appendChild(cw);
        var t=el('div');var tx=el('div','ican-t');while(j.firstChild)tx.appendChild(j.firstChild);t.appendChild(tx);
        var nums=at(j,'exercises').split(/[\s,;]+/).filter(Boolean);
        if(nums.length){var xl=el('span','exl');nums.forEach(function(nm,ii){if(ii)xl.appendChild(D.createTextNode(' · '));var a=el('a',null,'Exercise '+nm);a.href='#'+L.id+'-ex'+nm;xl.appendChild(a)});t.appendChild(xl)}
        x.appendChild(t);aw.appendChild(x);L.ic.push(x)});
      Q.appendChild(aw)}
    C.pages.push({el:Q,type:'lesson',lab:'Lesson '+two(L.n)+' · '+txt(L.title),title:txt(L.title),col:L.col,L:L})});
  C.lessons.forEach(function(L){[L.segO,L.segA].forEach(function(sg){if(!sg)return;sg.innerHTML='';L.ic.forEach(function(){sg.appendChild(el('span'))})});
    if(L.ic.length){var t=el('span');t.style.flexGrow=L.ic.length;tint(t,L.col);t.appendChild(el('i'));C.allp.appendChild(t);L.slice=t}});

  /* ── capstone ── */
  var cs=one(S,'capstone'),B=page(C,'capstone','capstone-'+C.L,'#ffffff');
  header(B,'Capstone','',at(cs,'title')||'Course capstone',true);
  var bw=el('div','col');
  var cn=cs?kids(cs,'p'):[];if(cn.length){var nb=el('div','sub-n');cn.forEach(function(p){nb.appendChild(p)});B.appendChild(nb)}
  else B.appendChild(note('Each exercise draws on several lessons. Try it before opening its solution: the effort of searching does most of the work.'));
  if(cs)kids(cs,'exercise').forEach(function(x,k){bw.appendChild(exercise(x,'capstone-'+C.L+'-ex'+(k+1),k+1,'#ffffff',C))});
  B.appendChild(bw);
  C.pages.push({el:B,type:'capstone',lab:'Capstone',title:at(cs,'title')?txt(at(cs,'title')):'Capstone',col:'#ffffff',arc:1});

  /* ── review: sheets and glossary ── */
  var V=page(C,'review','review-'+C.L,'#ffffff');
  header(V,'Review','','Sheets and glossary');
  V.appendChild(subheading('Review sheets','sheets-'+C.L));
  V.appendChild(note('Each sheet gathers the essentials of its lesson.'));
  var fg=el('div','grid g280');C.lessons.forEach(function(L){var f=el('div','sheet');tint(f,L.col);
    var h=el('a','sheet-h');h.href='#'+L.id;h.appendChild(el('span','tag',two(L.n)));h.appendChild(el('span','sheet-t',L.title));f.appendChild(h);
    var u=el('ul');L.ess.forEach(function(x){u.appendChild(el('li',null,x))});f.appendChild(u);fg.appendChild(f)});
  V.appendChild(fg);
  V.appendChild(subheading('Glossary','glossary-'+C.L));
  var go=el('div','glo col');Object.keys(C.gl).map(function(k){return C.gl[k]}).sort(function(a,b){return a.term.localeCompare(b.term,LANG,{sensitivity:'base'})})
    .forEach(function(g){var e=el('div','gl');e.id='gl-'+C.L+'-'+slug(g.term);tint(e,g.L.col);var h=el('div','gl-h');h.appendChild(el('span','gl-term',g.term));
      var a=el('a','cc','Lesson '+two(g.L.n));a.href='#'+g.L.id;h.appendChild(a);e.appendChild(h);e.appendChild(el('div','gl-d',g.def));go.appendChild(e)});
  V.appendChild(go);
  V.appendChild(el('div','foot',txt(C.title)+' · '+(NC>1?'end of course '+(C.i+1)+' of '+NC:'end of the course')));
  C.pages.push({el:V,type:'review',lab:'Review',title:'Sheets and glossary',col:'#ffffff'});
  C.pages.forEach(function(p,k){p.C=C;p.k=k;p.id=p.el.id;p.i=PAGES.length;PAGES.push(p)})});

/* ── the box legend, presented in the opening of the first course ── */
function boxLegend(P,C){
  P.appendChild(subheading('Box legend','legend-'+C.L));
  P.appendChild(note('Each type of content keeps the same form from one end of the course to the other, in the color of its lesson. A frame marks a place where you act.'));
  var cols=C.lessons.map(function(L){return L.col});if(!cols.length)cols=['#ffffff'];
  var g=el('div','grid g250 legend');
  var M=[
    ['definition','<definition term="Term">the exact meaning of a word, given where it first appears.</definition>','Sets the meaning of a new word.'],
    ['example','<example>A concrete case that shows the notion at work.</example>','Shows the notion in a case.'],
    ['caution','<caution>A common confusion, and the right distinction that clears it up.</caution>','Heads off a common mistake.'],
    ['remember','<remember>The idea to keep, said in one sentence.</remember>','Fixes what matters most.'],
    ['landmarks','<landmarks><landmark title="Landmark">A fixed point that situates the notion.</landmark></landmarks>','Situates the notion.'],
    ['check','<check>A question, to make sure you have understood.<answer>The answer unfolds here.</answer></check>','Has you check on the spot.']];
  M.forEach(function(m,k){var d=el('div','legend-c');tint(d,cols[k%cols.length]);var t=el('div',null,m[1]);body(t,d,C);
    var u=el('div','sub-n',m[2]);u.style.marginTop='-14px';d.appendChild(u);g.appendChild(d)});
  P.appendChild(g)}

/* ── page navigation ── */
PAGES.forEach(function(p,i){
  var nv=el('nav','nv');
  function link(q,cls,lab){var a=el('a',cls);if(!q){a.classList.add('ghost');a.innerHTML='<span class="nv-l">'+lab+'</span><span class="nv-t">·</span>';a.setAttribute('aria-hidden','true');a.tabIndex=-1;return a}
    a.href='#'+q.id;a.style.setProperty('--c',q.col);if(q.arc)a.style.setProperty('--arc',q.C.arc);
    a.innerHTML='<span class="nv-l">'+lab+'</span>';
    var t=el('span','nv-t');if(q.arc){var c=el('span','square');c.style.marginRight='8px';c.style.verticalAlign='1px';t.appendChild(c)}
    t.appendChild(D.createTextNode((q.C!==p.C?txt(q.C.title)+' · ':'')+q.title));a.appendChild(t);return a}
  nv.appendChild(link(PAGES[i-1],'prev','← Previous page'));
  nv.appendChild(el('span','nv-n',two(p.k+1)+' / '+two(p.C.pages.length)));
  nv.appendChild(link(PAGES[i+1],'next','Next page →'));
  p.el.appendChild(nv)});

/* ── top bar ── */
var BAR=el('header');BAR.id='topbar';
BAR.innerHTML='<div class="hd"><span class="hd-course"></span><span class="hd-page"></span><button type="button" class="hd-toc" aria-label="Open the contents">Contents<span class="dot"></span></button></div><div class="hd-prog"><i></i></div>';
W.parentNode.insertBefore(BAR,W);
var HDC=BAR.querySelector('.hd-course'),HDP=BAR.querySelector('.hd-page'),HDI=BAR.querySelector('.hd-prog i');

/* ── contents panel ── */
var SCRIM=el('div');SCRIM.id='scrim';var TOC=el('aside');TOC.id='toc';TOC.setAttribute('aria-label','Contents');
var th=el('div','toc-h','<span>Contents</span>');var tx=el('button','toc-x','×');tx.type='button';tx.setAttribute('aria-label','Close the contents');th.appendChild(tx);TOC.appendChild(th);
TOC.appendChild(controls());
var TC=el('div','toc-c','<span>Progress</span>');var TCT=el('span','cnt');TC.appendChild(TCT);TOC.appendChild(TC);
var TABS=null;
if(NC>1){TABS=el('div','tabs');COURSES.forEach(function(C){var o=el('button','tab cc');o.type='button';o._C=C;
  o.innerHTML='<span class="tab-l">Course '+(C.i+1)+'</span><span class="tab-t">'+C.title+'</span>';C.cntT=el('span','tab-c');o.appendChild(C.cntT);C.tab=o;TABS.appendChild(o)});TOC.appendChild(TABS)}
COURSES.forEach(function(C){var l=el('nav','tocl');C.tl=l;l.hidden=true;
  function e(href,cls,html,pi){var a=el('a','te'+(cls?' '+cls:''),html);a.href='#'+href;if(pi!=null)a._pi=pi;l.appendChild(a);return a}
  e('opening-'+C.L,'tx','<span class="te-t">Opening</span>',C.pages[0].el.id);
  C.lessons.forEach(function(L){var a=e(L.id,'','',L.id);tint(a,L.col);a.appendChild(el('span','tag',two(L.n)));a.appendChild(el('span','te-t',L.title));
    L.cntT=el('span','te-c');a.appendChild(L.cntT);L.te=a;
    L.parts.forEach(function(p){var s=e(p.id,'tp','<span class="rn">'+roman(p.n)+'</span><span class="te-t">'+p.title+'</span>');tint(s,L.col)})});
  var b=e('capstone-'+C.L,'tx','',('capstone-'+C.L));b.style.setProperty('--arc',C.arc);b.innerHTML='<span class="square"></span><span class="te-t">Capstone</span>';
  e('sheets-'+C.L,'tx','<span class="te-t">Review sheets</span>','review-'+C.L);
  e('glossary-'+C.L,'tx','<span class="te-t">Glossary</span>');
  TOC.appendChild(l)});
W.parentNode.appendChild(SCRIM);W.parentNode.appendChild(TOC);

/* ══ 2. BEHAVIOR ══ */
var MST={},UPD=0,CUR=-1,ACTED=false,ZI=TZ0,VIEW=0,TOC_COURSE=null,ANIMS=[],FRESH={};
var STORED=(function(){try{var p=JSON.parse(D.getElementById('lv-progress').textContent||'{}');
  return {updated:+p.updated||0,mastered:clean(p.mastered)}}catch(e){return {updated:0,mastered:{}}}})();
var WRITTEN={updated:STORED.updated,mastered:copy(STORED.mastered)};
function clean(a){var r={};if(a&&typeof a==='object')Object.keys(a).forEach(function(k){if(a[k]===true&&/^[\w.-]{1,80}$/.test(k))r[k]=true});return r}
function copy(a){var r={};Object.keys(a).forEach(function(k){r[k]=true});return r}
function same(a,b){var x=Object.keys(a).sort().join('|'),y=Object.keys(b).sort().join('|');return x===y}

/* ── counters and bars ── */
function count(e,t){if(!e||e._t===t)return;var before=e._t;e._t=t;
  if(before==null||R.classList.contains('instant')||RM){e.innerHTML=t;return}
  var a=anim(e,[{opacity:1},{opacity:0}],{duration:120,easing:E_OUT,fill:'forwards'});
  setTimeout(function(){e.innerHTML=t;if(a)a.cancel();anim(e,[{opacity:0},{opacity:1}],{duration:180,easing:E_IN})},RM?0:120)}
function segs(sg,n){if(!sg)return;var k=0;[].forEach.call(sg.children,function(s,i){var on=i<n;if(s.classList.contains('on')!==on){s.style.setProperty('--d',(k++*30)+'ms');s.classList.toggle('on',on)}})}
function refresh(){
  var tot=0,ok=0;
  COURSES.forEach(function(C){var ct=0,co=0;
    C.lessons.forEach(function(L){var n=L.ic.length,o=0;L.ic.forEach(function(j){var on=!!MST[j._key];if(on)o++;
        if(j.classList.contains('on')!==on){j.classList.toggle('on',on);j.setAttribute('aria-checked',on?'true':'false')}});
      L.o=o;segs(L.segO,o);segs(L.segA,o);count(L.cntO,o+' / '+n+' mastered');count(L.cntA,o+' / '+n);
      var complete=n>0&&o===n;if(L.card)L.card.classList.toggle('complete',complete);
      if(L.cntT){var t=complete?'✓':(n?o+'/'+n:'');if(L.cntT._t!==t){L.cntT._t=t;L.cntT.textContent=t;L.cntT.classList.toggle('ok',complete)}}
      if(L.slice)L.slice.firstChild.style.width=(n?o/n*100:0)+'%';ct+=n;co+=o});
    count(C.cntG,co+' / '+ct+' mastered');if(C.cntT)count(C.cntT,co+' / '+ct);tot+=ct;ok+=co});
  count(TCT,ok+' / '+tot+' mastered');
  R.classList.toggle('unsaved',!FRAMED&&!same(MST,WRITTEN.mastered))}

/* ── text size ── */
function size(i,keep){i=Math.max(0,Math.min(TZ.length-1,i));var p=keep?readingPos():null;ZI=i;R.style.setProperty('--z',TZ[i]);
  [].forEach.call(D.querySelectorAll('.tz button'),function(b){var v=b.getAttribute('data-tz');b.classList.toggle('limit',(v==='-1'&&i===0)||(v==='1'&&i===TZ.length-1))});
  if(p!=null&&!FRAMED)setReadingPos(p)}

/* ── scrolling: opened on its own, the window scrolls; placed in a frame, the host page does ── */
function free(){return !FRAMED||R.scrollHeight>innerHeight+1}
function barHeight(){return BAR.offsetHeight||52}
function topOf(e){return e.getBoundingClientRect().top+(window.pageYOffset||0)}
function scrollToY(y){y=Math.max(0,Math.round(y));
  if(free())window.scrollTo(0,y);else{try{parent.postMessage({lvAnchor:y},'*')}catch(e){}}}
function scrollY(){return free()?(window.pageYOffset||0):VIEW}
function readingPos(){var p=PAGES[CUR];if(!p)return 0;var t=topOf(p.el)-barHeight(),h=p.el.offsetHeight||1;return Math.max(0,Math.min(1,(scrollY()-t)/h))}
function setReadingPos(f){var p=PAGES[CUR];if(!p)return;if(f<=0){window.scrollTo(0,0);return}window.scrollTo(0,topOf(p.el)-barHeight()+f*p.el.offsetHeight)}
function progressBar(){var p=PAGES[CUR];if(!p)return;var t=topOf(p.el)-barHeight(),h=p.el.offsetHeight,vh=free()?innerHeight:Math.min(innerHeight,(screen.availHeight||800)-120);
  var f=h>vh?(scrollY()-t)/(h-vh):1;f=Math.max(0,Math.min(1,f));HDI.style.width=((p.k+f)/p.C.pages.length*100)+'%'}

/* ── pages ── */
function indexOf(e){while(e&&!(e.classList&&e.classList.contains('pg')))e=e.parentElement;if(!e)return -1;for(var i=0;i<PAGES.length;i++)if(PAGES[i].el===e)return i;return -1}
function topLabel(p){
  HDC.textContent=txt(p.C.title);
  HDP.innerHTML='';if(p.arc){var c=el('span','square');HDP.appendChild(c)}HDP.appendChild(el('span',null,p.lab));
  [BAR,HDP].forEach(function(e){tint(e,p.col);e.style.setProperty('--arc',p.C.arc)});
  HDI.style.background=p.arc?p.C.arc:'';
  [].forEach.call(TOC.querySelectorAll('.te'),function(a){var on=a.getAttribute('href')==='#'+p.id;a.classList.toggle('on',on)})}
function show(i,target,instant){
  var p=PAGES[i];if(!p)return;var q=PAGES[CUR];
  ANIMS.forEach(function(a){try{a.cancel()}catch(e){}});ANIMS=[];
  function enter(){
    if(q&&q!==p)q.el.classList.remove('on');p.el.classList.add('on');CUR=i;topLabel(p);
    if(!instant){if(target&&target!==p.el)scrollToY(topOf(target)-barHeight()-16);else scrollToY(0);
      try{history.replaceState(null,'','#'+(target&&target.id?target.id:p.id))}catch(e){}
      var k=[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}];
      var a=anim(p.el,k,{duration:380,easing:E_IN});if(a)ANIMS.push(a);
      [].slice.call(p.el.children,0,3).forEach(function(c,j){var b=anim(c,k,{duration:380,delay:50*(j+1),easing:E_IN,fill:'backwards'});if(b)ANIMS.push(b)});
      if(p.type==='opening')welcome()}
    progressBar();send()}
  if(q&&q!==p&&!instant&&!RM){var s=anim(q.el,[{opacity:1},{opacity:0}],{duration:150,easing:E_OUT,fill:'forwards'});
    if(s){ANIMS.push(s);s.onfinish=function(){enter();s.cancel()};return}}
  enter()}
function go(id,instant){var e=id&&D.getElementById(id);if(!e)return false;var i=indexOf(e);if(i<0)return false;
  var p=PAGES[i];if(i===CUR&&!instant){if(e!==p.el)scrollToY(topOf(e)-barHeight()-16);else scrollToY(0);try{history.replaceState(null,'','#'+id)}catch(x){}return true}
  show(i,e===p.el?null:e,instant);return true}
/* the "Mastered" badge of a lesson that has just become so enters the next time it appears */
function welcome(){Object.keys(FRESH).forEach(function(id){var L=FRESH[id];
  [L.card&&L.card.querySelector('.mst'),TOC.classList.contains('on')?L.cntT:null].forEach(function(e){if(e&&e.offsetParent)anim(e,[{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'none'}],{duration:320,easing:E_IN})})});
  if(PAGES[CUR]&&PAGES[CUR].type==='opening'||TOC.classList.contains('on'))FRESH={}}

/* ── contents panel ── */
function tocTab(C,cascade){TOC_COURSE=C;COURSES.forEach(function(O){O.tl.hidden=O!==C;if(O.tab){O.tab.classList.toggle('on',O===C);O.tab.setAttribute('aria-pressed',O===C?'true':'false')}});
  if(cascade){var es=C.tl.querySelectorAll('.te'),n=es.length,step=n>1?Math.min(25,300/(n-1)):0;
    [].forEach.call(es,function(e,j){anim(e,[{opacity:0,transform:'translateX(-12px)'},{opacity:1,transform:'none'}],{duration:300,delay:j*step,easing:E_IN,fill:'backwards'})})}}
function openToc(){var p=PAGES[CUR];
  if(FRAMED&&!free()){var hs=Math.max(320,Math.min(innerHeight,(screen.availHeight||800)-120)),ts=Math.max(0,Math.min(VIEW,innerHeight-hs));
    TOC.style.top=ts+'px';TOC.style.bottom='auto';TOC.style.height=Math.min(hs,innerHeight)+'px'}
  else{TOC.style.top='';TOC.style.bottom='';TOC.style.height=''}
  TOC.classList.add('on');SCRIM.classList.add('on');tocTab(p?p.C:COURSES[0],true);welcome();
  var a=TOC.querySelector('.tocl:not([hidden]) .te.on');if(a&&a.scrollIntoView)a.scrollIntoView({block:'nearest'})}
function closeToc(){TOC.classList.remove('on');SCRIM.classList.remove('on')}

/* ── fold-outs ── */
function toggle(b){var o=!b._fd.classList.contains('open');b._fd.classList.toggle('open',o);b.classList.toggle('open',o);b.textContent=b._lab[o?1:0];b.setAttribute('aria-expanded',o?'true':'false')}
function keyword(b){var m=b.parentNode,fd=m._fd,i=fd.querySelector('.fold-i'),act=m.querySelector('.kw.open');
  function fill(){var g=wordDef(b._C,b._k);i.innerHTML='';var t=el('b',null,g?g.term:b.textContent);i.appendChild(t);i.appendChild(D.createTextNode(': '));
    var s=el('span',null,g?g.def:'');i.appendChild(s)}
  if(act===b){b.classList.remove('open');fd.classList.remove('open');return}
  if(act){act.classList.remove('open');b.classList.add('open');var a=anim(i,[{opacity:1},{opacity:0}],{duration:120,easing:E_OUT,fill:'forwards'});
    setTimeout(function(){fill();if(a)a.cancel();anim(i,[{opacity:0},{opacity:1}],{duration:180,easing:E_IN})},RM?0:120);return}
  fill();b.classList.add('open');fd.classList.add('open')}

/* ── checking a statement ── */
function tick(j){var L=j._L,on=!MST[j._key],before=L.o===L.ic.length&&L.ic.length>0;
  if(on)MST[j._key]=true;else delete MST[j._key];UPD=Date.now();ACTED=true;refresh();
  if(on&&!RM){var cb=j.querySelector('.cb'),rg=j.querySelector('.cbr'),c='rgb('+rgb(L.col)+' / ';
    anim(cb,[{transform:'scale(1)'},{transform:'scale(1.18)',offset:.33},{transform:'scale(1)'}],{duration:520,easing:E_IN});
    anim(rg,[{boxShadow:'0 0 0 0 '+c+'.6)'},{boxShadow:'0 0 0 10px '+c+'0)'}],{duration:520,easing:E_IN})}
  var complete=L.o===L.ic.length&&L.ic.length>0;
  if(complete&&!before){FRESH[L.id]=L;if(L.segA&&!RM){var c2='rgb('+rgb(L.col)+' / ';anim(L.segA,[{filter:'drop-shadow(0 0 0 '+c2+'0))'},{filter:'drop-shadow(0 0 10px '+c2+'.6))'},{filter:'drop-shadow(0 0 0 '+c2+'0))'}],{duration:900,easing:E_IN})}}
  send();if(FRAMED){try{parent.postMessage({lvProgress:{updated:UPD,mastered:copy(MST)}},'*')}catch(e){}}}

/* ── state: local storage and host page ── */
function state(){var p=PAGES[CUR];return {v:1,updated:UPD,mastered:copy(MST),page:p?p.id:'',pos:readingPos(),size:TZ[ZI]}}
function send(){var e=state();try{localStorage.setItem(KEY,JSON.stringify(e))}catch(x){}
  if(FRAMED){try{parent.postMessage({lvState:e},'*')}catch(x){}}}
var rafPos=0;function schedulePos(){if(rafPos)return;rafPos=requestAnimationFrame(function(){rafPos=0;progressBar();if(CUR>=0)send()})}
function apply(e,target){
  R.classList.add('instant');
  var b=STORED;if(e&&+e.updated>b.updated){MST=clean(e.mastered);UPD=+e.updated}else{MST=copy(b.mastered);UPD=b.updated}
  var z=e&&TZ.indexOf(+e.size);size(z>=0&&e?z:TZ0);
  var ok=false,byTarget=false;if(target)ok=byTarget=go(target,true);
  if(!ok&&e&&e.page&&D.getElementById(e.page))ok=go(e.page,true);
  if(!ok)show(CUR>=0?CUR:0,null,true);
  refresh();
  requestAnimationFrame(function(){requestAnimationFrame(function(){R.classList.remove('instant')})});
  return byTarget}

/* ── saving the up-to-date file ── */
var RX=new RegExp('(<script type="application/json" id="lv-'+'progress">)([\\s\\S]*?)(<\\/'+'script>)');
function compose(){var j=JSON.stringify({updated:UPD,mastered:copy(MST)},null,1).replace(/</g,'\\u003c');
  return SOURCE.replace(RX,function(m,a,b,c){return a+'\n'+j+'\n'+c})}
function fileName(){var n='';try{n=decodeURIComponent(location.pathname.split('/').pop()||'')}catch(e){}
  if(/\.html?$/i.test(n))return n;return (SUBJECT.replace(/<[^>]+>/g,'').replace(/[\\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim()||'course')+'.html'}
var DBN='html-course'+(slug(SUBJECT)?':'+slug(SUBJECT):'');
function db(){return new Promise(function(ok,ko){var r=indexedDB.open(DBN,1);r.onupgradeneeded=function(){r.result.createObjectStore('h')};r.onsuccess=function(){ok(r.result)};r.onerror=function(){ko(r.error)}})}
function readH(){return db().then(function(d){return new Promise(function(ok){var q=d.transaction('h').objectStore('h').get('file');q.onsuccess=function(){ok(q.result||null)};q.onerror=function(){ok(null)}})}).catch(function(){return null})}
function keepH(h){return db().then(function(d){d.transaction('h','readwrite').objectStore('h').put(h,'file')}).catch(function(){})}
function write(h,blob){return h.createWritable().then(function(w){return w.write(blob).then(function(){return w.close()})})}
function written(){WRITTEN={updated:UPD,mastered:copy(MST)};SOURCE=compose();refresh();
  [].forEach.call(D.querySelectorAll('.sv'),function(b){b.classList.add('done');b.querySelector('.sv-l').textContent='Saved';
    setTimeout(function(){b.classList.remove('done');b.querySelector('.sv-l').textContent='Save'},1600)})}
var SAVING=false;
function save(){if(SAVING)return;SAVING=true;var blob=new Blob([compose()],{type:'text/html;charset=utf-8'});
  function finish(){SAVING=false}
  if(window.showSaveFilePicker){
    readH().then(function(h){
      if(!h)return null;
      return h.queryPermission({mode:'readwrite'}).then(function(p){return p==='granted'?p:h.requestPermission({mode:'readwrite'})})
        .then(function(p){if(p!=='granted')return null;return write(h,blob).then(function(){return true})}).catch(function(){return null})})
    .then(function(done){if(done){written();return}
      return window.showSaveFilePicker({suggestedName:fileName(),types:[{description:'HTML page',accept:{'text/html':['.html']}}]})
        .then(function(h){return write(h,blob).then(function(){keepH(h);written()})},function(){})})
    .then(finish,finish);return}
  var u=URL.createObjectURL(blob),a=el('a');a.href=u;a.download=fileName();a.style.display='none';D.body.appendChild(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(u)},1000);written();finish()}

/* ── listeners ── */
D.addEventListener('click',function(e){
  var t=e.target;if(!t.closest)return;
  var x=t.closest('.exl a');
  if(x){e.preventDefault();e.stopPropagation();var id=x.getAttribute('href').slice(1);ACTED=true;go(id);var ex=D.getElementById(id);
    if(ex){ex.classList.remove('seen');void ex.offsetWidth;if(!RM)ex.classList.add('seen')}return}
  var j=t.closest('.ican');if(j){tick(j);return}
  var a=t.closest('a[href^="#"]');
  if(a&&!e.defaultPrevented&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.button){var id2=decodeURIComponent(a.getAttribute('href').slice(1));
    if(D.getElementById(id2)&&indexOf(D.getElementById(id2))>=0){e.preventDefault();ACTED=true;if(TOC.contains(a))closeToc();go(id2)}return}
  var b=t.closest('button');if(!b)return;
  if(b.classList.contains('reveal')){toggle(b);return}
  if(b.classList.contains('kw')){keyword(b);return}
  if(b.hasAttribute('data-tz')){ACTED=true;var v=+b.getAttribute('data-tz');size(v===0?TZ0:ZI+v,true);send();return}
  if(b.classList.contains('sv')){save();return}
  if(b.classList.contains('hd-toc')){openToc();return}
  if(b.classList.contains('toc-x')){closeToc();return}
  if(b.classList.contains('tab')){tocTab(b._C,true);return}});
SCRIM.addEventListener('click',closeToc);
D.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&TOC.classList.contains('on')){closeToc();return}
  var t=e.target;if(t&&t.classList&&t.classList.contains('ican')&&(e.key===' '||e.key==='Enter')){e.preventDefault();tick(t);return}
  if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||TOC.classList.contains('on'))return;
  if(t&&/^(input|textarea|select)$/i.test(t.tagName||''))return;
  if(e.key==='ArrowRight'&&CUR<PAGES.length-1){ACTED=true;show(CUR+1)}
  else if(e.key==='ArrowLeft'&&CUR>0){ACTED=true;show(CUR-1)}});
D.addEventListener('touchstart',function(){},{passive:true});
window.addEventListener('scroll',schedulePos,{passive:true});
window.addEventListener('resize',schedulePos);
['wheel','touchmove'].forEach(function(k){window.addEventListener(k,function(){ACTED=true},{passive:true})});
D.addEventListener('visibilitychange',function(){if(D.visibilityState==='hidden')send()});
window.addEventListener('pagehide',send);
window.addEventListener('hashchange',function(){var id='';try{id=decodeURIComponent(location.hash.slice(1))}catch(x){}if(id){ACTED=true;go(id)}});
window.addEventListener('message',function(e){if(e.source!==window.parent)return;var d=e.data;if(!d||typeof d!=='object')return;
  if(d.lvView&&typeof d.lvView.top==='number'){VIEW=d.lvView.top;schedulePos();return}
  if(d.lvState&&typeof d.lvState==='object'&&!ACTED){apply(d.lvState,null);reconcile()}});

/* ══ RESUME ══ */
var LOC=null;try{LOC=JSON.parse(localStorage.getItem(KEY)||'null')}catch(x){}
var TARGET='';try{TARGET=decodeURIComponent((location.hash||'').slice(1))}catch(x){}
var hasTarget=apply(LOC,TARGET);
if(!FRAMED)requestAnimationFrame(function(){var c=hasTarget&&D.getElementById(TARGET);
  if(c&&indexOf(c)>=0&&c!==PAGES[CUR].el)scrollToY(topOf(c)-barHeight()-16);else if(!hasTarget&&LOC&&+LOC.pos>0)setReadingPos(+LOC.pos);else window.scrollTo(0,0)});
var RECONCILED=false;
function reconcile(){if(RECONCILED||same(MST,STORED.mastered))return;
  if(FRAMED){RECONCILED=true;try{parent.postMessage({lvProgress:{updated:UPD||Date.now(),mastered:copy(MST)}},'*')}catch(e){}}}
reconcile();refresh();
if(FRAMED){try{parent.postMessage({lvStateWanted:1},'*')}catch(x){}}
if(D.fonts&&D.fonts.ready)D.fonts.ready.then(function(){progressBar()});
})();

(function(){
const R=document.getElementById('ptr'),T=document.getElementById('ptr-content').content,P=T.querySelector('phrases');
const final=R.classList.contains('final');
const topic=P.getAttribute('topic')||'';
const el=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h!=null)e.innerHTML=h;return e};
const cross='<svg width="11" height="11" viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="square"/></svg>';
const header=el('div','header'),g=el('div');
g.append(el('div','tag mono',final?'FINAL VERSION':'PHRASES TO REMEMBER'),el('div','topic',topic));
if(!final)g.append(el('p','intro',P.getAttribute('intro')||'Check the phrases you dislike; the ones you leave unchecked are kept as they are.'));
header.append(g);R.append(header);
const list=[];let n=0;
P.querySelectorAll(':scope > part, :scope > definition').forEach(p=>{
 const def=p.tagName.toLowerCase()==='definition';
 const title=p.getAttribute('title')||(def?'Definition':'');
 let num='';if(!def){n++;num=p.getAttribute('num')||String(n).padStart(2,'0')}
 const b=el('div','part'),h=el('div','head');
 if(num)h.append(el('span','num mono',num));
 h.append(el('span','ttl',title));b.append(h);
 p.querySelectorAll('phrase').forEach(s=>{
  const d=el('div','ph');
  if(!final)d.append(el('div','box',cross));
  d.append(el('p','txt',s.innerHTML));
  if(!final)d.append(el('span','redo mono','TO REVISE'));
  list.push({d,title,text:s.textContent.trim()});b.append(d);
 });
 R.append(b);
});
if(final){
 const bw=el('div','bw'),bt=el('div','btn mono','Hide to recite');bw.style.marginTop='0';bw.append(bt);header.append(bw);
 bt.addEventListener('click',()=>{const c=R.classList.toggle('masked');list.forEach(x=>x.d.classList.remove('seen'));bt.textContent=c?'Show all':'Hide to recite'});
 list.forEach(x=>x.d.addEventListener('click',()=>{if(R.classList.contains('masked'))x.d.classList.toggle('seen')}));
 return;
}
const notes=el('div','part notes'),hn=el('div','head');hn.append(el('span','ttl','What I dislike'));
const ta=el('textarea');ta.placeholder='Write here what bothers you in the checked phrases…';notes.append(hn,ta);R.append(notes);
const bw=el('div','bw'),bt=el('div','btn mono choice-btn','Keep all ↗');bw.append(bt);R.append(bw);
const update=()=>{const k=list.filter(x=>x.d.classList.contains('on')).length;bt.textContent=k?'Rewrite checked phrases ('+k+') ↗':'Keep all ↗'};
list.forEach(x=>x.d.addEventListener('click',()=>{x.d.classList.toggle('on');update()}));
bt.addEventListener('click',()=>{
 const on=list.filter(x=>x.d.classList.contains('on')),off=list.filter(x=>!x.d.classList.contains('on'));
 const f=l=>l.map(x=>x.title+': '+x.text).join('\n');
 let m='Phrases to remember, “'+topic+'”\n\n';
 if(!on.length)m+='All the phrases shown are kept.';
 else m+='To rewrite:\n'+f(on)+'\n\nRemarks: '+(ta.value.trim()||'none')+'\n\nKept:\n'+(off.length?f(off):'none');
 if(typeof sendPrompt==='function')sendPrompt(m);
 bt.textContent='Sent';
});
})();

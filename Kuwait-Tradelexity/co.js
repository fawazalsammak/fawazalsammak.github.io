/* tradelexity – notable exporting / importing companies (trade page). Data: co.json */
(function(){
 var EN=document.documentElement.lang==='en',L=function(a,e){return EN?e:a;};
 var C;try{C=(new URLSearchParams(location.search).get('c')||'KW').toUpperCase();}catch(e){C='KW';}
 fetch('co.json').then(function(r){return r.json();}).then(function(D){var d=D.c[C];if(!d)return;
  var host=document.getElementById('vEnt');if(!host)return;
  var st=document.createElement('style');st.textContent='#coS{margin-top:16px}#coS .cot{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 12px}#coS .cot button{font:inherit;font-size:14px;padding:8px 14px;border-radius:999px;border:1px solid #D4B85A;background:transparent;color:inherit;cursor:pointer}#coS .cot button.on{background:#D4B85A;color:#0B193A;font-weight:700}#coS .cor{display:flex;justify-content:space-between;gap:10px;align-items:baseline;padding:9px 2px;border-bottom:1px solid var(--line,rgba(255,255,255,.14))}#coS .cor b{font-weight:600}#coS .cor small{opacity:.75;text-align:end;flex:none;max-width:48%}#coS h4{margin:14px 0 4px;font-size:15px;color:#D4B85A}#coS .cog{font-size:13px;opacity:.8;margin:6px 0 2px}#coS .con{font-size:13px;opacity:.75;margin-top:12px;line-height:1.6}';document.head.appendChild(st);
  var s=document.createElement('div');s.className='card';s.id='coS';
  var nm=function(r){return EN?r[1]:r[0];},sc=function(r){return EN?r[3]:r[2];},hs=function(k){return D.hs[k]?(EN?D.hs[k][1]:D.hs[k][0]):k;};
  var rows=function(a){return a.map(function(r){return '<div class="cor"><b>'+nm(r)+'</b><small>'+sc(r)+'</small></div>';}).join('');};
  var byC=function(){var g={},seen={};['x','m'].forEach(function(f){d[f].forEach(function(r){r[4].split(',').forEach(function(k){var t=hs(k);g[t]=g[t]||{x:[],m:[]};if(g[t][f].indexOf(nm(r))<0)g[t][f].push(nm(r));});});});
   return Object.keys(g).sort(function(a,b){return (g[b].x.length+g[b].m.length)-(g[a].x.length+g[a].m.length);}).map(function(t){return '<h4>'+t+'</h4>'+(g[t].x.length?'<div class="cog">'+L('مصدّرون: ','Exporters: ')+'</div><div>'+g[t].x.join(L('، ',', '))+'</div>':'')+(g[t].m.length?'<div class="cog">'+L('مستوردون: ','Importers: ')+'</div><div>'+g[t].m.join(L('، ',', '))+'</div>':'');}).join('');};
  var views={x:function(){return rows(d.x);},m:function(){return rows(d.m);},c:byC,o:function(){return (d.o||[]).map(function(r){return '<div class="cor"><b>'+(EN?r[1]:r[0])+'</b><small>'+L('نفط وغاز','Oil and gas')+'</small></div>';}).join('');}};
  var tabs=[['x',L('المصدّرون','Exporters')],['m',L('المستوردون','Importers')],['c',L('حسب السلعة','By commodity')]];if(d.o&&d.o.length)tabs.push(['o',L('قطاع النفط والغاز','Oil and gas sector')]);
  s.innerHTML='<h3>'+L('أبرز الشركات المصدّرة والمستوردة','Major exporting and importing companies')+'</h3><div class="cot">'+tabs.map(function(t,i){return '<button type="button" data-v="'+t[0]+'"'+(i?'':' class="on"')+'>'+t[1]+'</button>';}).join('')+'</div><div id="coB"></div><div class="con">'+L('قائمة تعريفية بأبرز الشركات غير النفطية، غير مرتبة حسب قيمة التجارة؛ لا تُنشر بيانات عن قيمة صادرات أو واردات كل شركة. شركات النفط والغاز معروضة في تبويب مستقل.','An indicative list of leading non-oil companies, not ranked by trade value; no company-level export or import values are published. Oil and gas companies are shown in a separate tab.')+'</div>';
  host.appendChild(s);var body=s.querySelector('#coB');body.innerHTML=views.x();
  s.querySelector('.cot').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;s.querySelectorAll('.cot button').forEach(function(x){x.classList.toggle('on',x===b);});body.innerHTML=views[b.dataset.v]();});
  var vis=function(){var ok=true;try{ok=!!(cur&&cur.kw);}catch(e){}s.style.display=ok?'':'none';};vis();setInterval(vis,600);
 }).catch(function(){});
})();

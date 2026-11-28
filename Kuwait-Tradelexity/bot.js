/* tradelexity assistant: answers questions from the portal's own data (bot.json). No external service. */
(()=>{
const EN=document.documentElement.lang==='en',L=(a,e)=>EN?e:a;
const CUR=(new URLSearchParams(location.search).get('c')||'').toUpperCase();
let D=null,last=null;
const css=`#tbB{position:fixed;inset-inline-start:14px;bottom:104px;z-index:9000;font:700 13.5px Noto Naskh Arabic,Montserrat,sans-serif;padding:10px 16px;border-radius:999px;border:1px solid #D4B85A;background:#0B193A;color:#D4B85A;cursor:pointer;box-shadow:0 6px 18px #0008}
#tbP{position:fixed;inset-inline-start:12px;bottom:104px;z-index:9001;box-sizing:border-box;width:min(380px,calc(100vw - 24px));max-width:calc(100% - 24px);height:min(560px,calc(100vh - 150px));display:none;flex-direction:column;background:#0f2150;border:1px solid #D4B85A88;border-radius:16px;box-shadow:0 14px 40px #000a;color:#eaf0fb;font:14px Noto Naskh Arabic,Montserrat,sans-serif;overflow:hidden}
#tbP.on{display:flex}#tbP header{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:#0B193A;border-bottom:1px solid #D4B85A55;font-weight:800;color:#D4B85A}
#tbP header button{background:none;border:1px solid #ffffff40;color:#dfe7f5;border-radius:999px;padding:3px 12px;font:700 12px Noto Naskh Arabic,sans-serif;cursor:pointer}
#tbM{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:9px}
#tbM .q,#tbM .a{max-width:92%;padding:9px 12px;border-radius:12px;line-height:1.7;word-break:break-word}
#tbM .q{align-self:flex-end;background:#D4B85A;color:#0B193A;font-weight:700}#tbM .a{align-self:flex-start;background:#ffffff10;border:1px solid #ffffff1c}
#tbM .a b{color:#fff}#tbM .a table{width:100%;border-collapse:collapse;margin-top:4px;font-size:13px}#tbM .a td,#tbM .a th{padding:4px 5px;border-bottom:1px solid #ffffff1c;text-align:start}#tbM .a th{color:#D4B85A;font-weight:700}
#tbM .a a{display:inline-block;margin:7px 6px 0 0;padding:4px 11px;border-radius:999px;border:1px solid #D4B85A99;color:#D4B85A;text-decoration:none;font-weight:700;font-size:12.5px}
#tbS{display:flex;gap:6px;flex-wrap:wrap;padding:0 12px 8px}#tbS button{font:700 12px Noto Naskh Arabic,sans-serif;padding:5px 10px;border-radius:999px;border:1px solid #ffffff30;background:#ffffff0d;color:#dfe7f5;cursor:pointer}
#tbF{display:flex;gap:8px;padding:10px 12px;border-top:1px solid #ffffff1c;background:#0B193A}#tbF input{flex:1;min-width:0;font:16px Noto Naskh Arabic,sans-serif;padding:9px 13px;border-radius:999px;border:1px solid #D4B85A88;background:#ffffff12;color:#fff;outline:none}
#tbF button{font:800 13px Noto Naskh Arabic,sans-serif;padding:8px 16px;border-radius:999px;border:0;background:#D4B85A;color:#0B193A;cursor:pointer}`;
const nz=s=>String(s||'').toLowerCase().replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[؟?!.,،:؛"'()\-–]/g,' ').replace(/\s+/g,' ').trim();
const num=(v,d=1)=>v==null||!isFinite(v)?'–':Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
const usd=m=>m==null?'–':Math.abs(m)>=1000?num(m/1000)+L(' مليار دولار',' $ bn'):num(m,0)+L(' مليون دولار',' $ m');
const bn=v=>v==null?'–':v>=1000?num(v/1000,2)+L(' تريليون دولار',' $ tn'):num(v)+L(' مليار دولار',' $ bn');
const pc=v=>v==null?'–':'<span dir="ltr">'+(v>0?'+':'')+num(v)+'%</span>';
const nm=c=>D.c[c]?(EN?D.c[c].e:D.c[c].a):c;
const la=c=>{const n=nm(c);return /^ال/.test(n)?'لل'+n.slice(2):'لـ'+n;};
const hs=k=>D.hs[k]?(EN?D.hs[k][1]:D.hs[k][0]):k;
const rl=s=>s==null?'–':s>=68?L('منخفضة','low'):s>=55?L('معتدلة','moderate'):s>=40?L('مرتفعة','high'):L('مرتفعة جداً','very high');
const pg=(p,c,x)=>(EN?p+'_en.html':p+'.html')+'?c='+c+(x||'');
const links=(c,m)=>`<div><a href="${pg('summary',c)}">${L('الملخص','Summary')}</a><a href="${(EN?'en.html':'index.html')+'?c='+c+'&go=1'}">${L('التجارة','Trade')}</a><a href="${pg('finance',c)}">${L('الاقتصاد','Economy')}</a><a href="${pg('opportunities',c,m?'&m='+m:'')}">${L('الفرص','Prospects')}</a></div>`;
let IDX=null;
function index(){IDX=[];for(const c in D.c){const r=D.c[c];[r.a,r.e,...(r.al||[])].forEach(n=>{n=nz(n);if(n.length>1){IDX.push([n,c,0]);if(/^ال/.test(n)&&n.length>4)IDX.push([n.slice(2),c,1]);}});}IDX.sort((a,b)=>b[0].length-a[0].length);}
function countries(t){let s='  '+t+' ';const out=[];for(const [n,c,st] of IDX){let from=0,i;while((i=s.indexOf(n,from))>=0){from=i+1;const a=s[i+n.length];if(a!==' ')continue;const p3=s.slice(Math.max(0,i-4),i);const okB=st?/(^| )(ال|وال|بال|لل|فال|كال|ولل)$/.test(p3):(/ $/.test(p3)||/ [بلوفك]$/.test(p3)||/ (ول|وب)$/.test(p3));if(!okB)continue;if(!out.some(o=>o[1]===c))out.push([i,c]);s=s.slice(0,i)+' '.repeat(n.length)+s.slice(i+n.length);break;}}
 return out.sort((a,b)=>a[0]-b[0]).map(o=>o[1]);}
const T=[['cmp',/قارن|مقارن|compare|versus| vs /],['h1',/النصف الاول|نصف 2026|2026|first half|h1/],['partners',/شرك|partner|مع من|تتاجر/],['topx',/ماذا تصدر|اهم الصادرات|ابرز الصادرات|اهم صادرات|ابرز صادرات|سلع|منتجات|what does .* export|top exports|main exports|products/],['needs',/تحتاج|احتياج|ماذا تستورد|اهم الواردات|اهم واردات|needs|what does .* import|top imports|main imports/],['bal',/ميزان|فائض|عجز تجاري|balance|surplus|deficit/],['exp',/صادر|تصدير|export/],['imp',/وارد|استيراد|import/],['trade',/تبادل|تجار|trade/],['gdp',/ناتج|حجم الاقتصاد|gdp|economy size|size of the economy/],['gr',/نمو|growth/],['inf',/تضخم|inflation|اسعار المستهلك/],['debt',/دين|ديون|debt/],['fb',/ماليه عامه|عجز الموازنه|الموازنه|fiscal|budget/],['ca',/حساب جاري|الحساب الجاري|current account/],['pop',/سكان|population/],['res',/احتياطي|reserves/],['pol',/فائده|interest|policy rate/],['rat',/تصنيف|rating|ستاندرد|s&p/],['risk',/مخاطر|risk|هل استثمر|امن للاستثمار|safe to invest/],['fdi',/استثمار اجنبي|استثمار مباشر|fdi|foreign direct/],['kw',/الكويت|kuwait/],['mk',/افضل الاسواق|best markets/]];
const F={
 gdp:(c,r)=>L(`الناتج المحلي الإجمالي ${la(c)} (${r.gy||2025}): <b>${bn(r.gdp)}</b>`,`${nm(c)} GDP (${r.gy||2025}): <b>${bn(r.gdp)}</b>`)+(r.gpc?L(`، ونصيب الفرد <b>${num(r.gpc[1],0)} دولار</b>.`,`; GDP per capita <b>$${num(r.gpc[1],0)}</b>.`):'.'),
 gr:(c,r)=>L(`النمو الحقيقي في ${nm(c)}: <b>${pc(r.gr)}</b> في 2025، وتقدير 2026 <b>${pc(r.gr26)}</b>.`,`Real GDP growth in ${nm(c)}: <b>${pc(r.gr)}</b> in 2025; 2026 estimate <b>${pc(r.gr26)}</b>.`),
 inf:(c,r)=>L(`التضخم في ${nm(c)} (2025): <b>${pc(r.inf)}</b>.`,`Inflation in ${nm(c)} (2025): <b>${pc(r.inf)}</b>.`),
 debt:(c,r)=>L(`الدين الحكومي في ${nm(c)} (2025): <b>${num(r.debt)}%</b> من الناتج.`,`Government debt in ${nm(c)} (2025): <b>${num(r.debt)}%</b> of GDP.`),
 fb:(c,r)=>L(`رصيد المالية العامة في ${nm(c)} (2025): <b>${pc(r.fb)}</b> من الناتج.`,`Fiscal balance in ${nm(c)} (2025): <b>${pc(r.fb)}</b> of GDP.`),
 ca:(c,r)=>L(`الحساب الجاري في ${nm(c)} (2025): <b>${pc(r.ca)}</b> من الناتج.`,`Current account in ${nm(c)} (2025): <b>${pc(r.ca)}</b> of GDP.`),
 pop:(c,r)=>r.pop?L(`عدد سكان ${nm(c)} (${r.pop[0]}): <b>${num(r.pop[1],2)} مليون نسمة</b>.`,`Population of ${nm(c)} (${r.pop[0]}): <b>${num(r.pop[1],2)} million</b>.`):na(c),
 res:(c,r)=>r.res?L(`الاحتياطيات الدولية ${la(c)} (${r.res[0]}): <b>${bn(r.res[1])}</b>.`,`International reserves of ${nm(c)} (${r.res[0]}): <b>${bn(r.res[1])}</b>.`):na(c),
 pol:(c,r)=>r.pol!=null?L(`سعر الفائدة الرئيسي في ${nm(c)}: <b>${num(r.pol,2)}%</b>.`,`Policy interest rate in ${nm(c)}: <b>${num(r.pol,2)}%</b>.`):na(c),
 rat:(c,r)=>L(`التصنيف الائتماني ${la(c)} (S&P): <b dir="ltr">${r.rt&&r.rt!=='–'?r.rt:L('غير مصنفة','not rated')}</b>.`,`${nm(c)} credit rating (S&P): <b>${r.rt&&r.rt!=='–'?r.rt:'not rated'}</b>.`),
 risk:(c,r)=>L(`تقييم مخاطر الاستثمار في ${nm(c)}: <b>${r.risk}/100</b> – مخاطر <b>${rl(r.risk)}</b>. (كلما ارتفع الرقم انخفضت المخاطر.)`,`Investment risk score for ${nm(c)}: <b>${r.risk}/100</b> – <b>${rl(r.risk)}</b> risk. (A higher score means lower risk.)`),
 fdi:(c,r)=>r.fdi?L(`تدفقات الاستثمار الأجنبي المباشر إلى ${nm(c)} (${r.fdi[0]}): <b>${bn(r.fdi[1])}</b>.`,`FDI inflows to ${nm(c)} (${r.fdi[0]}): <b>${bn(r.fdi[1])}</b>.`):na(c),
 exp:(c,r)=>L(`صادرات ${nm(c)} (${r.y}): <b>${usd(r.x)}</b>.`,`${nm(c)} exports (${r.y}): <b>${usd(r.x)}</b>.`),
 imp:(c,r)=>L(`واردات ${nm(c)} (${r.y}): <b>${usd(r.m)}</b>.`,`${nm(c)} imports (${r.y}): <b>${usd(r.m)}</b>.`),
 bal:(c,r)=>{const b=r.x-r.m;return L(`الميزان التجاري ${la(c)} (${r.y}): <b>${b>=0?'فائض':'عجز'} ${usd(Math.abs(b))}</b> (الصادرات ${usd(r.x)}، الواردات ${usd(r.m)}).`,`${nm(c)} trade balance (${r.y}): <b>${b>=0?'surplus':'deficit'} of ${usd(Math.abs(b))}</b> (exports ${usd(r.x)}, imports ${usd(r.m)}).`);},
 trade:(c,r)=>L(`التجارة الخارجية ${la(c)} (${r.y}): الصادرات <b>${usd(r.x)}</b>، الواردات <b>${usd(r.m)}</b>، حجم التبادل <b>${usd(r.x+r.m)}</b>.`,`${nm(c)} foreign trade (${r.y}): exports <b>${usd(r.x)}</b>, imports <b>${usd(r.m)}</b>, total <b>${usd(r.x+r.m)}</b>.`),
 partners:(c,r)=>L(`أهم الشركاء التجاريين ${la(c)} (${r.y}):`,`Top trading partners of ${nm(c)} (${r.y}):`)+tbl((r.par||[]).map(([p,v])=>[nm(p),usd(v)])),
 topx:(c,r)=>L(`أهم صادرات ${nm(c)}:`,`Top exports of ${nm(c)}:`)+tbl((r.ex||[]).map(([k,v])=>[hs(k),usd(v)])),
 needs:(c,r)=>L(`أهم احتياجات ${nm(c)} من الواردات (صافي الاستيراد):`,`Main import needs of ${nm(c)} (net imports):`)+tbl((r.nd||[]).map(([k,v])=>[hs(k),usd(v)])),
 h1:(c,r)=>{const h=r.h1;if(!h)return L(`لا تتوفر بعد بيانات 2026 ${la(c)}؛ أحدث سنة كاملة هي ${r.y}: الصادرات ${usd(r.x)} والواردات ${usd(r.m)}.`,`2026 data are not yet available for ${nm(c)}; the latest full year is ${r.y}: exports ${usd(r.x)}, imports ${usd(r.m)}.`);const g=(a,b)=>b?' ('+pc((a/b-1)*100)+')':'';return L(`${nm(c)} – ${h.lb[0]}: الصادرات <b>${usd(h.x)}</b>${g(h.x,h.x0)}، الواردات <b>${usd(h.m)}</b>${g(h.m,h.m0)} مقارنة بالفترة نفسها من 2025.`,`${nm(c)} – ${h.lb[1]}: exports <b>${usd(h.x)}</b>${g(h.x,h.x0)}, imports <b>${usd(h.m)}</b>${g(h.m,h.m0)} versus the same period of 2025.`);},
 kw:(c,r)=>c==='KW'?F.mk(c,r):(r.kw?L(`التبادل بين الكويت و${nm(c)}: صادرات الكويت إليها <b>${usd(r.kw[0])}</b>، وواردات الكويت منها <b>${usd(r.kw[1])}</b>.`,`Kuwait–${nm(c)} trade: Kuwait's exports to it <b>${usd(r.kw[0])}</b>; Kuwait's imports from it <b>${usd(r.kw[1])}</b>.`):na(c)),
 mk:(c,r)=>r.mk?L('أفضل الأسواق للصادرات الكويتية بحسب مؤشر التكامل التجاري:','Best markets for Kuwaiti exports by trade complementarity:')+tbl(r.mk.map(([p,v])=>[nm(p),v])):F.sum(c,r),
 sum:(c,r)=>`<b>${nm(c)}</b>`+tbl([[L('الناتج المحلي','GDP')+' '+(r.gy||2025),bn(r.gdp)],[L('النمو 2025','Growth 2025'),pc(r.gr)],[L('التضخم 2025','Inflation 2025'),pc(r.inf)],[L('الصادرات','Exports')+' '+r.y,usd(r.x)],[L('الواردات','Imports')+' '+r.y,usd(r.m)],[L('التصنيف (S&P)','Rating (S&P)'),r.rt||'–'],[L('مخاطر الاستثمار','Investment risk'),r.risk+'/100 · '+rl(r.risk)]])
};
const PRD=[['قمح|wheat','1001','10','القمح','wheat'],['ارز|رز|rice','1006','10','الأرز','rice'],['ذره|maize|corn','1005','10','الذرة','maize'],['سكر|sugar','1701','17','السكر','sugar'],['زيت النخيل|زيت نخيل|palm oil','1511','15','زيت النخيل','palm oil'],['دواجن|دجاج|poultry|chicken','0207','02','لحوم الدواجن','poultry meat'],['لحوم الابقار|لحوم ابقار|لحم بقري|لحم البقر|beef','0202','02','لحوم الأبقار المجمدة','frozen beef'],['حليب|البان|milk|dairy','0402','04','الحليب المجفف والمركّز','milk powder and concentrated milk'],['فول الصويا|صويا|soybeans|soybean|soya','1201','12','فول الصويا','soybeans'],['النفط الخام|نفط خام|نفط|بترول|crude oil|crude','2709','27','النفط الخام','crude oil'],['مشتقات نفطيه|مشتقات|وقود|بنزين|ديزل|refined petroleum|fuel|petrol|diesel|gasoline','2710','27','المشتقات النفطية','refined petroleum products'],['غاز|gas|lng','2711','27','الغاز','petroleum gas'],['ادويه|دواء|medicines|medicine|pharmaceuticals|drugs','3004','30','الأدوية','medicines'],['سيارات|سياره|cars|car|vehicles','8703','87','السيارات','cars'],['هواتف|هاتف|جوالات|phones|smartphones|mobile phones','8517','85','الهواتف وأجهزة الاتصال','phones and telecom equipment'],['ذهب|gold','7108','71','الذهب','gold'],['اسمده|سماد|fertilizers|fertilisers|fertilizer|fertiliser','3102','31','الأسمدة النيتروجينية','nitrogen fertilisers'],['المنيوم|aluminium|aluminum','7601','76','الألمنيوم الخام','unwrought aluminium'],
['لحوم|لحم|meat','','02','اللحوم','meat'],['حبوب|cereals|grains|grain','','10','الحبوب','cereals'],['حديد|صلب|steel|iron','','72','الحديد والصلب','iron and steel'],['بلاستيك|لدائن|plastics|plastic','','39','البلاستيك','plastics'],['الات|معدات|machinery|machines','','84','الآلات والمعدات','machinery'],['الكترونيات|اجهزه كهربائيه|electronics|electrical','','85','الأجهزة الكهربائية والإلكترونيات','electrical equipment and electronics'],['ملابس|clothing|apparel|clothes','','61','الملابس','clothing'],['اثاث|furniture','','94','الأثاث','furniture'],['كيماويات|chemicals','','29','الكيماويات العضوية','organic chemicals'],['اسماك|سمك|fish|seafood','','03','الأسماك','fish'],['فواكه|فاكهه|fruits|fruit','','08','الفواكه','fruit'],['خضروات|خضار|vegetables','','07','الخضروات','vegetables'],['نحاس|copper','','74','النحاس','copper'],['طائرات|aircraft|planes','','88','الطائرات','aircraft'],['عطور|تجميل|perfumes|cosmetics','','33','العطور ومستحضرات التجميل','perfumes and cosmetics'],['زيوت نباتيه|زيت|vegetable oils|vegetable oil','','15','الزيوت النباتية','vegetable oils']].map(p=>[new RegExp('(?:^| )(?:و|ب|ل)?(?:ال|لل)?(?:'+p[0]+')s?(?: |$)'),p[1],p[2],p[3],p[4]]);
const product=t=>PRD.find(p=>p[0].test(t));
let PD=null,SP=null;const getJ=(u)=>fetch(u).then(r=>r.ok?r.json():null).catch(()=>null);
async function suppliers(c,pr){if(!PD)PD=await getJ('prod.json')||{n:{},c:{}};const pn=EN?pr[4]:pr[3],to=L(' إلى '+nm(c),' to '+nm(c));
 const row=(nmap,ps,t,div)=>tbl(ps.map(([m,v])=>[nmap[m]?(EN?nmap[m][1]:nmap[m][0]):m,usd(v/div),t?num(v/t*100,0)+'%':'']));
 const e=pr[1]&&PD.c[c]&&PD.c[c][pr[1]];
 if(e){const [mode,t,ps]=e;if(!t||!ps.length)return L(`لا تُظهر بيانات 2024 واردات تُذكر من ${pn}${to}.`,`2024 data show no significant imports of ${pn}${to}.`)+links(c);
  return L(`أهم موردي ${pn}${to} (2024) – إجمالي الواردات <b>${usd(t/1000)}</b>:`,`Main suppliers of ${pn}${to} (2024) – total imports <b>${usd(t/1000)}</b>:`)+row(PD.n,ps,t,1000)+(mode==='m'?`<small style="opacity:.75;display:block;margin-top:5px">${L('بحسب ما أعلنته الدول المصدّرة، لأن الدولة لم تنشر بيانات 2024. لا تشمل المصدّرين الذين لا ينشرون بياناتهم، مثل روسيا.','Based on what exporting countries reported, because this country has not published 2024 data. Exporters that do not publish data, such as Russia, are not included.')}</small>`:'')+links(c);}
 if(!SP)SP=await getJ('sup.json')||{n:{},c:{}};const g=SP.c[c]&&SP.c[c][pr[2]];
 if(g&&g.p&&g.p.length){const cn=hs(pr[2]);return (pr[1]?L(`لا تتوفر بعد بيانات تفصيلية عن ${pn}${to}. هذه بيانات الفصل كاملاً (${cn})، ${g.y}:`,`Product-level data for ${pn}${to} are not available yet. These are the figures for the whole chapter (${cn}), ${g.y}:`):L(`أهم موردي ${cn}${to} (${g.y}) – إجمالي الواردات <b>${usd(g.t)}</b>:`,`Main suppliers of ${cn}${to} (${g.y}) – total imports <b>${usd(g.t)}</b>:`))+row(SP.n,g.p,g.t,1)+links(c);}
 return L(`بيانات موردي ${pn}${to} غير متوفرة بعد في المنصة.`,`Supplier data for ${pn}${to} are not yet available in the portal.`)+links(c);}
const na=c=>L(`هذا المؤشر غير متوفر ${la(c)} في المنصة.`,`This indicator is not available for ${nm(c)} in the portal.`);
const tbl=rows=>rows.length?'<table>'+rows.map(r=>'<tr>'+r.map((x,i)=>`<td${i?' dir="auto"':''}>${x}</td>`).join('')+'</tr>').join('')+'</table>':' –';
function cmp(a,b){const A=D.c[a],B=D.c[b];const R=[[L('الناتج المحلي','GDP'),bn(A.gdp),bn(B.gdp)],[L('النمو 2025','Growth 2025'),pc(A.gr),pc(B.gr)],[L('التضخم','Inflation'),pc(A.inf),pc(B.inf)],[L('الدين/الناتج','Debt/GDP'),num(A.debt)+'%',num(B.debt)+'%'],[L('الصادرات','Exports'),usd(A.x),usd(B.x)],[L('الواردات','Imports'),usd(A.m),usd(B.m)],[L('التصنيف','Rating'),A.rt||'–',B.rt||'–'],[L('المخاطر','Risk score'),A.risk+' · '+rl(A.risk),B.risk+' · '+rl(B.risk)]];
 return `<table><tr><th></th><th>${nm(a)}</th><th>${nm(b)}</th></tr>`+R.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')+'</table>'+`<div><a href="${pg('opportunities',a,'&m='+b)}">${L('فرص التجارة بين البلدين','Trade prospects between them')}</a></div>`;}
function answer(q){q=String(q).replace(/\bU\.?S\.?A?\b/g,'usa').replace(/\bU\.?K\.?\b/g,'uk').replace(/\bU\.?A\.?E\.?\b/g,'uae');const t=nz(q);let cs=countries(t);const topics=T.filter(([k,re])=>re.test(' '+t+' ')).map(x=>x[0]);
 if(/^(مرحبا|اهلا|السلام عليكم|هلا|hi|hello|hey)( |$)/.test(t)&&!cs.length&&!topics.length)return help();
 if(/مساعده|ماذا تستطيع|كيف استخدم|help|what can you/.test(t))return help();
 let tp=topics.filter(k=>k!=='kw'||!cs.includes('KW'));if(/افضل الاسواق|best markets/.test(t)&&!cs.length)cs=['KW'];
 if(!cs.length){if((tp.length||product(t))&&(last||D.c[CUR]))cs=[last||CUR];else if(!tp.length&&!product(t))return L('لم أتعرف على دولة أو مؤشر في سؤالك. اكتب اسم الدولة وما تريد معرفته، مثل: «صادرات تركيا» أو «قارن بين مصر والمغرب».','I could not find a country or an indicator in your question. Type a country and what you want to know, for example: "Turkey exports" or "compare Egypt and Morocco".');else return L('عن أي دولة؟ اكتب اسم الدولة مع السؤال.','Which country? Please include the country name.');}
 last=cs[0];
 if(cs.length>=2){const [a,b]=cs;if(tp.includes('cmp')||!tp.length||tp.every(k=>['gdp','gr','inf','debt','rat','risk'].includes(k)))return cmp(a,b);
  const x=(D.c[a].par||[]).find(p=>p[0]===b),k=a==='KW'?D.c[b].kw:b==='KW'?D.c[a].kw:null;let s='';
  if(k){const o=a==='KW'?b:a;s=F.kw(o,D.c[o]);}else if(x)s=L(`حجم التبادل التجاري بين ${nm(a)} و${nm(b)} (${D.c[a].y}): <b>${usd(x[1])}</b>؛ ${nm(b)} من أهم خمسة شركاء ${la(a)}.`,`${nm(a)}–${nm(b)} trade (${D.c[a].y}): <b>${usd(x[1])}</b>; ${nm(b)} is among ${nm(a)}'s top five partners.`);
  else s=L(`تفاصيل التجارة بين ${nm(a)} و${nm(b)} والسلع الأنسب متاحة في صفحة فرص التجارة الدولية.`,`Trade between ${nm(a)} and ${nm(b)}, and the best-fit products, are on the Trade Prospects page.`);
  return s+`<div><a href="${pg('opportunities',a,'&m='+b)}">${L('فرص التجارة بين البلدين','Trade prospects between them')}</a></div>`;}
 const pr=product(t);if(pr&&cs.length===1&&!/تصدر|صادرات|يصدر|export/.test(t))return suppliers(cs[0],pr);
 const c=cs[0],r=D.c[c];tp=tp.filter(k=>k!=='cmp');
 if(tp.includes('exp')&&tp.includes('topx'))tp=tp.filter(k=>k!=='exp');if(tp.includes('imp')&&tp.includes('needs'))tp=tp.filter(k=>k!=='imp');
 if(tp.includes('h1'))tp=['h1'];if(tp.includes('bal'))tp=tp.filter(k=>!['exp','imp','trade','fb'].includes(k));if(tp.includes('fdi'))tp=tp.filter(k=>k!=='risk');
 if(tp.length>1)tp=tp.filter(k=>k!=='trade');if(tp.includes('kw')&&tp.length>1&&c!=='KW')tp=tp.filter(k=>k!=='kw');
 if(!tp.length)tp=['sum'];
 return tp.slice(0,3).map(k=>F[k](c,r)).join('<br>')+links(c);}
const help=()=>L('أجيب من بيانات المنصة عن 151 دولة. اسألني مثلاً عن: الناتج المحلي، النمو، التضخم، الدين، الصادرات والواردات، الميزان التجاري، أهم الشركاء والسلع، مورّدي سلعة معينة (مثل: من أين تستورد الإمارات القمح؟)، النصف الأول 2026، التصنيف الائتماني، مخاطر الاستثمار، أو قارن بين دولتين.','I answer from the portal\'s data on 151 countries. Ask about: GDP, growth, inflation, debt, exports and imports, trade balance, top partners and products, suppliers of a product (e.g. where does the UAE import wheat from?), first half 2026, credit rating, investment risk, or compare two countries.');
function ui(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const b=document.createElement('button');b.id='tbB';b.type='button';b.textContent=L('المساعد','Assistant');
 const p=document.createElement('div');p.id='tbP';p.setAttribute('role','dialog');p.setAttribute('aria-label',L('المساعد','Assistant'));
 const sg=EN?['Kuwait summary','Compare Egypt and Turkey','India top partners','Where does the UAE import wheat from?']:['ملخص الكويت','قارن بين مصر وتركيا','أهم شركاء الهند','من أين تستورد الإمارات القمح؟'];
 p.innerHTML=`<header><span>${L('مساعد tradelexity','tradelexity assistant')}</span><button type="button" id="tbX">${L('إغلاق','Close')}</button></header><div id="tbM"></div><div id="tbS">${sg.map(s=>`<button type="button">${s}</button>`).join('')}</div><form id="tbF"><input type="text" autocomplete="off" placeholder="${L('اكتب سؤالك…','Type your question…')}" aria-label="${L('سؤال','Question')}"><button type="submit">${L('إرسال','Send')}</button></form>`;
 document.body.appendChild(b);document.body.appendChild(p);
 const M=p.querySelector('#tbM'),inp=p.querySelector('input');
 const add=(cls,html)=>{const d=document.createElement('div');d.className=cls;d[cls==='q'?'textContent':'innerHTML']=html;M.appendChild(d);M.scrollTop=M.scrollHeight;};
 const ask=q=>{q=q.trim();if(!q)return;add('q',q);inp.value='';const go=()=>{const bad=L('تعذر تجهيز الإجابة. جرّب صياغة أخرى.','Could not prepare an answer. Please rephrase.');let a;try{a=answer(q);}catch(e){a=bad;}Promise.resolve(a).then(x=>add('a',x)).catch(()=>add('a',bad));};
  if(D)go();else fetch('bot.json').then(r=>r.json()).then(j=>{D=j;index();go();}).catch(()=>add('a',L('تعذر تحميل البيانات. تحقق من الاتصال.','Could not load the data. Check your connection.')));};
 b.onclick=()=>{p.classList.add('on');b.style.display='none';if(!M.children.length)add('a',help());if(!D)fetch('bot.json').then(r=>r.json()).then(j=>{D=j;index();}).catch(()=>{});};
 p.querySelector('#tbX').onclick=()=>{p.classList.remove('on');b.style.display='';};
 p.querySelector('#tbF').onsubmit=e=>{e.preventDefault();ask(inp.value);};
 p.querySelectorAll('#tbS button').forEach(x=>x.onclick=()=>ask(x.textContent));
 const vis=()=>{const i=document.getElementById('intro');const hide=i&&!i.classList.contains('pk');if(hide){b.style.display='none';p.classList.remove('on');}else if(!p.classList.contains('on'))b.style.display='';let fx=false;if(!(i&&i.classList.contains('pk'))){let n=document.elementFromPoint(innerWidth/2,innerHeight-8);while(n&&n!==document.body){if(n.id==='tbP'||n.id==='tbB'){fx=b.dataset.fx==='1';break;}if(getComputedStyle(n).position==='fixed'){fx=true;break;}n=n.parentElement;}}b.dataset.fx=fx?'1':'0';const off=fx?'104px':'18px';b.style.bottom=off;p.style.bottom=off;};
 vis();setInterval(vis,600);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ui);else ui();
window.__tbAnswer=q=>{if(!IDX)index();return answer(q);};window.__tbLoad=j=>{D=j;index();};
})();

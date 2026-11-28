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
const nz=s=>String(s||'').toLowerCase().replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/[؟?!.,،:؛"'()\-–\/]/g,' ').replace(/\s+/g,' ').trim();
const num=(v,d=1)=>v==null||!isFinite(v)?'–':Number(v).toLocaleString('en-US',{maximumFractionDigits:d});
const usd=m=>m==null||!isFinite(m)?'–':Math.abs(m)>=1e6?num(m/1e6,2)+L(' تريليون دولار',' $ tn'):Math.abs(m)>=1000?num(m/1000)+L(' مليار دولار',' $ bn'):num(m,Math.abs(m)<10?1:0)+L(' مليون دولار',' $ m');
const bn=v=>v==null?'–':Math.abs(v)>=1000?num(v/1000,2)+L(' تريليون دولار',' $ tn'):num(v)+L(' مليار دولار',' $ bn');
const pc=v=>v==null?'–':'<span dir="ltr">'+(v>0?'+':'')+num(v)+'%</span>';
const nm=c=>D.c[c]?(EN?D.c[c].e:D.c[c].a):(XN[c]?(EN?XN[c][1]:XN[c][0]):c);let XN={};
const la=c=>{const n=nm(c);return /^ال/.test(n)?'لل'+n.slice(2):'لـ'+n;};
const hs=k=>D.hs[k]?(EN?D.hs[k][1]:D.hs[k][0]):k;
const rl=s=>s==null?'–':s>=68?L('منخفضة','low'):s>=55?L('معتدلة','moderate'):s>=40?L('مرتفعة','high'):L('مرتفعة جداً','very high');
const pg=(p,c,x)=>(EN?p+'_en.html':p+'.html')+'?c='+c+(x||'');
const links=(c,m)=>`<div><a href="${pg('summary',c)}">${L('الملخص','Summary')}</a><a href="${(EN?'en.html':'index.html')+'?c='+c+'&go=1'}">${L('التجارة','Trade')}</a><a href="${pg('finance',c)}">${L('الاقتصاد','Economy')}</a><a href="${pg('opportunities',c,m?'&m='+m:'')}">${L('الفرص','Prospects')}</a></div>`;
const olink=(a,b)=>`<div><a href="${pg('opportunities',a,'&m='+b)}">${L('فرص التجارة بين البلدين','Trade prospects between them')}</a></div>`;
const tbl=(rows,hd)=>rows.length?'<table>'+(hd?'<tr>'+hd.map(h=>`<th>${h}</th>`).join('')+'</tr>':'')+rows.map(r=>'<tr>'+r.map(x=>`<td dir="auto">${x}</td>`).join('')+'</tr>').join('')+'</table>':' –';
const note=t=>`<small style="opacity:.75;display:block;margin-top:5px">${t}</small>`;
const W=k=>new RegExp('(?:^| )(?:و|ب|ل|ف|ك)?(?:ال|لل)?(?:'+k+')');
const WB=k=>new RegExp('(?:^| )(?:و|ب|ل|ف|ك)?(?:ال|لل)?(?:'+k+')s?(?: |$)');
const getJ=u=>fetch(u).then(r=>r.ok?r.json():null).catch(()=>null);
let FN=null,OP=null,FB=null,PD=null,SP=null;
const need=async(...k)=>{for(const x of k){if(x==='fin'&&!FN)FN=(await getJ('fin.json')||{c:{}}).c;if(x==='opp'&&!OP)OP=(await getJ('opp.json')||{c:{}}).c;if(x==='fdi'&&!FB){FB=await getJ('fdib.json')||{c:{},n:{}};XN=Object.assign(XN,FB.n||{});}if(x==='prod'&&!PD)PD=await getJ('prod.json')||{n:{},c:{}};if(x==='sup'&&!SP)SP=await getJ('sup.json')||{n:{},c:{}};}};
/* ---------- recognition ---------- */
let IDX=null,GIDX=null;
function index(){IDX=[];for(const c in D.c){const r=D.c[c];[r.a,r.e,...(r.al||[])].forEach(n=>{n=nz(n);if(n.length>1){IDX.push([n,c,0]);if(/^ال/.test(n)&&n.length>4)IDX.push([n.slice(2),c,1]);}});}IDX.sort((a,b)=>b[0].length-a[0].length);GIDX=(D.g||[]).map(g=>[WB(g[3]),g]);}
function countries(t){let s='  '+t+' ';const out=[];for(const [n,c,st] of IDX){let from=0,i;while((i=s.indexOf(n,from))>=0){from=i+1;if(s[i+n.length]!==' ')continue;const p3=s.slice(Math.max(0,i-4),i);const okB=st?/(^| )(ال|وال|بال|لل|فال|كال|ولل)$/.test(p3):(/ $/.test(p3)||/ [بلوفك]$/.test(p3)||/ (ول|وب)$/.test(p3));if(!okB)continue;if(!out.some(o=>o[1]===c))out.push([i,c]);s=s.slice(0,i)+' '.repeat(n.length)+s.slice(i+n.length);break;}}
 return {cs:out.sort((a,b)=>a[0]-b[0]).map(o=>o[1]),rest:s.replace(/\s+/g,' ').trim()};}
function group(t){if(/جنوب افريقيا|south africa/.test(t))t=t.replace(/جنوب افريقيا|south africa/g,' ');if(/saudi arabia|united arab|العربيه السعوديه|الامارات العربيه|عربيه متحده/.test(t))t=t.replace(/saudi arabia|united arab emirates|المملكه العربيه السعوديه|العربيه السعوديه|الامارات العربيه المتحده/g,' ');if(/امريكا الشماليه|امريكا الجنوبيه|امريكا اللاتينيه|north america|south america|latin america/.test(t)){}const g=GIDX.find(x=>x[0].test(t));return g?g[1]:null;}
const IND=[
 ['gpc','نصيب الفرد|دخل الفرد|per capita','NGDPDPC',['نصيب الفرد من الناتج','GDP per capita'],'usd1',0,'gpc'],
 ['xg','الصادرات الي الناتج|نسبه الصادرات|exports to gdp|exports as a share','EXPGDP',['صادرات السلع والخدمات (% من الناتج)','Exports of goods and services (% of GDP)'],'pg',0],
 ['mg','الواردات الي الناتج|نسبه الواردات|imports to gdp|imports as a share','IMPGDP',['واردات السلع والخدمات (% من الناتج)','Imports of goods and services (% of GDP)'],'pg',0],
 ['gdp','ناتج|حجم الاقتصاد|اكبر اقتصاد|اقتصاد|gdp|economy|economies','NGDPD',['الناتج المحلي الإجمالي','GDP'],'bn',1,'gdp'],
 ['gr','نمو|growth|fastest growing','NGDP_RPCH',['النمو الحقيقي','Real GDP growth'],'pc',0,'gr'],
 ['inf','تضخم|inflation','PCPIPCH',['التضخم','Inflation'],'pc',0,'inf'],
 ['debt','دين(?: |$)|دين عام|ديون|مديوني|debt','GGXWDG_NGDP',['الدين الحكومي (% من الناتج)','Government debt (% of GDP)'],'pg',0,'debt'],
 ['fb','ماليه عامه|موازنه|ميزانيه|عجز مالي|fiscal|budget','GGXCNL_NGDP',['رصيد المالية العامة (% من الناتج)','Fiscal balance (% of GDP)'],'pcg',0,'fb'],
 ['ca','حساب جاري|current account','BCA_NGDPD',['الحساب الجاري (% من الناتج)','Current account (% of GDP)'],'pcg',0,'ca'],
 ['pop','سكان|population|populous','LP',['عدد السكان','Population'],'mn',1],
 ['resm','تغطيه الواردات|اشهر الواردات|import cover|months of imports','RESM',['تغطية الاحتياطيات للواردات (أشهر)','Reserve cover (months of imports)'],'n1',0],
 ['res','احتياطي|reserves','RES',['الاحتياطيات الدولية','International reserves'],'bn',1],
 ['m2','عرض النقد|سيوله|broad money|money supply','M2G',['نمو عرض النقد','Broad money growth'],'pc',0],
 ['lend','اقراض|فائده القروض|lending rate','LEND',['سعر فائدة الإقراض','Lending rate'],'rate',0],
 ['fdio','استثمار صادر|استثمارات صادره|fdi outflow|outward fdi|outward investment','FDIOUT',['تدفقات الاستثمار المباشر الصادرة','FDI outflows'],'bn',1],
 ['fdi','استثمار اجنبي|استثمار مباشر|استثمارات اجنبيه|استثمارات مباشره|fdi|foreign direct|foreign investment','FDIIN',['تدفقات الاستثمار الأجنبي المباشر الواردة','FDI inflows'],'bn',1],
 ['bal','ميزان|فائض|عجز تجاري|trade balance|balance|surplus|deficit','@b',['الميزان التجاري','Trade balance'],'usdm',1],
 ['exp','صادر|تصدير|مصدر|export','@x',['الصادرات','Exports'],'usdm',1],
 ['imp','وارد|استيراد|مستورد|import','@m',['الواردات','Imports'],'usdm',1],
 ['tot','تبادل|حجم التجاره|تجاره خارجيه|تجاره|total trade|foreign trade|trade','@t',['حجم التبادل التجاري','Total trade'],'usdm',1],
 ['pol','فائده|interest|policy rate','#pol',['سعر الفائدة الرئيسي','Policy rate'],'rate',0],
 ['risk','مخاطر|risk|هل استثمر|امن للاستثمار|امان|safe|safest|riskiest','#risk',['درجة مخاطر الاستثمار (من 100)','Investment risk score (out of 100)'],'n0',0],
 ['rat','تصنيف|rating|ستاندرد','#rt',['التصنيف الائتماني (S&P)','Credit rating (S&P)'],'txt',0],
 ['fx','سعر الصرف|صرف|عمله|exchange rate|currency','#fx',['سعر الصرف','Exchange rate'],'txt',0]
].map(r=>[r[0],W(r[1]),r[2],r[3],r[4],r[5],r[6]]);
const fmt=(v,f)=>v==null?'–':f==='bn'?bn(v):f==='pc'||f==='pcg'?pc(v):f==='pg'?num(v)+'%':f==='usd1'?'$'+num(v,0):f==='mn'?num(v,2)+L(' مليون',' million'):f==='usdm'?usd(v):f==='rate'?num(v,2)+'%':f==='n0'?num(v,0):f==='n1'?num(v,1):String(v);
const lastY=(s,max)=>{const ks=Object.keys(s||{}).filter(y=>s[y]!=null&&(!max||+y<=max)).sort();return ks.length?ks[ks.length-1]:null;};
/* value of indicator for country (year optional) -> [value, year] */
function val(c,ind,year){const r=D.c[c],src=ind[2];if(!r)return [null,null];
 if(src[0]==='@'){const y=year||r.y,t=r.ty&&r.ty[y]?r.ty[y]:(String(y)===String(r.y)?[r.x,r.m]:null);if(!t)return [null,y];return [src==='@x'?t[0]:src==='@m'?t[1]:src==='@b'?t[0]-t[1]:t[0]+t[1],y];}
 if(src==='#pol')return [r.pol,''];if(src==='#risk')return [r.risk,''];if(src==='#rt')return [r.rt&&r.rt!=='–'?r.rt:null,''];if(src==='#fx')return [r.fx?r.fx[1]:null,''];
 const s=FN&&FN[c]?FN[c][src]:null;if(!s)return [null,year];const y=year||lastY(s,2025);return [y?s[y]:null,y];}
const PRD=[['قمح|wheat','1001','10','القمح','wheat'],['ارز|رز|rice','1006','10','الأرز','rice'],['ذره|maize|corn','1005','10','الذرة','maize'],['سكر|sugar','1701','17','السكر','sugar'],['زيت النخيل|زيت نخيل|palm oil','1511','15','زيت النخيل','palm oil'],['دواجن|دجاج|poultry|chicken','0207','02','لحوم الدواجن','poultry meat'],['لحوم الابقار|لحوم ابقار|لحم بقري|لحم البقر|beef','0202','02','لحوم الأبقار المجمدة','frozen beef'],['حليب|البان|milk|dairy','0402','04','الحليب المجفف والمركّز','milk powder and concentrated milk'],['فول الصويا|صويا|soybeans|soybean|soya','1201','12','فول الصويا','soybeans'],['النفط الخام|نفط خام|نفط|بترول|crude oil|crude|oil','2709','27','النفط الخام','crude oil'],['مشتقات نفطيه|مشتقات|وقود|بنزين|ديزل|refined petroleum|fuel|petrol|diesel|gasoline','2710','27','المشتقات النفطية','refined petroleum products'],['غاز|gas|lng','2711','27','الغاز','petroleum gas'],['ادويه|دواء|medicines|medicine|pharmaceuticals|drugs','3004','30','الأدوية','medicines'],['سيارات|سياره|cars|car|vehicles','8703','87','السيارات','cars'],['هواتف|هاتف|جوالات|phones|smartphones|mobile phones','8517','85','الهواتف وأجهزة الاتصال','phones and telecom equipment'],['ذهب|gold','7108','71','الذهب','gold'],['اسمده|سماد|fertilizers|fertilisers|fertilizer|fertiliser','3102','31','الأسمدة النيتروجينية','nitrogen fertilisers'],['المنيوم|aluminium|aluminum','7601','76','الألمنيوم الخام','unwrought aluminium'],
['لحوم|لحم|meat','','02','اللحوم','meat'],['حبوب|cereals|grains|grain','','10','الحبوب','cereals'],['حديد|صلب|steel|iron','','72','الحديد والصلب','iron and steel'],['بلاستيك|لدائن|plastics|plastic','','39','البلاستيك','plastics'],['الات|معدات|machinery|machines','','84','الآلات والمعدات','machinery'],['الكترونيات|اجهزه كهربائيه|electronics|electrical','','85','الأجهزة الكهربائية والإلكترونيات','electrical equipment and electronics'],['ملابس|clothing|apparel|clothes','','61','الملابس','clothing'],['اثاث|furniture','','94','الأثاث','furniture'],['كيماويات|chemicals','','29','الكيماويات العضوية','organic chemicals'],['اسماك|سمك|fish|seafood','','03','الأسماك','fish'],['فواكه|فاكهه|تمور|fruits|fruit|dates','','08','الفواكه','fruit'],['خضروات|خضار|vegetables','','07','الخضروات','vegetables'],['نحاس|copper','','74','النحاس','copper'],['طائرات|aircraft|planes','','88','الطائرات','aircraft'],['عطور|تجميل|perfumes|cosmetics','','33','العطور ومستحضرات التجميل','perfumes and cosmetics'],['زيوت نباتيه|زيت|vegetable oils|vegetable oil','','15','الزيوت النباتية','vegetable oils'],['قهوه|شاي|توابل|بهارات|coffee|tea|spices','','09','القهوة والشاي والتوابل','coffee, tea and spices'],['اسمنت|ملح|cement|salt','','25','الأسمنت والملح والأحجار','cement, salt and stone'],['خشب|اخشاب|wood|timber','','44','الخشب','wood'],['ورق|paper','','48','الورق','paper'],['قطن|cotton','','52','القطن','cotton'],['احذيه|footwear|shoes','','64','الأحذية','footwear'],['مطاط|اطارات|rubber|tyres|tires','','40','المطاط','rubber'],['سفن|ships','','89','السفن','ships'],['اجهزه طبيه|medical devices','','90','الأجهزة الطبية والبصرية','medical and optical instruments'],['العاب|toys','','95','الألعاب','toys'],['تبغ|سجائر|tobacco|cigarettes','','24','التبغ','tobacco']].map(p=>[WB(p[0]),p[1],p[2],p[3],p[4]]);
const product=t=>PRD.find(p=>p[0].test(t));
/* ---------- answers ---------- */
const na=c=>L(`هذا المؤشر غير متوفر ${la(c)} في المنصة.`,`This indicator is not available for ${nm(c)} in the portal.`);
const sumC=(c,r)=>`<b>${nm(c)}</b>`+tbl([[L('الناتج المحلي','GDP')+' '+(r.gy||2025),bn(r.gdp)],[L('النمو 2025','Growth 2025'),pc(r.gr)],[L('التضخم 2025','Inflation 2025'),pc(r.inf)],[L('الصادرات','Exports')+' '+r.y,usd(r.x)],[L('الواردات','Imports')+' '+r.y,usd(r.m)],[L('التصنيف (S&P)','Rating (S&P)'),r.rt||'–'],[L('مخاطر الاستثمار','Investment risk'),r.risk+'/100 · '+rl(r.risk)]]);
function one(c,ind,year){const r=D.c[c],[v,y]=val(c,ind,year),lb=EN?ind[3][1]:ind[3][0],k=ind[0];
 if(k==='risk')return L(`تقييم مخاطر الاستثمار في ${nm(c)}: <b>${r.risk}/100</b> – مخاطر <b>${rl(r.risk)}</b>. (كلما ارتفع الرقم انخفضت المخاطر.)`,`Investment risk score for ${nm(c)}: <b>${r.risk}/100</b> – <b>${rl(r.risk)}</b> risk. (A higher score means lower risk.)`);
 if(k==='rat')return L(`التصنيف الائتماني ${la(c)} (S&P): <b dir="ltr">${v||'غير مصنفة'}</b>.`,`${nm(c)} credit rating (S&P): <b>${v||'not rated'}</b>.`);
 if(k==='fx')return r.fx?L(`عملة ${nm(c)}: <b>${r.fx[0]}</b>، ومتوسط سعر الصرف <b>${num(r.fx[1],3)}</b> لكل دولار أمريكي.`,`${nm(c)} currency: <b>${r.fx[0]}</b>; average exchange rate <b>${num(r.fx[1],3)}</b> per US dollar.`):L(`تُعرض بيانات ${nm(c)} بالدولار الأمريكي؛ لا يتوفر سعر صرف في المنصة.`,`${nm(c)} figures are shown in US dollars; no exchange rate is available in the portal.`);
 if(v==null)return year?L(`لا تتوفر بيانات «${lb}» ${la(c)} لسنة ${year}.`,`No ${lb} data for ${nm(c)} in ${year}.`):na(c);
 let s=L(`${lb} – ${nm(c)}${y?' ('+y+')':''}: <b>${fmt(v,ind[4])}</b>`,`${lb} – ${nm(c)}${y?' ('+y+')':''}: <b>${fmt(v,ind[4])}</b>`);
 if(k==='bal')s+=L(` (${v>=0?'فائض':'عجز'})`,` (${v>=0?'surplus':'deficit'})`);
 if(k==='gr'&&!year&&r.gr26!=null)s+=L(`، وتقدير 2026 <b>${pc(r.gr26)}</b>`,`; 2026 estimate <b>${pc(r.gr26)}</b>`);
 if(String(y)==='2026'&&ind[2][0]!=='@')s+=L(' (تقدير)',' (estimate)');
 return s+'.';}
function trend(c,ind){const lb=EN?ind[3][1]:ind[3][0],src=ind[2];let ys=[];if(src[0]==='@')ys=Object.keys(D.c[c].ty||{}).sort();else if(src[0]==='#')return one(c,ind);else ys=Object.keys((FN[c]||{})[src]||{}).filter(y=>FN[c][src][y]!=null).sort();
 if(!ys.length)return na(c);return L(`${lb} – ${nm(c)}:`,`${lb} – ${nm(c)}:`)+tbl(ys.map(y=>[y+(y==='2026'&&src[0]!=='@'?L(' (تقدير)',' (est.)'):''),fmt(val(c,ind,y)[0],ind[4])]));}
function rank(ind,set,gname,asc,n,year,focus){const lb=EN?ind[3][1]:ind[3][0];if(ind[0]==='rat'||ind[0]==='fx')return L('هذا المؤشر لا يصلح للترتيب.','This indicator cannot be ranked.');
 let rows=set.map(c=>[c,...val(c,ind,year)]).filter(r=>r[1]!=null&&isFinite(r[1]));if(!rows.length)return L('لا تتوفر بيانات كافية لهذا الترتيب.','Not enough data for this ranking.');
 rows.sort((a,b)=>asc?a[1]-b[1]:b[1]-a[1]);const yr=year||(ind[2][0]==='@'?L('أحدث سنة','latest year'):ind[2][0]==='#'?'':'2025');
 const ttl=`${lb}${gname?' – '+gname:''}${yr?' ('+yr+')':''}`;
 if(focus){const i=rows.findIndex(r=>r[0]===focus);if(i<0)return na(focus);return L(`ترتيب ${nm(focus)} في «${ttl}»: <b>${i+1}</b> من ${rows.length} (${fmt(rows[i][1],ind[4])}).`,`${nm(focus)} ranks <b>${i+1}</b> of ${rows.length} for ${ttl} (${fmt(rows[i][1],ind[4])}).`)+tbl(rows.slice(Math.max(0,i-2),i+3).map(r=>[(rows.indexOf(r)+1)+'. '+nm(r[0]),fmt(r[1],ind[4])]));}
 let s=L(`${asc?'الأدنى':'الأعلى'} – ${ttl}:`,`${asc?'Lowest':'Highest'} – ${ttl}:`)+tbl(rows.slice(0,n).map((r,i)=>[(i+1)+'. '+nm(r[0]),fmt(r[1],ind[4])]));
 if(gname&&ind[5]&&ind[0]!=='bal'){const tot=rows.reduce((a,r)=>a+r[1],0);s+=note(L(`مجموع ${rows.length} دولة: ${fmt(tot,ind[4])}`,`Total for ${rows.length} countries: ${fmt(tot,ind[4])}`));}
 return s;}
function cmp(a,b){const A=D.c[a],B=D.c[b];const R=[[L('الناتج المحلي','GDP'),bn(A.gdp),bn(B.gdp)],[L('النمو 2025','Growth 2025'),pc(A.gr),pc(B.gr)],[L('التضخم','Inflation'),pc(A.inf),pc(B.inf)],[L('الدين/الناتج','Debt/GDP'),num(A.debt)+'%',num(B.debt)+'%'],[L('الصادرات','Exports'),usd(A.x),usd(B.x)],[L('الواردات','Imports'),usd(A.m),usd(B.m)],[L('التصنيف','Rating'),A.rt||'–',B.rt||'–'],[L('المخاطر','Risk score'),A.risk+' · '+rl(A.risk),B.risk+' · '+rl(B.risk)]];
 return tbl(R,['',nm(a),nm(b)])+olink(a,b);}
function cmpInd(cs,ind,year){const lb=EN?ind[3][1]:ind[3][0];return lb+':'+tbl(cs.map(c=>{const [v,y]=val(c,ind,year);return [nm(c)+(y?' ('+y+')':''),fmt(v,ind[4])];}));}
const bilv=(a,b)=>{const A=OP[a],B=OP[b];let x=0,m=0,y='';if(A&&A.p&&A.p[b]){x=A.p[b][0];m=A.p[b][1];y=A.ly||A.y[A.y.length-1];}if(B&&B.p&&B.p[a]){if(B.p[a][1]>x)x=B.p[a][1];if(!m)m=B.p[a][0];if(!y)y=B.ly||B.y[B.y.length-1];}return [x,m,y];};
function bil(a,b){const [x,m,y]=bilv(a,b);
 if(!x&&!m)return L(`لا تتوفر بيانات عن التجارة المباشرة بين ${nm(a)} و${nm(b)}.`,`No data on direct trade between ${nm(a)} and ${nm(b)}.`)+olink(a,b);
 return L(`التجارة بين ${nm(a)} و${nm(b)} (${y}):`,`Trade between ${nm(a)} and ${nm(b)} (${y}):`)+tbl([[L(`صادرات ${nm(a)} إلى ${nm(b)}`,`${nm(a)} exports to ${nm(b)}`),usd(x)],[L(`واردات ${nm(a)} من ${nm(b)}`,`${nm(a)} imports from ${nm(b)}`),usd(m)],[L('حجم التبادل','Total trade'),usd(x+m)],[L('الميزان','Balance'),usd(Math.abs(x-m))+' · '+L('لصالح ','in favour of ')+nm(x>=m?a:b)]])+olink(a,b);}
function opps(a,b){const A=OP[a],B=OP[b];if(!A||!B||!A.ch||!B.ch)return L('لا تتوفر بيانات كافية لتقدير الفرص بين البلدين.','Not enough data to assess prospects between the two.')+olink(a,b);
 const na_=A.y.length,nb=B.y.length,ax={},bm={};let AX=0,BM=0;for(const k in A.ch){if(+k>=98)continue;const v=A.ch[k].slice(0,na_).reduce((s,x)=>s+(x||0),0)/na_;ax[k]=v;AX+=v;}for(const k in B.ch){if(+k>=98)continue;const v=B.ch[k].slice(nb).reduce((s,x)=>s+(x||0),0)/nb;bm[k]=v;BM+=v;}
 if(!AX||!BM)return L('لا تتوفر بيانات كافية لتقدير الفرص بين البلدين.','Not enough data to assess prospects between the two.')+olink(a,b);
 let d=0;new Set([...Object.keys(ax),...Object.keys(bm)]).forEach(k=>{d+=Math.abs((bm[k]||0)/BM-(ax[k]||0)/AX);});const tci=Math.round(100*(1-d/2)),lv=tci>=40?L('عالٍ','high'):tci>=25?L('متوسط','medium'):L('منخفض','low');
 const top=Object.keys(ax).filter(k=>bm[k]).map(k=>[k,Math.min(ax[k],bm[k])]).sort((p,q)=>q[1]-p[1]).slice(0,5);
 return L(`فرص صادرات ${nm(a)} إلى ${nm(b)} – مؤشر التكامل التجاري <b>${tci}</b> (${lv}). أكبر السلع التي تصدّرها ${nm(a)} وتستوردها ${nm(b)}:`,`Export prospects for ${nm(a)} in ${nm(b)} – trade complementarity index <b>${tci}</b> (${lv}). Largest products that ${nm(a)} exports and ${nm(b)} imports:`)+tbl(top.map(([k,v])=>[hs(k),usd(v)]))+note(L('القيمة = الأقل بين صادرات الأولى وواردات الثانية من السلعة (متوسط سنوي).','Value = the smaller of the first country\'s exports and the second\'s imports of the product (annual average).'))+olink(a,b);}
function chTrade(c,pr,exp){const o=OP[c];if(!o||!o.ch||!o.ch[pr[2]])return L(`لا تتوفر بيانات ${EN?pr[4]:pr[3]} ${la(c)}.`,`No ${pr[4]} data for ${nm(c)}.`)+links(c);const n=o.y.length,a=o.ch[pr[2]],v=exp?a[n-1]:a[2*n-1],y=o.y[n-1],tot=exp?o.t[0]:o.t[1];
 return L(`${exp?'صادرات':'واردات'} ${nm(c)} من ${hs(pr[2])} (${y}): <b>${usd(v)}</b>${tot&&String(y)===String(o.ly||y)?'، أي '+num(v/tot*100)+'% من إجمالي '+(exp?'الصادرات':'الواردات'):''}.`,`${nm(c)} ${exp?'exports':'imports'} of ${hs(pr[2])} (${y}): <b>${usd(v)}</b>${tot&&String(y)===String(o.ly||y)?', '+num(v/tot*100)+'% of total '+(exp?'exports':'imports'):''}.`)+(pr[1]?note(L(`الرقم لمجموعة «${hs(pr[2])}» كاملة، وليس ${pr[3]} وحده.`,`The figure is for the whole "${hs(pr[2])}" group, not ${pr[4]} alone.`)):'')+links(c);}
function chRank(pr,exp,set,gname,n){const rows=set.map(c=>{const o=OP[c];if(!o||!o.ch||!o.ch[pr[2]])return null;const k=o.y.length;return [c,exp?o.ch[pr[2]][k-1]:o.ch[pr[2]][2*k-1]];}).filter(r=>r&&r[1]>0).sort((a,b)=>b[1]-a[1]);
 if(!rows.length)return L('لا تتوفر بيانات لهذا الترتيب.','No data for this ranking.');
 return L(`أكبر ${exp?'مصدّري':'مستوردي'} ${hs(pr[2])}${gname?' – '+gname:''} (أحدث سنة):`,`Largest ${exp?'exporters':'importers'} of ${hs(pr[2])}${gname?' – '+gname:''} (latest year):`)+tbl(rows.slice(0,n).map((r,i)=>[(i+1)+'. '+nm(r[0]),usd(r[1])]))+(pr[1]?note(L(`الترتيب لمجموعة «${hs(pr[2])}» كاملة، ضمن دول المنصة.`,`Ranking is for the whole "${hs(pr[2])}" group, among the portal's countries.`)):note(L('ضمن دول المنصة.','Among the portal\'s countries.')));}
async function suppliers(c,pr){await need('prod');const pn=EN?pr[4]:pr[3],to=L(' إلى '+nm(c),' to '+nm(c));
 const row=(nmap,ps,t,div)=>tbl(ps.map(([m,v])=>[nmap[m]?(EN?nmap[m][1]:nmap[m][0]):m,usd(v/div),t?num(v/t*100,0)+'%':'']));
 const e=pr[1]&&PD.c[c]&&PD.c[c][pr[1]];
 if(e){const [mode,t,ps]=e;if(!t||!ps.length)return L(`لا تُظهر بيانات 2024 واردات تُذكر من ${pn}${to}.`,`2024 data show no significant imports of ${pn}${to}.`)+links(c);
  return L(`أهم موردي ${pn}${to} (2024) – إجمالي الواردات <b>${usd(t/1000)}</b>:`,`Main suppliers of ${pn}${to} (2024) – total imports <b>${usd(t/1000)}</b>:`)+row(PD.n,ps,t,1000)+(mode==='m'?note(L('بحسب ما أعلنته الدول المصدّرة، لأن الدولة لم تنشر بيانات 2024. لا تشمل المصدّرين الذين لا ينشرون بياناتهم، مثل روسيا.','Based on what exporting countries reported, because this country has not published 2024 data. Exporters that do not publish data, such as Russia, are not included.')):'')+links(c);}
 await need('sup');const g=SP.c[c]&&SP.c[c][pr[2]];
 if(g&&g.p&&g.p.length){const cn=hs(pr[2]);return (pr[1]?L(`لا تتوفر بعد بيانات تفصيلية عن ${pn}${to}. هذه بيانات المجموعة كاملة (${cn})، ${g.y}:`,`Product-level data for ${pn}${to} are not available yet. These are the figures for the whole group (${cn}), ${g.y}:`):L(`أهم موردي ${cn}${to} (${g.y}) – إجمالي الواردات <b>${usd(g.t)}</b>:`,`Main suppliers of ${cn}${to} (${g.y}) – total imports <b>${usd(g.t)}</b>:`))+row(SP.n,g.p,g.t,1)+links(c);}
 await need('opp');if(OP[c]&&OP[c].ch&&OP[c].ch[pr[2]])return chTrade(c,pr,false).replace(/<div>.*$/,'')+note(L('تفاصيل المورّدين لهذه السلعة غير متوفرة بعد.','Supplier details for this product are not available yet.'))+links(c);
 return L(`بيانات موردي ${pn}${to} غير متوفرة بعد في المنصة.`,`Supplier data for ${pn}${to} are not yet available in the portal.`)+links(c);}
function fdiList(c,dir){const e=FB.c[c]&&FB.c[c][dir];if(!e||!e.p||!e.p.length)return L(`لا تتوفر بيانات أرصدة الاستثمار المباشر ${la(c)}.`,`No direct-investment position data for ${nm(c)}.`)+links(c);
 return (dir==='i'?L(`أكبر المستثمرين في ${nm(c)} (رصيد الاستثمار المباشر، ${e.y}) – الإجمالي <b>${usd(e.T)}</b>:`,`Largest investors in ${nm(c)} (direct-investment position, ${e.y}) – total <b>${usd(e.T)}</b>:`):L(`أكبر وجهات استثمارات ${nm(c)} في الخارج (رصيد الاستثمار المباشر، ${e.y}) – الإجمالي <b>${usd(e.T)}</b>:`,`Largest destinations of ${nm(c)}'s investment abroad (direct-investment position, ${e.y}) – total <b>${usd(e.T)}</b>:`))+tbl(e.p.filter(p=>!['IL','PS','LY','SD','YE','DJ','BY'].includes(p[0])).slice(0,7).map(p=>[nm(p[0]),usd(p[1])+(p[2]?' ('+p[2]+')':'')]))+`<div><a href="${pg('finance',c)}">${L('صفحة الاقتصاد والمالية','Economy & Finance page')}</a></div>`;}
function fdiPair(a,b){const f=(x,y)=>{const US=FB.us;if(US){if(x==='US'&&US.o&&US.o[y]!=null)return [US.o[y],US.y||2025];if(y==='US'&&US.i&&US.i[x]!=null)return [US.i[x],US.y||2025];}const o=FB.c[x]&&FB.c[x].o&&FB.c[x].o.p.find(p=>p[0]===y);if(o)return [o[1],o[2]||FB.c[x].o.y];const i=FB.c[y]&&FB.c[y].i&&FB.c[y].i.p.find(p=>p[0]===x);return i?[i[1],i[2]||FB.c[y].i.y]:null;};const ab=f(a,b),ba=f(b,a);
 if(!ab&&!ba)return L(`لا تُظهر البيانات استثمارات مباشرة مسجّلة بين ${nm(a)} و${nm(b)}.`,`The data show no recorded direct investment between ${nm(a)} and ${nm(b)}.`);
 return L('رصيد الاستثمار المباشر بين البلدين:','Direct-investment positions between the two:')+tbl([[L(`استثمارات ${nm(a)} في ${nm(b)}`,`${nm(a)}'s investment in ${nm(b)}`),ab?usd(ab[0])+' ('+ab[1]+')':'–'],[L(`استثمارات ${nm(b)} في ${nm(a)}`,`${nm(b)}'s investment in ${nm(a)}`),ba?usd(ba[0])+' ('+ba[1]+')':'–']]);}
/* ---------- analysis ---------- */
const AN=/(^| )(و|ب|ل)?(ال)?(حلل|تحليل|تحليلا|تقييم|نقاط|لماذا|سبب|اسباب|توقعات|نظره|وضع|بالتفصيل|تفصيل|مفصل|مفصله|شامل|شامله|معمق|تقرير|تنصح|انصح)|هل استثمر|هل نستثمر|analy|assess|evaluat|strength|weakness|swot|(^| )why( |$)|outlook|overview|in depth|detailed|deep dive|report|should i invest|should we invest|explain/;
const H=t=>`<b style="color:#D4B85A;display:block;margin-top:7px">${t}</b>`;
const UL=a=>a.filter(Boolean).map(x=>'• '+x).join('<br>');
const pp=v=>(v>0?'+':'')+num(v)+L(' نقطة مئوية',' pp');
const rankOf=(c,f)=>{const v=Object.keys(D.c).map(k=>[k,f(D.c[k])]).filter(x=>x[1]!=null&&isFinite(x[1])).sort((a,b)=>b[1]-a[1]);const i=v.findIndex(x=>x[0]===c);return i<0?null:[i+1,v.length];};
const IG=['AAA','AA+','AA','AA-','A+','A','A-','BBB+','BBB','BBB-'];
const PIL=[['الاستقرار الاقتصادي (النمو والتضخم)','Macroeconomic stability (growth, inflation)',20],['الملاءة المالية (العجز والدين)','Fiscal strength (deficit, debt)',20],['المتانة الخارجية (الحساب الجاري والاحتياطيات)','External resilience (current account, reserves)',20],['الجدارة الائتمانية (التصنيف السيادي)','Creditworthiness (sovereign rating)',30],['جاذبية الاستثمار (تدفقات الاستثمار المباشر)','Investment appeal (FDI inflows)',10]];
const verdict=s=>s==null?'':s>=68?L('بيئة استثمارية مواتية.','A favourable investment environment.'):s>=55?L('مناسبة لاستثمار انتقائي مع متابعة.','Suitable for selective investment with monitoring.'):s>=40?L('تتطلب ضمانات وأدوات حماية قبل الاستثمار.','Calls for guarantees and risk protection before investing.'):L('يُنصح بالتريث أو الاقتصار على التجارة المضمونة.','Caution is advised; limit exposure to secured trade.');
const DISC=()=>note(L('تحليل آلي محسوب من مؤشرات المنصة، وليس توصية استثمارية. البيانات تبيّن ما حدث ولا تفسّر أسبابه.','Automated analysis computed from the portal\'s indicators, not investment advice. The data show what happened, not why.'));
function sw(c){const r=D.c[c],S=[],Wk=[];const ig=IG.includes(r.rt);
 if(r.gr!=null){if(r.gr>=4)S.push(L(`نمو قوي (${pc(r.gr)})`,`Strong growth (${pc(r.gr)})`));else if(r.gr<1.5)Wk.push(L(`نمو ضعيف (${pc(r.gr)})`,`Weak growth (${pc(r.gr)})`));}
 if(r.inf!=null){if(r.inf>=0&&r.inf<=4)S.push(L(`تضخم منخفض (${pc(r.inf)})`,`Low inflation (${pc(r.inf)})`));else if(r.inf>10)Wk.push(L(`تضخم مرتفع (${pc(r.inf)})`,`High inflation (${pc(r.inf)})`));else if(r.inf<0)Wk.push(L(`انكماش في الأسعار (${pc(r.inf)})`,`Falling prices (${pc(r.inf)})`));}
 if(r.fb!=null){if(r.fb>=0)S.push(L(`فائض في المالية العامة (${pc(r.fb)} من الناتج)`,`Fiscal surplus (${pc(r.fb)} of GDP)`));else if(r.fb<-5)Wk.push(L(`عجز مالي واسع (${pc(r.fb)} من الناتج)`,`Wide fiscal deficit (${pc(r.fb)} of GDP)`));}
 if(r.debt!=null){if(r.debt<40)S.push(L(`دين حكومي منخفض (${num(r.debt)}% من الناتج)`,`Low government debt (${num(r.debt)}% of GDP)`));else if(r.debt>90)Wk.push(L(`دين حكومي مرتفع (${num(r.debt)}% من الناتج)`,`High government debt (${num(r.debt)}% of GDP)`));}
 if(r.ca!=null){if(r.ca>2)S.push(L(`فائض في الحساب الجاري (${pc(r.ca)})`,`Current-account surplus (${pc(r.ca)})`));else if(r.ca<-4)Wk.push(L(`عجز في الحساب الجاري (${pc(r.ca)})`,`Current-account deficit (${pc(r.ca)})`));}
 if(r.rm!=null){if(r.rm>=6)S.push(L(`احتياطيات تغطي ${num(r.rm)} شهراً من الواردات`,`Reserves cover ${num(r.rm)} months of imports`));else if(r.rm<3)Wk.push(L(`احتياطيات محدودة (${num(r.rm)} شهراً من الواردات)`,`Thin reserves (${num(r.rm)} months of imports)`));}
 if(ig)S.push(L(`تصنيف بدرجة استثمارية (${r.rt})`,`Investment-grade rating (${r.rt})`));else if(r.rt&&r.rt!=='–')Wk.push(L(`تصنيف دون الدرجة الاستثمارية (${r.rt})`,`Rating below investment grade (${r.rt})`));else Wk.push(L('غير مصنفة من S&P','Not rated by S&P'));
 if(r.fdig!=null&&r.fdig>=3)S.push(L(`تدفقات استثمار أجنبي قوية (${num(r.fdig)}% من الناتج)`,`Strong FDI inflows (${num(r.fdig)}% of GDP)`));
 if(r.ex&&r.x){const sh=r.ex[0][1]/r.x*100;if(sh>50)Wk.push(L(`اعتماد الصادرات على «${hs(r.ex[0][0])}» (${num(sh,0)}%)`,`Exports rely on "${hs(r.ex[0][0])}" (${num(sh,0)}%)`));}
 return [S,Wk];}
function econA(c){const r=D.c[c],rg=rankOf(c,x=>x.gdp),rp=rankOf(c,x=>x.gpc?x.gpc[1]:null),[S,Wk]=sw(c);
 const o=[`<b>${L('تحليل اقتصادي – ','Economic analysis – ')+nm(c)}</b>`];
 o.push(H(L('الحجم','Size'))+UL([r.gdp!=null&&L(`الناتج المحلي ${bn(r.gdp)} (${r.gy||2025})${rg?' – المرتبة '+rg[0]+' من '+rg[1]:''}`,`GDP ${bn(r.gdp)} (${r.gy||2025})${rg?' – ranked '+rg[0]+' of '+rg[1]:''}`),r.gpc&&L(`نصيب الفرد ${num(r.gpc[1],0)} دولار${rp?' – المرتبة '+rp[0]:''}`,`GDP per capita $${num(r.gpc[1],0)}${rp?' – ranked '+rp[0]:''}`),r.pop&&L(`السكان ${num(r.pop[1],1)} مليون`,`Population ${num(r.pop[1],1)} million`)]));
 const g=[];if(r.gr!=null){g.push(L(`النمو ${pc(r.gr)} في 2025`,`Growth ${pc(r.gr)} in 2025`)+(r.g5!=null?L(`، ${r.gr>=r.g5?'أعلى':'أقل'} من متوسط 2020–2024 (${pc(r.g5)})`,`, ${r.gr>=r.g5?'above':'below'} the 2020–2024 average (${pc(r.g5)})`):''));if(r.gr26!=null)g.push(L(`تقدير 2026: ${pc(r.gr26)} – ${r.gr26>r.gr+0.3?'تسارع متوقع':r.gr26<r.gr-0.3?'تباطؤ متوقع':'استقرار متوقع'}`,`2026 estimate: ${pc(r.gr26)} – ${r.gr26>r.gr+0.3?'expected to accelerate':r.gr26<r.gr-0.3?'expected to slow':'expected to hold steady'}`));}
 if(r.inf!=null)g.push(L(`التضخم ${pc(r.inf)}`,`Inflation ${pc(r.inf)}`)+(r.i24!=null?L(` (${r.inf<r.i24?'انخفض':'ارتفع'} من ${pc(r.i24)} في 2024)`,` (${r.inf<r.i24?'down':'up'} from ${pc(r.i24)} in 2024)`):''));
 o.push(H(L('النمو والأسعار','Growth and prices'))+UL(g));
 o.push(H(L('المالية العامة والقطاع الخارجي','Public finances and external position'))+UL([r.fb!=null&&L(`رصيد المالية العامة ${pc(r.fb)} من الناتج`,`Fiscal balance ${pc(r.fb)} of GDP`),r.debt!=null&&L(`الدين الحكومي ${num(r.debt)}% من الناتج`,`Government debt ${num(r.debt)}% of GDP`)+(r.d19!=null?L(` (${pp(r.debt-r.d19)} منذ 2019)`,` (${pp(r.debt-r.d19)} since 2019)`):''),r.ca!=null&&L(`الحساب الجاري ${pc(r.ca)} من الناتج`,`Current account ${pc(r.ca)} of GDP`),r.res&&L(`الاحتياطيات ${bn(r.res[1])}${r.rm!=null?' – تغطي '+num(r.rm)+' شهراً من الواردات':''}`,`Reserves ${bn(r.res[1])}${r.rm!=null?' – '+num(r.rm)+' months of imports':''}`)]));
 if(S.length)o.push(H(L('نقاط القوة','Strengths'))+UL(S));if(Wk.length)o.push(H(L('نقاط تستدعي المتابعة','Points to watch'))+UL(Wk));
 o.push(H(L('الخلاصة','Bottom line'))+L(`درجة مخاطر الاستثمار ${r.risk}/100 (مخاطر ${rl(r.risk)}). `,`Investment risk score ${r.risk}/100 (${rl(r.risk)} risk). `)+verdict(r.risk));
 return o.join('')+DISC()+links(c);}
function investA(c){const r=D.c[c],o=[`<b>${L('تقييم الاستثمار – ','Investment assessment – ')+nm(c)}</b>`];
 o.push(L(`<br>درجة المخاطر <b>${r.risk}/100</b> – مخاطر <b>${rl(r.risk)}</b>. ${verdict(r.risk)}`,`<br>Risk score <b>${r.risk}/100</b> – <b>${rl(r.risk)}</b> risk. ${verdict(r.risk)}`));
 const rp=r.rp||[];o.push(H(L('مكوّنات الدرجة (من 100)','Score components (out of 100)'))+tbl(PIL.map((p,i)=>[EN?p[1]:p[0],rp[i]==null?'–':rp[i],p[2]+'%']),[L('المكوّن','Component'),L('الدرجة','Score'),L('الوزن','Weight')]));
 const ix=rp.map((v,i)=>[v,i]).filter(x=>x[0]!=null).sort((a,b)=>a[0]-b[0]);
 if(ix.length>1){const lo=ix[0],hi=ix[ix.length-1];o.push(UL([L(`أقوى مكوّن: ${PIL[hi[1]][0]} (${hi[0]})`,`Strongest: ${PIL[hi[1]][1]} (${hi[0]})`),L(`أضعف مكوّن: ${PIL[lo[1]][0]} (${lo[0]})`,`Weakest: ${PIL[lo[1]][1]} (${lo[0]})`)]));}
 const [S,Wk]=sw(c);if(S.length)o.push(H(L('ما يدعم الاستثمار','What supports investment'))+UL(S.slice(0,5)));if(Wk.length)o.push(H(L('ما يستدعي الحذر','What calls for caution'))+UL(Wk.slice(0,5)));
 const fl=[];if(r.fdi)fl.push(L(`تدفقات الاستثمار المباشر الواردة ${bn(r.fdi[1])} (${r.fdi[0]})`,`FDI inflows ${bn(r.fdi[1])} (${r.fdi[0]})`));const e=FB&&FB.c[c]&&FB.c[c].i;if(e&&e.p&&e.p.length)fl.push(L('أكبر المستثمرين: ','Largest investors: ')+e.p.slice(0,3).map(p=>nm(p[0])+' ('+usd(p[1])+')').join(L('، ',', ')));
 if(fl.length)o.push(H(L('الاستثمار الأجنبي','Foreign investment'))+UL(fl));
 return o.join('')+DISC()+links(c);}
function tradeA(c){const r=D.c[c],o=[`<b>${L('تحليل التجارة الخارجية – ','Foreign trade analysis – ')+nm(c)}</b>`],ys=Object.keys(r.ty||{}).sort(),bal=r.x-r.m;
 const a=[L(`الصادرات ${usd(r.x)} والواردات ${usd(r.m)} (${r.y})`,`Exports ${usd(r.x)}, imports ${usd(r.m)} (${r.y})`),L(`الميزان التجاري: ${bal>=0?'فائض':'عجز'} ${usd(Math.abs(bal))}`,`Trade balance: ${bal>=0?'surplus':'deficit'} of ${usd(Math.abs(bal))}`)];
 if(r.gdp)a.push(L(`الانفتاح التجاري: التبادل يعادل ${num((r.x+r.m)/1000/r.gdp*100,0)}% من الناتج`,`Trade openness: total trade equals ${num((r.x+r.m)/1000/r.gdp*100,0)}% of GDP`));
 o.push(H(L('الصورة العامة','Overview'))+UL(a));
 if(ys.length>=4){const y0=ys[0],y1=ys[ys.length-1],n=+y1-+y0,t0=r.ty[y0],t1=r.ty[y1],cg=(p,q)=>p>0&&q>0?(Math.pow(q/p,1/n)-1)*100:null,cx=cg(t0[0],t1[0]),cm=cg(t0[1],t1[1]);const b0=t0[0]-t0[1],b1=t1[0]-t1[1];
  o.push(H(L(`الاتجاه ${y0}–${y1}`,`Trend ${y0}–${y1}`))+UL([cx!=null&&L(`الصادرات: من ${usd(t0[0])} إلى ${usd(t1[0])} (${pc(cx)} سنوياً في المتوسط)`,`Exports: from ${usd(t0[0])} to ${usd(t1[0])} (${pc(cx)} a year on average)`),cm!=null&&L(`الواردات: من ${usd(t0[1])} إلى ${usd(t1[1])} (${pc(cm)} سنوياً في المتوسط)`,`Imports: from ${usd(t0[1])} to ${usd(t1[1])} (${pc(cm)} a year on average)`),L(`الميزان: ${b1>b0?'تحسّن':'تراجع'} من ${b0>=0?'فائض':'عجز'} ${usd(Math.abs(b0))} إلى ${b1>=0?'فائض':'عجز'} ${usd(Math.abs(b1))}`,`Balance: ${b1>b0?'improved':'weakened'} from a ${b0>=0?'surplus':'deficit'} of ${usd(Math.abs(b0))} to a ${b1>=0?'surplus':'deficit'} of ${usd(Math.abs(b1))}`)]));}
 if(r.h1){const h=r.h1,gq=(p,q)=>q?pc((p/q-1)*100):'–';o.push(H(h.lb[EN?1:0])+UL([L(`الصادرات ${usd(h.x)} (${gq(h.x,h.x0)} عن الفترة نفسها من 2025)`,`Exports ${usd(h.x)} (${gq(h.x,h.x0)} on the same period of 2025)`),L(`الواردات ${usd(h.m)} (${gq(h.m,h.m0)})`,`Imports ${usd(h.m)} (${gq(h.m,h.m0)})`)]));}
 const tt=r.x+r.m,cz=[];if(r.par&&r.par.length&&tt){const s1=r.par[0][1]/tt*100,s3=r.par.slice(0,3).reduce((s,p)=>s+p[1],0)/tt*100;cz.push(L(`الشريك الأول ${nm(r.par[0][0])} بحصة ${num(s1,0)}% من التبادل؛ أكبر ثلاثة شركاء ${num(s3,0)}%`,`Top partner ${nm(r.par[0][0])} with ${num(s1,0)}% of trade; top three partners ${num(s3,0)}%`));}
 if(r.ex&&r.ex.length&&r.x){const e3=r.ex.slice(0,3).reduce((s,p)=>s+p[1],0)/r.x*100;cz.push(L(`أكبر ثلاث سلع مصدّرة (${r.ex.slice(0,3).map(p=>hs(p[0])).join('، ')}) تمثل ${num(Math.min(e3,100),0)}% من الصادرات`,`Top three export products (${r.ex.slice(0,3).map(p=>hs(p[0])).join(', ')}) make up ${num(Math.min(e3,100),0)}% of exports`));}
 if(r.nd&&r.nd.length)cz.push(L(`أكبر احتياجات الاستيراد: ${r.nd.slice(0,3).map(p=>hs(p[0])).join('، ')}`,`Largest import needs: ${r.nd.slice(0,3).map(p=>hs(p[0])).join(', ')}`));
 if(cz.length)o.push(H(L('التركّز','Concentration'))+UL(cz));
 const ob=[];if(r.ex&&r.x&&r.ex[0][1]/r.x>0.5)ob.push(L(`اعتماد مرتفع على سلعة واحدة («${hs(r.ex[0][0])}») يجعل الصادرات حساسة لأسعارها`,`Heavy reliance on one product ("${hs(r.ex[0][0])}") leaves exports exposed to its price`));if(r.par&&tt&&r.par[0][1]/tt>0.25)ob.push(L(`اعتماد واضح على شريك واحد (${nm(r.par[0][0])})`,`Clear dependence on one partner (${nm(r.par[0][0])})`));if(bal<0&&r.gdp&&-bal/1000/r.gdp>0.1)ob.push(L('عجز تجاري يتجاوز 10% من الناتج','Trade deficit above 10% of GDP'));if(bal>0&&r.gdp&&bal/1000/r.gdp>0.1)ob.push(L('فائض تجاري يتجاوز 10% من الناتج','Trade surplus above 10% of GDP'));
 if(ob.length)o.push(H(L('ملاحظات','Observations'))+UL(ob));
 return o.join('')+DISC()+links(c);}
function tciOf(a,b){const A=OP[a],B=OP[b];if(!A||!B||!A.ch||!B.ch)return null;const na_=A.y.length,nb=B.y.length,ax={},bm={};let AX=0,BM=0;for(const k in A.ch){if(+k>=98)continue;const v=A.ch[k].slice(0,na_).reduce((s,x)=>s+(x||0),0)/na_;ax[k]=v;AX+=v;}for(const k in B.ch){if(+k>=98)continue;const v=B.ch[k].slice(nb).reduce((s,x)=>s+(x||0),0)/nb;bm[k]=v;BM+=v;}if(!AX||!BM)return null;let d=0;new Set([...Object.keys(ax),...Object.keys(bm)]).forEach(k=>{d+=Math.abs((bm[k]||0)/BM-(ax[k]||0)/AX);});const tci=Math.round(100*(1-d/2));return {tci,lv:tci>=40?L('عالٍ','high'):tci>=25?L('متوسط','medium'):L('منخفض','low'),top:Object.keys(ax).filter(k=>bm[k]).map(k=>[k,Math.min(ax[k],bm[k])]).sort((p,q)=>q[1]-p[1]).slice(0,3)};}
function pairA(a,b){const A=OP[a],B=OP[b],o=[`<b>${L(`تحليل العلاقة الاقتصادية – ${nm(a)} و${nm(b)}`,`Economic relationship – ${nm(a)} and ${nm(b)}`)}</b>`];const [x,m,y]=bilv(a,b);
 if(x||m){const l=[L(`صادرات ${nm(a)} إلى ${nm(b)}: ${usd(x)}؛ وارداتها منها: ${usd(m)} (${y})`,`${nm(a)} exports to ${nm(b)}: ${usd(x)}; imports from it: ${usd(m)} (${y})`),L(`الميزان: ${usd(Math.abs(x-m))} لصالح ${nm(x>=m?a:b)}`,`Balance: ${usd(Math.abs(x-m))} in favour of ${nm(x>=m?a:b)}`)];
  const shr=(me,o_)=>{const r_=D.c[me],t=r_.x+r_.m;if(!t)return null;const tv=k=>{const z=bilv(me,k);return z[0]+z[1];};const v=tv(o_);const rk=Object.keys(D.c).filter(k=>k!==me).map(k=>[k,tv(k)]).sort((p,q)=>q[1]-p[1]).findIndex(p=>p[0]===o_);return [Math.min(v/t*100,100),rk<0?null:rk+1];};const sa=shr(a,b),sb=shr(b,a);
  if(sa)l.push(L(`${nm(b)} تمثل ${num(sa[0])}% من تجارة ${nm(a)}${sa[1]?' (الشريك رقم '+sa[1]+')':''}`,`${nm(b)} accounts for ${num(sa[0])}% of ${nm(a)}'s trade${sa[1]?' (partner no. '+sa[1]+')':''}`));if(sb)l.push(L(`${nm(a)} تمثل ${num(sb[0])}% من تجارة ${nm(b)}${sb[1]?' (الشريك رقم '+sb[1]+')':''}`,`${nm(a)} accounts for ${num(sb[0])}% of ${nm(b)}'s trade${sb[1]?' (partner no. '+sb[1]+')':''}`));
  if(sa&&sb&&(sa[0]>3*sb[0]||sb[0]>3*sa[0]))l.push(L(`علاقة غير متكافئة: أهميتها ${sa[0]>sb[0]?la(a):la(b)} أكبر بكثير`,`An uneven relationship: it matters far more to ${sa[0]>sb[0]?nm(a):nm(b)}`));
  o.push(H(L('التجارة','Trade'))+UL(l));}else o.push(H(L('التجارة','Trade'))+L('لا تتوفر بيانات عن تجارة مباشرة بين البلدين.','No data on direct trade between the two.'));
 const t1=tciOf(a,b),t2=tciOf(b,a),l2=[];if(t1)l2.push(L(`صادرات ${nm(a)} مقابل احتياجات ${nm(b)}: مؤشر التكامل ${t1.tci} (${t1.lv}) – أبرز السلع: ${t1.top.map(p=>hs(p[0])).join('، ')}`,`${nm(a)}'s exports against ${nm(b)}'s needs: complementarity ${t1.tci} (${t1.lv}) – main products: ${t1.top.map(p=>hs(p[0])).join(', ')}`));if(t2)l2.push(L(`صادرات ${nm(b)} مقابل احتياجات ${nm(a)}: مؤشر التكامل ${t2.tci} (${t2.lv}) – أبرز السلع: ${t2.top.map(p=>hs(p[0])).join('، ')}`,`${nm(b)}'s exports against ${nm(a)}'s needs: complementarity ${t2.tci} (${t2.lv}) – main products: ${t2.top.map(p=>hs(p[0])).join(', ')}`));
 if(l2.length)o.push(H(L('فرص التوسع','Room to expand'))+UL(l2));
 if(FB){const f=(p,q)=>{const US=FB.us;if(US){if(p==='US'&&US.o&&US.o[q]!=null)return [US.o[q],US.y||2025];if(q==='US'&&US.i&&US.i[p]!=null)return [US.i[p],US.y||2025];}const oo=FB.c[p]&&FB.c[p].o&&FB.c[p].o.p.find(z=>z[0]===q);if(oo)return [oo[1],oo[2]||FB.c[p].o.y];const ii=FB.c[q]&&FB.c[q].i&&FB.c[q].i.p.find(z=>z[0]===p);return ii?[ii[1],ii[2]||FB.c[q].i.y]:null;},ab=f(a,b),ba=f(b,a);
  o.push(H(L('الاستثمار المباشر','Direct investment'))+((ab||ba)?UL([ab&&L(`استثمارات ${nm(a)} في ${nm(b)}: ${usd(ab[0])} (${ab[1]})`,`${nm(a)}'s investment in ${nm(b)}: ${usd(ab[0])} (${ab[1]})`),ba&&L(`استثمارات ${nm(b)} في ${nm(a)}: ${usd(ba[0])} (${ba[1]})`,`${nm(b)}'s investment in ${nm(a)}: ${usd(ba[0])} (${ba[1]})`)]):L('لا تُظهر البيانات استثمارات مباشرة مسجّلة بين البلدين.','The data show no recorded direct investment between the two.')));}
 const ra=D.c[a],rb=D.c[b];o.push(H(L('المخاطر','Risk'))+L(`${nm(a)}: ${ra.risk}/100 (${rl(ra.risk)}) · ${nm(b)}: ${rb.risk}/100 (${rl(rb.risk)})`,`${nm(a)}: ${ra.risk}/100 (${rl(ra.risk)}) · ${nm(b)}: ${rb.risk}/100 (${rl(rb.risk)})`));
 return o.join('')+DISC()+olink(a,b);}
function groupA(g){const set=g[4],gn=EN?g[2]:g[1],all=Object.keys(D.c),sum=(S,f)=>S.reduce((s,c)=>s+(f(D.c[c])||0),0),G=sum(set,r=>r.gdp),GA=sum(all,r=>r.gdp),P=sum(set,r=>r.pop?r.pop[1]:0),X=sum(set,r=>r.x),M=sum(set,r=>r.m);
 const wg=set.reduce((s,c)=>{const r=D.c[c];return r.gdp&&r.gr!=null?[s[0]+r.gdp*r.gr,s[1]+r.gdp]:s;},[0,0]);const by=(f,asc)=>set.filter(c=>f(D.c[c])!=null).sort((p,q)=>asc?f(D.c[p])-f(D.c[q]):f(D.c[q])-f(D.c[p]));
 const bg=by(r=>r.gdp),fg=by(r=>r.gr),hi=by(r=>r.inf),sf=by(r=>r.risk),rk=by(r=>r.risk,true);
 const o=[`<b>${L('تحليل – ','Analysis – ')+gn}</b> (${set.length} ${L('دولة في المنصة','countries in the portal')})`];
 o.push(H(L('الحجم','Size'))+UL([L(`الناتج المحلي المجمّع ${bn(G)}، أي ${num(G/GA*100)}% من إجمالي دول المنصة`,`Combined GDP ${bn(G)}, ${num(G/GA*100)}% of all countries in the portal`),L(`السكان ${num(P,0)} مليون`,`Population ${num(P,0)} million`),L(`الصادرات ${usd(X)} والواردات ${usd(M)} (تشمل التجارة بين الأعضاء)`,`Exports ${usd(X)}, imports ${usd(M)} (including trade among members)`),wg[1]&&L(`النمو المرجّح بحجم الاقتصاد ${pc(wg[0]/wg[1])} في 2025`,`GDP-weighted growth ${pc(wg[0]/wg[1])} in 2025`)]));
 o.push(H(L('الأعضاء','Members'))+UL([bg.length&&L(`الأكبر اقتصاداً: ${bg.slice(0,3).map(c=>nm(c)+' ('+bn(D.c[c].gdp)+')').join('، ')}`,`Largest economies: ${bg.slice(0,3).map(c=>nm(c)+' ('+bn(D.c[c].gdp)+')').join(', ')}`),bg.length&&G&&L(`${nm(bg[0])} وحدها تمثل ${num(D.c[bg[0]].gdp/G*100,0)}% من ناتج المجموعة`,`${nm(bg[0])} alone is ${num(D.c[bg[0]].gdp/G*100,0)}% of the group's GDP`),fg.length&&L(`الأسرع نمواً: ${fg.slice(0,3).map(c=>nm(c)+' ('+pc(D.c[c].gr)+')').join('، ')}`,`Fastest growing: ${fg.slice(0,3).map(c=>nm(c)+' ('+pc(D.c[c].gr)+')').join(', ')}`),hi.length&&L(`الأعلى تضخماً: ${hi.slice(0,2).map(c=>nm(c)+' ('+pc(D.c[c].inf)+')').join('، ')}`,`Highest inflation: ${hi.slice(0,2).map(c=>nm(c)+' ('+pc(D.c[c].inf)+')').join(', ')}`),sf.length&&L(`الأقل مخاطر: ${sf.slice(0,3).map(c=>nm(c)+' ('+D.c[c].risk+')').join('، ')}`,`Lowest risk: ${sf.slice(0,3).map(c=>nm(c)+' ('+D.c[c].risk+')').join(', ')}`),rk.length&&L(`الأعلى مخاطر: ${rk.slice(0,3).map(c=>nm(c)+' ('+D.c[c].risk+')').join('، ')}`,`Highest risk: ${rk.slice(0,3).map(c=>nm(c)+' ('+D.c[c].risk+')').join(', ')}`)]));
 return o.join('')+DISC();}
function cmpA(a,b){const A=D.c[a],B=D.c[b],rows=[[L('الناتج المحلي','GDP'),A.gdp,B.gdp,bn,1],[L('نصيب الفرد','GDP per capita'),A.gpc&&A.gpc[1],B.gpc&&B.gpc[1],v=>'$'+num(v,0),1],[L('السكان (مليون)','Population (m)'),A.pop&&A.pop[1],B.pop&&B.pop[1],v=>num(v,1),0],[L('النمو 2025','Growth 2025'),A.gr,B.gr,pc,1],[L('التضخم','Inflation'),A.inf,B.inf,pc,-1],[L('رصيد المالية/الناتج','Fiscal balance/GDP'),A.fb,B.fb,pc,1],[L('الدين/الناتج','Debt/GDP'),A.debt,B.debt,v=>num(v)+'%',-1],[L('الحساب الجاري/الناتج','Current account/GDP'),A.ca,B.ca,pc,1],[L('الاحتياطيات','Reserves'),A.res&&A.res[1],B.res&&B.res[1],bn,1],[L('الصادرات','Exports'),A.x,B.x,usd,1],[L('الواردات','Imports'),A.m,B.m,usd,0],[L('درجة المخاطر','Risk score'),A.risk,B.risk,v=>num(v,0),1]];let wa=0,wb=0;const la_=[],lb_=[];
 rows.forEach(r=>{if(!r[4]||r[1]==null||r[2]==null||r[1]===r[2])return;const aw=r[4]>0?r[1]>r[2]:r[1]<r[2];if(aw){wa++;la_.push(r[0]);}else{wb++;lb_.push(r[0]);}});
 return `<b>${L('مقارنة تفصيلية','Detailed comparison')}</b>`+tbl(rows.map(r=>[r[0],r[1]==null?'–':r[3](r[1]),r[2]==null?'–':r[3](r[2])]),['',nm(a),nm(b)])+tbl([[L('التصنيف (S&P)','Rating (S&P)'),A.rt||'–',B.rt||'–']])+H(L('القراءة','Reading'))+UL([la_.length&&L(`${nm(a)} أفضل في ${wa} مؤشرات: ${la_.join('، ')}`,`${nm(a)} is ahead on ${wa} indicators: ${la_.join(', ')}`),lb_.length&&L(`${nm(b)} أفضل في ${wb} مؤشرات: ${lb_.join('، ')}`,`${nm(b)} is ahead on ${wb} indicators: ${lb_.join(', ')}`)])+DISC()+olink(a,b);}
const help=()=>L('أنا بيان، مساعد tradelexity. أجيب من بيانات المنصة عن 151 دولة. أمثلة:<br>• مؤشر لدولة أو لسنة: «تضخم مصر 2020»، «تطور الناتج المحلي للسعودية»<br>• ترتيب: «أكبر 5 اقتصادات في أفريقيا»، «ترتيب الكويت في الصادرات»<br>• مجموعة: «ناتج دول مجلس التعاون»، «دول بريكس»<br>• تجارة بين دولتين: «التجارة بين المغرب وفرنسا»، «فرص الكويت في بولندا»<br>• سلعة: «من أين تستورد الإمارات القمح؟»، «صادرات السعودية من النفط»، «أكبر مصدّر للسيارات»<br>• استثمار: «من يستثمر في مصر؟»، «استثمارات الكويت في تركيا»<br>• مقارنة: «قارن بين مصر وتركيا»<br>• تحليل: «حلل اقتصاد مصر»، «حلل تجارة تركيا»، «هل أستثمر في نيجيريا ولماذا؟»، «حلل العلاقة بين الكويت والصين»، «تحليل دول مجلس التعاون»، «قارن بالتفصيل بين السعودية والإمارات»','I am Bayan, the tradelexity assistant. I answer from the portal\'s data on 151 countries. Examples:<br>• An indicator, for any year: "Egypt inflation 2020", "Saudi GDP trend"<br>• Rankings: "top 5 economies in Africa", "Kuwait rank in exports"<br>• Groups: "GCC GDP", "BRICS members"<br>• Two countries: "trade between Morocco and France", "Kuwait prospects in Poland"<br>• Products: "where does the UAE import wheat from?", "Saudi oil exports", "largest car exporters"<br>• Investment: "who invests in Egypt?", "Kuwait investment in Turkey"<br>• Compare: "compare Egypt and Turkey"<br>• Analysis: "analyse Egypt\'s economy", "analyse Turkey\'s trade", "should I invest in Nigeria and why?", "analyse Kuwait and China", "analysis of the GCC", "detailed comparison of Saudi Arabia and the UAE"');
async function answer(q){q=String(q).replace(/\bU\.?S\.?A?\b/g,'usa').replace(/\bU\.?K\.?\b/g,'uk').replace(/\bU\.?A\.?E\.?\b/g,'uae');const t=nz(q),tt=' '+t+' ';
 if(/^(مرحبا|اهلا|السلام عليكم|هلا|hi|hello|hey)( |$)/.test(t)&&t.split(' ').length<4)return help();
 if(/مساعده|ماذا تستطيع|ماذا يمكنك|كيف استخدم|help|what can you/.test(t))return help();
 if(/مصدر البيانات|مصادر البيانات|مصادرك|من اين البيانات|data source|your source|sources/.test(t))return L('المصادر والمنهجية غير معروضة في المنصة حالياً.','Sources and methodology are not displayed in the portal at present.');
 if(/كم دوله|عدد الدول|how many countries/.test(t))return L(`تغطي المنصة <b>${Object.keys(D.c).length}</b> دولة.`,`The portal covers <b>${Object.keys(D.c).length}</b> countries.`);
 const g=group(t);let {cs}=countries(t);
 if(g&&['na','sa'].includes(g[0]))cs=cs.filter(c=>c!=='US');
 const pr=product(t),ym=t.match(/(?:^| )(20(?:1[5-9]|2[0-6]))(?: |$)/),year=ym?ym[1]:null;
 const inds=IND.filter(i=>i[1].test(t));
 const isRank=/(^| )(اكبر|اعلي|اكثر|اقل|ادني|اصغر|افضل|اسوا|اسرع|اغني|افقر|ترتيب|مرتبه|تصنف|top|largest|highest|biggest|lowest|smallest|least|most|rank|ranking|best|worst|fastest|richest|poorest|safest|riskiest)/.test(t);
 let asc=/(^| )(اقل|ادني|اصغر|اسوا|افقر|lowest|smallest|least|worst|poorest)/.test(t);
 const isTrend=/تطور|تغير|تاريخ|منذ|خلال السنوات|عبر السنوات|سنويا|trend|history|over time|since|by year|over the years/.test(t);
 const isCmp=/قارن|مقارن|compar|versus| vs /.test(tt),isOpp=/فرص|تكامل|opportunit|prospect|complementar/.test(t),isFdiWho=/من يستثمر|المستثمرون|المستثمرين|اكبر المستثمرين|مصدر الاستثمار|who invests|investors in|invests in/.test(t),isFdiOut=/اين تستثمر|استثمارات .* في الخارج|وجهات استثمار|تستثمر في الخارج|where does .* invest|invest abroad|investment abroad/.test(t),isInv=/استثمار|يستثمر|تستثمر|invest/.test(t);
 const nMatch=t.match(/(?:^| )(\d{1,2})(?: |$)/),N=nMatch&&+nMatch[1]>=2&&+nMatch[1]<=30?+nMatch[1]:(/(^| )(عشر|ten)( |$)/.test(t)?10:/(^| )(خمس|خمسه|five)( |$)/.test(t)?5:/(^| )(ثلاث|ثلاثه|three)( |$)/.test(t)?3:null);
 const all=Object.keys(D.c),set=g?g[4]:all,gname=g?(EN?g[2]:g[1]):'';
 const expI=/تصدر|صادرات|صادر|يصدر|مصدر|export/.test(t),impI=/تستورد|واردات|وارد|يستورد|مستورد|استيراد|مورد|يورد|import|supplier|supplies/.test(t);
 const isAn=AN.test(t);
 if(isAn&&g&&!cs.length&&!pr)return groupA(g);
 /* group membership */
 if(g&&!cs.length&&!inds.length&&!pr&&!isRank)return L(`دول ${gname} في المنصة (${set.length}):`,`${gname} countries in the portal (${set.length}):`)+'<br>'+set.map(nm).join(L('، ',', '))+'.';
 /* product rankings without a country */
 if(pr&&!cs.length&&(isRank||g||/من يصدر|من يستورد|who exports|who imports/.test(t))){await need('opp');return chRank(pr,!/مستورد|يستورد|واردات|import/.test(t),set,gname,N||10);}
 /* rankings */
 if((isRank||g)&&cs.length<=1&&(inds.length||isRank)&&!(cs.length&&!/ترتيب|مرتبه|rank/.test(t)&&!g)){let ind=inds[0]||IND.find(i=>i[0]==='gdp');if(/اغني|richest|افقر|poorest/.test(t))ind=IND.find(i=>i[0]==='gpc');
  if(ind[2][0]!=='@'&&ind[2][0]!=='#')await need('fin');if(ind[0]==='risk'){asc=/(^| )(اعلي|اكثر|اكبر|اسوا|highest|most|riskiest|worst)/.test(t)&&!/امان|امنا|safe/.test(t);}
  if(cs.length&&!g){last=cs[0];return rank(ind,all,'',false,5,year,cs[0])+links(cs[0]);}
  if(cs.length&&g){last=cs[0];return rank(ind,set,gname,false,5,year,cs[0])+links(cs[0]);}
  return rank(ind,set,gname,asc,N||(g&&set.length<=12?set.length:10),year);}
 if(!cs.length){if((inds.length||pr||isOpp||isInv||isTrend||isAn||/شرك|partner|ملخص|summary|نبذه/.test(t))&&(last||D.c[CUR]))cs=[last||CUR];else if(/افضل الاسواق|best markets/.test(t))cs=['KW'];else return inds.length||pr?L('عن أي دولة؟ اكتب اسم الدولة مع السؤال.','Which country? Please include the country name.'):L('لم أتعرف على دولة أو مؤشر في سؤالك. جرّب مثلاً: «صادرات تركيا»، «أكبر اقتصادات آسيا»، «من أين تستورد الكويت الأرز؟». اكتب «مساعدة» لعرض الأمثلة.','I could not find a country or an indicator in your question. Try, for example: "Turkey exports", "largest economies in Asia", "where does Kuwait import rice from?". Type "help" for more examples.');}
 last=cs[0];
 if(isAn&&!pr){if(cs.length>=2){if(isCmp)return cmpA(cs[0],cs[1]);await need('opp','fdi');return pairA(cs[0],cs[1]);}
  if(/تجار|صادر|وارد|تبادل|trade|export|import/.test(t)&&!/اقتصاد|econom/.test(t))return tradeA(cs[0]);
  if(/مخاطر|استثمر|نستثمر|استثمار|تنصح|انصح|risk|invest/.test(t)){await need('fdi');return investA(cs[0]);}
  return econA(cs[0]);}
 /* two or more countries */
 if(cs.length>=2){const [a,b]=cs;
  if(isInv&&!isCmp){await need('fdi');return fdiPair(a,b)+olink(a,b);}
  if(isOpp){await need('opp');return opps(a,b);}
  if(inds.length&&(isCmp||cs.length>2||!/(^| )(بين|مع|الي|من|between|with|to|from)( |$)/.test(t)||!inds.some(i=>['exp','imp','tot','bal'].includes(i[0])))){if(inds.some(i=>i[2][0]!=='@'&&i[2][0]!=='#'))await need('fin');return inds.slice(0,3).map(i=>cmpInd(cs,i,year)).join('')+olink(a,b);}
  if(isCmp)return cmp(a,b);
  await need('opp');return bil(a,b);}
 const c=cs[0],r=D.c[c];
 /* investment */
 if(isFdiWho){await need('fdi');return fdiList(c,'i');}
 if(isFdiOut){await need('fdi');return fdiList(c,'o');}
 /* product */
 if(pr){if(expI&&!/تستورد|مورد|يورد|import|supplier/.test(t)){await need('opp');return chTrade(c,pr,true);}return suppliers(c,pr);}
 /* opportunities for one country (with Kuwait) */
 if(isOpp){await need('opp');return c==='KW'?(r.mk?L('أفضل الأسواق للصادرات الكويتية بحسب مؤشر التكامل التجاري:','Best markets for Kuwaiti exports by trade complementarity:')+tbl(r.mk.map(([p,v])=>[nm(p),v]))+links(c):sumC(c,r)):opps('KW',c);}
 /* special single-country topics */
 const out=[];
 if(/افضل الاسواق|best markets/.test(t)&&r.mk)out.push(L('أفضل الأسواق للصادرات الكويتية بحسب مؤشر التكامل التجاري:','Best markets for Kuwaiti exports by trade complementarity:')+tbl(r.mk.map(([p,v])=>[nm(p),v])));
 if(/شرك|partner|مع من|تتاجر/.test(t))out.push(L(`أهم الشركاء التجاريين ${la(c)} (${r.y}):`,`Top trading partners of ${nm(c)} (${r.y}):`)+tbl((r.par||[]).map(([p,v])=>[nm(p),usd(v)])));
 if(/ماذا تصدر|اهم الصادرات|ابرز الصادرات|اهم صادرات|ابرز صادرات|اهم السلع|what does .* export|top exports|main exports|main products/.test(t))out.push(L(`أهم صادرات ${nm(c)}:`,`Top exports of ${nm(c)}:`)+tbl((r.ex||[]).map(([k,v])=>[hs(k),usd(v)])));
 if(/تحتاج|احتياج|ماذا تستورد|اهم الواردات|اهم واردات|ابرز الواردات|needs|what does .* import|top imports|main imports/.test(t))out.push(L(`أهم احتياجات ${nm(c)} من الواردات (صافي الاستيراد):`,`Main import needs of ${nm(c)} (net imports):`)+tbl((r.nd||[]).map(([k,v])=>[hs(k),usd(v)])));
 if(out.length)return out.join('<br>')+links(c);
 const tr=inds.filter(i=>i[2][0]==='@');
 if((/النصف الاول|نصف 2026|first half|h1/.test(t)||(year==='2026'&&(tr.length||!inds.length)))){const h=r.h1;if(!h)return L(`لا تتوفر بعد بيانات تجارة 2026 ${la(c)}؛ أحدث سنة كاملة هي ${r.y}: الصادرات ${usd(r.x)} والواردات ${usd(r.m)}.`,`2026 trade data are not yet available for ${nm(c)}; the latest full year is ${r.y}: exports ${usd(r.x)}, imports ${usd(r.m)}.`)+links(c);const gq=(a,b)=>b?' ('+pc((a/b-1)*100)+')':'';return L(`${nm(c)} – ${h.lb[0]}: الصادرات <b>${usd(h.x)}</b>${gq(h.x,h.x0)}، الواردات <b>${usd(h.m)}</b>${gq(h.m,h.m0)} مقارنة بالفترة نفسها من 2025.`,`${nm(c)} – ${h.lb[1]}: exports <b>${usd(h.x)}</b>${gq(h.x,h.x0)}, imports <b>${usd(h.m)}</b>${gq(h.m,h.m0)} versus the same period of 2025.`)+links(c);}
 if(/(^| )(ب|مع |و)?(ال)?كويت|kuwait/.test(tt)&&c!=='KW'&&r.kw&&!inds.some(i=>i[2][0]!=='@'))return L(`التبادل بين الكويت و${nm(c)}: صادرات الكويت إليها <b>${usd(r.kw[0])}</b>، وواردات الكويت منها <b>${usd(r.kw[1])}</b>.`,`Kuwait–${nm(c)} trade: Kuwait's exports to it <b>${usd(r.kw[0])}</b>; Kuwait's imports from it <b>${usd(r.kw[1])}</b>.`)+links(c);
 if(!inds.length)return (isTrend?'':'')+sumC(c,r)+links(c);
 let use=inds.slice();if(use.some(i=>i[0]==='bal'))use=use.filter(i=>!['exp','imp','tot','fb'].includes(i[0]));if(use.length>1)use=use.filter(i=>i[0]!=='tot');if(use.some(i=>i[0]==='fdi'||i[0]==='fdio'))use=use.filter(i=>i[0]!=='risk');if(use.some(i=>i[0]==='lend'))use=use.filter(i=>i[0]!=='pol');if(use.some(i=>i[0]==='xg'||i[0]==='mg'))use=use.filter(i=>!['exp','imp','gdp'].includes(i[0]));if(use.some(i=>i[0]==='gpc'))use=use.filter(i=>i[0]!=='gdp');if(use.length>1&&use.some(i=>i[0]==='gdp')&&/اقتصاد|economy/.test(t)&&!/ناتج|gdp/.test(t))use=use.filter(i=>i[0]!=='gdp');
 if(use.some(i=>i[2][0]!=='@'&&i[2][0]!=='#'))await need('fin');
 return use.slice(0,3).map(i=>isTrend?trend(c,i):one(c,i,year)).join('<br>')+links(c);}
function ui(){const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 const b=document.createElement('button');b.id='tbB';b.type='button';b.textContent=L('اسأل بيان','Ask Bayan');
 const p=document.createElement('div');p.id='tbP';p.setAttribute('role','dialog');p.setAttribute('aria-label',L('بيان','Bayan'));
 const sg=EN?["Analyse Egypt's economy",'Should I invest in Turkey and why?','Analyse Kuwait and China','Where does the UAE import wheat from?']:['حلل اقتصاد مصر','هل أستثمر في تركيا ولماذا؟','حلل العلاقة بين الكويت والصين','من أين تستورد الإمارات القمح؟'];
 p.innerHTML=`<header><span>${L('بيان · مساعد tradelexity','Bayan · tradelexity assistant')}</span><button type="button" id="tbX">${L('إغلاق','Close')}</button></header><div id="tbM"></div><div id="tbS">${sg.map(s=>`<button type="button">${s}</button>`).join('')}</div><form id="tbF"><input type="text" autocomplete="off" placeholder="${L('اكتب سؤالك…','Type your question…')}" aria-label="${L('سؤال','Question')}"><button type="submit">${L('إرسال','Send')}</button></form>`;
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

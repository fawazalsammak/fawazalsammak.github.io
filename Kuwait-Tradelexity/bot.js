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
const usd=m=>m==null||!isFinite(m)?'–':Math.abs(m)>=1000?num(m/1000)+L(' مليار دولار',' $ bn'):num(m,Math.abs(m)<10?1:0)+L(' مليون دولار',' $ m');
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
function bil(a,b){const A=OP[a],B=OP[b];let x=0,m=0,y='';if(A&&A.p&&A.p[b]){[x,m]=A.p[b];y=A.ly||A.y[A.y.length-1];}if(B&&B.p&&B.p[a]){if(!x)x=B.p[a][1];if(!m)m=B.p[a][0];if(!y)y=B.ly||B.y[B.y.length-1];}
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
const help=()=>L('أجيب من بيانات المنصة عن 151 دولة. أمثلة:<br>• مؤشر لدولة أو لسنة: «تضخم مصر 2020»، «تطور الناتج المحلي للسعودية»<br>• ترتيب: «أكبر 5 اقتصادات في أفريقيا»، «ترتيب الكويت في الصادرات»<br>• مجموعة: «ناتج دول مجلس التعاون»، «دول بريكس»<br>• تجارة بين دولتين: «التجارة بين المغرب وفرنسا»، «فرص الكويت في بولندا»<br>• سلعة: «من أين تستورد الإمارات القمح؟»، «صادرات السعودية من النفط»، «أكبر مصدّر للسيارات»<br>• استثمار: «من يستثمر في مصر؟»، «استثمارات الكويت في تركيا»<br>• مقارنة: «قارن بين مصر وتركيا»','I answer from the portal\'s data on 151 countries. Examples:<br>• An indicator, for any year: "Egypt inflation 2020", "Saudi GDP trend"<br>• Rankings: "top 5 economies in Africa", "Kuwait rank in exports"<br>• Groups: "GCC GDP", "BRICS members"<br>• Two countries: "trade between Morocco and France", "Kuwait prospects in Poland"<br>• Products: "where does the UAE import wheat from?", "Saudi oil exports", "largest car exporters"<br>• Investment: "who invests in Egypt?", "Kuwait investment in Turkey"<br>• Compare: "compare Egypt and Turkey"');
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
 const isCmp=/قارن|مقارن|compare|versus| vs /.test(tt),isOpp=/فرص|تكامل|opportunit|prospect|complementar/.test(t),isFdiWho=/من يستثمر|المستثمرون|المستثمرين|اكبر المستثمرين|مصدر الاستثمار|who invests|investors in|invests in/.test(t),isFdiOut=/اين تستثمر|استثمارات .* في الخارج|وجهات استثمار|تستثمر في الخارج|where does .* invest|invest abroad|investment abroad/.test(t),isInv=/استثمار|يستثمر|تستثمر|invest/.test(t);
 const nMatch=t.match(/(?:^| )(\d{1,2})(?: |$)/),N=nMatch&&+nMatch[1]>=2&&+nMatch[1]<=30?+nMatch[1]:(/(^| )(عشر|ten)( |$)/.test(t)?10:/(^| )(خمس|خمسه|five)( |$)/.test(t)?5:/(^| )(ثلاث|ثلاثه|three)( |$)/.test(t)?3:null);
 const all=Object.keys(D.c),set=g?g[4]:all,gname=g?(EN?g[2]:g[1]):'';
 const expI=/تصدر|صادرات|صادر|يصدر|مصدر|export/.test(t),impI=/تستورد|واردات|وارد|يستورد|مستورد|استيراد|مورد|يورد|import|supplier|supplies/.test(t);
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
 if(!cs.length){if((inds.length||pr||isOpp||isInv||isTrend||/شرك|partner|ملخص|summary|نبذه/.test(t))&&(last||D.c[CUR]))cs=[last||CUR];else if(/افضل الاسواق|best markets/.test(t))cs=['KW'];else return inds.length||pr?L('عن أي دولة؟ اكتب اسم الدولة مع السؤال.','Which country? Please include the country name.'):L('لم أتعرف على دولة أو مؤشر في سؤالك. جرّب مثلاً: «صادرات تركيا»، «أكبر اقتصادات آسيا»، «من أين تستورد الكويت الأرز؟». اكتب «مساعدة» لعرض الأمثلة.','I could not find a country or an indicator in your question. Try, for example: "Turkey exports", "largest economies in Asia", "where does Kuwait import rice from?". Type "help" for more examples.');}
 last=cs[0];
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
 const b=document.createElement('button');b.id='tbB';b.type='button';b.textContent=L('المساعد','Assistant');
 const p=document.createElement('div');p.id='tbP';p.setAttribute('role','dialog');p.setAttribute('aria-label',L('المساعد','Assistant'));
 const sg=EN?['Where does the UAE import wheat from?','Top 5 economies in Africa','Trade between Kuwait and China','Who invests in Egypt?']:['من أين تستورد الإمارات القمح؟','أكبر 5 اقتصادات في أفريقيا','التجارة بين الكويت والصين','من يستثمر في مصر؟'];
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

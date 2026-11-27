/* tradelexity wordmark: lowercase, steady, single glow wave t -> y */
(function(){
var CSS='.bw{display:inline-block;animation:bwave 3.3s calc(var(--i)*.15s) ease-in-out infinite}.bw.g{color:#D4B85A}.bw.w{color:#fff}'+
'@keyframes bwave{0%,40%,100%{text-shadow:0 2px 12px #0006}12%{text-shadow:0 0 8px #fff,0 0 20px #ffffffcc,0 0 38px #D4B85Abb}}'+
'.brand .min,.imin,.fbn,.lgn{animation-name:none!important}.imin{animation:idrop 2.2s .8s cubic-bezier(.16,1,.3,1) both!important}'+
'.tspDot.on{animation:none!important}';
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
function wrap(el,keepColor){if(!el||el.dataset.bw)return;var t=(el.textContent||'').replace(/\s+/g,'');if(!/^tradelexity$/i.test(t))return;
 var w='tradelexity',h='';for(var i=0;i<w.length;i++)h+='<span class="bw '+(i<5?'w':'g')+'" style="--i:'+i+'">'+w[i]+'</span>';el.innerHTML=h;el.dataset.bw='1';}
function run(){document.querySelectorAll('.brand .min,.fbn,.lgn,.imin,.br1').forEach(function(e){wrap(e);});
 var n=document.querySelector('.tspN');if(n&&!n.dataset.bw){var sp=n.querySelectorAll('span');if(sp.length===11){sp[0].textContent='t';sp.forEach(function(s,i){s.style.setProperty('--i',i);});n.dataset.bw='1';}}
 if(/Tradelexity/.test(document.title))document.title=document.title.replace(/Tradelexity/g,'tradelexity');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
new MutationObserver(function(){run();}).observe(document.documentElement,{childList:true,subtree:true});
})();

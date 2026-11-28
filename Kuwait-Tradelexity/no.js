/* tradelexity – every exports / imports label states "non-oil" (the portal covers non-oil trade). Idempotent text pass. */
(function(){
 var R=[[/(?<!إجمالي )الصادرات(?! غير النفطية| النفطية| الوطنية| غير نفطية)/g,'الصادرات غير النفطية'],
  [/الواردات(?! غير النفطية| النفطية| غير نفطية)/g,'الواردات غير النفطية'],
  [/(?<!ال)صادرات (?!الوقود|النفط)((?:(?!غير النفطية)[^|\n]){2,30}?) (إلى|الى) /g,'صادرات $1 غير النفطية $2 '],
  [/(?<!ال)واردات (?!الوقود|النفط|السلع)((?:(?!غير النفطية)[^|\n]){2,30}?) من (?!الناتج)/g,'واردات $1 غير النفطية من '],
  [/(?<![Nn]on-oil |[Oo]il |[Ff]uel |[Tt]otal |[Nn]ational |product |-|[A-Za-z])Exports\b/g,'Non-oil exports'],
  [/(?<![Nn]on-oil |[Oo]il |[Ff]uel |[Tt]otal |[Nn]ational |product |-|[A-Za-z])exports\b(?! of oil)/g,'non-oil exports'],
  [/(?<![Nn]on-oil |[Ff]uel |-|[A-Za-z])Imports\b/g,'Non-oil imports'],
  [/(?<![Nn]on-oil |[Ff]uel |-|[A-Za-z])imports\b(?! of fuel| of goods)/g,'non-oil imports']];
 var skip=function(n){var p=n.parentElement;if(!p)return true;if(/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.tagName))return true;return !!p.closest('#tbP,#tbB,#coS,#ft,[data-raw]');};
 var busy=false,run=function(){if(busy)return;busy=true;try{var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),n;while(n=w.nextNode()){if(skip(n))continue;var t=n.nodeValue;if(!t||t.length<6||!/صادرات|واردات|xports|mports/.test(t))continue;var o=t;for(var i=0;i<R.length;i++)t=t.replace(R[i][0],R[i][1]);if(t!==o)n.nodeValue=t;}}catch(e){}busy=false;};
 var tm=null,later=function(){if(tm)return;tm=setTimeout(function(){tm=null;run();},120);};
 var go=function(){run();try{new MutationObserver(function(){if(!busy)later();}).observe(document.body,{childList:true,subtree:true,characterData:true});}catch(e){}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();

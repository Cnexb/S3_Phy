const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./siUnitsLab-C089mW5j.js","./createLabIframe-9eJBFeHt.js","./index-D5HkfLN5.js","./index-D9vUhwsO.css","./embedPageUrl-DWRMbVg6.js","./foundationsNotesWorksheet-Cj5plJAG.js","./foundationsQuantitiesQuiz-DHNMPDeA.js"])))=>i.map(i=>d[i]);
import{t,_ as b,g as q}from"./index-D5HkfLN5.js";import{r as M,l as A,m as $,c as D,F as S,a as C,h as k,b as F,d as K,s as R}from"./toolsShell-Je9dA2Qh.js";import{m as z,b as P}from"./flashcardDeck-BT7EPuKi.js";const _=["siUnits"],T="s3phy.foundations.tool",Z={siUnits:()=>b(()=>import("./siUnitsLab-C089mW5j.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url).then(o=>o.createSiUnitsLab)};function O(o){return t({siUnits:"tools.siUnits.title"}[o]||o)}const v=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],Q=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],V=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}];function x(o){let i=M(sessionStorage.getItem("s3phy.foundations.section"),"notes",S),r=A(T,_,"siUnits"),n=null,a={main:null},m=null,l=null,u=null,c=null;function p(){D(m),m=null}async function L(e){e.innerHTML="",p();const s=Z[r];if(!s)return;m=(await s())(t),e.appendChild(m)}async function E(e){const{createFoundationsNotesWorksheet:s}=await b(async()=>{const{createFoundationsNotesWorksheet:y}=await import("./foundationsNotesWorksheet-Cj5plJAG.js");return{createFoundationsNotesWorksheet:y}},__vite__mapDeps([5,2,3,4]),import.meta.url),d=s(t);e.appendChild(d),u=d._foundationsNotesWorksheetCleanup||null}async function g(e){const{createFoundationsQuantitiesQuiz:s}=await b(async()=>{const{createFoundationsQuantitiesQuiz:y}=await import("./foundationsQuantitiesQuiz-DHNMPDeA.js");return{createFoundationsQuantitiesQuiz:y}},__vite__mapDeps([6,2,3,4]),import.meta.url),d=s(t);e.appendChild(d),l=d._foundationsQuantitiesQuizCleanup||null}function f(){if(a.main)if(l==null||l(),l=null,u==null||u(),u=null,c==null||c(),c=null,p(),i==="notes")a.main.innerHTML=I(),U();else if(i==="tools")a.main.innerHTML=C({toolOrder:_,toolId:r,getLabel:O,t}),k(o,{getLabel:O,t,getActiveToolId:()=>r,onSelectTool:e=>{r=e,R(T,r)},mountTool:e=>{L(e)}});else if(i==="summary")a.main.innerHTML=H(),N();else if(i==="worksheets"){a.main.innerHTML='<section class="panel panel--worksheets-embed"></section>';const e=a.main.querySelector(".panel--worksheets-embed");E(e)}else if(i==="quiz"){a.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=a.main.querySelector(".panel--quiz-embed");g(e)}else i==="flashcards"&&(c=z(a.main,{deckOptions:V.map(e=>({value:e.value,label:t(e.labelKey)})),buildDeck:e=>P(e,q()),introKey:"flashcards.introFoundations"}))}function h(){n==null||n.refreshLabels(),f()}function w(){n==null||n.destroy(),n=$(o,{subtitleKey:"strand.foundations.subtitle",activeSection:i,sections:S,onSection:e=>{i==="tools"&&e!=="tools"&&p(),i=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(i),f()},onLang:h}),a.main=n.main,n.updateSection(i),f()}function I(){return`
      <section class="panel">
        <h2>${t("notes.title")}</h2>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${v.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${t(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function U(){const e=v.map(s=>({key:s.id,fileEn:s.fileEn,fileZh:s.fileZh}));await F(o,e)}function H(){return`
      <section class="panel">
        <h2>${t("summary.title")}</h2>
        <p class="lead">${t("summary.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${v.map(e=>`
            <div class="card" data-summary-card="${e.id}">
              <h3>${t(`summary.item.${e.id}`)}</h3>
              <div data-summary-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function N(){await K(o,Q)}return window.addEventListener("s3phy:lang",h),w(),()=>{window.removeEventListener("s3phy:lang",h),l==null||l(),u==null||u(),c==null||c(),p(),n==null||n.destroy()}}export{x as mountFoundationsHub};

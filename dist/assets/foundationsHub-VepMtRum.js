const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./siUnitsLab-CG4PLi0R.js","./createLabIframe-CUgD43F6.js","./index-C7PJAb7d.js","./index-BMJ7OUGl.css","./foundationsNotesWorksheet-CY-kjQsv.js","./foundationsUsefulMathQuiz-CuaCpgCw.js","./foundationsQuantitiesQuiz-DeK4gtYe.js"])))=>i.map(i=>d[i]);
import{t as n,_ as y,g as D}from"./index-C7PJAb7d.js";import{r as R,l as F,m as K,c as Q,F as O,h as Z,a as P,s as V}from"./hubShell-IS4B4YV1.js";import{r as j,h as Y}from"./toolsShell-BMZ7uaTA.js";import{m as G,b as W}from"./flashcardDeck-73RBwmon.js";const E=["siUnits"],q="s3phy.foundations.tool",x={siUnits:()=>y(()=>import("./siUnitsLab-CG4PLi0R.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(i=>i.createSiUnitsLab)};function I(i){return n({siUnits:"tools.siUnits.title"}[i]||i)}const b=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],B=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],J=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}],S=["quantitiesUnits","usefulMaths"],g="s3phy.foundations.quiz";function X(i){return S.includes(i)?i:"quantitiesUnits"}function at(i){let a=R(sessionStorage.getItem("s3phy.foundations.section"),"notes",O),f=X(sessionStorage.getItem(g)),d=F(q,E,"siUnits"),s=null,u={main:null},p=null,o=null,c=null,r=null;function h(){Q(p),p=null}async function U(t){t.innerHTML="",h();const e=x[d];if(!e)return;p=(await e())(n),t.appendChild(p)}async function w(t){const{createFoundationsNotesWorksheet:e}=await y(async()=>{const{createFoundationsNotesWorksheet:m}=await import("./foundationsNotesWorksheet-CY-kjQsv.js");return{createFoundationsNotesWorksheet:m}},__vite__mapDeps([4,2,3]),import.meta.url),l=e(n);t.appendChild(l),c=l._foundationsNotesWorksheetCleanup||null}async function z(t){if(!t)return;if(o==null||o(),o=null,t.innerHTML="",f==="usefulMaths"){const{createFoundationsUsefulMathQuiz:m}=await y(async()=>{const{createFoundationsUsefulMathQuiz:C}=await import("./foundationsUsefulMathQuiz-CuaCpgCw.js");return{createFoundationsUsefulMathQuiz:C}},__vite__mapDeps([5,2,3]),import.meta.url),L=m(n);t.appendChild(L),o=L._foundationsUsefulMathQuizCleanup||null;return}const{createFoundationsQuantitiesQuiz:e}=await y(async()=>{const{createFoundationsQuantitiesQuiz:m}=await import("./foundationsQuantitiesQuiz-DeK4gtYe.js");return{createFoundationsQuantitiesQuiz:m}},__vite__mapDeps([6,2,3]),import.meta.url),l=e(n);t.appendChild(l),o=l._foundationsQuantitiesQuizCleanup||null}function M(){const t=S.map(e=>`<button type="button" data-quiz="${e}" class="${f===e?"active":""}">${n(`quiz.label.${e}`)}</button>`).join("");return`
      <section class="panel panel--quiz-embed">
        <div class="worksheet-picker">
          <p class="lead">${n("quiz.pick")}</p>
          <div class="tool-list" data-quiz-list>${t}</div>
        </div>
        <div class="worksheet-stage" data-quiz-stage></div>
      </section>`}function v(){if(u.main)if(o==null||o(),o=null,c==null||c(),c=null,r==null||r(),r=null,h(),a==="notes")u.main.innerHTML=k(),A();else if(a==="tools")u.main.innerHTML=j({toolOrder:E,toolId:d,getLabel:I,t:n}),Y(i,{getLabel:I,t:n,getActiveToolId:()=>d,onSelectTool:t=>{d=t,V(q,d)},mountTool:t=>{U(t)}});else if(a==="summary")u.main.innerHTML=H(),N();else if(a==="worksheets"){u.main.innerHTML='<section class="panel panel--worksheets-embed"></section>';const t=u.main.querySelector(".panel--worksheets-embed");w(t)}else a==="quiz"?(u.main.innerHTML=M(),z(u.main.querySelector("[data-quiz-stage]"))):a==="flashcards"&&(r=G(u.main,{deckOptions:J.map(t=>({value:t.value,label:n(t.labelKey)})),buildDeck:t=>W(t,D()),introKey:"flashcards.introFoundations"}))}function _(){s==null||s.refreshLabels(),v()}function $(){s==null||s.destroy(),s=K(i,{subtitleKey:"strand.foundations.subtitle",activeSection:a,sections:O,onSection:t=>{a==="tools"&&t!=="tools"&&h(),a=t,sessionStorage.setItem("s3phy.foundations.section",t),s.updateSection(a),v()},onLang:_}),u.main=s.main,s.updateSection(a),v()}function k(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${b.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${n(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function A(){const t=b.map(e=>({key:e.id,fileEn:e.fileEn,fileZh:e.fileZh}));await Z(i,t)}function H(){return`
      <section class="panel">
        <h2>${n("summary.title")}</h2>
        <p class="lead">${n("summary.intro")}</p>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${b.map(t=>`
            <div class="card" data-summary-card="${t.id}">
              <h3>${n(`summary.item.${t.id}`)}</h3>
              <div data-summary-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function N(){await P(i,B)}function T(t){const e=t.target.closest("[data-quiz]");if(!e||a!=="quiz")return;const l=e.getAttribute("data-quiz");!l||l===f||!S.includes(l)||(f=l,sessionStorage.setItem(g,l),v())}return window.addEventListener("s3phy:lang",_),i.addEventListener("click",T),$(),()=>{window.removeEventListener("s3phy:lang",_),i.removeEventListener("click",T),o==null||o(),c==null||c(),r==null||r(),h(),s==null||s.destroy()}}export{at as mountFoundationsHub};

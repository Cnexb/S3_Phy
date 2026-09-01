const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsNotesWorksheet-D2NfbrO4.js","./index-DlE57Yxm.js","./index-BMJ7OUGl.css","./foundationsUsefulMathQuiz-CyMMZUIQ.js","./foundationsQuantitiesQuiz-BIkPG1zC.js"])))=>i.map(i=>d[i]);
import{t as a,_ as h,g as k}from"./index-DlE57Yxm.js";import{r as L,m as N,F as S,h as T,a as H}from"./hubShell-B8yXaIsZ.js";import{m as C,b as F}from"./flashcardDeck-DsbQuZP5.js";const v=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],A=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],D=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}],y=["quantitiesUnits","usefulMaths"],q="s3phy.foundations.quiz";function K(l){return y.includes(l)?l:"quantitiesUnits"}function P(l){let u=L(sessionStorage.getItem("s3phy.foundations.section"),"notes",S),m=K(sessionStorage.getItem(q)),n=null,o={main:null},i=null,c=null,d=null;async function g(t){const{createFoundationsNotesWorksheet:e}=await h(async()=>{const{createFoundationsNotesWorksheet:r}=await import("./foundationsNotesWorksheet-D2NfbrO4.js");return{createFoundationsNotesWorksheet:r}},__vite__mapDeps([0,1,2]),import.meta.url),s=e(a);t.appendChild(s),c=s._foundationsNotesWorksheetCleanup||null}async function w(t){if(!t)return;if(i==null||i(),i=null,t.innerHTML="",m==="usefulMaths"){const{createFoundationsUsefulMathQuiz:r}=await h(async()=>{const{createFoundationsUsefulMathQuiz:U}=await import("./foundationsUsefulMathQuiz-CyMMZUIQ.js");return{createFoundationsUsefulMathQuiz:U}},__vite__mapDeps([3,1,2]),import.meta.url),_=r(a);t.appendChild(_),i=_._foundationsUsefulMathQuizCleanup||null;return}const{createFoundationsQuantitiesQuiz:e}=await h(async()=>{const{createFoundationsQuantitiesQuiz:r}=await import("./foundationsQuantitiesQuiz-BIkPG1zC.js");return{createFoundationsQuantitiesQuiz:r}},__vite__mapDeps([4,1,2]),import.meta.url),s=e(a);t.appendChild(s),i=s._foundationsQuantitiesQuizCleanup||null}function E(){const t=y.map(e=>`<button type="button" data-quiz="${e}" class="${m===e?"active":""}">${a(`topic.${e}`)}</button>`).join("");return`
      <section class="panel panel--quiz-embed">
        <div class="worksheet-picker">
          <p class="lead">${a("quiz.pick")}</p>
          <div class="tool-list" data-quiz-list>${t}</div>
        </div>
        <div class="worksheet-stage" data-quiz-stage></div>
      </section>`}function f(){if(o.main)if(i==null||i(),i=null,c==null||c(),c=null,d==null||d(),d=null,u==="notes")o.main.innerHTML=M(),O();else if(u==="summary")o.main.innerHTML=$(),I();else if(u==="worksheets"){o.main.innerHTML='<section class="panel panel--worksheets-embed"></section>';const t=o.main.querySelector(".panel--worksheets-embed");g(t)}else u==="quiz"?(o.main.innerHTML=E(),w(o.main.querySelector("[data-quiz-stage]"))):u==="flashcards"&&(d=C(o.main,{deckOptions:D.map(t=>({value:t.value,label:a(t.labelKey)})),buildDeck:t=>F(t,k()),introKey:"flashcards.introFoundations"}))}function p(){n==null||n.refreshLabels(),f()}function z(){n==null||n.destroy(),n=N(l,{subtitleKey:"strand.foundations.subtitle",activeSection:u,sections:S,onSection:t=>{u=t,sessionStorage.setItem("s3phy.foundations.section",t),n.updateSection(u),f()},onLang:p}),o.main=n.main,n.updateSection(u),f()}function M(){return`
      <section class="panel">
        <h2>${a("notes.title")}</h2>
        <p class="lead">${a("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${v.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${a(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function O(){const t=v.map(e=>({key:e.id,fileEn:e.fileEn,fileZh:e.fileZh}));await T(l,t)}function $(){return`
      <section class="panel">
        <h2>${a("summary.title")}</h2>
        <p class="lead">${a("summary.intro")}</p>
        <p class="lead">${a("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${v.map(t=>`
            <div class="card" data-summary-card="${t.id}">
              <h3>${a(`summary.item.${t.id}`)}</h3>
              <div data-summary-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function I(){await H(l,A)}function b(t){const e=t.target.closest("[data-quiz]");if(!e||u!=="quiz")return;const s=e.getAttribute("data-quiz");!s||s===m||!y.includes(s)||(m=s,sessionStorage.setItem(q,s),f())}return window.addEventListener("s3phy:lang",p),l.addEventListener("click",b),z(),()=>{window.removeEventListener("s3phy:lang",p),l.removeEventListener("click",b),i==null||i(),c==null||c(),d==null||d(),n==null||n.destroy()}}export{P as mountFoundationsHub};

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsNotesWorksheet-BDPtweLl.js","./index-gTfMEpCq.js","./index-DFJVJlRu.css","./foundationsUsefulMathQuiz-DSnilfGn.js","./foundationsQuantitiesQuiz-D7bS4sIj.js"])))=>i.map(i=>d[i]);
import{t,_ as h,g as I}from"./index-gTfMEpCq.js";import{r as O,m as U,h as H,a as T}from"./hubShell-DDPfqb7-.js";import{m as N,b as C}from"./flashcardDeck-BpzoZA-B.js";const v=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],A=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],D=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}],y=["quantitiesUnits","usefulMaths"],g="s3phy.foundations.quiz";function F(l){return y.includes(l)?l:"quantitiesUnits"}function Z(l){let s=O(sessionStorage.getItem("s3phy.foundations.section")),m=F(sessionStorage.getItem(g)),i=null,u={main:null},a=null,d=null,r=null;async function S(e){const{createFoundationsNotesWorksheet:n}=await h(async()=>{const{createFoundationsNotesWorksheet:c}=await import("./foundationsNotesWorksheet-BDPtweLl.js");return{createFoundationsNotesWorksheet:c}},__vite__mapDeps([0,1,2]),import.meta.url),o=n(t);e.appendChild(o),d=o._foundationsNotesWorksheetCleanup||null}async function q(e){if(!e)return;if(a==null||a(),a=null,e.innerHTML="",m==="usefulMaths"){const{createFoundationsUsefulMathQuiz:c}=await h(async()=>{const{createFoundationsUsefulMathQuiz:L}=await import("./foundationsUsefulMathQuiz-DSnilfGn.js");return{createFoundationsUsefulMathQuiz:L}},__vite__mapDeps([3,1,2]),import.meta.url),_=c(t);e.appendChild(_),a=_._foundationsUsefulMathQuizCleanup||null;return}const{createFoundationsQuantitiesQuiz:n}=await h(async()=>{const{createFoundationsQuantitiesQuiz:c}=await import("./foundationsQuantitiesQuiz-D7bS4sIj.js");return{createFoundationsQuantitiesQuiz:c}},__vite__mapDeps([4,1,2]),import.meta.url),o=n(t);e.appendChild(o),a=o._foundationsQuantitiesQuizCleanup||null}function $(){const e=y.map(n=>`<button type="button" data-quiz="${n}" class="${m===n?"active":""}">${t(`topic.${n}`)}</button>`).join("");return`
      <section class="panel panel--quiz-embed">
        <div class="worksheet-picker">
          <p class="lead">${t("quiz.pick")}</p>
          <div class="tool-list" data-quiz-list>${e}</div>
        </div>
        <div class="worksheet-stage" data-quiz-stage></div>
      </section>`}function p(){if(u.main)if(a==null||a(),a=null,d==null||d(),d=null,r==null||r(),r=null,s==="notes")u.main.innerHTML=z(),E();else if(s==="summary")u.main.innerHTML=M(),k();else if(s==="worksheets"){u.main.innerHTML='<section class="panel panel--worksheets-embed"></section>';const e=u.main.querySelector(".panel--worksheets-embed");S(e)}else s==="quiz"?(u.main.innerHTML=$(),q(u.main.querySelector("[data-quiz-stage]"))):s==="flashcards"?r=N(u.main,{deckOptions:D.map(e=>({value:e.value,label:t(e.labelKey)})),buildDeck:e=>C(e,I()),introKey:"flashcards.introFoundations"}):u.main.innerHTML=`
        <section class="panel">
          <h2>${t(`nav.${s}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function f(){i==null||i.refreshLabels(),p()}function w(){i==null||i.destroy(),i=U(l,{subtitleKey:"strand.foundations.subtitle",activeSection:s,onSection:e=>{s=e,sessionStorage.setItem("s3phy.foundations.section",e),i.updateSection(s),p()},onLang:f}),u.main=i.main,i.updateSection(s),p()}function z(){return`
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
      </section>`}async function E(){const e=v.map(n=>({key:n.id,fileEn:n.fileEn,fileZh:n.fileZh}));await H(l,e)}function M(){return`
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
      </section>`}async function k(){await T(l,A)}function b(e){const n=e.target.closest("[data-quiz]");if(!n||s!=="quiz")return;const o=n.getAttribute("data-quiz");!o||o===m||!y.includes(o)||(m=o,sessionStorage.setItem(g,o),p())}return window.addEventListener("s3phy:lang",f),l.addEventListener("click",b),w(),()=>{window.removeEventListener("s3phy:lang",f),l.removeEventListener("click",b),a==null||a(),d==null||d(),r==null||r(),i==null||i.destroy()}}export{Z as mountFoundationsHub};

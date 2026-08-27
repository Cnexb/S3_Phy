const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsNotesWorksheet-DZiVznBk.js","./index-RIDpC2x-.js","./index-DJd_yXQN.css","./foundationsQuantitiesQuiz-CXQjwj8U.js"])))=>i.map(i=>d[i]);
import{t,_ as h,g as $}from"./index-RIDpC2x-.js";import{r as q,m as H,h as E,a as L}from"./hubShell-D2ek9WhN.js";import{m as M,b as N}from"./flashcardDeck-CuetOEtn.js";const f=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],O=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],T=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}];function K(r){let a=q(sessionStorage.getItem("s3phy.foundations.section")),n=null,i={main:null},s=null,o=null,l=null;async function y(e){const{createFoundationsNotesWorksheet:u}=await h(async()=>{const{createFoundationsNotesWorksheet:p}=await import("./foundationsNotesWorksheet-DZiVznBk.js");return{createFoundationsNotesWorksheet:p}},__vite__mapDeps([0,1,2]),import.meta.url),d=u(t);e.appendChild(d),o=d._foundationsNotesWorksheetCleanup||null}async function v(e){const{createFoundationsQuantitiesQuiz:u}=await h(async()=>{const{createFoundationsQuantitiesQuiz:p}=await import("./foundationsQuantitiesQuiz-CXQjwj8U.js");return{createFoundationsQuantitiesQuiz:p}},__vite__mapDeps([3,1,2]),import.meta.url),d=u(t);e.appendChild(d),s=d._foundationsQuantitiesQuizCleanup||null}function c(){if(i.main)if(s==null||s(),s=null,o==null||o(),o=null,l==null||l(),l=null,a==="notes")i.main.innerHTML=g(),S();else if(a==="summary")i.main.innerHTML=_(),w();else if(a==="worksheets"){i.main.innerHTML='<section class="panel panel--worksheets-embed"></section>';const e=i.main.querySelector(".panel--worksheets-embed");y(e)}else if(a==="quiz"){i.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=i.main.querySelector(".panel--quiz-embed");v(e)}else a==="flashcards"?l=M(i.main,{deckOptions:T.map(e=>({value:e.value,label:t(e.labelKey)})),buildDeck:e=>N(e,$()),introKey:"flashcards.introFoundations"}):i.main.innerHTML=`
        <section class="panel">
          <h2>${t(`nav.${a}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function m(){n==null||n.refreshLabels(),c()}function b(){n==null||n.destroy(),n=H(r,{subtitleKey:"strand.foundations.subtitle",activeSection:a,onSection:e=>{a=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(a),c()},onLang:m}),i.main=n.main,n.updateSection(a),c()}function g(){return`
      <section class="panel">
        <h2>${t("notes.title")}</h2>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${f.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${t(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function S(){const e=f.map(u=>({key:u.id,fileEn:u.fileEn,fileZh:u.fileZh}));await E(r,e)}function _(){return`
      <section class="panel">
        <h2>${t("summary.title")}</h2>
        <p class="lead">${t("summary.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${f.map(e=>`
            <div class="card" data-summary-card="${e.id}">
              <h3>${t(`summary.item.${e.id}`)}</h3>
              <div data-summary-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function w(){await L(r,O)}return window.addEventListener("s3phy:lang",m),b(),()=>{window.removeEventListener("s3phy:lang",m),s==null||s(),o==null||o(),l==null||l(),n==null||n.destroy()}}export{K as mountFoundationsHub};

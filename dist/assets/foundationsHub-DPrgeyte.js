const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsQuantitiesQuiz-gVbqXkis.js","./index-B7uA7UVj.js","./index-D6oOKDFx.css"])))=>i.map(i=>d[i]);
import{t,_ as S,g as $}from"./index-B7uA7UVj.js";import{r as _,m as q,h as w,a as H}from"./hubShell-CIVPxjm0.js";import{m as M,b as O}from"./flashcardDeck-Cp4icgG_.js";const c=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],E=[{key:"quantitiesUnits",type:"image",fileEn:"quantities-units-en.webp",fileZh:"quantities-units-zhHant.webp"},{key:"usefulMaths",type:"image",fileEn:"useful-mathematics-en.webp",fileZh:"useful-mathematics-zhHant.webp"}],L=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}];function U(u){let i=_(sessionStorage.getItem("s3phy.foundations.section")),n=null,a={main:null},s=null,o=null;async function f(e){const{createFoundationsQuantitiesQuiz:l}=await S(async()=>{const{createFoundationsQuantitiesQuiz:g}=await import("./foundationsQuantitiesQuiz-gVbqXkis.js");return{createFoundationsQuantitiesQuiz:g}},__vite__mapDeps([0,1,2]),import.meta.url),m=l(t);e.appendChild(m),s=m._foundationsQuantitiesQuizCleanup||null}function d(){if(a.main)if(s==null||s(),s=null,o==null||o(),o=null,i==="notes")a.main.innerHTML=h(),y();else if(i==="summary")a.main.innerHTML=v(),b();else if(i==="quiz"){a.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=a.main.querySelector(".panel--quiz-embed");f(e)}else i==="flashcards"?o=M(a.main,{deckOptions:L.map(e=>({value:e.value,label:t(e.labelKey)})),buildDeck:e=>O(e,$()),introKey:"flashcards.introFoundations"}):a.main.innerHTML=`
        <section class="panel">
          <h2>${t(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${t("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function r(){n==null||n.refreshLabels(),d()}function p(){n==null||n.destroy(),n=q(u,{subtitleKey:"strand.foundations.subtitle",activeSection:i,onSection:e=>{i=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(i),d()},onLang:r}),a.main=n.main,n.updateSection(i),d()}function h(){return`
      <section class="panel">
        <h2>${t("notes.title")}</h2>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${c.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${t(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function y(){const e=c.map(l=>({key:l.id,fileEn:l.fileEn,fileZh:l.fileZh}));await w(u,e)}function v(){return`
      <section class="panel">
        <h2>${t("summary.title")}</h2>
        <p class="lead">${t("summary.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${c.map(e=>`
            <div class="card" data-summary-card="${e.id}">
              <h3>${t(`summary.item.${e.id}`)}</h3>
              <div data-summary-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function b(){await H(u,E)}return window.addEventListener("s3phy:lang",r),p(),()=>{window.removeEventListener("s3phy:lang",r),s==null||s(),o==null||o(),n==null||n.destroy()}}export{U as mountFoundationsHub};

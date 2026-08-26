const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsQuantitiesQuiz-DqGEAuIM.js","./index-NZ92tK8R.js","./index-Dfqqu7BV.css"])))=>i.map(i=>d[i]);
import{t as o,_ as g,g as y}from"./index-NZ92tK8R.js";import{r as S,m as _,h as q}from"./hubShell-BRHaDzWS.js";import{m as L,b as E}from"./flashcardDeck-ItZZsKtG.js";const f=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],H=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}];function w(c){let t=S(sessionStorage.getItem("s3phy.foundations.section")),n=null,s={main:null},i=null,a=null;async function m(e){const{createFoundationsQuantitiesQuiz:l}=await g(async()=>{const{createFoundationsQuantitiesQuiz:b}=await import("./foundationsQuantitiesQuiz-DqGEAuIM.js");return{createFoundationsQuantitiesQuiz:b}},__vite__mapDeps([0,1,2]),import.meta.url),r=l(o);e.appendChild(r),i=r._foundationsQuantitiesQuizCleanup||null}function u(){if(s.main)if(i==null||i(),i=null,a==null||a(),a=null,t==="notes")s.main.innerHTML=h(),v();else if(t==="quiz"){s.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=s.main.querySelector(".panel--quiz-embed");m(e)}else t==="flashcards"?a=L(s.main,{deckOptions:H.map(e=>({value:e.value,label:o(e.labelKey)})),buildDeck:e=>E(e,y()),introKey:"flashcards.introFoundations"}):s.main.innerHTML=`
        <section class="panel">
          <h2>${o(`nav.${t}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${o("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function d(){n==null||n.refreshLabels(),u()}function p(){n==null||n.destroy(),n=_(c,{subtitleKey:"strand.foundations.subtitle",activeSection:t,onSection:e=>{t=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(t),u()},onLang:d}),s.main=n.main,n.updateSection(t),u()}function h(){return`
      <section class="panel">
        <h2>${o("notes.title")}</h2>
        <p class="lead">${o("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${f.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${o(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function v(){const e=f.map(l=>({key:l.id,fileEn:l.fileEn,fileZh:l.fileZh}));await q(c,e)}return window.addEventListener("s3phy:lang",d),p(),()=>{window.removeEventListener("s3phy:lang",d),i==null||i(),a==null||a(),n==null||n.destroy()}}export{w as mountFoundationsHub};

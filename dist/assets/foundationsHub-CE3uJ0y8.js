const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsQuantitiesQuiz-Btcs6ckp.js","./index-DMkHONTt.js","./index-Dfqqu7BV.css"])))=>i.map(i=>d[i]);
import{t as s,_ as g,g as y}from"./index-DMkHONTt.js";import{r as S,m as _,h as q}from"./hubShell-BEpE0h3y.js";import{m as L,b as $}from"./flashcardDeck-C1YB_gih.js";const p=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}],E=[{value:"all",labelKey:"flashcards.all"},{value:"quantitiesUnits",labelKey:"topic.quantitiesUnits"},{value:"usefulMaths",labelKey:"topic.usefulMaths"}];function w(c){let t=S(sessionStorage.getItem("s3phy.foundations.section")),n=null,o={main:null},i=null,a=null;async function f(e){const{createFoundationsQuantitiesQuiz:l}=await g(async()=>{const{createFoundationsQuantitiesQuiz:b}=await import("./foundationsQuantitiesQuiz-Btcs6ckp.js");return{createFoundationsQuantitiesQuiz:b}},__vite__mapDeps([0,1,2]),import.meta.url),r=l(s);e.appendChild(r),i=r._foundationsQuantitiesQuizCleanup||null}function u(){if(o.main)if(i==null||i(),i=null,a==null||a(),a=null,t==="notes")o.main.innerHTML=h(),v();else if(t==="quiz"){o.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=o.main.querySelector(".panel--quiz-embed");f(e)}else t==="flashcards"?a=L(o.main,{deckOptions:E.map(e=>({value:e.value,label:s(e.labelKey)})),buildDeck:e=>$(e,y()),introKey:"flashcards.introFoundations"}):o.main.innerHTML=`
        <section class="panel">
          <h2>${s(`nav.${t}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${s("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function d(){n==null||n.refreshLabels(),u()}function m(){n==null||n.destroy(),n=_(c,{subtitleKey:"strand.foundations.subtitle",activeSection:t,onSection:e=>{t=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(t),u()},onLang:d}),o.main=n.main,n.updateSection(t),u()}function h(){return`
      <section class="panel">
        <h2>${s("notes.title")}</h2>
        <p class="lead">${s("notes.intro")}</p>
        <p class="lead">${s("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${p.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${s(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function v(){const e=p.map(l=>({key:l.id,fileEn:l.fileEn,fileZh:l.fileZh}));await q(c,e)}return window.addEventListener("s3phy:lang",d),m(),()=>{window.removeEventListener("s3phy:lang",d),i==null||i(),a==null||a(),n==null||n.destroy()}}export{w as mountFoundationsHub};

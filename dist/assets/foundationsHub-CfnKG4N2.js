const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./foundationsQuantitiesQuiz-BzXz39Op.js","./index-DudlQnP0.js","./index-Dfqqu7BV.css"])))=>i.map(i=>d[i]);
import{t as a,_ as b}from"./index-DudlQnP0.js";import{r as g,m as y,h as S}from"./hubShell-CfC9LnD4.js";const c=[{id:"quantitiesUnits",titleKey:"topic.quantitiesUnits",fileEn:"quantities-units-en.pdf",fileZh:"quantities-units-zhHant.pdf"},{id:"usefulMaths",titleKey:"topic.usefulMaths",fileEn:"useful-mathematics-en.pdf",fileZh:"useful-mathematics-zhHant.pdf"}];function H(u){let i=g(sessionStorage.getItem("s3phy.foundations.section")),n=null,s={main:null},t=null;async function p(e){const{createFoundationsQuantitiesQuiz:o}=await b(async()=>{const{createFoundationsQuantitiesQuiz:v}=await import("./foundationsQuantitiesQuiz-BzXz39Op.js");return{createFoundationsQuantitiesQuiz:v}},__vite__mapDeps([0,1,2]),import.meta.url),l=o(a);e.appendChild(l),t=l._foundationsQuantitiesQuizCleanup||null}function d(){if(s.main)if(t==null||t(),t=null,i==="notes")s.main.innerHTML=f(),h();else if(i==="quiz"){s.main.innerHTML='<section class="panel panel--quiz-embed"></section>';const e=s.main.querySelector(".panel--quiz-embed");p(e)}else s.main.innerHTML=`
        <section class="panel">
          <h2>${a(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${a("foundations.comingSoon")}</p>
          </div>
        </section>
      `}function r(){n==null||n.refreshLabels(),d()}function m(){n==null||n.destroy(),n=y(u,{subtitleKey:"strand.foundations.subtitle",activeSection:i,onSection:e=>{i=e,sessionStorage.setItem("s3phy.foundations.section",e),n.updateSection(i),d()},onLang:r}),s.main=n.main,n.updateSection(i),d()}function f(){return`
      <section class="panel">
        <h2>${a("notes.title")}</h2>
        <p class="lead">${a("notes.intro")}</p>
        <p class="lead">${a("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${c.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${a(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function h(){const e=c.map(o=>({key:o.id,fileEn:o.fileEn,fileZh:o.fileZh}));await S(u,e)}return window.addEventListener("s3phy:lang",r),m(),()=>{window.removeEventListener("s3phy:lang",r),t==null||t(),n==null||n.destroy()}}export{H as mountFoundationsHub};

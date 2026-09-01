const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./flemingHandRulesLab-CpDjQIu8.js","./createLabIframe-D8o5sCa9.js","./index-Sk6vVDvP.js","./index-BMJ7OUGl.css"])))=>i.map(i=>d[i]);
import{t as n,_ as b}from"./index-Sk6vVDvP.js";import{r as E,l as T,m as H,c as S,h as I,s as _}from"./hubShell-kY8-O5uD.js";import{r as O,h as R}from"./toolsShell-BMZ7uaTA.js";const f="s3phy.electricity.tool",u=["flemingHandRules"],$={flemingHandRules:()=>b(()=>import("./flemingHandRulesLab-CpDjQIu8.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(o=>o.createFlemingHandRulesLab)};function p(o){return n({flemingHandRules:"tools.flemingHandRules.title"}[o]||o)}const y=[{id:"electrostatics",titleKey:"topic.electrostatics",fileEn:"electrostatics-en.pdf",fileZh:"electrostatics-zhHant.pdf"},{id:"electricCircuits",titleKey:"topic.electricCircuits",fileEn:"electric-circuits-en.pdf",fileZh:"electric-circuits-zhHant.pdf"},{id:"domesticElectricity",titleKey:"topic.domesticElectricity",fileEn:"domestic-electricity-en.pdf",fileZh:"domestic-electricity-zhHant.pdf"},{id:"electromagnetism",titleKey:"topic.electromagnetism",fileEn:"electromagnetism-en.pdf",fileZh:"electromagnetism-zhHant.pdf"},{id:"electromagneticInduction",titleKey:"topic.electromagneticInduction",fileEn:"electromagnetic-induction-en.pdf",fileZh:"electromagnetic-induction-zhHant.pdf"}];function A(o){let i=E(sessionStorage.getItem("s3phy.electricity.section")),l=T(f,u,"flemingHandRules"),t=null,a={main:null},s=null;function r(){S(s),s=null}async function g(e){e.innerHTML="",r();const c=$[l];if(!c)return;s=(await c())(n),e.appendChild(s)}function d(){a.main&&(i==="notes"?(a.main.innerHTML=v(),L()):i==="tools"?(a.main.innerHTML=O({toolOrder:u,toolId:l,getLabel:p,t:n}),R(o,{getLabel:p,t:n,getActiveToolId:()=>l,onSelectTool:e=>{l=e,_(f,l)},mountTool:e=>{g(e)}})):a.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("electricity.comingSoon")}</p>
          </div>
        </section>
      `)}function m(){t==null||t.refreshLabels(),d()}function h(){t==null||t.destroy(),t=H(o,{subtitleKey:"strand.electricity.subtitle",activeSection:i,onSection:e=>{i==="tools"&&e!=="tools"&&r(),i=e,sessionStorage.setItem("s3phy.electricity.section",e),t.updateSection(i),d()},onLang:m}),a.main=t.main,t.updateSection(i),d()}function v(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${y.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${n(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function L(){const e=y.map(c=>({key:c.id,fileEn:c.fileEn,fileZh:c.fileZh}));await I(o,e)}return window.addEventListener("s3phy:lang",m),h(),()=>{window.removeEventListener("s3phy:lang",m),r(),t==null||t.destroy()}}export{A as mountElectricityHub};

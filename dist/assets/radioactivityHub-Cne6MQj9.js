const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./radiationDeflectionLab-D6WLGd1M.js","./createLabIframe-8e5INMaB.js","./index-Bi7egCS9.js","./index-BMJ7OUGl.css"])))=>i.map(i=>d[i]);
import{t as n,_ as L}from"./index-Bi7egCS9.js";import{r as T,l as S,m as E,h as I,s as O,c as _}from"./hubShell-BM01ToX-.js";import{r as H,h as D}from"./toolsShell-BMZ7uaTA.js";const m="s3phy.radioactivity.tool",p=["radiationDeflection"],R={radiationDeflection:()=>L(()=>import("./radiationDeflectionLab-D6WLGd1M.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(o=>o.createRadiationDeflectionLab)};function u(o){return n({radiationDeflection:"tools.radiationDeflection.title"}[o]||o)}const y=[{id:"radiationRadioactivity",titleKey:"topic.radiationRadioactivity",fileEn:"radiation-radioactivity-en.pdf",fileZh:"radiation-radioactivity-zhHant.pdf"},{id:"atomicModel",titleKey:"topic.atomicModel",fileEn:"atomic-model-en.pdf",fileZh:"atomic-model-zhHant.pdf"},{id:"nuclearEnergy",titleKey:"topic.nuclearEnergy",fileEn:"nuclear-energy-en.pdf",fileZh:"nuclear-energy-zhHant.pdf"}];function C(o){let i=T(sessionStorage.getItem("s3phy.radioactivity.section")),r=S(m,p,"radiationDeflection"),e=null,d={main:null},l=null;function c(){_(l),l=null}async function v(t){t.innerHTML="",c();const a=R[r];if(!a)return;l=(await a())(n),t.appendChild(l)}function s(){d.main&&(i==="notes"?(d.main.innerHTML=g(),b()):i==="tools"?(d.main.innerHTML=H({toolOrder:p,toolId:r,getLabel:u,t:n}),D(o,{getLabel:u,t:n,getActiveToolId:()=>r,onSelectTool:t=>{r=t,O(m,r)},mountTool:t=>{v(t)}})):d.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("radioactivity.comingSoon")}</p>
          </div>
        </section>
      `)}function f(){e==null||e.refreshLabels(),s()}function h(){e==null||e.destroy(),e=E(o,{subtitleKey:"strand.radioactivity.subtitle",activeSection:i,onSection:t=>{i==="tools"&&t!=="tools"&&c(),i=t,sessionStorage.setItem("s3phy.radioactivity.section",t),e.updateSection(i),s()},onLang:f}),d.main=e.main,e.updateSection(i),s()}function g(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${y.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${n(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function b(){const t=y.map(a=>({key:a.id,fileEn:a.fileEn,fileZh:a.fileZh}));await I(o,t)}return window.addEventListener("s3phy:lang",f),h(),()=>{window.removeEventListener("s3phy:lang",f),c(),e==null||e.destroy()}}export{C as mountRadioactivityHub};

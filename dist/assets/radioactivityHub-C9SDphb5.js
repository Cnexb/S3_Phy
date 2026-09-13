const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./cloudChamberLab-BBnIPMGg.js","./createLabIframe-9eJBFeHt.js","./index-D5HkfLN5.js","./index-D9vUhwsO.css","./embedPageUrl-DWRMbVg6.js","./radiationDeflectionLab-CGK-dc7G.js"])))=>i.map(i=>d[i]);
import{t as a,_ as m}from"./index-D5HkfLN5.js";import{r as T,l as _,m as E,a as S,h as I,b as O,s as C,c as H}from"./toolsShell-Je9dA2Qh.js";const f="s3phy.radioactivity.tool",p=["cloudChamber","radiationDeflection"],R={cloudChamber:()=>m(()=>import("./cloudChamberLab-BBnIPMGg.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url).then(i=>i.createCloudChamberLab),radiationDeflection:()=>m(()=>import("./radiationDeflectionLab-CGK-dc7G.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url).then(i=>i.createRadiationDeflectionLab)};function v(i){return a({cloudChamber:"tools.cloudChamber.title",radiationDeflection:"tools.radiationDeflection.title"}[i]||i)}const y=[{id:"radiationRadioactivity",titleKey:"topic.radiationRadioactivity",fileEn:"radiation-radioactivity-en.pdf",fileZh:"radiation-radioactivity-zhHant.pdf"},{id:"atomicModel",titleKey:"topic.atomicModel",fileEn:"atomic-model-en.pdf",fileZh:"atomic-model-zhHant.pdf"},{id:"nuclearEnergy",titleKey:"topic.nuclearEnergy",fileEn:"nuclear-energy-en.pdf",fileZh:"nuclear-energy-zhHant.pdf"}];function w(i){let o=T(sessionStorage.getItem("s3phy.radioactivity.section")),r=_(f,p,"cloudChamber"),t=null,l={main:null},d=null;function c(){H(d),d=null}async function h(e){e.innerHTML="",c();const n=R[r];if(!n)return;d=(await n())(a),e.appendChild(d)}function s(){l.main&&(o==="notes"?(l.main.innerHTML=L(),g()):o==="tools"?(l.main.innerHTML=S({toolOrder:p,toolId:r,getLabel:v,t:a}),I(i,{getLabel:v,t:a,getActiveToolId:()=>r,onSelectTool:e=>{r=e,C(f,r)},mountTool:e=>{h(e)}})):l.main.innerHTML=`
        <section class="panel">
          <h2>${a(`nav.${o}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${a("radioactivity.comingSoon")}</p>
          </div>
        </section>
      `)}function u(){t==null||t.refreshLabels(),s()}function b(){t==null||t.destroy(),t=E(i,{subtitleKey:"strand.radioactivity.subtitle",activeSection:o,onSection:e=>{o==="tools"&&e!=="tools"&&c(),o=e,sessionStorage.setItem("s3phy.radioactivity.section",e),t.updateSection(o),s()},onLang:u}),l.main=t.main,t.updateSection(o),s()}function L(){return`
      <section class="panel">
        <h2>${a("notes.title")}</h2>
        <p class="lead">${a("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${y.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${a(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function g(){const e=y.map(n=>({key:n.id,fileEn:n.fileEn,fileZh:n.fileZh}));await O(i,e)}return window.addEventListener("s3phy:lang",u),b(),()=>{window.removeEventListener("s3phy:lang",u),c(),t==null||t.destroy()}}export{w as mountRadioactivityHub};

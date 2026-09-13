const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./boylesLawLab-BOcgupZF.js","./createLabIframe-9eJBFeHt.js","./index-D5HkfLN5.js","./index-D9vUhwsO.css","./embedPageUrl-DWRMbVg6.js","./charlesLawLab-pRoIWj3D.js","./pressureLawLab-DmP9US0V.js","./connectedContainersLab-DQ3HhNer.js","./kineticTheoryLab-CcSjl4QD.js"])))=>i.map(i=>d[i]);
import{t as a,_ as l}from"./index-D5HkfLN5.js";import{r as T,l as g,m as w,c as E,a as S,h as O,b as I,s as A}from"./toolsShell-Je9dA2Qh.js";const L="s3phy.gas.tool",m=["boylesLaw","charlesLaw","pressureLaw","connectedContainers","kineticTheory"],C={boylesLaw:()=>l(()=>import("./boylesLawLab-BOcgupZF.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url).then(e=>e.createBoylesLawLab),charlesLaw:()=>l(()=>import("./charlesLawLab-pRoIWj3D.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url).then(e=>e.createCharlesLawLab),pressureLaw:()=>l(()=>import("./pressureLawLab-DmP9US0V.js"),__vite__mapDeps([6,1,2,3,4]),import.meta.url).then(e=>e.createPressureLawLab),connectedContainers:()=>l(()=>import("./connectedContainersLab-DQ3HhNer.js"),__vite__mapDeps([7,1,2,3,4]),import.meta.url).then(e=>e.createConnectedContainersLab),kineticTheory:()=>l(()=>import("./kineticTheoryLab-CcSjl4QD.js"),__vite__mapDeps([8,1,2,3,4]),import.meta.url).then(e=>e.createKineticTheoryLab)};function h(e){return a({boylesLaw:"tools.boylesLaw.title",charlesLaw:"tools.charlesLaw.title",pressureLaw:"tools.pressureLaw.title",connectedContainers:"tools.connectedContainers.title",kineticTheory:"tools.kineticTheory.title"}[e]||e)}const y=[{id:"gasLaws",titleKey:"topic.gasLaws",fileEn:"gas-laws-en.pdf",fileZh:"gas-laws-zhHant.pdf"},{id:"kineticTheory",titleKey:"topic.kineticTheory",fileEn:"kinetic-theory-en.pdf",fileZh:"kinetic-theory-zhHant.pdf"}];function $(e){let n=T(sessionStorage.getItem("s3phy.gas.section")),s=g(L,m,"boylesLaw"),o=null,r={main:null},c=null;function d(){E(c),c=null}async function _(t){t.innerHTML="",d();const i=C[s];if(!i)return;c=(await i())(a),t.appendChild(c)}function u(){r.main&&(n==="notes"?(r.main.innerHTML=f(),v()):n==="tools"?(r.main.innerHTML=S({toolOrder:m,toolId:s,getLabel:h,t:a}),O(e,{getLabel:h,t:a,getActiveToolId:()=>s,onSelectTool:t=>{s=t,A(L,s)},mountTool:t=>{_(t)}})):r.main.innerHTML=`
        <section class="panel">
          <h2>${a(`nav.${n}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${a("gas.comingSoon")}</p>
          </div>
        </section>
      `)}function p(){o==null||o.refreshLabels(),u()}function b(){o==null||o.destroy(),o=w(e,{subtitleKey:"strand.gas.subtitle",activeSection:n,onSection:t=>{n==="tools"&&t!=="tools"&&d(),n=t,sessionStorage.setItem("s3phy.gas.section",t),o.updateSection(n),u()},onLang:p}),r.main=o.main,o.updateSection(n),u()}function f(){return`
      <section class="panel">
        <h2>${a("notes.title")}</h2>
        <p class="lead">${a("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${y.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${a(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function v(){const t=y.map(i=>({key:i.id,fileEn:i.fileEn,fileZh:i.fileZh}));await I(e,t)}return window.addEventListener("s3phy:lang",p),b(),()=>{window.removeEventListener("s3phy:lang",p),d(),o==null||o.destroy()}}export{$ as mountGasHub};

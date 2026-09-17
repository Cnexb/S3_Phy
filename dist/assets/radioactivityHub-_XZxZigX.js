const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./cloudChamberLab-DoCVOxsh.js","./createLabIframe-MeoI5VBv.js","./index-DAhv2-VN.js","./index-DrKyaDaG.css","./embedPageUrl-DWRMbVg6.js","./radiationDeflectionLab-D97oXdpQ.js"])))=>i.map(i=>d[i]);
import{t as a,_ as m}from"./index-DAhv2-VN.js";import{r as g,l as _,m as S,a as I,h as O,b as E,s as C,c as R}from"./toolsShell-BWKmQeV6.js";const v="s3phy.radioactivity.tool",p=["cloudChamber","radiationDeflection"],D={cloudChamber:()=>m(()=>import("./cloudChamberLab-DoCVOxsh.js"),__vite__mapDeps([0,1,2,3,4]),import.meta.url).then(o=>o.createCloudChamberLab),radiationDeflection:()=>m(()=>import("./radiationDeflectionLab-D97oXdpQ.js"),__vite__mapDeps([5,1,2,3,4]),import.meta.url).then(o=>o.createRadiationDeflectionLab)};function f(o){return a({cloudChamber:"tools.cloudChamber.title",radiationDeflection:"tools.radiationDeflection.title"}[o]||o)}const y=[{id:"radiationRadioactivity",titleKey:"topic.radiationRadioactivity",fileEn:"radiation-radioactivity-en.pdf",fileZh:"radiation-radioactivity-zhHant.pdf"}];function w(o){let i=g(sessionStorage.getItem("s3phy.radioactivity.section")),r=_(v,p,"cloudChamber"),e=null,d={main:null},l=null;function c(){R(l),l=null}async function b(t){t.innerHTML="",c();const n=D[r];if(!n)return;l=(await n())(a),t.appendChild(l)}function s(){d.main&&(i==="notes"?(d.main.innerHTML=L(),T()):i==="tools"?(d.main.innerHTML=I({toolOrder:p,toolId:r,getLabel:f,t:a}),O(o,{getLabel:f,t:a,getActiveToolId:()=>r,onSelectTool:t=>{r=t,C(v,r)},mountTool:t=>{b(t)}})):d.main.innerHTML=`
        <section class="panel">
          <h2>${a(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${a("radioactivity.comingSoon")}</p>
          </div>
        </section>
      `)}function u(){e==null||e.refreshLabels(),s()}function h(){e==null||e.destroy(),e=S(o,{subtitleKey:"strand.radioactivity.subtitle",activeSection:i,onSection:t=>{i==="tools"&&t!=="tools"&&c(),i=t,sessionStorage.setItem("s3phy.radioactivity.section",t),e.updateSection(i),s()},onLang:u}),d.main=e.main,e.updateSection(i),s()}function L(){return`
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
      </section>`}async function T(){const t=y.map(n=>({key:n.id,fileEn:n.fileEn,fileZh:n.fileZh}));await E(o,t)}return window.addEventListener("s3phy:lang",u),h(),()=>{window.removeEventListener("s3phy:lang",u),c(),e==null||e.destroy()}}export{w as mountRadioactivityHub};

const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vectorToolLab-DLjui9ok.js","./createLabIframe-C8T_FQGR.js","./index-BwACS_PB.js","./index-BtiVjpDi.css","./elevatorWeightLab-Dd4j6I_1.js","./projectileMotionLab-Bheejpny.js","./orbitalForcesLab-CVONcB1U.js"])))=>i.map(i=>d[i]);
import{t,_ as p}from"./index-BwACS_PB.js";import{l as H,s as b,m as w,c as O,h as z,a as j}from"./hubShell-CS209LS2.js";import{r as A,h as K}from"./toolsShell-C-Th6Ujm.js";const v="s3phy.mechanics.tool",d=[{id:"positionMovement",titleKey:"topic.positionMovement",fileEn:"position-movement-en.pdf",fileZh:"position-movement-zhHant.pdf"},{id:"equationOfMotion",titleKey:"topic.equationOfMotion",fileEn:"equation-of-motion-en.pdf",fileZh:"equation-of-motion-zhHant.pdf"},{id:"verticalMotion",titleKey:"topic.verticalMotion",fileEn:"vertical-motion-en.pdf",fileZh:"vertical-motion-zhHant.pdf"},{id:"motionGraph",titleKey:"topic.motionGraph",fileEn:"motion-graph-en.pdf",fileZh:"motion-graph-zhHant.pdf"},{id:"forceI",titleKey:"topic.forceI",fileEn:"force-i-en.pdf",fileZh:"force-i-zhHant.pdf"},{id:"forceII",titleKey:"topic.forceII",fileEn:"force-ii-en.pdf",fileZh:"force-ii-zhHant.pdf",tool:"elevatorWeight"},{id:"forceIII",titleKey:"topic.forceIII",fileEn:"force-iii-en.pdf",fileZh:"force-iii-zhHant.pdf"},{id:"moment",titleKey:"topic.moment",fileEn:"moment-en.pdf",fileZh:"moment-zhHant.pdf"},{id:"workEnergyPower",titleKey:"topic.workEnergyPower",fileEn:"work-energy-power-en.pdf",fileZh:"work-energy-power-zhHant.pdf"},{id:"momentum",titleKey:"topic.momentum",fileEn:"momentum-en.pdf",fileZh:"momentum-zhHant.pdf"},{id:"projectileMotion",titleKey:"topic.projectileMotion",fileEn:"projectile-motion-en.pdf",fileZh:"projectile-motion-zhHant.pdf",tool:"projectileMotion"},{id:"circularMotion",titleKey:"topic.circularMotion",fileEn:"circular-motion-en.pdf",fileZh:"circular-motion-zhHant.pdf",tool:"orbitalForces"},{id:"gravitationalForce",titleKey:"topic.gravitationalForce",fileEn:"gravitational-force-en.pdf",fileZh:"gravitational-force-zhHant.pdf",tool:"orbitalForces"}],Z={positionMovement:"position-movement",equationOfMotion:"equation-of-motion",verticalMotion:"vertical-motion",motionGraph:"motion-graph",forceI:"force-i",forceII:"force-ii",forceIII:"force-iii",moment:"moment",workEnergyPower:"work-energy-power",momentum:"momentum",projectileMotion:"projectile-motion",circularMotion:"circular-motion",gravitationalForce:"gravitational-force"},k=d.map(i=>{const o=Z[i.id];return{key:i.id,type:"image",fileEn:`${o}-en.webp`,fileZh:`${o}-zhHant.webp`}}),y=["vectorTool","elevatorWeight","projectileMotion","orbitalForces"],R={vectorTool:()=>p(()=>import("./vectorToolLab-DLjui9ok.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(i=>i.createVectorToolLab),elevatorWeight:()=>p(()=>import("./elevatorWeightLab-Dd4j6I_1.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(i=>i.createElevatorWeightLab),projectileMotion:()=>p(()=>import("./projectileMotionLab-Bheejpny.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(i=>i.createProjectileMotionLab),orbitalForces:()=>p(()=>import("./orbitalForcesLab-CVONcB1U.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(i=>i.createOrbitalForcesLab)};function E(i){return t({vectorTool:"tools.vectorTool.title",elevatorWeight:"tools.elevatorWeight.title",projectileMotion:"tools.projectileMotion.title",orbitalForces:"tools.orbitalForces.title"}[i]||i)}function q(i){let o=sessionStorage.getItem("s3phy.mechanics.section")||"topics",c=H(v,y,"projectileMotion"),n=null,r={main:null},f=null;function h(){O(f),f=null}async function M(e){e.innerHTML="",h();const a=R[c];if(!a)return;const s=(await a())(t);f=s,e.appendChild(s)}function l(){r.main&&(o==="topics"?r.main.innerHTML=I():o==="notes"?r.main.innerHTML=L():o==="tools"?(r.main.innerHTML=A({toolOrder:y,toolId:c,getLabel:E,t}),K(i,{getLabel:E,t,getActiveToolId:()=>c,onSelectTool:e=>{c=e,b(v,c)},mountTool:e=>{M(e)}})):o==="worksheets"?r.main.innerHTML=`
        <section class="panel">
          <h2>${t("worksheets.practiceTitle")}</h2>
          <p class="lead">${t("worksheets.comingSoon")}</p>
        </section>
      `:o==="quiz"?r.main.innerHTML=`
        <section class="panel">
          <h2>${t("quiz.practiceTitle")}</h2>
          <p class="lead">${t("quiz.comingSoon")}</p>
        </section>
      `:o==="flashcards"?r.main.innerHTML=`
        <section class="panel">
          <h2>${t("flashcards.title")}</h2>
          <p class="lead">${t("flashcards.comingSoon")}</p>
        </section>
      `:o==="summary"&&(r.main.innerHTML=S()),o==="notes"&&_(),o==="summary"&&$())}function u(){n==null||n.refreshLabels(),l()}function T(){n==null||n.destroy(),n=w(i,{subtitleKey:"strand.mechanics.subtitle",activeSection:o,onSection:e=>{o==="tools"&&e!=="tools"&&h(),o=e,sessionStorage.setItem("s3phy.mechanics.section",e),n.updateSection(o),l()},onLang:u}),r.main=n.main,n.updateSection(o),l()}function I(){return`
      <section class="panel panel--topic-hub">
        <h2>${t("topics.title")}</h2>
        <p class="lead">${t("topics.intro")}</p>
        <div class="grid cols-2 topic-hub-grid">
          ${d.map(e=>{const a=e.tool?`<button class="btn primary" type="button" data-go-tool="${e.tool}">${t("topic.openTool")}</button>`:`<button class="btn primary" type="button" data-go-section="notes">${t("topic.viewNotes")}</button>`;return`
            <div class="card">
              <h3>${t(e.titleKey)}</h3>
              ${a}
            </div>`}).join("")}
        </div>
      </section>`}function g(e){const a=e.target.closest("[data-go-tool]");if(a){const s=a.getAttribute("data-go-tool");y.includes(s)&&(c=s,b(v,c)),o="tools",sessionStorage.setItem("s3phy.mechanics.section","tools"),n.updateSection(o),l();return}const m=e.target.closest("[data-go-section]");(m==null?void 0:m.getAttribute("data-go-section"))==="notes"&&(o="notes",sessionStorage.setItem("s3phy.mechanics.section","notes"),n.updateSection(o),l())}function L(){return`
      <section class="panel">
        <h2>${t("notes.title")}</h2>
        <p class="lead">${t("notes.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${d.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${t(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function _(){const e=d.map(a=>({key:a.id,fileEn:a.fileEn,fileZh:a.fileZh}));await z(i,e)}function S(){return`
      <section class="panel">
        <h2>${t("summary.title")}</h2>
        <p class="lead">${t("summary.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-4" data-summary-grid>
          ${d.map(e=>`
            <div class="card" data-summary-card="${e.id}">
              <h3>${t(`summary.item.${e.id}`)}</h3>
              <div data-summary-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function $(){await j(i,k)}return window.addEventListener("s3phy:lang",u),i.addEventListener("click",g),T(),()=>{window.removeEventListener("s3phy:lang",u),i.removeEventListener("click",g),h(),n==null||n.destroy()}}export{q as mountMechanicsHub};

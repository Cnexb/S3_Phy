const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vectorToolLab-DuriKGfx.js","./createLabIframe-CNwIpMS7.js","./index-BMdk7rTM.js","./index-ZK2XJRX5.css","./elevatorWeightLab-lk92QsSP.js","./projectileMotionLab-DUBcyu5b.js","./orbitalForcesLab-7EifrMQl.js"])))=>i.map(i=>d[i]);
import{t,_ as c}from"./index-BMdk7rTM.js";import{r as b,l as L,m as H,c as S,b as w,d as $,s as O}from"./hubShell-Sz3LR5TZ.js";import{r as z,h as Z}from"./toolsShell-C-Th6Ujm.js";const u="s3phy.mechanics.tool",s=[{id:"positionMovement",titleKey:"topic.positionMovement",fileEn:"position-movement-en.pdf",fileZh:"position-movement-zhHant.pdf"},{id:"equationOfMotion",titleKey:"topic.equationOfMotion",fileEn:"equation-of-motion-en.pdf",fileZh:"equation-of-motion-zhHant.pdf"},{id:"verticalMotion",titleKey:"topic.verticalMotion",fileEn:"vertical-motion-en.pdf",fileZh:"vertical-motion-zhHant.pdf"},{id:"motionGraph",titleKey:"topic.motionGraph",fileEn:"motion-graph-en.pdf",fileZh:"motion-graph-zhHant.pdf"},{id:"forceI",titleKey:"topic.forceI",fileEn:"force-i-en.pdf",fileZh:"force-i-zhHant.pdf"},{id:"forceII",titleKey:"topic.forceII",fileEn:"force-ii-en.pdf",fileZh:"force-ii-zhHant.pdf",tool:"elevatorWeight"},{id:"forceIII",titleKey:"topic.forceIII",fileEn:"force-iii-en.pdf",fileZh:"force-iii-zhHant.pdf"},{id:"moment",titleKey:"topic.moment",fileEn:"moment-en.pdf",fileZh:"moment-zhHant.pdf"},{id:"workEnergyPower",titleKey:"topic.workEnergyPower",fileEn:"work-energy-power-en.pdf",fileZh:"work-energy-power-zhHant.pdf"},{id:"momentum",titleKey:"topic.momentum",fileEn:"momentum-en.pdf",fileZh:"momentum-zhHant.pdf"},{id:"projectileMotion",titleKey:"topic.projectileMotion",fileEn:"projectile-motion-en.pdf",fileZh:"projectile-motion-zhHant.pdf",tool:"projectileMotion"},{id:"circularMotion",titleKey:"topic.circularMotion",fileEn:"circular-motion-en.pdf",fileZh:"circular-motion-zhHant.pdf",tool:"orbitalForces"},{id:"gravitationalForce",titleKey:"topic.gravitationalForce",fileEn:"gravitational-force-en.pdf",fileZh:"gravitational-force-zhHant.pdf",tool:"orbitalForces"}],j={positionMovement:"position-movement",equationOfMotion:"equation-of-motion",verticalMotion:"vertical-motion",motionGraph:"motion-graph",forceI:"force-i",forceII:"force-ii",forceIII:"force-iii",moment:"moment",workEnergyPower:"work-energy-power",momentum:"momentum",projectileMotion:"projectile-motion",circularMotion:"circular-motion",gravitationalForce:"gravitational-force"},K=s.map(e=>{const i=j[e.id];return{key:e.id,type:"image",fileEn:`${i}-en.webp`,fileZh:`${i}-zhHant.webp`}}),v=["vectorTool","elevatorWeight","projectileMotion","orbitalForces"],A={vectorTool:()=>c(()=>import("./vectorToolLab-DuriKGfx.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(e=>e.createVectorToolLab),elevatorWeight:()=>c(()=>import("./elevatorWeightLab-lk92QsSP.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(e=>e.createElevatorWeightLab),projectileMotion:()=>c(()=>import("./projectileMotionLab-DUBcyu5b.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(e=>e.createProjectileMotionLab),orbitalForces:()=>c(()=>import("./orbitalForcesLab-7EifrMQl.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(e=>e.createOrbitalForcesLab)};function y(e){return t({vectorTool:"tools.vectorTool.title",elevatorWeight:"tools.elevatorWeight.title",projectileMotion:"tools.projectileMotion.title",orbitalForces:"tools.orbitalForces.title"}[e]||e)}function q(e){let i=b(sessionStorage.getItem("s3phy.mechanics.section")),l=L(u,v,"projectileMotion"),n=null,a={main:null},m=null;function d(){S(m),m=null}async function g(o){o.innerHTML="",d();const r=A[l];if(!r)return;const h=(await r())(t);m=h,o.appendChild(h)}function p(){a.main&&(i==="notes"?a.main.innerHTML=M():i==="tools"?(a.main.innerHTML=z({toolOrder:v,toolId:l,getLabel:y,t}),Z(e,{getLabel:y,t,getActiveToolId:()=>l,onSelectTool:o=>{l=o,O(u,l)},mountTool:o=>{g(o)}})):i==="worksheets"?a.main.innerHTML=`
        <section class="panel">
          <h2>${t("worksheets.practiceTitle")}</h2>
          <p class="lead">${t("worksheets.comingSoon")}</p>
        </section>
      `:i==="quiz"?a.main.innerHTML=`
        <section class="panel">
          <h2>${t("quiz.practiceTitle")}</h2>
          <p class="lead">${t("quiz.comingSoon")}</p>
        </section>
      `:i==="flashcards"?a.main.innerHTML=`
        <section class="panel">
          <h2>${t("flashcards.title")}</h2>
          <p class="lead">${t("flashcards.comingSoon")}</p>
        </section>
      `:i==="summary"&&(a.main.innerHTML=T()),i==="notes"&&I(),i==="summary"&&_())}function f(){n==null||n.refreshLabels(),p()}function E(){n==null||n.destroy(),n=H(e,{subtitleKey:"strand.mechanics.subtitle",activeSection:i,onSection:o=>{i==="tools"&&o!=="tools"&&d(),i=o,sessionStorage.setItem("s3phy.mechanics.section",o),n.updateSection(i),p()},onLang:f}),a.main=n.main,n.updateSection(i),p()}function M(){return`
      <section class="panel">
        <h2>${t("notes.title")}</h2>
        <p class="lead">${t("notes.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${s.map(o=>`
            <div class="card" data-note-card="${o.id}">
              <h3>${t(`notes.card.${o.id}`)}</h3>
              <div data-note-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function I(){const o=s.map(r=>({key:r.id,fileEn:r.fileEn,fileZh:r.fileZh}));await w(e,o)}function T(){return`
      <section class="panel">
        <h2>${t("summary.title")}</h2>
        <p class="lead">${t("summary.intro")}</p>
        <p class="lead">${t("notes.embedHint")}</p>
        <div class="grid cols-4" data-summary-grid>
          ${s.map(o=>`
            <div class="card" data-summary-card="${o.id}">
              <h3>${t(`summary.item.${o.id}`)}</h3>
              <div data-summary-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function _(){await $(e,K)}return window.addEventListener("s3phy:lang",f),E(),()=>{window.removeEventListener("s3phy:lang",f),d(),n==null||n.destroy()}}export{q as mountMechanicsHub};

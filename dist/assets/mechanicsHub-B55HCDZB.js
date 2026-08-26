const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vectorToolLab-taEi8bWe.js","./createLabIframe-gQEIQ5yv.js","./index-CAfFDNgh.js","./index-Dfqqu7BV.css","./elevatorWeightLab-CpzUN7GR.js","./projectileMotionLab-DaeSSv8I.js","./orbitalForcesLab-BJ1vklsP.js"])))=>i.map(i=>d[i]);
import{t as i,_ as c}from"./index-CAfFDNgh.js";import{r as L,l as b,m as H,c as S,h as w,d as O,s as $}from"./hubShell-D0cBgiXT.js";import{r as z,h as Z}from"./toolsShell-C-Th6Ujm.js";const u="s3phy.mechanics.tool",s=[{id:"positionMovement",titleKey:"topic.positionMovement",fileEn:"position-movement-en.pdf",fileZh:"position-movement-zhHant.pdf"},{id:"equationOfMotion",titleKey:"topic.equationOfMotion",fileEn:"equation-of-motion-en.pdf",fileZh:"equation-of-motion-zhHant.pdf"},{id:"verticalMotion",titleKey:"topic.verticalMotion",fileEn:"vertical-motion-en.pdf",fileZh:"vertical-motion-zhHant.pdf"},{id:"motionGraph",titleKey:"topic.motionGraph",fileEn:"motion-graph-en.pdf",fileZh:"motion-graph-zhHant.pdf"},{id:"forceI",titleKey:"topic.forceI",fileEn:"force-i-en.pdf",fileZh:"force-i-zhHant.pdf"},{id:"forceII",titleKey:"topic.forceII",fileEn:"force-ii-en.pdf",fileZh:"force-ii-zhHant.pdf",tool:"elevatorWeight"},{id:"forceIII",titleKey:"topic.forceIII",fileEn:"force-iii-en.pdf",fileZh:"force-iii-zhHant.pdf"},{id:"moment",titleKey:"topic.moment",fileEn:"moment-en.pdf",fileZh:"moment-zhHant.pdf"},{id:"workEnergyPower",titleKey:"topic.workEnergyPower",fileEn:"work-energy-power-en.pdf",fileZh:"work-energy-power-zhHant.pdf"},{id:"momentum",titleKey:"topic.momentum",fileEn:"momentum-en.pdf",fileZh:"momentum-zhHant.pdf"},{id:"projectileMotion",titleKey:"topic.projectileMotion",fileEn:"projectile-motion-en.pdf",fileZh:"projectile-motion-zhHant.pdf",tool:"projectileMotion"},{id:"circularMotion",titleKey:"topic.circularMotion",fileEn:"circular-motion-en.pdf",fileZh:"circular-motion-zhHant.pdf",tool:"orbitalForces"},{id:"gravitationalForce",titleKey:"topic.gravitationalForce",fileEn:"gravitational-force-en.pdf",fileZh:"gravitational-force-zhHant.pdf",tool:"orbitalForces"}],j={positionMovement:"position-movement",equationOfMotion:"equation-of-motion",verticalMotion:"vertical-motion",motionGraph:"motion-graph",forceI:"force-i",forceII:"force-ii",forceIII:"force-iii",moment:"moment",workEnergyPower:"work-energy-power",momentum:"momentum",projectileMotion:"projectile-motion",circularMotion:"circular-motion",gravitationalForce:"gravitational-force"},K=s.map(e=>{const t=j[e.id];return{key:e.id,type:"image",fileEn:`${t}-en.webp`,fileZh:`${t}-zhHant.webp`}}),v=["vectorTool","elevatorWeight","projectileMotion","orbitalForces"],A={vectorTool:()=>c(()=>import("./vectorToolLab-taEi8bWe.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(e=>e.createVectorToolLab),elevatorWeight:()=>c(()=>import("./elevatorWeightLab-CpzUN7GR.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(e=>e.createElevatorWeightLab),projectileMotion:()=>c(()=>import("./projectileMotionLab-DaeSSv8I.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(e=>e.createProjectileMotionLab),orbitalForces:()=>c(()=>import("./orbitalForcesLab-BJ1vklsP.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(e=>e.createOrbitalForcesLab)};function y(e){return i({vectorTool:"tools.vectorTool.title",elevatorWeight:"tools.elevatorWeight.title",projectileMotion:"tools.projectileMotion.title",orbitalForces:"tools.orbitalForces.title"}[e]||e)}function q(e){let t=L(sessionStorage.getItem("s3phy.mechanics.section")),l=b(u,v,"projectileMotion"),n=null,a={main:null},m=null;function d(){S(m),m=null}async function g(o){o.innerHTML="",d();const r=A[l];if(!r)return;const h=(await r())(i);m=h,o.appendChild(h)}function p(){a.main&&(t==="notes"?a.main.innerHTML=M():t==="tools"?(a.main.innerHTML=z({toolOrder:v,toolId:l,getLabel:y,t:i}),Z(e,{getLabel:y,t:i,getActiveToolId:()=>l,onSelectTool:o=>{l=o,$(u,l)},mountTool:o=>{g(o)}})):t==="worksheets"?a.main.innerHTML=`
        <section class="panel">
          <h2>${i("worksheets.practiceTitle")}</h2>
          <p class="lead">${i("worksheets.comingSoon")}</p>
        </section>
      `:t==="quiz"?a.main.innerHTML=`
        <section class="panel">
          <h2>${i("quiz.practiceTitle")}</h2>
          <p class="lead">${i("quiz.comingSoon")}</p>
        </section>
      `:t==="flashcards"?a.main.innerHTML=`
        <section class="panel">
          <h2>${i("flashcards.title")}</h2>
          <p class="lead">${i("flashcards.comingSoon")}</p>
        </section>
      `:t==="summary"&&(a.main.innerHTML=T()),t==="notes"&&I(),t==="summary"&&_())}function f(){n==null||n.refreshLabels(),p()}function E(){n==null||n.destroy(),n=H(e,{subtitleKey:"strand.mechanics.subtitle",activeSection:t,onSection:o=>{t==="tools"&&o!=="tools"&&d(),t=o,sessionStorage.setItem("s3phy.mechanics.section",o),n.updateSection(t),p()},onLang:f}),a.main=n.main,n.updateSection(t),p()}function M(){return`
      <section class="panel">
        <h2>${i("notes.title")}</h2>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${s.map(o=>`
            <div class="card" data-note-card="${o.id}">
              <h3>${i(`notes.card.${o.id}`)}</h3>
              <div data-note-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function I(){const o=s.map(r=>({key:r.id,fileEn:r.fileEn,fileZh:r.fileZh}));await w(e,o)}function T(){return`
      <section class="panel">
        <h2>${i("summary.title")}</h2>
        <p class="lead">${i("summary.intro")}</p>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-4" data-summary-grid>
          ${s.map(o=>`
            <div class="card" data-summary-card="${o.id}">
              <h3>${i(`summary.item.${o.id}`)}</h3>
              <div data-summary-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function _(){await O(e,K)}return window.addEventListener("s3phy:lang",f),E(),()=>{window.removeEventListener("s3phy:lang",f),d(),n==null||n.destroy()}}export{q as mountMechanicsHub};

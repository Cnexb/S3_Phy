const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vectorToolLab-BD9SrJiK.js","./createLabIframe-BnyZMF-N.js","./index-DnTYw8l2.js","./index-D16P_DNl.css","./elevatorWeightLab-D7N4R78H.js","./projectileMotionLab-BAjspq_q.js"])))=>i.map(i=>d[i]);
import{t,_ as u}from"./index-DnTYw8l2.js";import{l as _,s as M,m as w,c as O,h as z,a as j}from"./hubShell-BRVvORhA.js";import{r as K,h as Z}from"./toolsShell-C-Th6Ujm.js";const v="s3phy.mechanics.tool",d=[{id:"positionMovement",titleKey:"topic.positionMovement",fileEn:"position-movement-en.pdf",fileZh:"position-movement-zhHant.pdf"},{id:"equationOfMotion",titleKey:"topic.equationOfMotion",fileEn:"equation-of-motion-en.pdf",fileZh:"equation-of-motion-zhHant.pdf"},{id:"verticalMotion",titleKey:"topic.verticalMotion",fileEn:"vertical-motion-en.pdf",fileZh:"vertical-motion-zhHant.pdf"},{id:"motionGraph",titleKey:"topic.motionGraph",fileEn:"motion-graph-en.pdf",fileZh:"motion-graph-zhHant.pdf"},{id:"forceI",titleKey:"topic.forceI",fileEn:"force-i-en.pdf",fileZh:"force-i-zhHant.pdf"},{id:"forceII",titleKey:"topic.forceII",fileEn:"force-ii-en.pdf",fileZh:"force-ii-zhHant.pdf",tool:"elevatorWeight"},{id:"forceIII",titleKey:"topic.forceIII",fileEn:"force-iii-en.pdf",fileZh:"force-iii-zhHant.pdf"},{id:"moment",titleKey:"topic.moment",fileEn:"moment-en.pdf",fileZh:"moment-zhHant.pdf"},{id:"workEnergyPower",titleKey:"topic.workEnergyPower",fileEn:"work-energy-power-en.pdf",fileZh:"work-energy-power-zhHant.pdf"},{id:"momentum",titleKey:"topic.momentum",fileEn:"momentum-en.pdf",fileZh:"momentum-zhHant.pdf"},{id:"projectileMotion",titleKey:"topic.projectileMotion",fileEn:"projectile-motion-en.pdf",fileZh:"projectile-motion-zhHant.pdf",tool:"projectileMotion"},{id:"circularMotion",titleKey:"topic.circularMotion",fileEn:"circular-motion-en.pdf",fileZh:"circular-motion-zhHant.pdf"},{id:"gravitationalForce",titleKey:"topic.gravitationalForce",fileEn:"gravitational-force-en.pdf",fileZh:"gravitational-force-zhHant.pdf"}],A={positionMovement:"position-movement",equationOfMotion:"equation-of-motion",verticalMotion:"vertical-motion",motionGraph:"motion-graph",forceI:"force-i",forceII:"force-ii",forceIII:"force-iii",moment:"moment",workEnergyPower:"work-energy-power",momentum:"momentum",projectileMotion:"projectile-motion",circularMotion:"circular-motion",gravitationalForce:"gravitational-force"},k=d.map(i=>{const o=A[i.id];return{key:i.id,type:"image",fileEn:`${o}-en.webp`,fileZh:`${o}-zhHant.webp`}}),y=["vectorTool","elevatorWeight","projectileMotion"],R={vectorTool:()=>u(()=>import("./vectorToolLab-BD9SrJiK.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(i=>i.createVectorToolLab),elevatorWeight:()=>u(()=>import("./elevatorWeightLab-D7N4R78H.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(i=>i.createElevatorWeightLab),projectileMotion:()=>u(()=>import("./projectileMotionLab-BAjspq_q.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(i=>i.createProjectileMotionLab)};function E(i){return t({vectorTool:"tools.vectorTool.title",elevatorWeight:"tools.elevatorWeight.title",projectileMotion:"tools.projectileMotion.title"}[i]||i)}function W(i){let o=sessionStorage.getItem("s3phy.mechanics.section")||"topics",c=_(v,y,"projectileMotion"),n=null,r={main:null},m=null;function f(){O(m),m=null}async function T(e){e.innerHTML="",f();const a=R[c];if(!a)return;const s=(await a())(t);m=s,e.appendChild(s)}function l(){r.main&&(o==="topics"?r.main.innerHTML=b():o==="notes"?r.main.innerHTML=L():o==="tools"?(r.main.innerHTML=K({toolOrder:y,toolId:c,getLabel:E,t}),Z(i,{getLabel:E,t,getActiveToolId:()=>c,onSelectTool:e=>{c=e,M(v,c)},mountTool:e=>{T(e)}})):o==="worksheets"?r.main.innerHTML=`
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
      `:o==="summary"&&(r.main.innerHTML=$()),o==="notes"&&S(),o==="summary"&&H())}function h(){n==null||n.refreshLabels(),l()}function I(){n==null||n.destroy(),n=w(i,{subtitleKey:"strand.mechanics.subtitle",activeSection:o,onSection:e=>{o==="tools"&&e!=="tools"&&f(),o=e,sessionStorage.setItem("s3phy.mechanics.section",e),n.updateSection(o),l()},onLang:h}),r.main=n.main,n.updateSection(o),l()}function b(){return`
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
      </section>`}function g(e){const a=e.target.closest("[data-go-tool]");if(a){const s=a.getAttribute("data-go-tool");y.includes(s)&&(c=s,M(v,c)),o="tools",sessionStorage.setItem("s3phy.mechanics.section","tools"),n.updateSection(o),l();return}const p=e.target.closest("[data-go-section]");(p==null?void 0:p.getAttribute("data-go-section"))==="notes"&&(o="notes",sessionStorage.setItem("s3phy.mechanics.section","notes"),n.updateSection(o),l())}function L(){return`
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
      </section>`}async function S(){const e=d.map(a=>({key:a.id,fileEn:a.fileEn,fileZh:a.fileZh}));await z(i,e)}function $(){return`
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
      </section>`}async function H(){await j(i,k)}return window.addEventListener("s3phy:lang",h),i.addEventListener("click",g),I(),()=>{window.removeEventListener("s3phy:lang",h),i.removeEventListener("click",g),f(),n==null||n.destroy()}}export{W as mountMechanicsHub};

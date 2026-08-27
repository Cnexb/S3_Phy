const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./vectorToolLab-DhiXe6Hp.js","./createLabIframe-CHF3imhM.js","./index-gTfMEpCq.js","./index-DFJVJlRu.css","./newtonFirstLawLab-DvaRgbB-.js","./elevatorWeightLab-xbM5H79-.js","./stackedBoxesLab-CBPwx7Pc.js","./projectileMotionLab-CkhsyLb7.js","./orbitalForcesLab-DecLUad-.js"])))=>i.map(i=>d[i]);
import{t as i,_ as c,g as I}from"./index-gTfMEpCq.js";import{r as T,l as S,m as H,c as O,h as K,a as k,s as $}from"./hubShell-DDPfqb7-.js";import{r as z,h as A}from"./toolsShell-Bcq8XcZY.js";import{m as Z,d as j}from"./flashcardDeck-BpzoZA-B.js";const v="s3phy.mechanics.tool",m=[{id:"positionMovement",titleKey:"topic.positionMovement",fileEn:"position-movement-en.pdf",fileZh:"position-movement-zhHant.pdf"},{id:"equationOfMotion",titleKey:"topic.equationOfMotion",fileEn:"equation-of-motion-en.pdf",fileZh:"equation-of-motion-zhHant.pdf"},{id:"verticalMotion",titleKey:"topic.verticalMotion",fileEn:"vertical-motion-en.pdf",fileZh:"vertical-motion-zhHant.pdf"},{id:"motionGraph",titleKey:"topic.motionGraph",fileEn:"motion-graph-en.pdf",fileZh:"motion-graph-zhHant.pdf"},{id:"forceI",titleKey:"topic.forceI",fileEn:"force-i-en.pdf",fileZh:"force-i-zhHant.pdf",tool:"newtonFirstLaw"},{id:"forceII",titleKey:"topic.forceII",fileEn:"force-ii-en.pdf",fileZh:"force-ii-zhHant.pdf",tool:"elevatorWeight"},{id:"forceIII",titleKey:"topic.forceIII",fileEn:"force-iii-en.pdf",fileZh:"force-iii-zhHant.pdf",tool:"stackedBoxes"},{id:"moment",titleKey:"topic.moment",fileEn:"moment-en.pdf",fileZh:"moment-zhHant.pdf"},{id:"workEnergyPower",titleKey:"topic.workEnergyPower",fileEn:"work-energy-power-en.pdf",fileZh:"work-energy-power-zhHant.pdf"},{id:"momentum",titleKey:"topic.momentum",fileEn:"momentum-en.pdf",fileZh:"momentum-zhHant.pdf"},{id:"projectileMotion",titleKey:"topic.projectileMotion",fileEn:"projectile-motion-en.pdf",fileZh:"projectile-motion-zhHant.pdf",tool:"projectileMotion"},{id:"circularMotion",titleKey:"topic.circularMotion",fileEn:"circular-motion-en.pdf",fileZh:"circular-motion-zhHant.pdf",tool:"orbitalForces"},{id:"gravitationalForce",titleKey:"topic.gravitationalForce",fileEn:"gravitational-force-en.pdf",fileZh:"gravitational-force-zhHant.pdf",tool:"orbitalForces"}],F={positionMovement:"position-movement",equationOfMotion:"equation-of-motion",verticalMotion:"vertical-motion",motionGraph:"motion-graph",forceI:"force-i",forceII:"force-ii",forceIII:"force-iii",moment:"moment",workEnergyPower:"work-energy-power",momentum:"momentum",projectileMotion:"projectile-motion",circularMotion:"circular-motion",gravitationalForce:"gravitational-force"},P=m.map(e=>{const t=F[e.id];return{key:e.id,type:"image",fileEn:`${t}-en.webp`,fileZh:`${t}-zhHant.webp`}}),R=[{value:"all",labelKey:"flashcards.all"},...m.map(e=>({value:e.id,labelKey:e.titleKey}))],y=["vectorTool","newtonFirstLaw","elevatorWeight","stackedBoxes","projectileMotion","orbitalForces"],C={vectorTool:()=>c(()=>import("./vectorToolLab-DhiXe6Hp.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(e=>e.createVectorToolLab),newtonFirstLaw:()=>c(()=>import("./newtonFirstLawLab-DvaRgbB-.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(e=>e.createNewtonFirstLawLab),elevatorWeight:()=>c(()=>import("./elevatorWeightLab-xbM5H79-.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(e=>e.createElevatorWeightLab),stackedBoxes:()=>c(()=>import("./stackedBoxesLab-CBPwx7Pc.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(e=>e.createStackedBoxesLab),projectileMotion:()=>c(()=>import("./projectileMotionLab-CkhsyLb7.js"),__vite__mapDeps([7,1,2,3]),import.meta.url).then(e=>e.createProjectileMotionLab),orbitalForces:()=>c(()=>import("./orbitalForcesLab-DecLUad-.js"),__vite__mapDeps([8,1,2,3]),import.meta.url).then(e=>e.createOrbitalForcesLab)};function E(e){return i({vectorTool:"tools.vectorTool.title",newtonFirstLaw:"tools.newtonFirstLaw.title",elevatorWeight:"tools.elevatorWeight.title",stackedBoxes:"tools.stackedBoxes.title",projectileMotion:"tools.projectileMotion.title",orbitalForces:"tools.orbitalForces.title"}[e]||e)}function V(e){let t=T(sessionStorage.getItem("s3phy.mechanics.section")),s=S(v,y,"projectileMotion"),n=null,a={main:null},d=null,r=null;function p(){O(d),d=null}async function _(o){o.innerHTML="",p();const l=C[s];if(!l)return;const h=(await l())(i);d=h,o.appendChild(h)}function f(){a.main&&(r==null||r(),r=null,t==="notes"?a.main.innerHTML=L():t==="tools"?(a.main.innerHTML=z({toolOrder:y,toolId:s,getLabel:E,t:i}),A(e,{getLabel:E,t:i,getActiveToolId:()=>s,onSelectTool:o=>{s=o,$(v,s)},mountTool:o=>{_(o)}})):t==="worksheets"?a.main.innerHTML=`
        <section class="panel">
          <h2>${i("worksheets.practiceTitle")}</h2>
          <p class="lead">${i("worksheets.comingSoon")}</p>
        </section>
      `:t==="quiz"?a.main.innerHTML=`
        <section class="panel">
          <h2>${i("quiz.practiceTitle")}</h2>
          <p class="lead">${i("quiz.comingSoon")}</p>
        </section>
      `:t==="flashcards"?r=Z(a.main,{deckOptions:R.map(o=>({value:o.value,label:i(o.labelKey)})),buildDeck:o=>j(o,I()),introKey:"flashcards.introMechanics"}):t==="summary"&&(a.main.innerHTML=b()),t==="notes"&&M(),t==="summary"&&w())}function u(){n==null||n.refreshLabels(),f()}function g(){n==null||n.destroy(),n=H(e,{subtitleKey:"strand.mechanics.subtitle",activeSection:t,onSection:o=>{t==="tools"&&o!=="tools"&&p(),t=o,sessionStorage.setItem("s3phy.mechanics.section",o),n.updateSection(t),f()},onLang:u}),a.main=n.main,n.updateSection(t),f()}function L(){return`
      <section class="panel">
        <h2>${i("notes.title")}</h2>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${m.map(o=>`
            <div class="card" data-note-card="${o.id}">
              <h3>${i(`notes.card.${o.id}`)}</h3>
              <div data-note-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function M(){const o=m.map(l=>({key:l.id,fileEn:l.fileEn,fileZh:l.fileZh}));await K(e,o)}function b(){return`
      <section class="panel">
        <h2>${i("summary.title")}</h2>
        <p class="lead">${i("summary.intro")}</p>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-4" data-summary-grid>
          ${m.map(o=>`
            <div class="card" data-summary-card="${o.id}">
              <h3>${i(`summary.item.${o.id}`)}</h3>
              <div data-summary-body></div>
            </div>
          `).join("")}
        </div>
      </section>`}async function w(){await k(e,P)}return window.addEventListener("s3phy:lang",u),g(),()=>{window.removeEventListener("s3phy:lang",u),r==null||r(),p(),n==null||n.destroy()}}export{V as mountMechanicsHub};

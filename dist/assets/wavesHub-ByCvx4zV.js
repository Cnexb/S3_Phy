const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./waveMotionLab-DBlOvOwi.js","./createLabIframe-BnyZMF-N.js","./index-DnTYw8l2.js","./index-D16P_DNl.css","./longitudinalWaveLab-D6dqx96D.js","./waveInterferenceLab-bp-b396v.js","./waveDiffractionLab-C2n41fGK.js","./thinFilmInterferenceLab--Agdcdhg.js","./diffractionGratingCompareLab-FOQK-fSp.js","./spectralOverlapLab-BoEsrCA0.js","./ultrasoundReflectionLab-CjuI4OKF.js","./soundRefractionShadowLab-C-bDTf4b.js"])))=>i.map(i=>d[i]);
import{t as n,_ as r}from"./index-DnTYw8l2.js";import{l as S,s as g,m as O,h as R,c as $}from"./hubShell-BRVvORhA.js";import{r as A,h as D}from"./toolsShell-C-Th6Ujm.js";const m="s3phy.waves.tool",h=[{id:"waveMotion",titleKey:"topic.waveMotion",fileEn:"wave-motion-en.pdf",fileZh:"wave-motion-zhHant.pdf",tool:"waveMotion"},{id:"waveProperties",titleKey:"topic.waveProperties",fileEn:"wave-properties-en.pdf",fileZh:"wave-properties-zhHant.pdf",tool:"waveInterference"},{id:"stationaryWave",titleKey:"topic.stationaryWave",fileEn:"stationary-wave-en.pdf",fileZh:"stationary-wave-zhHant.pdf"},{id:"lightWave",titleKey:"topic.lightWave",fileEn:"light-wave-en.pdf",fileZh:"light-wave-zhHant.pdf",tool:"thinFilmInterference"},{id:"soundWave",titleKey:"topic.soundWave",fileEn:"sound-wave-en.pdf",fileZh:"sound-wave-zhHant.pdf",tool:"ultrasoundReflection"}],_=["waveMotion","longitudinalWave","waveInterference","waveDiffraction","thinFilmInterference","diffractionGratingCompare","spectralOverlap","ultrasoundReflection","soundRefractionShadow"],M={waveMotion:()=>r(()=>import("./waveMotionLab-DBlOvOwi.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(e=>e.createWaveMotionLab),longitudinalWave:()=>r(()=>import("./longitudinalWaveLab-D6dqx96D.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(e=>e.createLongitudinalWaveLab),waveInterference:()=>r(()=>import("./waveInterferenceLab-bp-b396v.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(e=>e.createWaveInterferenceLab),waveDiffraction:()=>r(()=>import("./waveDiffractionLab-C2n41fGK.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(e=>e.createWaveDiffractionLab),thinFilmInterference:()=>r(()=>import("./thinFilmInterferenceLab--Agdcdhg.js"),__vite__mapDeps([7,1,2,3]),import.meta.url).then(e=>e.createThinFilmInterferenceLab),diffractionGratingCompare:()=>r(()=>import("./diffractionGratingCompareLab-FOQK-fSp.js"),__vite__mapDeps([8,1,2,3]),import.meta.url).then(e=>e.createDiffractionGratingCompareLab),spectralOverlap:()=>r(()=>import("./spectralOverlapLab-BoEsrCA0.js"),__vite__mapDeps([9,1,2,3]),import.meta.url).then(e=>e.createSpectralOverlapLab),ultrasoundReflection:()=>r(()=>import("./ultrasoundReflectionLab-CjuI4OKF.js"),__vite__mapDeps([10,1,2,3]),import.meta.url).then(e=>e.createUltrasoundReflectionLab),soundRefractionShadow:()=>r(()=>import("./soundRefractionShadowLab-C-bDTf4b.js"),__vite__mapDeps([11,1,2,3]),import.meta.url).then(e=>e.createSoundRefractionShadowLab)};function b(e){return n({waveMotion:"tools.waveMotion.title",longitudinalWave:"tools.longitudinalWave.title",waveInterference:"tools.waveInterference.title",waveDiffraction:"tools.waveDiffraction.title",thinFilmInterference:"tools.thinFilmInterference.title",diffractionGratingCompare:"tools.diffractionGratingCompare.title",spectralOverlap:"tools.spectralOverlap.title",ultrasoundReflection:"tools.ultrasoundReflection.title",soundRefractionShadow:"tools.soundRefractionShadow.title"}[e]||e)}function C(e){let i=sessionStorage.getItem("s3phy.waves.section")||"topics",l=S(m,_,"waveMotion"),o=null,s={main:null},v=null;function f(){$(v),v=null}async function L(t){t.innerHTML="",f();const a=M[l];if(!a)return;const d=(await a())(n);v=d,t.appendChild(d)}function c(){s.main&&(i==="topics"?s.main.innerHTML=E():i==="notes"?(s.main.innerHTML=I(),T()):i==="tools"?(s.main.innerHTML=A({toolOrder:_,toolId:l,getLabel:b,t:n}),D(e,{getLabel:b,t:n,getActiveToolId:()=>l,onSelectTool:t=>{l=t,g(m,l)},mountTool:t=>{L(t)}})):s.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("waves.comingSoon")}</p>
          </div>
        </section>
      `)}function u(){o==null||o.refreshLabels(),c()}function y(){o==null||o.destroy(),o=O(e,{subtitleKey:"strand.waves.subtitle",activeSection:i,onSection:t=>{i==="tools"&&t!=="tools"&&f(),i=t,sessionStorage.setItem("s3phy.waves.section",t),o.updateSection(i),c()},onLang:u}),s.main=o.main,o.updateSection(i),c()}function E(){return`
      <section class="panel panel--topic-hub">
        <h2>${n("topics.title")}</h2>
        <p class="lead">${n("topics.intro")}</p>
        <div class="grid cols-3 topic-hub-grid">
          ${h.map(t=>{const a=t.tool?`<button class="btn primary" type="button" data-go-tool="${t.tool}">${n("topic.openTool")}</button>`:`<button class="btn primary" type="button" disabled>${n("topic.openTool")}</button>`;return`
            <div class="card">
              <h3>${n(t.titleKey)}</h3>
              ${a}
            </div>`}).join("")}
        </div>
      </section>
    `}function I(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.intro")}</p>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-3" data-notes-grid>
          ${h.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${n(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function T(){const t=h.map(a=>({key:a.id,fileEn:a.fileEn,fileZh:a.fileZh}));await R(e,t)}function w(t){const a=t.target.closest("[data-go-tool]");if(a){const d=a.getAttribute("data-go-tool");_.includes(d)&&(l=d,g(m,l)),i="tools",sessionStorage.setItem("s3phy.waves.section","tools"),o.updateSection(i),c();return}const p=t.target.closest("[data-go-section]");(p==null?void 0:p.getAttribute("data-go-section"))==="notes"&&(i="notes",sessionStorage.setItem("s3phy.waves.section","notes"),o.updateSection(i),c())}return e.addEventListener("click",w),window.addEventListener("s3phy:lang",u),y(),()=>{e.removeEventListener("click",w),window.removeEventListener("s3phy:lang",u),f(),o==null||o.destroy()}}export{C as mountWavesHub};

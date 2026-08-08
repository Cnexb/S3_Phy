const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./opticsLightLensWorksheet-DQGMok8Q.js","./index-BwACS_PB.js","./index-BtiVjpDi.css","./refractionLab-b5MUuYX5.js","./createLabIframe-C8T_FQGR.js","./tirEscapeLab-zcr7dfOe.js"])))=>i.map(i=>d[i]);
import{t as e,_ as y,g as P}from"./index-BwACS_PB.js";import{l as j,m as z,c as V,s as g,h as Z,a as W}from"./hubShell-CS209LS2.js";import{r as Y,h as U}from"./toolsShell-C-Th6Ujm.js";import{m as q,b as x}from"./flashcardDeck-Bw-9B8Qi.js";const _=["refraction","refractionTir"],v="s3phy.refraction.tool",F=["lightLens"],G="20260627-em-v2",k=[{key:"refraction",fileEn:"refraction-en.pdf",fileZh:"refraction-zhHant.pdf"},{key:"tir",fileEn:"tir-en.pdf",fileZh:"tir-zhHant.pdf"}],E=[{key:"refraction",type:"image",fileEn:"refraction-en.webp",fileZh:"refraction-zhHant.webp"},{key:"tir",type:"image",fileEn:"tir-en.webp",fileZh:"tir-zhHant.webp"}],S={lightLens:()=>y(()=>import("./opticsLightLensWorksheet-DQGMok8Q.js"),__vite__mapDeps([0,1,2]),import.meta.url).then(o=>o.createOpticsLightLensWorksheet)},B={refraction:()=>y(()=>import("./refractionLab-b5MUuYX5.js"),__vite__mapDeps([3,4,1,2]),import.meta.url).then(o=>o.createRefractionLab),refractionTir:()=>y(()=>import("./tirEscapeLab-zcr7dfOe.js"),__vite__mapDeps([5,4,1,2]),import.meta.url).then(o=>o.createTirEscapeLab)};function O(o){return e({refraction:"tools.refraction.title",refractionTir:"tools.refractionTir.title"}[o]||o)}function J(o){return e({lightLens:"worksheets.opticsLightLensTitle"}[o]||o)}function nt(o){let n=sessionStorage.getItem("s3phy.refraction.section")||"topics",d=j(v,_,"refraction"),f="lightLens",a=null,c={main:null},m=null,l=null,r=null;const w=[{value:"refractionTir",labelKey:"flashcards.deck.refractionTir"}];function h(){V(m),m=null}async function R(t){t.innerHTML="",h();const i=B[d];if(!i)return;const s=(await i())(e);m=s,t.appendChild(s)}async function $(t){if(!t)return;r==null||r(),r=null,t.innerHTML="";const i=S[f];if(!i)return;const s=(await i())(e);t.appendChild(s),r=s._opticsLightLensWorksheetCleanup||null}function A(){const t=F.map(i=>`<button type="button" data-worksheet="${i}" class="${f===i?"active":""}">${J(i)}</button>`).join("");return`
      <section class="panel panel--worksheets-embed">
        <div class="worksheet-picker">
          <p class="lead">${e("worksheets.pick")}</p>
          <div class="tool-list" data-worksheet-list>${t}</div>
        </div>
        <div class="worksheet-stage" data-worksheet-stage></div>
      </section>`}function p(){c.main&&(l==null||l(),l=null,r==null||r(),r=null,n==="topics"?c.main.innerHTML=H():n==="notes"?c.main.innerHTML=C():n==="tools"?c.main.innerHTML=Y({toolOrder:_,toolId:d,getLabel:O,t:e}):n==="worksheets"?(c.main.innerHTML=A(),$(c.main.querySelector("[data-worksheet-stage]"))):n==="flashcards"?l=q(c.main,{deckOptions:w.map(t=>({value:t.value,label:e(t.labelKey)})),buildDeck:t=>x(t,P())}):n==="summary"&&(c.main.innerHTML=N()),n==="notes"&&D(),n==="tools"&&U(o,{getLabel:O,t:e,getActiveToolId:()=>d,onSelectTool:t=>{d=t,g(v,d)},mountTool:t=>{R(t)}}),n==="summary"&&K())}function L(){a==null||a.refreshLabels(),p()}function I(){a==null||a.destroy(),a=z(o,{subtitleKey:"strand.refraction.subtitle",activeSection:n,onSection:t=>{n==="tools"&&t!=="tools"&&h(),n=t,sessionStorage.setItem("s3phy.refraction.section",t),a.updateSection(n),p()},onLang:L}),c.main=a.main,a.updateSection(n),p()}function H(){const t=[["refraction","topic.refractionSnell"],["refractionTir","topic.refractionTir"]];return`
      <section class="panel panel--topic-hub">
        <h2>${e("topics.title")}</h2>
        <p class="lead">${e("topics.intro")}</p>
        <div class="grid cols-3 topic-hub-grid">
          ${t.map(([i,u])=>`
            <div class="card">
              <h3>${e(u)}</h3>
              <button class="btn primary" type="button" data-go-tool="${i}">${e("topic.openTool")}</button>
            </div>`).join("")}
        </div>
      </section>`}function M(t){const i=t.target.closest("[data-worksheet]");if(i&&n==="worksheets"){const s=i.getAttribute("data-worksheet");s&&s!==f&&S[s]&&(f=s,p());return}const u=t.target.closest("[data-go-tool]");u&&(n="tools",sessionStorage.setItem("s3phy.refraction.section","tools"),d=u.getAttribute("data-go-tool"),g(v,d),a.updateSection(n),p())}function C(){return`
      <section class="panel">
        <h2>${e("notes.title")}</h2>
        <p class="lead">${e("notes.intro")}</p>
        <p class="lead">${e("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${k.map(t=>{const i=e(`notes.card.${t.key}`);return`
            <div class="card" data-note-card="${t.key}">
              <h3>${i}</h3>
              <div data-note-body></div>
            </div>`}).join("")}
        </div>
      </section>`}async function D(){await Z(o,k)}function N(){return`
      <section class="panel">
        <h2>${e("summary.title")}</h2>
        <p class="lead">${e("summary.intro")}</p>
        <p class="lead">${e("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${E.map(t=>{const i=e(`summary.item.${t.key}`);return`
            <div class="card" data-summary-card="${t.key}">
              <h3>${i}</h3>
              <div data-summary-body></div>
            </div>`}).join("")}
        </div>
      </section>`}async function K(){await W(o,E,{version:G})}const b=L,T=t=>M(t);return window.addEventListener("s3phy:lang",b),o.addEventListener("click",T),I(),()=>{window.removeEventListener("s3phy:lang",b),o.removeEventListener("click",T),l==null||l(),r==null||r(),h(),a==null||a.destroy()}}export{nt as mountRefractionHub};

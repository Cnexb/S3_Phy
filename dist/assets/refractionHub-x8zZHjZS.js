const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./opticsLightLensWorksheet-CbOP6xcH.js","./index-DMkHONTt.js","./index-Dfqqu7BV.css","./refractionLab-DxFXYNY2.js","./createLabIframe-DJNWj-eB.js","./tirEscapeLab-DZFIZw6S.js"])))=>i.map(i=>d[i]);
import{t as i,_ as v,g as N}from"./index-DMkHONTt.js";import{r as K,l as P,m as z,c as V,h as Z,d as j,s as W}from"./hubShell-BEpE0h3y.js";import{r as Y,h as U}from"./toolsShell-C-Th6Ujm.js";import{m as q,a as x}from"./flashcardDeck-C1YB_gih.js";const b=["refraction","refractionTir"],_="s3phy.refraction.tool",F=["lightLens"],G="20260627-em-v2",k=[{key:"refraction",fileEn:"refraction-en.pdf",fileZh:"refraction-zhHant.pdf"},{key:"tir",fileEn:"tir-en.pdf",fileZh:"tir-zhHant.pdf"}],E=[{key:"refraction",type:"image",fileEn:"refraction-en.webp",fileZh:"refraction-zhHant.webp"},{key:"tir",type:"image",fileEn:"tir-en.webp",fileZh:"tir-zhHant.webp"}],g={lightLens:()=>v(()=>import("./opticsLightLensWorksheet-CbOP6xcH.js"),__vite__mapDeps([0,1,2]),import.meta.url).then(t=>t.createOpticsLightLensWorksheet)},B={refraction:()=>v(()=>import("./refractionLab-DxFXYNY2.js"),__vite__mapDeps([3,4,1,2]),import.meta.url).then(t=>t.createRefractionLab),refractionTir:()=>v(()=>import("./tirEscapeLab-DZFIZw6S.js"),__vite__mapDeps([5,4,1,2]),import.meta.url).then(t=>t.createTirEscapeLab)};function S(t){return i({refraction:"tools.refraction.title",refractionTir:"tools.refractionTir.title"}[t]||t)}function J(t){return i({lightLens:"worksheets.opticsLightLensTitle"}[t]||t)}function ne(t){let n=K(sessionStorage.getItem("s3phy.refraction.section")),d=P(_,b,"refraction"),f="lightLens",o=null,s={main:null},p=null,c=null,r=null;const O=[{value:"refractionTir",labelKey:"flashcards.deck.refractionTir"}];function h(){V(p),p=null}async function w(e){e.innerHTML="",h();const a=B[d];if(!a)return;const u=(await a())(i);p=u,e.appendChild(u)}async function R(e){if(!e)return;r==null||r(),r=null,e.innerHTML="";const a=g[f];if(!a)return;const u=(await a())(i);e.appendChild(u),r=u._opticsLightLensWorksheetCleanup||null}function $(){const e=F.map(a=>`<button type="button" data-worksheet="${a}" class="${f===a?"active":""}">${J(a)}</button>`).join("");return`
      <section class="panel panel--worksheets-embed">
        <div class="worksheet-picker">
          <p class="lead">${i("worksheets.pick")}</p>
          <div class="tool-list" data-worksheet-list>${e}</div>
        </div>
        <div class="worksheet-stage" data-worksheet-stage></div>
      </section>`}function m(){s.main&&(c==null||c(),c=null,r==null||r(),r=null,n==="notes"?s.main.innerHTML=I():n==="tools"?s.main.innerHTML=Y({toolOrder:b,toolId:d,getLabel:S,t:i}):n==="worksheets"?(s.main.innerHTML=$(),R(s.main.querySelector("[data-worksheet-stage]"))):n==="flashcards"?c=q(s.main,{deckOptions:O.map(e=>({value:e.value,label:i(e.labelKey)})),buildDeck:e=>x(e,N())}):n==="summary"&&(s.main.innerHTML=M()),n==="notes"&&C(),n==="tools"&&U(t,{getLabel:S,t:i,getActiveToolId:()=>d,onSelectTool:e=>{d=e,W(_,d)},mountTool:e=>{w(e)}}),n==="summary"&&D())}function L(){o==null||o.refreshLabels(),m()}function A(){o==null||o.destroy(),o=z(t,{subtitleKey:"strand.refraction.subtitle",activeSection:n,onSection:e=>{n==="tools"&&e!=="tools"&&h(),n=e,sessionStorage.setItem("s3phy.refraction.section",e),o.updateSection(n),m()},onLang:L}),s.main=o.main,o.updateSection(n),m()}function H(e){const a=e.target.closest("[data-worksheet]");if(a&&n==="worksheets"){const l=a.getAttribute("data-worksheet");l&&l!==f&&g[l]&&(f=l,m())}}function I(){return`
      <section class="panel">
        <h2>${i("notes.title")}</h2>
        <p class="lead">${i("notes.intro")}</p>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${k.map(e=>{const a=i(`notes.card.${e.key}`);return`
            <div class="card" data-note-card="${e.key}">
              <h3>${a}</h3>
              <div data-note-body></div>
            </div>`}).join("")}
        </div>
      </section>`}async function C(){await Z(t,k)}function M(){return`
      <section class="panel">
        <h2>${i("summary.title")}</h2>
        <p class="lead">${i("summary.intro")}</p>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-2" data-summary-grid>
          ${E.map(e=>{const a=i(`summary.item.${e.key}`);return`
            <div class="card" data-summary-card="${e.key}">
              <h3>${a}</h3>
              <div data-summary-body></div>
            </div>`}).join("")}
        </div>
      </section>`}async function D(){await j(t,E,{version:G})}const y=L,T=e=>H(e);return window.addEventListener("s3phy:lang",y),t.addEventListener("click",T),A(),()=>{window.removeEventListener("s3phy:lang",y),t.removeEventListener("click",T),c==null||c(),r==null||r(),h(),o==null||o.destroy()}}export{ne as mountRefractionHub};

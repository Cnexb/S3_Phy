import{t as n}from"./index-BwACS_PB.js";import{m,h as f}from"./hubShell-CS209LS2.js";const r=[{id:"gasLaws",titleKey:"topic.gasLaws",fileEn:"gas-laws-en.pdf",fileZh:"gas-laws-zhHant.pdf"},{id:"kineticTheory",titleKey:"topic.kineticTheory",fileEn:"kinetic-theory-en.pdf",fileZh:"kinetic-theory-zhHant.pdf"}];function b(o){let i=sessionStorage.getItem("s3phy.gas.section")||"topics",e=null,a={main:null};function c(){a.main&&(i==="topics"?a.main.innerHTML=g():i==="notes"?(a.main.innerHTML=u(),h()):a.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("gas.comingSoon")}</p>
          </div>
        </section>
      `)}function d(){e==null||e.refreshLabels(),c()}function p(){e==null||e.destroy(),e=m(o,{subtitleKey:"strand.gas.subtitle",activeSection:i,onSection:t=>{i=t,sessionStorage.setItem("s3phy.gas.section",t),e.updateSection(i),c()},onLang:d}),a.main=e.main,e.updateSection(i),c()}function g(){return`
      <section class="panel panel--topic-hub">
        <h2>${n("topics.title")}</h2>
        <p class="lead">${n("topics.intro")}</p>
        <div class="grid cols-2 topic-hub-grid">
          ${r.map(t=>`
            <div class="card">
              <h3>${n(t.titleKey)}</h3>
              <button class="btn primary" type="button" data-go-section="notes">${n("topic.viewNotes")}</button>
            </div>`).join("")}
        </div>
      </section>
    `}function u(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.intro")}</p>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${r.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${n(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function h(){const t=r.map(s=>({key:s.id,fileEn:s.fileEn,fileZh:s.fileZh}));await f(o,t)}function l(t){const s=t.target.closest("[data-go-section]");(s==null?void 0:s.getAttribute("data-go-section"))==="notes"&&(i="notes",sessionStorage.setItem("s3phy.gas.section","notes"),e.updateSection(i),c())}return window.addEventListener("s3phy:lang",d),o.addEventListener("click",l),p(),()=>{window.removeEventListener("s3phy:lang",d),o.removeEventListener("click",l),e==null||e.destroy()}}export{b as mountGasHub};

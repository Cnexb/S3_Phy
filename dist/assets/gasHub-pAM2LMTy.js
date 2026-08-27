import{t as i}from"./index-E70lkPvZ.js";import{r as f,m,h}from"./hubShell-BqQGUidm.js";const c=[{id:"gasLaws",titleKey:"topic.gasLaws",fileEn:"gas-laws-en.pdf",fileZh:"gas-laws-zhHant.pdf"},{id:"kineticTheory",titleKey:"topic.kineticTheory",fileEn:"kinetic-theory-en.pdf",fileZh:"kinetic-theory-zhHant.pdf"}];function v(d){let t=f(sessionStorage.getItem("s3phy.gas.section")),e=null,a={main:null};function s(){a.main&&(t==="notes"?(a.main.innerHTML=p(),g()):a.main.innerHTML=`
        <section class="panel">
          <h2>${i(`nav.${t}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${i("gas.comingSoon")}</p>
          </div>
        </section>
      `)}function o(){e==null||e.refreshLabels(),s()}function l(){e==null||e.destroy(),e=m(d,{subtitleKey:"strand.gas.subtitle",activeSection:t,onSection:n=>{t=n,sessionStorage.setItem("s3phy.gas.section",n),e.updateSection(t),s()},onLang:o}),a.main=e.main,e.updateSection(t),s()}function p(){return`
      <section class="panel">
        <h2>${i("notes.title")}</h2>
        <p class="lead">${i("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${c.map(n=>`
            <div class="card" data-note-card="${n.id}">
              <h3>${i(`notes.card.${n.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function g(){const n=c.map(r=>({key:r.id,fileEn:r.fileEn,fileZh:r.fileZh}));await h(d,n)}return window.addEventListener("s3phy:lang",o),l(),()=>{window.removeEventListener("s3phy:lang",o),e==null||e.destroy()}}export{v as mountGasHub};

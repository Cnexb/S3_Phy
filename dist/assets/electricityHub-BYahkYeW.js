import{t as n}from"./index-E70lkPvZ.js";import{r as p,m as u,h as y}from"./hubShell-BqQGUidm.js";const d=[{id:"electrostatics",titleKey:"topic.electrostatics",fileEn:"electrostatics-en.pdf",fileZh:"electrostatics-zhHant.pdf"},{id:"electricCircuits",titleKey:"topic.electricCircuits",fileEn:"electric-circuits-en.pdf",fileZh:"electric-circuits-zhHant.pdf"},{id:"domesticElectricity",titleKey:"topic.domesticElectricity",fileEn:"domestic-electricity-en.pdf",fileZh:"domestic-electricity-zhHant.pdf"},{id:"electromagnetism",titleKey:"topic.electromagnetism",fileEn:"electromagnetism-en.pdf",fileZh:"electromagnetism-zhHant.pdf"},{id:"electromagneticInduction",titleKey:"topic.electromagneticInduction",fileEn:"electromagnetic-induction-en.pdf",fileZh:"electromagnetic-induction-zhHant.pdf"}];function v(s){let i=p(sessionStorage.getItem("s3phy.electricity.section")),e=null,c={main:null};function o(){c.main&&(i==="notes"?(c.main.innerHTML=m(),f()):c.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${i}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("electricity.comingSoon")}</p>
          </div>
        </section>
      `)}function r(){e==null||e.refreshLabels(),o()}function l(){e==null||e.destroy(),e=u(s,{subtitleKey:"strand.electricity.subtitle",activeSection:i,onSection:t=>{i=t,sessionStorage.setItem("s3phy.electricity.section",t),e.updateSection(i),o()},onLang:r}),c.main=e.main,e.updateSection(i),o()}function m(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${d.map(t=>`
            <div class="card" data-note-card="${t.id}">
              <h3>${n(`notes.card.${t.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function f(){const t=d.map(a=>({key:a.id,fileEn:a.fileEn,fileZh:a.fileZh}));await y(s,t)}return window.addEventListener("s3phy:lang",r),l(),()=>{window.removeEventListener("s3phy:lang",r),e==null||e.destroy()}}export{v as mountElectricityHub};

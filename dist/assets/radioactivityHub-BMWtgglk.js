import{t as n}from"./index-D4dG1w-8.js";import{r as p,m as f,h as u}from"./hubShell-CNe9hLdR.js";const s=[{id:"radiationRadioactivity",titleKey:"topic.radiationRadioactivity",fileEn:"radiation-radioactivity-en.pdf",fileZh:"radiation-radioactivity-zhHant.pdf"},{id:"atomicModel",titleKey:"topic.atomicModel",fileEn:"atomic-model-en.pdf",fileZh:"atomic-model-zhHant.pdf"},{id:"nuclearEnergy",titleKey:"topic.nuclearEnergy",fileEn:"nuclear-energy-en.pdf",fileZh:"nuclear-energy-zhHant.pdf"}];function h(c){let t=p(sessionStorage.getItem("s3phy.radioactivity.section")),i=null,a={main:null};function o(){a.main&&(t==="notes"?(a.main.innerHTML=y(),m()):a.main.innerHTML=`
        <section class="panel">
          <h2>${n(`nav.${t}`)}</h2>
          <div class="card" style="padding: 2rem; text-align: center; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border);">
            <p class="lead" style="margin-bottom: 0;">${n("radioactivity.comingSoon")}</p>
          </div>
        </section>
      `)}function d(){i==null||i.refreshLabels(),o()}function l(){i==null||i.destroy(),i=f(c,{subtitleKey:"strand.radioactivity.subtitle",activeSection:t,onSection:e=>{t=e,sessionStorage.setItem("s3phy.radioactivity.section",e),i.updateSection(t),o()},onLang:d}),a.main=i.main,i.updateSection(t),o()}function y(){return`
      <section class="panel">
        <h2>${n("notes.title")}</h2>
        <p class="lead">${n("notes.embedHint")}</p>
        <div class="grid cols-2" data-notes-grid>
          ${s.map(e=>`
            <div class="card" data-note-card="${e.id}">
              <h3>${n(`notes.card.${e.id}`)}</h3>
              <div data-note-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function m(){const e=s.map(r=>({key:r.id,fileEn:r.fileEn,fileZh:r.fileZh}));await u(c,e)}return window.addEventListener("s3phy:lang",d),l(),()=>{window.removeEventListener("s3phy:lang",d),i==null||i.destroy()}}export{h as mountRadioactivityHub};

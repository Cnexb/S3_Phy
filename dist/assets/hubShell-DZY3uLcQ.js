import{t as s,g as k,s as C,a as M}from"./index-DyV6RUwl.js";const $=new Map;function w(){return k()==="zh-Hant"?"zhHant":"en"}function B(e){if(e)for(const t of Object.keys(e))t.endsWith("Cleanup")&&typeof e[t]=="function"&&e[t]()}function R(e,t,a){try{const o=sessionStorage.getItem(e);if(o&&t.includes(o))return o}catch{}return a}function Z(e,t){try{sessionStorage.setItem(e,t)}catch{}}async function g(e,t){if(!t)return!1;const a=`./${e}/${t}`;if($.has(a))return $.get(a);try{const l=(await fetch(a,{method:"HEAD"})).ok;return $.set(a,l),l}catch{return $.set(a,!1),!1}}async function W(e){return g("notes",e)}function _(e){return`${String(e).split("#")[0]}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}function S(e,t,a){const o=_(t);return`
    <div class="note-preview-wrap">
      <iframe class="note-preview" title="${e.replace(/"/g,"&quot;")}" src="${o}" loading="lazy"></iframe>
    </div>
    <p class="note-preview-link"><a href="${t}" target="_blank" rel="noopener">${a}</a></p>`}async function O(e,t){const a=w();await Promise.all(t.map(async o=>{const l=e.querySelector(`[data-note-card="${o.key}"]`);if(!l)return;const n=l.querySelector("[data-note-body]"),r=a==="zhHant"?o.fileZh:o.fileEn,c=await W(r),i=`./notes/${r}`;c?n.innerHTML=S(s(`notes.card.${o.key}`),i,s("notes.openPdf")):n.innerHTML=`<p class="lead">${s("notes.missing")}</p>
          <p><a class="btn" href="./notes/README.txt" target="_blank" rel="noopener">README</a></p>`}))}async function U(e,t,{version:a=""}={}){const o=w(),l=a?`?v=${a}`:"";await Promise.all(t.map(async n=>{const r=e.querySelector(`[data-summary-card="${n.key}"]`);if(!r)return;const c=r.querySelector("[data-summary-body]");if(n.type==="image"){const f=n.fileEn&&n.fileZh?o==="zhHant"?n.fileZh:n.fileEn:n.file,u=await g("summary",f),y=`${`./summary/${f}`}${l}`;u?c.innerHTML=`
          <img class="summary-thumb" src="${y}" alt="${s(`summary.item.${n.key}`)}" loading="lazy" />
          <p style="margin-top:8px"><a href="${y}" target="_blank" rel="noopener">${s("summary.viewImage")}</a></p>`:c.innerHTML=`<p class="lead">${s("summary.missing")}</p>`;return}const i=o==="zhHant"?n.fileZh:n.fileEn,d=await g("summary-pdfs",i),m=`./summary-pdfs/${i}`;d?c.innerHTML=S(s(`summary.item.${n.key}`),m,s("summary.download")):c.innerHTML=`<p class="lead">${s("summary.missing")}</p>`}))}function j(e,t,a="cols-2"){return`
      <section class="panel">
        <h2>${e("comics.title")}</h2>
        <p class="lead">${e("comics.intro")}</p>
        <div class="grid ${a}" data-comics-grid>
          ${t.map(o=>`
            <div class="card" data-comic-card="${o.key}">
              <h3>${e(`summary.item.${o.key}`)}</h3>
              <div data-comic-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function D(e,t,{version:a=""}={}){const o=w(),l=a?`?v=${a}`:"";await Promise.all(t.map(async n=>{const r=e.querySelector(`[data-comic-card="${n.key}"]`);if(!r)return;const c=r.querySelector("[data-comic-body]"),i=n.fileEn&&n.fileZh?o==="zhHant"?n.fileZh:n.fileEn:n.file,d=n.type==="pdf"||i&&String(i).toLowerCase().endsWith(".pdf"),m=await g("comics",i),u=`${`./comics/${i}`}${l}`;if(!m){c.innerHTML=`<p class="lead">${s("comics.missing")}</p>`;return}d?c.innerHTML=S(s(`summary.item.${n.key}`),u,s("comics.openPdf")):c.innerHTML=`
          <img class="summary-thumb" src="${u}" alt="${s(`summary.item.${n.key}`)}" loading="lazy" />
          <p style="margin-top:8px"><a href="${u}" target="_blank" rel="noopener">${s("comics.viewImage")}</a></p>`}))}const A=16;function P(e){if(!e)return{check(){},cleanup(){}};const t=e.querySelector(".main-nav");let a=0;function o(c){const i=e.querySelector(".site-header__brand"),d=e.querySelector(".site-header__actions"),m=i==null?void 0:i.querySelector(".brand-logo-wrap"),f=i==null?void 0:i.querySelector(".brand-text-block");let u=(i==null?void 0:i.offsetWidth)??0;c&&f&&(u=((m==null?void 0:m.offsetWidth)??0)+10);const b=(t==null?void 0:t.scrollWidth)??0,y=(d==null?void 0:d.offsetWidth)??0;return u+b+y+A*3}function l(){C(),e.classList.remove("nav-hide-brand-text","nav-compact-pills"),e.offsetWidth;const c=e.clientWidth;let i=o(!1);i>c&&(e.classList.add("nav-hide-brand-text"),e.offsetWidth,i=o(!0)),(i>c||t&&t.scrollWidth>t.clientWidth+2)&&e.classList.add("nav-compact-pills")}function n(){window.clearTimeout(a),a=window.setTimeout(l,60)}l(),window.addEventListener("resize",n);let r;return typeof ResizeObserver<"u"&&(r=new ResizeObserver(n),r.observe(e),t&&r.observe(t)),{check:l,cleanup(){window.clearTimeout(a),window.removeEventListener("resize",n),r==null||r.disconnect(),e.classList.remove("nav-hide-brand-text","nav-compact-pills")}}}const H=["notes","tools","worksheets","quiz","flashcards","summary"],I={notes:"nav.notes",tools:"nav.tools",worksheets:"nav.worksheets",quiz:"nav.quiz",flashcards:"nav.flashcards",summary:"nav.summary",comics:"nav.comics"};function F(e,t="notes",a=H){return a.includes(e)?e:t}function G(e,{subtitleKey:t,activeSection:a,sections:o=H,onSection:l,onLang:n}){var q;e.innerHTML=`
    <header class="site-header site-header--hub">
      <div class="site-header__brand">
        <button type="button" class="brand-logo-wrap" aria-label="${s("strand.back")}">
          <img class="brand-logo-img" src="./images/uniplus-logo.png" alt="" width="220" height="52" decoding="async" />
        </button>
        <div class="brand-text-block" style="cursor: pointer;" data-brand-home>
          <h1 class="site-title">${s("app.title")}</h1>
          <p class="site-subtitle" data-hub-subtitle>${s(t)}</p>
        </div>
      </div>
      <nav class="main-nav" data-nav aria-label="${s("app.title")}"></nav>
      <div class="site-header__actions">
        <button type="button" class="strand-back-btn" data-strand-back>${s("strand.back")}</button>
        <div class="lang-toggle" data-lang></div>
      </div>
    </header>
    <main data-main></main>
    <footer class="site-footer no-print" data-hub-footer>${s("footer.conventions")}</footer>
  `;const r=e.querySelector("[data-main]"),c=e.querySelector("[data-nav]"),i=e.querySelector("[data-lang]"),d=e.querySelector("[data-strand-back]");let m=a;const f=e.querySelector(".site-header--hub"),u=P(f);function b(p){m=p,c.innerHTML=o.map((h,z)=>{const x=p===h?"active":"",E=`${z+1}. ${s(I[h])}`;return`<button type="button" class="${x}" data-sec="${h}">${E}</button>`}).join(""),c.querySelectorAll("button").forEach(h=>{h.addEventListener("click",()=>l(h.getAttribute("data-sec")))}),requestAnimationFrame(()=>u.check())}function y(){i.innerHTML=`
      <button type="button" data-set-lang="en" class="${k()==="en"?"active":""}">${s("lang.en")}</button>
      <button type="button" data-set-lang="zh-Hant" class="${k()==="zh-Hant"?"active":""}">${s("lang.zhHant")}</button>
    `,i.querySelectorAll("button").forEach(p=>{p.addEventListener("click",()=>{M(p.getAttribute("data-set-lang")),n()})})}function T(){e.querySelector("[data-hub-subtitle]").textContent=s(t),d.textContent=s("strand.back"),e.querySelector("[data-hub-footer]").textContent=s("footer.conventions"),e.querySelector(".site-title").textContent=s("app.title")}const v=()=>{window.dispatchEvent(new CustomEvent("s3phy:strand",{detail:null}))};d.addEventListener("click",v);const L=e.querySelector(".brand-logo-wrap");return L&&L.addEventListener("click",v),(q=e.querySelector("[data-brand-home]"))==null||q.addEventListener("click",v),b(a),y(),{main:r,updateSection(p){b(p)},refreshLabels(){T(),b(m),y()},destroy(){d.removeEventListener("click",v),u.cleanup()}}}export{j as a,O as b,B as c,U as d,D as h,R as l,G as m,F as r,Z as s};

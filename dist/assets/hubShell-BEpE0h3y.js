import{t as s,g as L,s as _,a as C}from"./index-DMkHONTt.js";const w=new Map;function q(){return L()==="zh-Hant"?"zhHant":"en"}function N(e){if(e)for(const t of Object.keys(e))t.endsWith("Cleanup")&&typeof e[t]=="function"&&e[t]()}function O(e,t,a){try{const i=sessionStorage.getItem(e);if(i&&t.includes(i))return i}catch{}return a}function R(e,t){try{sessionStorage.setItem(e,t)}catch{}}async function S(e,t){if(!t)return!1;const a=`./${e}/${t}`;if(w.has(a))return w.get(a);try{const r=(await fetch(a,{method:"HEAD"})).ok;return w.set(a,r),r}catch{return w.set(a,!1),!1}}async function M(e){return S("notes",e)}function W(e){return`${String(e).split("#")[0]}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}function H(e,t,a){const i=W(t);return`
    <div class="note-preview-wrap">
      <iframe class="note-preview" title="${e.replace(/"/g,"&quot;")}" src="${i}" loading="lazy"></iframe>
    </div>
    <p class="note-preview-link"><a href="${t}" target="_blank" rel="noopener">${a}</a></p>`}async function Z(e,t){const a=q();await Promise.all(t.map(async i=>{const r=e.querySelector(`[data-note-card="${i.key}"]`);if(!r)return;const n=r.querySelector("[data-note-body]"),l=a==="zhHant"?i.fileZh:i.fileEn,c=await M(l),o=`./notes/${l}`;c?n.innerHTML=H(s(`notes.card.${i.key}`),o,s("notes.openPdf")):n.innerHTML=`<p class="lead">${s("notes.missing")}</p>
          <p><a class="btn" href="./notes/README.txt" target="_blank" rel="noopener">README</a></p>`}))}async function j(e,t,{version:a=""}={}){const i=q(),r=a?`?v=${a}`:"";await Promise.all(t.map(async n=>{const l=e.querySelector(`[data-summary-card="${n.key}"]`);if(!l)return;const c=l.querySelector("[data-summary-body]");if(n.type==="image"){const f=n.fileEn&&n.fileZh?i==="zhHant"?n.fileZh:n.fileEn:n.file,p=await S("summary",f),y=`${`./summary/${f}`}${r}`;p?c.innerHTML=`
          <img class="summary-thumb" src="${y}" alt="${s(`summary.item.${n.key}`)}" loading="lazy" />
          <p style="margin-top:8px"><a href="${y}" target="_blank" rel="noopener">${s("summary.viewImage")}</a></p>`:c.innerHTML=`<p class="lead">${s("summary.missing")}</p>`;return}const o=i==="zhHant"?n.fileZh:n.fileEn,d=await S("summary-pdfs",o),u=`./summary-pdfs/${o}`;d?c.innerHTML=H(s(`summary.item.${n.key}`),u,s("summary.download")):c.innerHTML=`<p class="lead">${s("summary.missing")}</p>`}))}function U(e,t,a="cols-2"){return`
      <section class="panel">
        <h2>${e("comics.title")}</h2>
        <p class="lead">${e("comics.intro")}</p>
        <div class="grid ${a}" data-comics-grid>
          ${t.map(i=>`
            <div class="card" data-comic-card="${i.key}">
              <h3>${e(`summary.item.${i.key}`)}</h3>
              <div data-comic-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function D(e,t,{version:a=""}={}){const i=q(),r=a?`?v=${a}`:"";await Promise.all(t.map(async n=>{const l=e.querySelector(`[data-comic-card="${n.key}"]`);if(!l)return;const c=l.querySelector("[data-comic-body]"),o=s(`summary.item.${n.key}`),d=n.fileEn&&n.fileZh?i==="zhHant"?n.fileZh:n.fileEn:n.file,u=Array.isArray(n.pages)?n.pages.filter(Boolean):[],f=n.type==="pdf"||d&&String(d).toLowerCase().endsWith(".pdf");if(u.length){const y=u.map((k,$)=>{const h=`./comics/${k}${r}`,b=o.replace(/"/g,"&quot;");return`<img class="comic-page" src="${h}" alt="${b} (${$+1}/${u.length})" loading="${$===0?"eager":"lazy"}" />`}).join(""),g=f?`./comics/${d}${r}`:"",v=g?`<p class="note-preview-link"><a href="${g}" target="_blank" rel="noopener">${s("comics.openPdf")}</a></p>`:"";c.innerHTML=`<div class="comic-pages">${y}</div>${v}`;return}const p=await S("comics",d),m=`./comics/${d}${r}`;if(!p){c.innerHTML=`<p class="lead">${s("comics.missing")}</p>`;return}f?c.innerHTML=H(o,m,s("comics.openPdf")):c.innerHTML=`
          <img class="summary-thumb" src="${m}" alt="${o}" loading="lazy" />
          <p style="margin-top:8px"><a href="${m}" target="_blank" rel="noopener">${s("comics.viewImage")}</a></p>`}))}const A=16;function P(e){if(!e)return{check(){},cleanup(){}};const t=e.querySelector(".main-nav");let a=0;function i(c){const o=e.querySelector(".site-header__brand"),d=e.querySelector(".site-header__actions"),u=o==null?void 0:o.querySelector(".brand-logo-wrap"),f=o==null?void 0:o.querySelector(".brand-text-block");let p=(o==null?void 0:o.offsetWidth)??0;c&&f&&(p=((u==null?void 0:u.offsetWidth)??0)+10);const m=(t==null?void 0:t.scrollWidth)??0,y=(d==null?void 0:d.offsetWidth)??0;return p+m+y+A*3}function r(){_(),e.classList.remove("nav-hide-brand-text","nav-compact-pills"),e.offsetWidth;const c=e.clientWidth;let o=i(!1);o>c&&(e.classList.add("nav-hide-brand-text"),e.offsetWidth,o=i(!0)),(o>c||t&&t.scrollWidth>t.clientWidth+2)&&e.classList.add("nav-compact-pills")}function n(){window.clearTimeout(a),a=window.setTimeout(r,60)}r(),window.addEventListener("resize",n);let l;return typeof ResizeObserver<"u"&&(l=new ResizeObserver(n),l.observe(e),t&&l.observe(t)),{check:r,cleanup(){window.clearTimeout(a),window.removeEventListener("resize",n),l==null||l.disconnect(),e.classList.remove("nav-hide-brand-text","nav-compact-pills")}}}const T=["notes","tools","worksheets","quiz","flashcards","summary"],F=["notes","tools","worksheets","quiz","flashcards","comics","summary"],I={notes:"nav.notes",tools:"nav.tools",worksheets:"nav.worksheets",quiz:"nav.quiz",flashcards:"nav.flashcards",summary:"nav.summary",comics:"nav.comics"};function G(e,t="notes",a=T){return a.includes(e)?e:t}function V(e,{subtitleKey:t,activeSection:a,sections:i=T,onSection:r,onLang:n}){var $;e.innerHTML=`
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
  `;const l=e.querySelector("[data-main]"),c=e.querySelector("[data-nav]"),o=e.querySelector("[data-lang]"),d=e.querySelector("[data-strand-back]");let u=a;const f=e.querySelector(".site-header--hub"),p=P(f);function m(h){u=h,c.innerHTML=i.map((b,z)=>{const E=h===b?"active":"",x=`${z+1}. ${s(I[b])}`;return`<button type="button" class="${E}" data-sec="${b}">${x}</button>`}).join(""),c.querySelectorAll("button").forEach(b=>{b.addEventListener("click",()=>r(b.getAttribute("data-sec")))}),requestAnimationFrame(()=>p.check())}function y(){o.innerHTML=`
      <button type="button" data-set-lang="en" class="${L()==="en"?"active":""}">${s("lang.en")}</button>
      <button type="button" data-set-lang="zh-Hant" class="${L()==="zh-Hant"?"active":""}">${s("lang.zhHant")}</button>
    `,o.querySelectorAll("button").forEach(h=>{h.addEventListener("click",()=>{C(h.getAttribute("data-set-lang")),n()})})}function g(){e.querySelector("[data-hub-subtitle]").textContent=s(t),d.textContent=s("strand.back"),e.querySelector("[data-hub-footer]").textContent=s("footer.conventions"),e.querySelector(".site-title").textContent=s("app.title")}const v=()=>{window.dispatchEvent(new CustomEvent("s3phy:strand",{detail:null}))};d.addEventListener("click",v);const k=e.querySelector(".brand-logo-wrap");return k&&k.addEventListener("click",v),($=e.querySelector("[data-brand-home]"))==null||$.addEventListener("click",v),m(a),y(),{main:l,updateSection(h){m(h)},refreshLabels(){g(),m(u),y()},destroy(){d.removeEventListener("click",v),p.cleanup()}}}export{F as O,U as a,D as b,N as c,j as d,Z as h,O as l,V as m,G as r,R as s};

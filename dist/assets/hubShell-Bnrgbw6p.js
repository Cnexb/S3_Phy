import{t as o,g as x,s as M,p as _,m as C}from"./index-C3sm1H6R.js";const k=new Map;function L(){return x()==="zh-Hant"?"zhHant":"en"}function N(e){if(e)for(const t of Object.keys(e))t.endsWith("Cleanup")&&typeof e[t]=="function"&&e[t]()}function O(e,t,s){try{const i=sessionStorage.getItem(e);if(i&&t.includes(i))return i}catch{}return s}function R(e,t){try{sessionStorage.setItem(e,t)}catch{}}async function w(e,t){if(!t)return!1;const s=`./${e}/${t}`;if(k.has(s))return k.get(s);try{const r=(await fetch(s,{method:"HEAD"})).ok;return k.set(s,r),r}catch{return k.set(s,!1),!1}}async function E(e){return w("notes",e)}function W(e){return`${String(e).split("#")[0]}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}function q(e,t,s){const i=W(t);return`
    <div class="note-preview-wrap">
      <iframe class="note-preview" title="${e.replace(/"/g,"&quot;")}" src="${i}" loading="lazy"></iframe>
    </div>
    <p class="note-preview-link"><a href="${t}" target="_blank" rel="noopener">${s}</a></p>`}async function Z(e,t){const s=L();await Promise.all(t.map(async i=>{const r=e.querySelector(`[data-note-card="${i.key}"]`);if(!r)return;const n=r.querySelector("[data-note-body]"),l=s==="zhHant"?i.fileZh:i.fileEn,c=await E(l),a=`./notes/${l}`;c?n.innerHTML=q(o(`notes.card.${i.key}`),a,o("notes.openPdf")):n.innerHTML=`<p class="lead">${o("notes.missing")}</p>
          <p><a class="btn" href="./notes/README.txt" target="_blank" rel="noopener">README</a></p>`}))}async function j(e,t,{version:s=""}={}){const i=L(),r=s?`?v=${s}`:"";await Promise.all(t.map(async n=>{const l=e.querySelector(`[data-summary-card="${n.key}"]`);if(!l)return;const c=l.querySelector("[data-summary-body]");if(n.type==="image"){const f=n.fileEn&&n.fileZh?i==="zhHant"?n.fileZh:n.fileEn:n.file,p=await w("summary",f),y=`${`./summary/${f}`}${r}`;p?c.innerHTML=`
          <img class="summary-thumb" src="${y}" alt="${o(`summary.item.${n.key}`)}" loading="lazy" />
          <p style="margin-top:8px"><a href="${y}" target="_blank" rel="noopener">${o("summary.viewImage")}</a></p>`:c.innerHTML=`<p class="lead">${o("summary.missing")}</p>`;return}const a=i==="zhHant"?n.fileZh:n.fileEn,d=await w("summary-pdfs",a),u=`./summary-pdfs/${a}`;d?c.innerHTML=q(o(`summary.item.${n.key}`),u,o("summary.download")):c.innerHTML=`<p class="lead">${o("summary.missing")}</p>`}))}function U(e,t,s="cols-2"){return`
      <section class="panel">
        <h2>${e("comics.title")}</h2>
        <p class="lead">${e("comics.intro")}</p>
        <div class="grid ${s}" data-comics-grid>
          ${t.map(i=>`
            <div class="card" data-comic-card="${i.key}">
              <h3>${e(`summary.item.${i.key}`)}</h3>
              <div data-comic-body></div>
            </div>`).join("")}
        </div>
      </section>`}async function D(e,t,{version:s=""}={}){const i=L(),r=s?`?v=${s}`:"";await Promise.all(t.map(async n=>{const l=e.querySelector(`[data-comic-card="${n.key}"]`);if(!l)return;const c=l.querySelector("[data-comic-body]"),a=o(`summary.item.${n.key}`),d=n.fileEn&&n.fileZh?i==="zhHant"?n.fileZh:n.fileEn:n.file,u=Array.isArray(n.pages)?n.pages.filter(Boolean):[],f=n.type==="pdf"||d&&String(d).toLowerCase().endsWith(".pdf");if(u.length){const y=u.map((g,b)=>{const h=`./comics/${g}${r}`,S=a.replace(/"/g,"&quot;");return`<img class="comic-page" src="${h}" alt="${S} (${b+1}/${u.length})" loading="${b===0?"eager":"lazy"}" />`}).join(""),v=f?`./comics/${d}${r}`:"",$=v?`<p class="note-preview-link"><a href="${v}" target="_blank" rel="noopener">${o("comics.openPdf")}</a></p>`:"";c.innerHTML=`<div class="comic-pages">${y}</div>${$}`;return}const p=await w("comics",d),m=`./comics/${d}${r}`;if(!p){c.innerHTML=`<p class="lead">${o("comics.missing")}</p>`;return}f?c.innerHTML=q(a,m,o("comics.openPdf")):c.innerHTML=`
          <img class="summary-thumb" src="${m}" alt="${a}" loading="lazy" />
          <p style="margin-top:8px"><a href="${m}" target="_blank" rel="noopener">${o("comics.viewImage")}</a></p>`}))}const P=16;function A(e){if(!e)return{check(){},cleanup(){}};const t=e.querySelector(".main-nav");let s=0;function i(c){const a=e.querySelector(".site-header__brand"),d=e.querySelector(".site-header__actions"),u=a==null?void 0:a.querySelector(".brand-logo-wrap"),f=a==null?void 0:a.querySelector(".brand-text-block");let p=(a==null?void 0:a.offsetWidth)??0;c&&f&&(p=((u==null?void 0:u.offsetWidth)??0)+10);const m=(t==null?void 0:t.scrollWidth)??0,y=(d==null?void 0:d.offsetWidth)??0;return p+m+y+P*3}function r(){M(),e.classList.remove("nav-hide-brand-text","nav-compact-pills"),e.offsetWidth;const c=e.clientWidth;let a=i(!1);a>c&&(e.classList.add("nav-hide-brand-text"),e.offsetWidth,a=i(!0)),(a>c||t&&t.scrollWidth>t.clientWidth+2)&&e.classList.add("nav-compact-pills")}function n(){window.clearTimeout(s),s=window.setTimeout(r,60)}r(),window.addEventListener("resize",n);let l;return typeof ResizeObserver<"u"&&(l=new ResizeObserver(n),l.observe(e),t&&l.observe(t)),{check:r,cleanup(){window.clearTimeout(s),window.removeEventListener("resize",n),l==null||l.disconnect(),e.classList.remove("nav-hide-brand-text","nav-compact-pills")}}}const H=["notes","tools","worksheets","quiz","flashcards","summary"],F=["notes","tools","worksheets","quiz","flashcards","comics","summary"],I={notes:"nav.notes",tools:"nav.tools",worksheets:"nav.worksheets",quiz:"nav.quiz",flashcards:"nav.flashcards",summary:"nav.summary",comics:"nav.comics"};function G(e,t="notes",s=H){return s.includes(e)?e:t}function V(e,{subtitleKey:t,activeSection:s,sections:i=H,onSection:r,onLang:n}){var g;e.innerHTML=`
    <header class="site-header site-header--hub">
      <div class="site-header__brand">
        <button type="button" class="brand-logo-wrap" aria-label="${o("strand.back")}">
          <img class="brand-logo-img" src="./images/uniplus-logo.png" alt="" width="220" height="52" decoding="async" />
        </button>
        <div class="brand-text-block" style="cursor: pointer;" data-brand-home>
          <h1 class="site-title">${o("app.title")}</h1>
          <p class="site-subtitle" data-hub-subtitle>${o(t)}</p>
        </div>
      </div>
      <nav class="main-nav" data-nav aria-label="${o("app.title")}"></nav>
      <div class="site-header__actions">
        <button type="button" class="strand-back-btn" data-strand-back>${o("strand.back")}</button>
        ${_()}
      </div>
    </header>
    <main data-main></main>
    <footer class="site-footer no-print" data-hub-footer>${o("footer.conventions")}</footer>
  `;const l=e.querySelector("[data-main]"),c=e.querySelector("[data-nav]"),a=e.querySelector("[data-strand-back]"),d=C(e,{onLang:n});let u=s;const f=e.querySelector(".site-header--hub"),p=A(f);function m(b){u=b,c.innerHTML=i.map((h,S)=>{const T=b===h?"active":"",z=`${S+1}. ${o(I[h])}`;return`<button type="button" class="${T}" data-sec="${h}">${z}</button>`}).join(""),c.querySelectorAll("button").forEach(h=>{h.addEventListener("click",()=>r(h.getAttribute("data-sec")))}),requestAnimationFrame(()=>p.check())}function y(){e.querySelector("[data-hub-subtitle]").textContent=o(t),a.textContent=o("strand.back"),e.querySelector("[data-hub-footer]").textContent=o("footer.conventions"),e.querySelector(".site-title").textContent=o("app.title")}const v=()=>{window.dispatchEvent(new CustomEvent("s3phy:strand",{detail:null}))};a.addEventListener("click",v);const $=e.querySelector(".brand-logo-wrap");return $&&$.addEventListener("click",v),(g=e.querySelector("[data-brand-home]"))==null||g.addEventListener("click",v),m(s),{main:l,updateSection(b){m(b)},refreshLabels(){y(),m(u),d.refreshLabels()},destroy(){a.removeEventListener("click",v),d.destroy(),p.cleanup()}}}export{F as O,j as a,U as b,N as c,D as d,Z as h,O as l,V as m,G as r,R as s};

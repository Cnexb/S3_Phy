import{t as i,_ as T}from"./index-CAfFDNgh.js";const O=1.7,z=.7,w=1,U=.1,W=3;function V(t){const r=Math.floor(t),c=t-r;return r+(Math.random()<c?1:0)}function G(t){for(let r=t.length-1;r>0;r-=1){const c=Math.floor(Math.random()*(r+1));[t[r],t[c]]=[t[c],t[r]]}return t}function K(t){const r=new Map(t.map(l=>[l.id,l.copies])),c=[];let u=null;const f=t.reduce((l,n)=>l+n.copies,0);for(let l=0;l<f;l+=1){let n=[...r.entries()].filter(([p,g])=>g>0&&p!==u);n.length===0&&(n=[...r.entries()].filter(([,p])=>p>0)),n.sort((p,g)=>g[1]-p[1]);const[h,e]=n[0];c.push(h),r.set(h,e-1),u=h}return c}function Q(t){const r=[];return t.forEach(({id:c,copies:u})=>{for(let f=0;f<u;f+=1)r.push(c)}),r}function j(t){let r="sequence",c=1,u=[],f=[],l=0,n=!1,h=!1,e=!1;const p=new Map;function g(){return t()}function v(){return new Map(g().map(s=>[s.id,s]))}function x(){p.clear(),g().forEach(s=>{p.set(s.id,{nextRate:w,totalGotIt:0,roundAgain:0,roundGotIt:0,roundNeutral:0})})}function y(){const s=g();return c===1?s.map(o=>({id:o.id,copies:1})):s.map(o=>{var d;return{id:o.id,copies:V(((d=p.get(o.id))==null?void 0:d.nextRate)??w)}}).filter(o=>o.copies>0)}function E(s){if(s.length===0)return[];if(c===1){const o=s.map(d=>d.id);return r==="random"?G([...o]):[...o].sort((d,b)=>d-b)}return r==="random"?G(Q(s)):K(s)}function m(){if(h=!1,e=!1,u=y(),u.reduce((o,d)=>o+d.copies,0)===0){e=!0,h=!0,f=[],l=0;return}g().forEach(o=>{const d=p.get(o.id);d&&(d.roundAgain=0,d.roundGotIt=0,d.roundNeutral=0)}),f=E(u),l=0,n=!1}function k(){c=1,x(),m()}function C(){return f[l]??null}function R(){const s=C();return s==null?null:v().get(s)??null}function I(s){const o=C();if(o==null)return;const d=p.get(o);d&&(s==="again"?(d.nextRate=O,d.totalGotIt=0,d.roundAgain+=1):s==="gotit"?(d.totalGotIt+=1,d.roundGotIt+=1,d.nextRate=d.totalGotIt>=W?U:z):s==="neutral"&&(d.roundNeutral+=1,d.nextRate=w))}function a(){return n=!1,l<f.length-1?(l+=1,!1):(h=!0,!0)}return k(),{getMode:()=>r,setMode(s){r!==s&&(r=s,f=E(u),l=0,n=!1)},resetSession:k,getRoundNumber:()=>c,getProgress:()=>({index:f.length?l+1:0,total:f.length}),isFlipped:()=>n,flip(){n=!n},unflip(){n=!1},currentCard:R,prev(){return l>0?(l-=1,n=!1,!0):!1},nextNavigate(){return l<f.length-1?(l+=1,n=!1,!0):!1},rateAgain(){return n?(I("again"),a()):!1},rateGotIt(){return n?(I("gotit"),a()):!1},rateNeutral(){return n?(I("neutral"),a()):!1},isSummary:()=>h,isSessionComplete:()=>e,getRoundStats(){let s=0,o=0,d=0;return p.forEach(b=>{s+=b.roundAgain,o+=b.roundGotIt,d+=b.roundNeutral}),{again:s,gotIt:o,neutral:d}},nextRound(){c+=1,m()},restart(){k()}}}const X={thermometry:"flashcards.deck.thermometry",heatInternalEnergy:"flashcards.deck.heatInternalEnergy",changeOfState:"flashcards.deck.changeOfState",heatTransfer:"flashcards.deck.heatTransfer",reflection:"topic.reflection",refraction:"topic.refraction",tir:"topic.tir",convex:"topic.convex",concave:"topic.concave",em:"topic.em",rotatingMirror:"topic.reflection",quantitiesUnits:"topic.quantitiesUnits",usefulMaths:"topic.usefulMaths"};function Y(t){const r=X[t]||`topic.${t}`,c=i(r);return c===r?t:c}function lt(t,{deckOptions:r,buildDeck:c,initialDeck:u="all",introKey:f="flashcards.intro"}){let l=u,n=null,h=null;t.innerHTML=`
    <section class="panel panel--flashcards">
      <h2>${i("flashcards.title")}</h2>
      <p class="lead">${i(f)}</p>
      <div class="fc-controls no-print">
        <div class="control">
          <label>${i("flashcards.deck")}</label>
          <select data-fc-deck>
            ${r.map(a=>`<option value="${a.value}">${a.label}</option>`).join("")}
          </select>
        </div>
        <div class="fc-controls-right">
          <div class="fc-mode-group">
            <span class="fc-mode-label">${i("flashcards.studyMode")}</span>
            <div class="fc-mode-toggle" data-fc-mode>
              <button type="button" data-mode="sequence" class="active">${i("flashcards.mode.sequence")}</button>
              <button type="button" data-mode="random">${i("flashcards.mode.random")}</button>
            </div>
          </div>
          <span class="fc-round-badge" data-fc-round></span>
          <div class="fc-progress-block">
            <span class="fc-progress-label">${i("flashcards.progressLabel")}</span>
            <span class="fc-progress-num" data-fc-progress></span>
          </div>
        </div>
      </div>
      <div data-fc-study-panel>
        <div class="fc-study-stage">
          <div class="fc-card-layer fc-card-layer-back" aria-hidden="true"></div>
          <div class="fc-card-layer fc-card-layer-mid" aria-hidden="true"></div>
          <div class="fc-card-container" data-fc-card-wrap>
            <div class="fc-card-inner" data-fc-card-inner>
              <div class="fc-card-face fc-card-face-front">
                <div class="fc-card-top">
                  <span class="fc-subtopic-pill" data-fc-subtopic-pill></span>
                  <span class="fc-card-code" data-fc-card-code></span>
                </div>
                <div class="fc-card-body-scroll">
                  <div class="fc-card-text" data-fc-front-body></div>
                </div>
                <p class="fc-flip-prompt" data-fc-flip-prompt>${i("flashcards.tapFlip")}</p>
              </div>
              <div class="fc-card-face fc-card-face-back">
                <div class="fc-card-top">
                  <span class="fc-subtopic-pill" data-fc-subtopic-pill-back></span>
                  <span class="fc-card-code" data-fc-card-code-back></span>
                </div>
                <div class="fc-card-body-scroll">
                  <div class="fc-card-text" data-fc-back-body></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="fc-rating-hint" data-fc-hint></p>
        <div class="fc-toolbar no-print">
          <button type="button" class="fc-btn-nav" data-fc-prev>
            <span class="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            <span data-fc-prev-label>${i("flashcards.prev")}</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-again" data-fc-again title="${i("flashcards.again")}">
            <span class="material-symbols-outlined" aria-hidden="true">history</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-flip" data-fc-flip title="${i("flashcards.flip")}">
            <span class="material-symbols-outlined fc-flip-icon" aria-hidden="true">sync</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-gotit" data-fc-gotit title="${i("flashcards.gotIt")}">
            <span class="material-symbols-outlined" aria-hidden="true">check</span>
          </button>
          <button type="button" class="fc-btn-nav" data-fc-next>
            <span data-fc-next-label>${i("flashcards.next")}</span>
            <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
          </button>
        </div>
      </div>
      <div class="fc-summary-panel" data-fc-summary hidden>
        <h3 data-fc-summary-title></h3>
        <p class="muted" data-fc-summary-stats></p>
        <div class="fc-summary-counts">
          <span data-fc-summary-keep></span>
          <span data-fc-summary-confident></span>
        </div>
        <div class="fc-toolbar no-print">
          <button class="btn primary" type="button" data-fc-next-round>${i("flashcards.summary.nextRound")}</button>
          <button class="btn" type="button" data-fc-restart>${i("flashcards.summary.restart")}</button>
        </div>
      </div>
    </section>`;const e={deck:t.querySelector("[data-fc-deck]"),mode:t.querySelector("[data-fc-mode]"),round:t.querySelector("[data-fc-round]"),progress:t.querySelector("[data-fc-progress]"),studyPanel:t.querySelector("[data-fc-study-panel]"),summaryPanel:t.querySelector("[data-fc-summary]"),cardWrap:t.querySelector("[data-fc-card-wrap]"),cardInner:t.querySelector("[data-fc-card-inner]"),subtopicPill:t.querySelector("[data-fc-subtopic-pill]"),subtopicPillBack:t.querySelector("[data-fc-subtopic-pill-back]"),cardCode:t.querySelector("[data-fc-card-code]"),cardCodeBack:t.querySelector("[data-fc-card-code-back]"),frontBody:t.querySelector("[data-fc-front-body]"),backBody:t.querySelector("[data-fc-back-body]"),flipPrompt:t.querySelector("[data-fc-flip-prompt]"),hint:t.querySelector("[data-fc-hint]"),prev:t.querySelector("[data-fc-prev]"),again:t.querySelector("[data-fc-again]"),flip:t.querySelector("[data-fc-flip]"),gotit:t.querySelector("[data-fc-gotit]"),next:t.querySelector("[data-fc-next]"),summaryTitle:t.querySelector("[data-fc-summary-title]"),summaryStats:t.querySelector("[data-fc-summary-stats]"),summaryKeep:t.querySelector("[data-fc-summary-keep]"),summaryConfident:t.querySelector("[data-fc-summary-confident]"),nextRound:t.querySelector("[data-fc-next-round]"),restart:t.querySelector("[data-fc-restart]")};async function p(){const a=await c(l);n=j(()=>a)}function g(a,s){const o=!s;e.prev.disabled=o,e.again.disabled=o||!a,e.gotit.disabled=o||!a,e.flip.disabled=o,e.next.disabled=o}function v(a,s,o=!1){var H;a.classList.remove("fc-card-text-long","fc-card-text-compact");const d=document.createElement("div");d.innerHTML=s||"";const b=(d.textContent||"").trim(),S=b.split(`
`).filter(Boolean).length,q=((H=(s||"").match(/<br\s*\/?>/gi))==null?void 0:H.length)??0,N=Math.max(S,q>0?q+1:0),D=b.length;o||N>=5||D>220?a.classList.add("fc-card-text-compact"):(N>=4||D>130)&&a.classList.add("fc-card-text-long")}function x(a,s,o){const d=(o||"").replace(/"/g,"&quot;"),b=(o||i("flashcards.question")).replace(/</g,"&lt;");a.innerHTML=`<img src="${s}" alt="${d}" loading="lazy" class="fc-card-img" data-fc-img /><p class="fc-img-fallback muted" data-fc-img-fallback hidden>${b}</p>`;const S=a.querySelector("[data-fc-img]"),q=a.querySelector("[data-fc-img-fallback]");S&&q&&(S.onerror=()=>{S.hidden=!0,q.hidden=!1},S.onload=()=>{S.hidden=!1,q.hidden=!0})}function y(){const a=n.currentCard(),s=n.isFlipped();if(e.cardInner.classList.toggle("fc-flipped",s),!a){e.subtopicPill.textContent="",e.subtopicPillBack.textContent="",e.cardCode.textContent="",e.cardCodeBack.textContent="",e.frontBody.innerHTML="",e.backBody.innerHTML="",e.flipPrompt.hidden=!0,e.cardWrap.classList.remove("fc-card-container--image"),g(!1,!1),e.hint.textContent="";return}const o=Y(a.subtopic),d=i("flashcards.cardCode").replace("{id}",String(a.id));if(e.subtopicPill.textContent=o,e.subtopicPillBack.textContent=o,e.cardCode.textContent=d,e.cardCodeBack.textContent=d,a.isImage)e.cardWrap.classList.add("fc-card-container--image"),e.flipPrompt.hidden=!0,x(e.frontBody,a.frontImage,a.alt),a.backImage&&a.backImage!==a.frontImage?x(e.backBody,a.backImage,a.alt):e.backBody.innerHTML=e.frontBody.innerHTML;else{if(e.cardWrap.classList.remove("fc-card-container--image"),e.flipPrompt.hidden=s,e.frontBody.innerHTML=a.front,a.backImage){const b=a.imageAlt||"";e.backBody.innerHTML=`${a.back}<img class="fc-card-back-img" src="${a.backImage}" alt="${b}" />`}else e.backBody.innerHTML=a.back;v(e.frontBody,a.front,a.compactFront),v(e.backBody,a.back,a.compactBack)}g(s,!0),e.hint.textContent=s?i("flashcards.hint.rated"):i("flashcards.flipFirst"),e.hint.classList.toggle("fc-rating-hint--action",!s)}function E(){const a=n.getRoundStats(),{total:s}=n.getProgress();n.isSessionComplete()?(e.summaryTitle.textContent=i("flashcards.summary.complete"),e.summaryStats.textContent=i("flashcards.summary.completeStats"),e.nextRound.hidden=!0):(e.summaryTitle.textContent=i("flashcards.summary.title").replace("{round}",String(n.getRoundNumber())),e.summaryStats.textContent=i("flashcards.summary.stats").replace("{total}",String(s)).replace("{again}",String(a.again)).replace("{gotIt}",String(a.gotIt)).replace("{neutral}",String(a.neutral)),e.nextRound.hidden=!1),e.summaryKeep.textContent=i("flashcards.summary.keep").replace("{count}",String(a.again)),e.summaryConfident.textContent=i("flashcards.summary.confident").replace("{count}",String(a.gotIt))}function m(){const{index:a,total:s}=n.getProgress();e.round.textContent=i("flashcards.round").replace("{round}",String(n.getRoundNumber())).replace("{total}",String(s)),e.progress.textContent=s?`${a} / ${s}`:"—";const o=n.isSummary();e.studyPanel.hidden=o,e.summaryPanel.hidden=!o,o?E():y()}function k(){const a=n.getMode();e.mode.querySelectorAll("button").forEach(s=>{s.classList.toggle("active",s.dataset.mode===a)})}function C(){n.currentCard()&&(n.flip(),y())}function R(){t.querySelector("h2").textContent=i("flashcards.title"),t.querySelector(".lead").textContent=i("flashcards.intro"),t.querySelector("[data-fc-deck]").previousElementSibling.textContent=i("flashcards.deck"),t.querySelector(".fc-mode-label").textContent=i("flashcards.studyMode"),t.querySelector(".fc-progress-label").textContent=i("flashcards.progressLabel"),e.mode.querySelector('[data-mode="sequence"]').textContent=i("flashcards.mode.sequence"),e.mode.querySelector('[data-mode="random"]').textContent=i("flashcards.mode.random"),e.flipPrompt.textContent=i("flashcards.tapFlip"),t.querySelector("[data-fc-prev-label]").textContent=i("flashcards.prev"),t.querySelector("[data-fc-next-label]").textContent=i("flashcards.next"),e.nextRound.textContent=i("flashcards.summary.nextRound"),e.restart.textContent=i("flashcards.summary.restart"),m()}e.deck.value=l,e.deck.addEventListener("change",()=>{l=e.deck.value,p().then(()=>{k(),m()})}),e.mode.querySelectorAll("button").forEach(a=>{a.addEventListener("click",()=>{n.setMode(a.dataset.mode),k(),m()})}),e.cardWrap.addEventListener("click",a=>{a.target.closest("button")||C()}),e.flip.addEventListener("click",a=>{a.stopPropagation(),C()}),e.prev.addEventListener("click",()=>{n.prev(),m()}),e.again.addEventListener("click",()=>{n.rateAgain()?m():y()}),e.gotit.addEventListener("click",()=>{n.rateGotIt()?m():y()}),e.next.addEventListener("click",()=>{n.isFlipped()?n.rateNeutral()?m():y():n.nextNavigate()&&m()}),e.nextRound.addEventListener("click",()=>{n.nextRound(),m()}),e.restart.addEventListener("click",()=>{n.restart(),m()}),h=a=>{var o;if(!t.isConnected)return;const s=(o=a.target)==null?void 0:o.tagName;if(!(s==="INPUT"||s==="SELECT"||s==="TEXTAREA")){if(a.code==="Space"){a.preventDefault(),C();return}if(a.key==="ArrowLeft"){n.isFlipped()?n.rateAgain()?m():y():(n.prev(),m());return}if(a.key==="ArrowRight"||a.key==="1"){n.isFlipped()?n.rateGotIt()?m():y():n.nextNavigate()&&m();return}a.key==="2"&&n.isFlipped()&&(n.rateAgain()?m():y())}},window.addEventListener("keydown",h);const I=()=>{p().then(()=>{k(),R()})};return window.addEventListener("s3phy:lang",I),p().then(()=>{k(),m()}),()=>{window.removeEventListener("keydown",h),window.removeEventListener("s3phy:lang",I),n==null||n.restart(),t.innerHTML=""}}function J(t){const r=String(t).replace(/^\.\//,""),c=window.location.origin,u=window.location.pathname,f=u.match(/^(.*\/dist)\/?/);if(f)return`${c}${f[1]}/${r}`;let l="./";l.endsWith("/")||(l+="/");const n=u.endsWith("/")?u:u.replace(/\/[^/]*$/,"/")||"/";return new URL(`${l}${r}`,`${c}${n}`).href}let _=null,$=null,A=null,M=null;function Z(){return _||(_=T(()=>import("./flashcards-light-ch3-Cmbo5pjW.js"),[],import.meta.url).then(t=>t.default)),_}function tt(){return $||($=T(()=>import("./flashcards-optics-definitions-DEVNO4HU.js"),[],import.meta.url).then(t=>t.default)),$}function et(){return A||(A=T(()=>import("./flashcards-heat-ch1-DBrwHTm1.js"),[],import.meta.url).then(t=>t.default)),A}function at(){return M||(M=T(()=>import("./flashcards-foundations-CyU4om5_.js"),[],import.meta.url).then(t=>t.default)),M}function nt(t){return t==="zh-Hant"?"zhHant":"en"}function L(t){return J(t)}function B(t,r){return t.filter(c=>c.topic===r)}function rt(t,r,c,u){var h,e,p;const f=nt(r);if((h=t==null?void 0:t.en)!=null&&h.front||(e=t==null?void 0:t.zhHant)!=null&&e.front){const g=(p=t[f])!=null&&p.front?t[f]:t.en||t.zhHant,v=L(g.front),x=g.back?L(g.back):v;return{id:c,subtopic:t.topic||u,front:"",back:"",frontImage:v,backImage:x,alt:t.alt||t.title||"",isImage:!0}}if(t!=null&&t.front){const g=L(t.front),v=t.back?L(t.back):g;return{id:c,subtopic:t.topic||u,front:"",back:"",frontImage:g,backImage:v,alt:t.alt||t.title||"",isImage:!0}}const l=t[f]||t.en,n={id:c,subtopic:t.topic||u,front:(l==null?void 0:l.q)||"",back:(l==null?void 0:l.a)||"",isImage:!1,compactFront:!!t.compactFront,compactBack:!!t.compactBack};return t.backImage&&(n.backImage=L(t.backImage),n.imageAlt=t.imageAlt||""),n}function F(t,r,c="General"){let u=1;return t.map(f=>{const l=rt(f,r,u,f.topic||c);return u+=1,l})}function P(t,r){return t.filter(c=>c.topic===r)}async function st(t){const r=await Z(),c=await tt(),u=t==="rotatingMirror"?"reflection":t;return u==="all"?[...r,...c]:u==="reflection"?B(r,"reflection"):u==="refractionTir"?[...B(r,"refraction"),...B(r,"tir")]:u==="definitions"?c.slice():u==="convex"?P(c,"convex"):u==="concave"?P(c,"concave"):u==="em"?P(c,"em"):r.slice()}async function ct(t){const r=await et();return t==="all"?r.slice():r.filter(c=>c.topic===t)}async function dt(t,r){return F(await st(t),r)}async function ut(t,r){return F(await ct(t),r)}async function ot(t){const r=await at();return t==="all"?r.slice():r.filter(c=>c.topic===t)}async function ft(t,r){return F(await ot(t),r)}export{dt as a,ft as b,ut as c,lt as m};

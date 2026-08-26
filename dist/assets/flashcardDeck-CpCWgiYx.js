import{t as o,_ as M}from"./index-DudlQnP0.js";const G=1.7,D=.7,T=1,z=.1,O=3;function U(t){const r=Math.floor(t),c=t-r;return r+(Math.random()<c?1:0)}function H(t){for(let r=t.length-1;r>0;r-=1){const c=Math.floor(Math.random()*(r+1));[t[r],t[c]]=[t[c],t[r]]}return t}function W(t){const r=new Map(t.map(a=>[a.id,a.copies])),c=[];let l=null;const u=t.reduce((a,d)=>a+d.copies,0);for(let a=0;a<u;a+=1){let d=[...r.entries()].filter(([g,h])=>h>0&&g!==l);d.length===0&&(d=[...r.entries()].filter(([,g])=>g>0)),d.sort((g,h)=>h[1]-g[1]);const[e,y]=d[0];c.push(e),r.set(e,y-1),l=e}return c}function K(t){const r=[];return t.forEach(({id:c,copies:l})=>{for(let u=0;u<l;u+=1)r.push(c)}),r}function Q(t){let r="sequence",c=1,l=[],u=[],a=0,d=!1,e=!1,y=!1;const g=new Map;function h(){return t()}function k(){return new Map(h().map(s=>[s.id,s]))}function v(){g.clear(),h().forEach(s=>{g.set(s.id,{nextRate:T,totalGotIt:0,roundAgain:0,roundGotIt:0,roundNeutral:0})})}function E(){const s=h();return c===1?s.map(p=>({id:p.id,copies:1})):s.map(p=>{var i;return{id:p.id,copies:U(((i=g.get(p.id))==null?void 0:i.nextRate)??T)}}).filter(p=>p.copies>0)}function m(s){if(s.length===0)return[];if(c===1){const p=s.map(i=>i.id);return r==="random"?H([...p]):[...p].sort((i,b)=>i-b)}return r==="random"?H(K(s)):W(s)}function S(){if(e=!1,y=!1,l=E(),l.reduce((p,i)=>p+i.copies,0)===0){y=!0,e=!0,u=[],a=0;return}h().forEach(p=>{const i=g.get(p.id);i&&(i.roundAgain=0,i.roundGotIt=0,i.roundNeutral=0)}),u=m(l),a=0,d=!1}function x(){c=1,v(),S()}function q(){return u[a]??null}function L(){const s=q();return s==null?null:k().get(s)??null}function n(s){const p=q();if(p==null)return;const i=g.get(p);i&&(s==="again"?(i.nextRate=G,i.totalGotIt=0,i.roundAgain+=1):s==="gotit"?(i.totalGotIt+=1,i.roundGotIt+=1,i.nextRate=i.totalGotIt>=O?z:D):s==="neutral"&&(i.roundNeutral+=1,i.nextRate=T))}function f(){return d=!1,a<u.length-1?(a+=1,!1):(e=!0,!0)}return x(),{getMode:()=>r,setMode(s){r!==s&&(r=s,u=m(l),a=0,d=!1)},resetSession:x,getRoundNumber:()=>c,getProgress:()=>({index:u.length?a+1:0,total:u.length}),isFlipped:()=>d,flip(){d=!d},unflip(){d=!1},currentCard:L,prev(){return a>0?(a-=1,d=!1,!0):!1},nextNavigate(){return a<u.length-1?(a+=1,d=!1,!0):!1},rateAgain(){return d?(n("again"),f()):!1},rateGotIt(){return d?(n("gotit"),f()):!1},rateNeutral(){return d?(n("neutral"),f()):!1},isSummary:()=>e,isSessionComplete:()=>y,getRoundStats(){let s=0,p=0,i=0;return g.forEach(b=>{s+=b.roundAgain,p+=b.roundGotIt,i+=b.roundNeutral}),{again:s,gotIt:p,neutral:i}},nextRound(){c+=1,S()},restart(){x()}}}const V={thermometry:"flashcards.deck.thermometry",heatInternalEnergy:"flashcards.deck.heatInternalEnergy",changeOfState:"flashcards.deck.changeOfState",heatTransfer:"flashcards.deck.heatTransfer",reflection:"topic.reflection",refraction:"topic.refraction",tir:"topic.tir",convex:"topic.convex",concave:"topic.concave",em:"topic.em",rotatingMirror:"topic.reflection"};function j(t){const r=V[t]||`topic.${t}`,c=o(r);return c===r?t:c}function st(t,{deckOptions:r,buildDeck:c,initialDeck:l="all"}){let u=l,a=null,d=null;t.innerHTML=`
    <section class="panel panel--flashcards">
      <h2>${o("flashcards.title")}</h2>
      <p class="lead">${o("flashcards.intro")}</p>
      <div class="fc-controls no-print">
        <div class="control">
          <label>${o("flashcards.deck")}</label>
          <select data-fc-deck>
            ${r.map(n=>`<option value="${n.value}">${n.label}</option>`).join("")}
          </select>
        </div>
        <div class="fc-controls-right">
          <div class="fc-mode-group">
            <span class="fc-mode-label">${o("flashcards.studyMode")}</span>
            <div class="fc-mode-toggle" data-fc-mode>
              <button type="button" data-mode="sequence" class="active">${o("flashcards.mode.sequence")}</button>
              <button type="button" data-mode="random">${o("flashcards.mode.random")}</button>
            </div>
          </div>
          <span class="fc-round-badge" data-fc-round></span>
          <div class="fc-progress-block">
            <span class="fc-progress-label">${o("flashcards.progressLabel")}</span>
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
                <p class="fc-flip-prompt" data-fc-flip-prompt>${o("flashcards.tapFlip")}</p>
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
            <span data-fc-prev-label>${o("flashcards.prev")}</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-again" data-fc-again title="${o("flashcards.again")}">
            <span class="material-symbols-outlined" aria-hidden="true">history</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-flip" data-fc-flip title="${o("flashcards.flip")}">
            <span class="material-symbols-outlined fc-flip-icon" aria-hidden="true">sync</span>
          </button>
          <button type="button" class="fc-btn-circle fc-btn-gotit" data-fc-gotit title="${o("flashcards.gotIt")}">
            <span class="material-symbols-outlined" aria-hidden="true">check</span>
          </button>
          <button type="button" class="fc-btn-nav" data-fc-next>
            <span data-fc-next-label>${o("flashcards.next")}</span>
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
          <button class="btn primary" type="button" data-fc-next-round>${o("flashcards.summary.nextRound")}</button>
          <button class="btn" type="button" data-fc-restart>${o("flashcards.summary.restart")}</button>
        </div>
      </div>
    </section>`;const e={deck:t.querySelector("[data-fc-deck]"),mode:t.querySelector("[data-fc-mode]"),round:t.querySelector("[data-fc-round]"),progress:t.querySelector("[data-fc-progress]"),studyPanel:t.querySelector("[data-fc-study-panel]"),summaryPanel:t.querySelector("[data-fc-summary]"),cardWrap:t.querySelector("[data-fc-card-wrap]"),cardInner:t.querySelector("[data-fc-card-inner]"),subtopicPill:t.querySelector("[data-fc-subtopic-pill]"),subtopicPillBack:t.querySelector("[data-fc-subtopic-pill-back]"),cardCode:t.querySelector("[data-fc-card-code]"),cardCodeBack:t.querySelector("[data-fc-card-code-back]"),frontBody:t.querySelector("[data-fc-front-body]"),backBody:t.querySelector("[data-fc-back-body]"),flipPrompt:t.querySelector("[data-fc-flip-prompt]"),hint:t.querySelector("[data-fc-hint]"),prev:t.querySelector("[data-fc-prev]"),again:t.querySelector("[data-fc-again]"),flip:t.querySelector("[data-fc-flip]"),gotit:t.querySelector("[data-fc-gotit]"),next:t.querySelector("[data-fc-next]"),summaryTitle:t.querySelector("[data-fc-summary-title]"),summaryStats:t.querySelector("[data-fc-summary-stats]"),summaryKeep:t.querySelector("[data-fc-summary-keep]"),summaryConfident:t.querySelector("[data-fc-summary-confident]"),nextRound:t.querySelector("[data-fc-next-round]"),restart:t.querySelector("[data-fc-restart]")};async function y(){const n=await c(u);a=Q(()=>n)}function g(n,f){const s=!f;e.prev.disabled=s,e.again.disabled=s||!n,e.gotit.disabled=s||!n,e.flip.disabled=s,e.next.disabled=s}function h(n,f,s=!1){var N;n.classList.remove("fc-card-text-long","fc-card-text-compact");const p=document.createElement("div");p.innerHTML=f||"";const i=(p.textContent||"").trim(),b=i.split(`
`).filter(Boolean).length,C=((N=(f||"").match(/<br\s*\/?>/gi))==null?void 0:N.length)??0,_=Math.max(b,C>0?C+1:0),P=i.length;s||_>=5||P>220?n.classList.add("fc-card-text-compact"):(_>=4||P>130)&&n.classList.add("fc-card-text-long")}function k(n,f,s){const p=(s||"").replace(/"/g,"&quot;"),i=(s||o("flashcards.question")).replace(/</g,"&lt;");n.innerHTML=`<img src="${f}" alt="${p}" loading="lazy" class="fc-card-img" data-fc-img /><p class="fc-img-fallback muted" data-fc-img-fallback hidden>${i}</p>`;const b=n.querySelector("[data-fc-img]"),C=n.querySelector("[data-fc-img-fallback]");b&&C&&(b.onerror=()=>{b.hidden=!0,C.hidden=!1},b.onload=()=>{b.hidden=!1,C.hidden=!0})}function v(){const n=a.currentCard(),f=a.isFlipped();if(e.cardInner.classList.toggle("fc-flipped",f),!n){e.subtopicPill.textContent="",e.subtopicPillBack.textContent="",e.cardCode.textContent="",e.cardCodeBack.textContent="",e.frontBody.innerHTML="",e.backBody.innerHTML="",e.flipPrompt.hidden=!0,e.cardWrap.classList.remove("fc-card-container--image"),g(!1,!1),e.hint.textContent="";return}const s=j(n.subtopic),p=o("flashcards.cardCode").replace("{id}",String(n.id));if(e.subtopicPill.textContent=s,e.subtopicPillBack.textContent=s,e.cardCode.textContent=p,e.cardCodeBack.textContent=p,n.isImage)e.cardWrap.classList.add("fc-card-container--image"),e.flipPrompt.hidden=!0,k(e.frontBody,n.frontImage,n.alt),n.backImage&&n.backImage!==n.frontImage?k(e.backBody,n.backImage,n.alt):e.backBody.innerHTML=e.frontBody.innerHTML;else{if(e.cardWrap.classList.remove("fc-card-container--image"),e.flipPrompt.hidden=f,e.frontBody.innerHTML=n.front,n.backImage){const i=n.imageAlt||"";e.backBody.innerHTML=`${n.back}<img class="fc-card-back-img" src="${n.backImage}" alt="${i}" />`}else e.backBody.innerHTML=n.back;h(e.frontBody,n.front,n.compactFront),h(e.backBody,n.back,n.compactBack)}g(f,!0),e.hint.textContent=f?o("flashcards.hint.rated"):o("flashcards.flipFirst"),e.hint.classList.toggle("fc-rating-hint--action",!f)}function E(){const n=a.getRoundStats(),{total:f}=a.getProgress();a.isSessionComplete()?(e.summaryTitle.textContent=o("flashcards.summary.complete"),e.summaryStats.textContent=o("flashcards.summary.completeStats"),e.nextRound.hidden=!0):(e.summaryTitle.textContent=o("flashcards.summary.title").replace("{round}",String(a.getRoundNumber())),e.summaryStats.textContent=o("flashcards.summary.stats").replace("{total}",String(f)).replace("{again}",String(n.again)).replace("{gotIt}",String(n.gotIt)).replace("{neutral}",String(n.neutral)),e.nextRound.hidden=!1),e.summaryKeep.textContent=o("flashcards.summary.keep").replace("{count}",String(n.again)),e.summaryConfident.textContent=o("flashcards.summary.confident").replace("{count}",String(n.gotIt))}function m(){const{index:n,total:f}=a.getProgress();e.round.textContent=o("flashcards.round").replace("{round}",String(a.getRoundNumber())).replace("{total}",String(f)),e.progress.textContent=f?`${n} / ${f}`:"—";const s=a.isSummary();e.studyPanel.hidden=s,e.summaryPanel.hidden=!s,s?E():v()}function S(){const n=a.getMode();e.mode.querySelectorAll("button").forEach(f=>{f.classList.toggle("active",f.dataset.mode===n)})}function x(){a.currentCard()&&(a.flip(),v())}function q(){t.querySelector("h2").textContent=o("flashcards.title"),t.querySelector(".lead").textContent=o("flashcards.intro"),t.querySelector("[data-fc-deck]").previousElementSibling.textContent=o("flashcards.deck"),t.querySelector(".fc-mode-label").textContent=o("flashcards.studyMode"),t.querySelector(".fc-progress-label").textContent=o("flashcards.progressLabel"),e.mode.querySelector('[data-mode="sequence"]').textContent=o("flashcards.mode.sequence"),e.mode.querySelector('[data-mode="random"]').textContent=o("flashcards.mode.random"),e.flipPrompt.textContent=o("flashcards.tapFlip"),t.querySelector("[data-fc-prev-label]").textContent=o("flashcards.prev"),t.querySelector("[data-fc-next-label]").textContent=o("flashcards.next"),e.nextRound.textContent=o("flashcards.summary.nextRound"),e.restart.textContent=o("flashcards.summary.restart"),m()}e.deck.value=u,e.deck.addEventListener("change",()=>{u=e.deck.value,y().then(()=>{S(),m()})}),e.mode.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{a.setMode(n.dataset.mode),S(),m()})}),e.cardWrap.addEventListener("click",n=>{n.target.closest("button")||x()}),e.flip.addEventListener("click",n=>{n.stopPropagation(),x()}),e.prev.addEventListener("click",()=>{a.prev(),m()}),e.again.addEventListener("click",()=>{a.rateAgain()?m():v()}),e.gotit.addEventListener("click",()=>{a.rateGotIt()?m():v()}),e.next.addEventListener("click",()=>{a.isFlipped()?a.rateNeutral()?m():v():a.nextNavigate()&&m()}),e.nextRound.addEventListener("click",()=>{a.nextRound(),m()}),e.restart.addEventListener("click",()=>{a.restart(),m()}),d=n=>{var s;if(!t.isConnected)return;const f=(s=n.target)==null?void 0:s.tagName;if(!(f==="INPUT"||f==="SELECT"||f==="TEXTAREA")){if(n.code==="Space"){n.preventDefault(),x();return}if(n.key==="ArrowLeft"){a.isFlipped()?a.rateAgain()?m():v():(a.prev(),m());return}if(n.key==="ArrowRight"||n.key==="1"){a.isFlipped()?a.rateGotIt()?m():v():a.nextNavigate()&&m();return}n.key==="2"&&a.isFlipped()&&(a.rateAgain()?m():v())}},window.addEventListener("keydown",d);const L=()=>{y().then(()=>{S(),q()})};return window.addEventListener("s3phy:lang",L),y().then(()=>{S(),m()}),()=>{window.removeEventListener("keydown",d),window.removeEventListener("s3phy:lang",L),a==null||a.restart(),t.innerHTML=""}}function X(t){const r=String(t).replace(/^\.\//,""),c=window.location.origin,l=window.location.pathname,u=l.match(/^(.*\/dist)\/?/);if(u)return`${c}${u[1]}/${r}`;let a="./";a.endsWith("/")||(a+="/");const d=l.endsWith("/")?l:l.replace(/\/[^/]*$/,"/")||"/";return new URL(`${a}${r}`,`${c}${d}`).href}let R=null,$=null,w=null;function Y(){return R||(R=M(()=>import("./flashcards-light-ch3-Cmbo5pjW.js"),[],import.meta.url).then(t=>t.default)),R}function J(){return $||($=M(()=>import("./flashcards-optics-definitions-DEVNO4HU.js"),[],import.meta.url).then(t=>t.default)),$}function Z(){return w||(w=M(()=>import("./flashcards-heat-ch1-DBrwHTm1.js"),[],import.meta.url).then(t=>t.default)),w}function tt(t){return t==="zh-Hant"?"zhHant":"en"}function I(t){return X(t)}function A(t,r){return t.filter(c=>c.topic===r)}function et(t,r,c,l){var e,y,g;const u=tt(r);if((e=t==null?void 0:t.en)!=null&&e.front||(y=t==null?void 0:t.zhHant)!=null&&y.front){const h=(g=t[u])!=null&&g.front?t[u]:t.en||t.zhHant,k=I(h.front),v=h.back?I(h.back):k;return{id:c,subtopic:t.topic||l,front:"",back:"",frontImage:k,backImage:v,alt:t.alt||t.title||"",isImage:!0}}if(t!=null&&t.front){const h=I(t.front),k=t.back?I(t.back):h;return{id:c,subtopic:t.topic||l,front:"",back:"",frontImage:h,backImage:k,alt:t.alt||t.title||"",isImage:!0}}const a=t[u]||t.en,d={id:c,subtopic:t.topic||l,front:(a==null?void 0:a.q)||"",back:(a==null?void 0:a.a)||"",isImage:!1,compactFront:!!t.compactFront,compactBack:!!t.compactBack};return t.backImage&&(d.backImage=I(t.backImage),d.imageAlt=t.imageAlt||""),d}function F(t,r,c="General"){let l=1;return t.map(u=>{const a=et(u,r,l,u.topic||c);return l+=1,a})}function B(t,r){return t.filter(c=>c.topic===r)}async function at(t){const r=await Y(),c=await J(),l=t==="rotatingMirror"?"reflection":t;return l==="all"?[...r,...c]:l==="reflection"?A(r,"reflection"):l==="refractionTir"?[...A(r,"refraction"),...A(r,"tir")]:l==="definitions"?c.slice():l==="convex"?B(c,"convex"):l==="concave"?B(c,"concave"):l==="em"?B(c,"em"):r.slice()}async function nt(t){const r=await Z();return t==="all"?r.slice():r.filter(c=>c.topic===t)}async function ct(t,r){return F(await at(t),r)}async function ot(t,r){return F(await nt(t),r)}export{ot as a,ct as b,st as m};

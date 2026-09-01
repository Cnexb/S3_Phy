const L="s3phy:tool-picker-collapsed";function q({toolOrder:t,toolId:s,getLabel:a,t:l}){const c=t.map(o=>`<button type="button" data-tool="${o}" class="${s===o?"active":""}">${a(o)}</button>`).join("");return`
      <section class="panel panel--tools" data-tools-panel>
        <div class="tools-panel-head">
          <div class="tools-panel-head__text">
            <h2>${l("tools.title")}</h2>
            <p class="tools-active-lab" data-tool-active-label hidden>${a(s)}</p>
          </div>
          <div class="tools-panel-head__actions">
            <button type="button" class="tool-picker-toggle" data-tool-picker-toggle aria-expanded="true">
              <span data-tool-picker-chevron aria-hidden="true">&#9650;</span>
              <span data-tool-picker-toggle-label>${l("tools.hideLabList")}</span>
            </button>
            <button type="button" class="tool-picker-toggle" data-hub-fullscreen aria-pressed="false">
              <span class="material-symbols-outlined" data-hub-fullscreen-icon aria-hidden="true">fullscreen</span>
              <span data-hub-fullscreen-label>${l("tools.fullscreen")}</span>
            </button>
          </div>
        </div>
        <div class="tools-layout">
          <aside class="tool-picker" data-tool-picker>
            <p class="lead">${l("tools.pick")}</p>
            <div class="tool-list" data-tool-list>${c}</div>
          </aside>
          <div class="tool-stage" data-tool-stage></div>
        </div>
      </section>`}function E(t,{getLabel:s,t:a,onSelectTool:l,mountTool:c,getActiveToolId:o}){const r=t.querySelector("[data-tools-panel]"),S=t.querySelector("[data-tool-picker]"),d=t.querySelector("[data-tool-list]"),p=t.querySelector("[data-tool-stage]"),u=t.querySelector("[data-tool-picker-toggle]"),b=t.querySelector("[data-tool-picker-toggle-label]"),h=t.querySelector("[data-tool-picker-chevron]"),i=t.querySelector("[data-tool-active-label]");if(!r||!S||!d||!p||!u)return;let e=sessionStorage.getItem(L)==="true";const v=()=>{i&&(i.textContent=s(o()))},f=()=>{u.setAttribute("aria-expanded",e?"false":"true"),b&&(b.textContent=a(e?"tools.showLabList":"tools.hideLabList")),h&&(h.textContent=e?"▼":"▲"),i&&(i.hidden=!e)},k=n=>{e=n,r.classList.toggle("is-picker-collapsed",e),sessionStorage.setItem(L,e?"true":"false"),f()};r.classList.toggle("is-picker-collapsed",e),v(),f(),u.addEventListener("click",()=>{k(!e)}),d.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{const g=n.getAttribute("data-tool");g&&(l(g),d.querySelectorAll("button").forEach(y=>{y.classList.toggle("active",y.getAttribute("data-tool")===g)}),v(),c(p),window.innerWidth<=768&&k(!0))})}),c(p)}export{E as h,q as r};

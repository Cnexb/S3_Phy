const S="s3phy:tool-picker-collapsed";function q({toolOrder:t,toolId:s,getLabel:o,t:a}){const i=t.map(l=>`<button type="button" data-tool="${l}" class="${s===l?"active":""}">${o(l)}</button>`).join("");return`
      <section class="panel panel--tools" data-tools-panel>
        <div class="tools-panel-head">
          <div class="tools-panel-head__text">
            <h2>${a("tools.title")}</h2>
            <p class="tools-active-lab" data-tool-active-label hidden>${o(s)}</p>
          </div>
          <div class="tools-panel-head__actions">
            <button type="button" class="tool-picker-toggle" data-tool-picker-toggle aria-expanded="true">
              <span data-tool-picker-chevron aria-hidden="true">&#9650;</span>
              <span data-tool-picker-toggle-label>${a("tools.hideLabList")}</span>
            </button>
          </div>
        </div>
        <div class="tools-layout">
          <aside class="tool-picker" data-tool-picker>
            <p class="lead">${a("tools.pick")}</p>
            <div class="tool-list" data-tool-list>${i}</div>
          </aside>
          <div class="tool-stage" data-tool-stage></div>
        </div>
      </section>`}function E(t,{getLabel:s,t:o,onSelectTool:a,mountTool:i,getActiveToolId:l}){const d=t.querySelector("[data-tools-panel]"),f=t.querySelector("[data-tool-picker]"),r=t.querySelector("[data-tool-list]"),p=t.querySelector("[data-tool-stage]"),u=t.querySelector("[data-tool-picker-toggle]"),v=t.querySelector("[data-tool-picker-toggle-label]"),h=t.querySelector("[data-tool-picker-chevron]"),c=t.querySelector("[data-tool-active-label]");if(!d||!f||!r||!p||!u)return;let e=sessionStorage.getItem(S)==="true";const b=()=>{c&&(c.textContent=s(l()))},k=()=>{u.setAttribute("aria-expanded",e?"false":"true"),v&&(v.textContent=o(e?"tools.showLabList":"tools.hideLabList")),h&&(h.textContent=e?"▼":"▲"),c&&(c.hidden=!e)},y=n=>{e=n,d.classList.toggle("is-picker-collapsed",e),sessionStorage.setItem(S,e?"true":"false"),k()};d.classList.toggle("is-picker-collapsed",e),b(),k(),u.addEventListener("click",()=>{y(!e)}),r.querySelectorAll("button").forEach(n=>{n.addEventListener("click",()=>{const g=n.getAttribute("data-tool");g&&(a(g),r.querySelectorAll("button").forEach(L=>{L.classList.toggle("active",L.getAttribute("data-tool")===g)}),b(),i(p),window.innerWidth<=768&&y(!0))})}),i(p)}export{E as h,q as r};

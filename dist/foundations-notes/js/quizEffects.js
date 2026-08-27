/** BioUni+ quiz motion effects (split text, magnet hover, true focus, block reveal). */

/** Gradient shine on text (matches notes / osmosis lab shiny-text). */
export function shinyTextHtml(text, esc = (s) => s) {
  return `<span class="shiny-text">${esc(String(text))}</span>`;
}

export function animateSplitText(element) {
  if (!element) return;
  const text = element.textContent || "";
  if (!text.trim()) return;
  element.classList.remove("reveal");
  let delay = 0;
  const parts = [];
  text.split("\n").forEach((line, lineIdx) => {
    if (lineIdx > 0) parts.push('<br class="split-br" aria-hidden="true" />');
    const words = line.trim() ? line.split(/\s+/) : [];
    words.forEach((word) => {
      parts.push(
        `<span class="split-word" style="transition-delay:${delay}ms">${word}</span>`
      );
      delay += 28;
    });
  });
  element.innerHTML = parts.join(" ");
  requestAnimationFrame(() => {
    setTimeout(() => element.classList.add("reveal"), 40);
  });
}

export function bindMagnets(root = document) {
  root.querySelectorAll(".magnet-link").forEach((magnet) => {
    magnet.onmousemove = (e) => {
      const rect = magnet.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      magnet.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };
    magnet.onmouseleave = () => {
      magnet.style.transform = "";
    };
  });
}

export function bindTrueFocus(container, body = document.body) {
  if (!container) return;
  container.addEventListener("mouseenter", () => body.classList.add("true-focus-active"));
  container.addEventListener("mouseleave", () => body.classList.remove("true-focus-active"));
}

export function revealQuestionBlocks(root = document) {
  const blocks = root.querySelectorAll?.(".q-block") || [];
  blocks.forEach((block, i) => {
    block.classList.remove("q-visible");
    block.style.transitionDelay = `${Math.min(i * 70, 420)}ms`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => block.classList.add("q-visible"));
    });
  });
}

export function initSettingsToggle({ layout, panel, btn, icon, label }) {
  if (!layout || !panel || !btn) return;

  let open = true;

  function apply() {
    layout.classList.toggle("settings-collapsed", !open);
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", open ? "false" : "true");
    if (icon) icon.textContent = open ? "chevron_left" : "chevron_right";
    if (label) {
      label.textContent = open
        ? label.dataset.labelHide || label.getAttribute("data-label-hide") || "Hide settings"
        : label.dataset.labelShow || label.getAttribute("data-label-show") || "Show settings";
    }
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  btn.addEventListener("click", () => {
    open = !open;
    apply();
  });

  apply();
}

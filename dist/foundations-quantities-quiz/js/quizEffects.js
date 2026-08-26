/** BioUni+ quiz motion effects (split text, magnet hover, true focus, block reveal). */

/** Gradient shine on text (matches notes / osmosis lab shiny-text). */
export function shinyTextHtml(text, esc = (s) => s) {
  return `<span class="shiny-text">${esc(String(text))}</span>`;
}

function animateSplitTextBlock(element, delayOffset = 0) {
  const text = element.textContent?.trim() || "";
  if (!text) return delayOffset;
  element.innerHTML = text
    .split(/\s+/)
    .map((word, i) => {
      const delay = (delayOffset + i) * 28;
      return `<span class="split-word" style="transition-delay:${delay}ms">${word}</span>`;
    })
    .join(" ");
  return delayOffset + text.split(/\s+/).length;
}

export function animateSplitText(element) {
  if (!element) return;
  const blocks = element.querySelectorAll(".stem-block");
  if (blocks.length) {
    element.classList.remove("reveal");
    let offset = 0;
    blocks.forEach((block) => {
      offset = animateSplitTextBlock(block, offset);
    });
    requestAnimationFrame(() => {
      setTimeout(() => element.classList.add("reveal"), 40);
    });
    return;
  }
  const text = element.textContent?.trim() || "";
  if (!text) return;
  element.classList.remove("reveal");
  animateSplitTextBlock(element, 0);
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

export function initSettingsToggle({ layout, panel, btn, icon, label, storageKey = "quiz-settings-open" }) {
  if (!layout || !panel || !btn) return;

  const readOpen = () => {
    try {
      const v = sessionStorage.getItem(storageKey);
      if (v !== null) return v === "1";
    } catch {
      /* ignore */
    }
    return !window.matchMedia("(max-width: 1100px)").matches;
  };

  let open = readOpen();

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
    try {
      sessionStorage.setItem(storageKey, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }

  btn.addEventListener("click", () => {
    open = !open;
    apply();
  });

  apply();
}

import { QUIZ_ITEMS, QUIZ_SECTIONS } from "./quizData.js";
import { sectionLabel, renderSessionSummary } from "./quizSummary.js";
import { downloadWord, printSheet } from "./quizExport.js";
import {
  DIFFICULTY_LEVELS,
  difficultyLevel,
  seededShuffle,
  escHtml,
  modelAnswerText,
  resolveQuizLang,
  isChineseUI,
  questionFormat,
  formatTypeLabel,
  allFillFieldsCorrect,
  countFillBlanks,
  getFillLines,
  QUIZ_FORMAT_FILTERS,
  formatFilterLabel,
  buildQuizBankStats,
  filterQuizPool,
} from "./quizUtils.js";
import {
  animateSplitText,
  bindMagnets,
  bindTrueFocus,
  revealQuestionBlocks,
  initSettingsToggle,
} from "./quizEffects.js";

const UI = {
  en: {
    appSubtitle: "S3 Optics Ch.4 — EM waves, spectrum & applications — English UI",
    hSettings: "Worksheet settings",
    lblTypes: "Topics",
    lblFormats: "Question types",
    bankSummaryTitle: "Question bank (current filters)",
    bankAvailable: "Available to generate",
    bankByTopic: "By topic",
    bankByType: "By question type",
    bankMatrix: "Topic × type",
    bankNone: "Select at least one topic and one question type.",
    lblCount: "Number of questions (1–50)",
    lblDiff: "Difficulty",
    lblSeed: "Random seed (optional)",
    btnGenerate: "Generate questions",
    hExport: "Export",
    txtExportHint: "Word: .doc for Microsoft Word. Use Print → Save as PDF for a PDF copy.",
    btnDocQ: "Word — Questions",
    btnDocA: "Word — Answers",
    btnPrint: "Print / Save as PDF",
    hPractice: "On-screen practice",
    txtPracticeHint: "First wrong: hint only. Second wrong: model answer.",
    btnSummary: "Session summary",
    quizCheck: "Check answer",
    empty: "Generate questions first.",
    alertNoQuiz: "Generate questions first.",
    alertNoTypes: "Select at least one topic.",
    alertNoFormats: "Select at least one question type.",
    alertNoMatch: "No questions match your filters.",
    alertPoolLimited:
      "Only {available} question(s) match your topics, question types, and difficulty (you asked for {requested}). Questions were not repeated.",
    progressNone: "No session yet",
    progressCompletedPrefix: "Completed ",
    correct: "Correct.",
    hintPrefix: "Hint:",
    modelPrefix: "Model answer:",
    printConfirm: "Print ANSWER sheet? (Cancel = questions only)",
    summaryTitle: "Summary",
    summaryScoreLabel: "Score (correct / total)",
    summaryFirstTry: "Correct on first attempt",
    summaryWrongTitle: "Wrong twice — review these",
    summaryNoneWrong: "None — no questions failed after two attempts.",
    summaryIncomplete: "Still in progress",
    summaryByTypeTitle: "Correct rate by topic",
    summaryByTypeColType: "Topic",
    summaryByTypeColFraction: "Correct / in topic",
    summaryByTypeColRate: "Rate",
    summaryByTypeColFirst: "First-try / in topic",
    revTitle: "Comments & revision suggestions",
    revBandExcellent:
      "Overall accuracy is very high. Keep mixing topics so recall stays sharp for HKDSE.",
    revBandGood: "Good result. Use the table above to add a short round on weaker topics.",
    revBandFair: "Mixed performance: re-read weaker Ch.4 EM wave topics, then regenerate.",
    revBandLow: "Several concepts need consolidation. Review EM wave nature, the spectrum order, band properties, and applications/safety before the next round.",
    revWeakOne: "Prioritise revision on {type} — you scored {c}/{t} ({pct}%) in that topic.",
    revStrongOne: "Strength: every {type} item correct ({n} questions).",
    revTwoStrike: "Questions missed twice: study the model answers, then regenerate those topics.",
    revIncomplete: "Finish questions still in progress for a fair measure of strengths and gaps.",
    revFirstTryLow: "Many items needed two attempts. Read each stem carefully before answering.",
    revBalanced: "Errors spread across topics — continue balanced practice.",
    hideSettings: "Hide settings",
    showSettings: "Show settings",
  },
  zh: {
    appSubtitle: "概念检查 · 界面简体中文",
    hSettings: "工作纸设定",
    lblTypes: "课题",
    lblFormats: "题型",
    bankSummaryTitle: "题库（依目前筛选）",
    bankAvailable: "可生成题数",
    bankByTopic: "按课题",
    bankByType: "按题型",
    bankMatrix: "课题 × 题型",
    bankNone: "请至少选择一个课题和一种题型。",
    lblCount: "题数（1–50）",
    lblDiff: "难度",
    lblSeed: "随机种子（可留空）",
    btnGenerate: "生成题目",
    hExport: "导出",
    txtExportHint: "Word：下载 .doc 以 Word 打开。PDF 请用「打印」→「另存 PDF」。",
    btnDocQ: "Word — 试题",
    btnDocA: "Word — 答案",
    btnPrint: "打印／另存 PDF",
    hPractice: "互动练习",
    txtPracticeHint: "第一次答错只显示提示；第二次答错显示参考答案。",
    btnSummary: "学习摘要",
    quizCheck: "检查答案",
    empty: "请先按「生成题目」。",
    alertNoQuiz: "请先生成题目。",
    alertNoTypes: "请至少选择一个课题。",
    alertNoFormats: "请至少选择一种题型。",
    alertNoMatch: "没有符合条件的题目。",
    alertPoolLimited:
      "符合课题、题型与难度条件的只有 {available} 题（你要求 {requested} 题）。不会重复出题。",
    progressNone: "尚未生成题目",
    progressCompletedPrefix: "已完成 ",
    correct: "正确。",
    hintPrefix: "提示：",
    modelPrefix: "参考答案：",
    printConfirm: "要打印「答案版」吗？（取消 = 试题版）",
    summaryTitle: "摘要",
    summaryScoreLabel: "得分（答对／总题数）",
    summaryFirstTry: "首次即答对",
    summaryWrongTitle: "两次皆错 — 需重温",
    summaryNoneWrong: "没有此类题目。",
    summaryIncomplete: "尚未答对",
    summaryByTypeTitle: "各课题答对率",
    summaryByTypeColType: "课题",
    summaryByTypeColFraction: "答对／该课题题数",
    summaryByTypeColRate: "答对率",
    summaryByTypeColFirst: "首次即对／该课题题数",
    revTitle: "评语与温习建议",
    revBandExcellent: "整体答对率很高。建议持续混合各课题练习。",
    revBandGood: "整体表现不错。可针对较弱课题加做一轮。",
    revBandFair: "表现参差：请重温相关笔记后再生成题目。",
    revBandLow: "多个概念仍需巩固。请先温习电磁波性质、电磁波谱次序、各波段特性，以及应用与安全。",
    revWeakOne: "建议优先温习「{type}」：本次 {c}/{t}（{pct}%）。",
    revStrongOne: "强项：「{type}」本次全对（共 {n} 题）。",
    revTwoStrike: "曾两次答错的题目：请细读参考答案后再练。",
    revIncomplete: "尚有未答对题目，建议先完成。",
    revFirstTryLow: "不少题目需第二次才答对。作答前宜放慢阅读题干。",
    revBalanced: "错误分散在不同课题，宜均衡练习。",
    hideSettings: "隐藏设定",
    showSettings: "显示设定",
  },
  "zh-Hant": {
    appSubtitle: "中三光學 第4章 電磁波 — 繁體中文介面",
    hSettings: "工作紙設定",
    lblTypes: "課題",
    lblFormats: "題型",
    bankSummaryTitle: "題庫（依目前篩選）",
    bankAvailable: "可產生題數",
    bankByTopic: "按課題",
    bankByType: "按題型",
    bankMatrix: "課題 × 題型",
    bankNone: "請至少選擇一個課題和一種題型。",
    lblCount: "題數（1–50）",
    lblDiff: "難度",
    lblSeed: "隨機種子（可留空）",
    btnGenerate: "產生題目",
    hExport: "匯出",
    txtExportHint: "Word：下載 .doc 以 Word 開啟。PDF 請用「列印」→「另存 PDF」。",
    btnDocQ: "Word — 試題",
    btnDocA: "Word — 答案",
    btnPrint: "列印／另存 PDF",
    hPractice: "互動練習",
    txtPracticeHint: "第一次答錯只顯示提示；第二次答錯顯示參考答案。",
    btnSummary: "學習摘要",
    quizCheck: "檢查答案",
    empty: "請先按「產生題目」。",
    alertNoQuiz: "請先產生題目。",
    alertNoTypes: "請至少選擇一個課題。",
    alertNoFormats: "請至少選擇一種題型。",
    alertNoMatch: "沒有符合條件的題目。",
    alertPoolLimited:
      "符合課題、題型與難度條件的只有 {available} 題（你要求 {requested} 題）。不會重複出題。",
    progressNone: "尚未產生題目",
    progressCompletedPrefix: "已完成 ",
    correct: "正確。",
    hintPrefix: "提示：",
    modelPrefix: "參考答案：",
    printConfirm: "要列印「答案版」嗎？（取消 = 試題版）",
    summaryTitle: "摘要",
    summaryScoreLabel: "得分（答對／總題數）",
    summaryFirstTry: "首次即答對",
    summaryWrongTitle: "兩次皆錯 — 需重溫",
    summaryNoneWrong: "沒有此類題目。",
    summaryIncomplete: "尚未答對",
    summaryByTypeTitle: "各課題答對率",
    summaryByTypeColType: "課題",
    summaryByTypeColFraction: "答對／該課題題數",
    summaryByTypeColRate: "答對率",
    summaryByTypeColFirst: "首次即對／該課題題數",
    revTitle: "評語與溫習建議",
    revBandExcellent: "整體答對率很高。建議持續混合各課題練習。",
    revBandGood: "整體表現不錯。可針對較弱課題加做一輪。",
    revBandFair: "表現參差：請先溫習較弱的第4章電磁波課題，再重新出題。",
    revBandLow: "多個概念仍需鞏固。請先溫習電磁波性質、電磁譜次序、各波段特性，以及應用與安全，再進行下一輪。",
    revWeakOne: "建議優先溫習「{type}」：本題得分 {c}/{t}（{pct}%）。",
    revStrongOne: "強項：「{type}」本次全對（共 {n} 題）。",
    revTwoStrike: "曾兩次答錯的題目：請細讀參考答案後再練。",
    revIncomplete: "尚有未答對題目，建議先完成。",
    revFirstTryLow: "不少題目需第二次才答對。作答前宜放慢閱讀題幹。",
    revBalanced: "錯誤分散在不同課題，宜均衡練習。",
    hideSettings: "隱藏設定",
    showSettings: "顯示設定",
  },
};

export function initQuiz() {
  let lang = resolveQuizLang();
  let lastQuestions = [];
  const attemptMap = new Map();

  const t = (key) => UI[lang]?.[key] || UI.en[key] || key;

  const els = {
    typeChecks: document.getElementById("quiz-type-checks"),
    formatChecks: document.getElementById("quiz-format-checks"),
    bankSummary: document.getElementById("quiz-bank-summary"),
    numCount: document.getElementById("quiz-num-count"),
    selDiff: document.getElementById("quiz-sel-diff"),
    txtSeed: document.getElementById("quiz-txt-seed"),
    quizArea: document.getElementById("quiz-area"),
    summaryPanel: document.getElementById("summary-panel"),
    progressText: document.getElementById("quiz-progress-text"),
    progressBar: document.getElementById("quiz-progress-bar"),
    quizContainer: document.getElementById("quiz-container"),
  };

  if (!els.quizArea) return;


  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.getAttribute("data-i18n");
      if (UI[lang]?.[key] || UI.en[key]) node.textContent = t(key);
    });
    const toggleLabel = document.getElementById("settings-toggle-label");
    if (toggleLabel) {
      toggleLabel.dataset.labelHide = t("hideSettings");
      toggleLabel.dataset.labelShow = t("showSettings");
      const layout = document.getElementById("quiz-layout");
      const open = layout && !layout.classList.contains("settings-collapsed");
      toggleLabel.textContent = open ? t("hideSettings") : t("showSettings");
    }
    initMeta();
    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      pageTitle.textContent = t("hPractice");
      animateSplitText(pageTitle);
    }
    if (lastQuestions.length) renderQuiz();
    if (els.summaryPanel && !els.summaryPanel.hidden && lastQuestions.length) {
      renderSessionSummary({
        questions: lastQuestions,
        attemptMap,
        panel: els.summaryPanel,
        t,
        lang,
      });
    }
  }

  function applyEffectsAfterRender() {
    bindMagnets(els.quizArea);
    revealQuestionBlocks(els.quizArea);
    els.quizArea.querySelectorAll(".split-text-target").forEach((node) => animateSplitText(node));
  }

  function getFilterState() {
    return {
      sections: selectedSections(),
      formats: selectedFormats(),
      difficulty: els.selDiff?.value || "all",
    };
  }

  function updateBankSummary() {
    if (!els.bankSummary) return;
    const { sections, formats, difficulty } = getFilterState();

    if (!sections.length || !formats.length) {
      els.bankSummary.innerHTML = `<p class="font-label-bold text-on-surface mb-1">${escHtml(t("bankSummaryTitle"))}</p><p class="text-on-surface-variant">${escHtml(t("bankNone"))}</p>`;
      return;
    }

    const pool = filterQuizPool(QUIZ_ITEMS, { sections, formats, difficulty });
    const stats = buildQuizBankStats(pool, sections, formats);

    const topicRows = sections
      .map((sid) => {
        const sec = QUIZ_SECTIONS.find((s) => s.id === sid);
        const label = sec ? (isChineseUI(lang) ? sec.labelZh : sec.label) : sid;
        const n = stats.bySection[sid] || 0;
        return `<li class="flex justify-between gap-2"><span>${escHtml(label)}</span><span class="font-label-bold tabular-nums">${n}</span></li>`;
      })
      .join("");

    const typeRows = formats
      .map((fid) => {
        const fmt = QUIZ_FORMAT_FILTERS.find((f) => f.id === fid);
        const label = fmt ? formatFilterLabel(fmt, lang) : fid;
        const n = stats.byFormat[fid] || 0;
        return `<li class="flex justify-between gap-2"><span>${escHtml(label)}</span><span class="font-label-bold tabular-nums">${n}</span></li>`;
      })
      .join("");

    const headCells = formats
      .map((fid) => {
        const fmt = QUIZ_FORMAT_FILTERS.find((f) => f.id === fid);
        const short =
          fid === "mcq" ? "MCQ" : fid === "tf" ? "T/F" : fid === "fill" ? "Fill" : fid;
        const title = fmt ? formatFilterLabel(fmt, lang) : short;
        return `<th scope="col" title="${escHtml(title)}">${escHtml(short)}</th>`;
      })
      .join("");

    const bodyRows = sections
      .map((sid) => {
        const sec = QUIZ_SECTIONS.find((s) => s.id === sid);
        const label = sec ? (isChineseUI(lang) ? sec.labelZh : sec.label) : sid;
        const cells = formats
          .map((fid) => {
            const n = stats.matrix[sid]?.[fid] || 0;
            const cls = n > 0 ? "cell-hit" : "cell-zero";
            return `<td class="${cls}">${n}</td>`;
          })
          .join("");
        return `<tr><th scope="row">${escHtml(label)}</th>${cells}</tr>`;
      })
      .join("");

    els.bankSummary.innerHTML = `
      <p class="font-label-bold text-on-surface mb-2">${escHtml(t("bankSummaryTitle"))}</p>
      <p class="text-on-surface-variant text-[11px] uppercase tracking-wide mb-0.5">${escHtml(t("bankAvailable"))}</p>
      <p class="bank-available tabular-nums mb-4">${stats.total}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankByTopic"))}</p>
          <ul class="space-y-1 text-on-surface">${topicRows}</ul>
        </div>
        <div>
          <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankByType"))}</p>
          <ul class="space-y-1 text-on-surface">${typeRows}</ul>
        </div>
      </div>
      <p class="font-label-bold text-on-surface-variant text-[11px] uppercase tracking-wide mb-2">${escHtml(t("bankMatrix"))}</p>
      <div class="overflow-x-auto -mx-1 px-1">
        <table class="quiz-bank-matrix">
          <thead><tr><th scope="col"></th>${headCells}</tr></thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>`;
  }

  function bindFilterListeners() {
    const panel = document.getElementById("settings-panel");
    if (!panel || panel.dataset.bankListeners === "1") return;
    panel.dataset.bankListeners = "1";
    panel.addEventListener("change", (e) => {
      const t = e.target;
      if (
        t?.matches?.("#quiz-type-checks input, #quiz-format-checks input") ||
        t?.id === "quiz-sel-diff"
      ) {
        updateBankSummary();
      }
    });
  }

  function initMeta() {
    if (els.selDiff) {
      els.selDiff.innerHTML = DIFFICULTY_LEVELS.map(
        (d) =>
          `<option value="${d.id}">${isChineseUI(lang) ? d.labelZh : d.labelEn}</option>`
      ).join("");
    }
    if (els.typeChecks) {
      els.typeChecks.innerHTML = QUIZ_SECTIONS.map((sec) => {
        const label = isChineseUI(lang) ? sec.labelZh : sec.label;
        return `
        <label class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
          <input type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary" value="${sec.id}" checked />
          <span class="text-body-sm text-on-surface flex-1">${escHtml(label)}</span>
        </label>`;
      }).join("");
    }
    if (els.formatChecks) {
      els.formatChecks.innerHTML = QUIZ_FORMAT_FILTERS.map((fmt) => {
        const label = formatFilterLabel(fmt, lang);
        return `
        <label class="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 cursor-pointer">
          <input type="checkbox" class="rounded border-outline-variant text-primary focus:ring-primary" value="${fmt.id}" checked />
          <span class="text-body-sm text-on-surface flex-1">${escHtml(label)}</span>
        </label>`;
      }).join("");
    }
    bindFilterListeners();
    updateBankSummary();
  }

  function selectedSections() {
    return Array.from(els.typeChecks?.querySelectorAll("input:checked") || []).map((x) => x.value);
  }

  function selectedFormats() {
    return Array.from(els.formatChecks?.querySelectorAll("input:checked") || []).map((x) => x.value);
  }

  function generate() {
    const sections = selectedSections();
    if (!sections.length) {
      alert(t("alertNoTypes"));
      return;
    }
    const formats = selectedFormats();
    if (!formats.length) {
      alert(t("alertNoFormats"));
      return;
    }
    const count = Math.min(50, Math.max(1, Number(els.numCount?.value) || 10));
    const diffFilter = els.selDiff?.value || "all";
    const seed = els.txtSeed?.value || "";

    const pool = filterQuizPool(QUIZ_ITEMS, {
      sections,
      formats,
      difficulty: diffFilter,
    });
    if (!pool.length) {
      alert(t("alertNoMatch"));
      return;
    }

    const shuffled = seededShuffle(pool, seed);
    const take = Math.min(count, shuffled.length);
    lastQuestions = shuffled.slice(0, take);

    if (take < count) {
      alert(
        t("alertPoolLimited")
          .replace("{available}", String(take))
          .replace("{requested}", String(count))
      );
    }

    attemptMap.clear();
    lastQuestions.forEach((q) => {
      const state = { wrong: 0, solved: false, selected: null };
      if (questionFormat(q) === "fill" && countFillBlanks(q) > 0) {
        state.fillValues = Array(countFillBlanks(q)).fill("");
      }
      attemptMap.set(q.id, state);
    });

    if (els.summaryPanel) {
      els.summaryPanel.hidden = true;
      els.summaryPanel.innerHTML = "";
    }

    updateProgress();
    renderQuiz();
  }

  function updateProgress() {
    if (!lastQuestions.length) {
      if (els.progressText) els.progressText.textContent = t("progressNone");
      if (els.progressBar) els.progressBar.style.width = "0%";
      return;
    }
    let done = 0;
    lastQuestions.forEach((q) => {
      const st = attemptMap.get(q.id);
      if (st?.solved) done += 1;
    });
    if (els.progressText) {
      els.progressText.textContent = t("progressCompletedPrefix") + done + " / " + lastQuestions.length;
    }
    if (els.progressBar) {
      els.progressBar.style.width = `${(done / lastQuestions.length) * 100}%`;
    }
  }

  function renderQuiz() {
    const el = els.quizArea;
    if (!lastQuestions.length) {
      el.className = "quiz-empty text-center text-on-surface-variant py-12 text-body-sm";
      el.textContent = t("empty");
      return;
    }

    el.className = "space-y-5";
    el.innerHTML = "";

    const firstOpen = lastQuestions.find((q) => !attemptMap.get(q.id)?.solved);
    lastQuestions.forEach((q, idx) => {
      const st = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
      const wrap = document.createElement("article");
      wrap.className =
        "q-block p-5 md:p-6 rounded-2xl bg-surface border border-outline-variant/25 shadow-sm";
      wrap.id = "q-block-" + q.id;

      const head = document.createElement("div");
      head.className = "text-[11px] font-label-bold uppercase tracking-wide text-on-surface-variant mb-3";
      head.textContent =
        "Q" +
        (idx + 1) +
        " · " +
        sectionLabel(q.section, lang).toUpperCase() +
        " · " +
        formatTypeLabel(q) +
        " · " +
        q.difficulty.toUpperCase();
      wrap.appendChild(head);

      if (q.image?.src) {
        const fig = document.createElement("figure");
        fig.className = "quiz-fig mb-4";
        fig.innerHTML = `<img src="${escHtml(q.image.src)}" alt="${escHtml(q.image.alt || "")}" loading="lazy" />
          <figcaption class="text-body-sm text-on-surface-variant mt-2">${escHtml(q.image.caption || "")}</figcaption>`;
        wrap.appendChild(fig);
      }

      const stem = document.createElement("p");
      stem.className =
        "split-text-target font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-1 leading-tight whitespace-pre-line";
      stem.textContent = q.stem;
      wrap.appendChild(stem);

      if (q.stemZh) {
        const stemZh = document.createElement("p");
        stemZh.className = "text-body-sm text-on-surface-variant mb-4";
        stemZh.textContent = q.stemZh;
        wrap.appendChild(stemZh);
      }

      const fmt = questionFormat(q);
      const optionButtons = [];
      const fillInputs = [];

      if (fmt === "fill" && countFillBlanks(q) > 0) {
        if (q.wordBank?.length) {
          const bank = document.createElement("p");
          bank.className = "text-body-sm text-on-surface-variant mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20";
          bank.innerHTML = `<strong>Word bank:</strong> ${escHtml(q.wordBank.join(" · "))}`;
          wrap.appendChild(bank);
        }
        const fillWrap = document.createElement("div");
        fillWrap.className = "space-y-4 mb-4";
        let blankIndex = 0;
        getFillLines(q).forEach((line) => {
          const row = document.createElement("div");
          row.className =
            "fill-line flex flex-wrap items-baseline gap-x-2 gap-y-2 text-body-sm text-on-surface leading-relaxed";
          line.segments.forEach((seg) => {
            if (seg.type === "text") {
              const span = document.createElement("span");
              span.className = "fill-line-text whitespace-pre-wrap";
              span.textContent = seg.value || "";
              row.appendChild(span);
              return;
            }
            const inp = document.createElement("input");
            inp.type = "text";
            inp.autocomplete = "off";
            inp.className =
              "fill-inline-input shrink-0 min-w-[7rem] sm:min-w-[8.5rem] max-w-[12rem] px-3 py-2 rounded-lg border-2 border-outline-variant/30 bg-surface text-on-surface text-body-sm focus:border-primary focus:ring-1 focus:ring-primary align-baseline";
            inp.disabled = st.solved;
            const bi = blankIndex;
            inp.value = st.fillValues?.[bi] || "";
            inp.addEventListener("input", () => {
              const state = attemptMap.get(q.id) || { wrong: 0, solved: false, fillValues: [] };
              if (!state.fillValues) state.fillValues = Array(countFillBlanks(q)).fill("");
              state.fillValues[bi] = inp.value;
              attemptMap.set(q.id, state);
            });
            row.appendChild(inp);
            fillInputs.push(inp);
            blankIndex += 1;
          });
          fillWrap.appendChild(row);
        });
        wrap.appendChild(fillWrap);
      } else if (q.options?.length) {
        const og = document.createElement("div");
        og.className = "grid grid-cols-1 gap-3 mb-4";

        q.options.forEach((opt) => {
          const magnet = document.createElement("div");
          magnet.className = "magnet-link group";

          const btnOpt = document.createElement("button");
          btnOpt.type = "button";
          btnOpt.className =
            "quiz-option w-full text-left p-4 md:p-5 rounded-2xl border-2 border-outline-variant/20 bg-surface hover:border-primary hover:bg-primary-fixed transition-all flex items-center gap-4 relative disabled:opacity-60";
          btnOpt.dataset.key = opt.key;
          btnOpt.disabled = st.solved;

          const badge = document.createElement("span");
          badge.className =
            "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-surface-container-high font-label-bold group-hover:bg-primary group-hover:text-on-primary transition-colors";
          badge.textContent = opt.key;

          const text = document.createElement("span");
          text.className = "font-body-md text-on-surface flex-1 text-left";
          text.innerHTML = `${escHtml(opt.text)}${
            opt.textZh ? `<span class="block text-body-sm text-on-surface-variant mt-1">${escHtml(opt.textZh)}</span>` : ""
          }`;

          btnOpt.appendChild(badge);
          btnOpt.appendChild(text);
          magnet.appendChild(btnOpt);
          og.appendChild(magnet);
          optionButtons.push(btnOpt);

          if (!st.solved) {
            btnOpt.addEventListener("click", () => {
              optionButtons.forEach((b) => {
                b.classList.remove("border-primary", "bg-primary-fixed/30", "shadow-sm", "border-tertiary", "bg-tertiary/10");
                b.classList.add("border-outline-variant/20", "bg-surface");
                const bd = b.querySelector("span:first-child");
                bd?.classList.remove("bg-primary", "text-on-primary", "bg-tertiary");
                bd?.classList.add("bg-surface-container-high");
              });
              btnOpt.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
              btnOpt.classList.remove("border-outline-variant/20", "bg-surface");
              badge.classList.add("bg-primary", "text-on-primary");
              badge.classList.remove("bg-surface-container-high");
              const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
              state.selected = opt.key;
              attemptMap.set(q.id, state);
              wrap.dataset.selected = opt.key;
            });
          } else if (opt.key === q.answer) {
            btnOpt.classList.add("border-secondary", "bg-secondary/10");
            badge.classList.add("bg-secondary", "text-on-secondary");
          }
        });
        wrap.appendChild(og);

        if (st.selected) {
          const sel = optionButtons.find((b) => b.dataset.key === st.selected);
          if (sel && !st.solved) {
            sel.classList.add("border-primary", "bg-primary-fixed/30", "shadow-sm");
            sel.classList.remove("border-outline-variant/20", "bg-surface");
            const bd = sel.querySelector("span:first-child");
            bd?.classList.add("bg-primary", "text-on-primary");
          }
        }
      }

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className =
        "px-8 py-3 rounded-full bg-primary text-on-primary font-label-bold text-body-sm hover:opacity-90 transition-opacity disabled:opacity-50";
      btn.textContent = t("quizCheck");
      btn.disabled = st.solved;

      const fb = document.createElement("div");
      fb.className = "mt-3 text-body-sm hidden";
      fb.setAttribute("role", "status");

      const showModelAnswer = () => {
        const ma = modelAnswerText(q);
        fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-tertiary/10 text-tertiary border border-tertiary/25";
        fb.innerHTML = `<strong>${escHtml(t("modelPrefix"))}</strong> ${escHtml(ma.en)}${
          ma.zh ? `<span class="block mt-1 text-on-surface-variant">${escHtml(ma.zh)}</span>` : ""
        }`;
      };

      btn.addEventListener("click", () => {
        const state = attemptMap.get(q.id) || { wrong: 0, solved: false, selected: null };
        if (state.solved) return;

        let ok = false;
        if (fmt === "fill" && countFillBlanks(q) > 0) {
          const values = fillInputs.map((inp) => inp.value);
          state.fillValues = values;
          if (values.some((v) => !String(v).trim())) return;
          ok = allFillFieldsCorrect(q, values);
        } else {
          const selected = state.selected;
          if (!selected) return;
          ok = selected === q.answer;
        }

        fb.classList.remove("hidden");

        if (ok) {
          state.solved = true;
          attemptMap.set(q.id, state);
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-secondary/10 text-secondary font-label-bold";
          fb.textContent = t("correct");
          btn.disabled = true;
          optionButtons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === q.answer) {
              b.classList.add("border-secondary", "bg-secondary/10");
            }
          });
          fillInputs.forEach((inp) => {
            inp.disabled = true;
            inp.classList.add("border-secondary/50", "bg-secondary/5");
          });
          updateProgress();
          return;
        }

        state.wrong += 1;
        attemptMap.set(q.id, state);

        if (fmt !== "fill") {
          const wrongBtn = optionButtons.find((b) => b.dataset.key === state.selected);
          wrongBtn?.classList.add("border-tertiary", "bg-tertiary/10");
        } else {
          fillInputs.forEach((inp) => inp.classList.add("border-tertiary"));
        }

        if (state.wrong === 1) {
          fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
          fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
        } else {
          state.solved = true;
          attemptMap.set(q.id, state);
          showModelAnswer();
          btn.disabled = true;
          optionButtons.forEach((b) => {
            b.disabled = true;
            if (b.dataset.key === q.answer) {
              b.classList.add("border-tertiary", "bg-tertiary/10");
            }
          });
          fillInputs.forEach((inp) => {
            inp.disabled = true;
          });
          updateProgress();
        }
      });

      wrap.appendChild(btn);
      wrap.appendChild(fb);

      if (st.solved && st.wrong > 0 && st.wrong < 2) {
        fb.classList.remove("hidden");
        fb.className = "mt-3 text-body-sm p-3 rounded-xl bg-primary-fixed/50 text-on-surface border border-primary/20";
        fb.innerHTML = `<strong>${escHtml(t("hintPrefix"))}</strong> ${escHtml(q.hint || "")}`;
      }
      if (st.solved && st.wrong >= 2) {
        fb.classList.remove("hidden");
        showModelAnswer();
        btn.disabled = true;
      }

      el.appendChild(wrap);
    });

    applyEffectsAfterRender();
  }

  document.getElementById("btn-generate")?.addEventListener("click", generate);
  document.getElementById("btn-summary")?.addEventListener("click", () => {
    if (!els.summaryPanel) return;
    renderSessionSummary({
      questions: lastQuestions,
      attemptMap,
      panel: els.summaryPanel,
      t,
      lang,
    });
  });
  document.getElementById("btn-doc-q")?.addEventListener("click", () => downloadWord(lastQuestions, false, lang));
  document.getElementById("btn-doc-a")?.addEventListener("click", () => downloadWord(lastQuestions, true, lang));
  document.getElementById("btn-print")?.addEventListener("click", () => {
    if (!lastQuestions.length) {
      alert(t("alertNoQuiz"));
      return;
    }
    const want = confirm(t("printConfirm"));
    printSheet(lastQuestions, want, lang);
  });

  function syncLangFromParent() {
    const next = resolveQuizLang();
    if (next === lang) return;
    lang = next;
    applyLang();
  }

  try {
    const observer = new MutationObserver(syncLangFromParent);
    observer.observe(window.parent.document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });
    if (window.parent.document.readyState === "complete") {
      syncLangFromParent();
    } else {
      window.parent.addEventListener("load", syncLangFromParent, { once: true });
    }
  } catch (_) {
    /* not same-origin */
  }

  requestAnimationFrame(syncLangFromParent);

  bindFilterListeners();
  applyLang();
  els.quizArea.textContent = t("empty");
  els.quizArea.className = "quiz-empty text-center text-on-surface-variant py-12 text-body-sm";
  bindTrueFocus(els.quizContainer);

  initSettingsToggle({
    layout: document.getElementById("quiz-layout"),
    panel: document.getElementById("settings-panel"),
    btn: document.getElementById("btn-toggle-settings"),
    icon: document.getElementById("settings-toggle-icon"),
    label: document.getElementById("settings-toggle-label"),
  });
}

document.addEventListener("DOMContentLoaded", () => initQuiz());

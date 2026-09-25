export const QUIZ_UI_LANGS = ["en", "zh", "zh-Hant"];

export function isChineseUI(lang) {
  return lang === "zh" || lang === "zh-Hant";
}

export function noQuizAlertMessage(lang) {
  if (lang === "zh") return "请先生成题目。";
  if (lang === "zh-Hant") return "請先產生題目。";
  return "Generate questions first.";
}

export function resolveQuizLang() {
  try {
    const parentLang = window.parent.document.documentElement.lang;
    if (parentLang && QUIZ_UI_LANGS.includes(parentLang)) return parentLang;
    if (parentLang?.startsWith("zh")) return parentLang === "zh-Hant" ? "zh-Hant" : "zh";
  } catch (_) {
    /* cross-origin */
  }
  const local = document.documentElement.lang;
  if (local && QUIZ_UI_LANGS.includes(local)) return local;
  if (local?.startsWith("zh")) return local === "zh-Hant" ? "zh-Hant" : "zh";
  return "en";
}

export const DIFFICULTY_LEVELS = [
  { id: "all", labelEn: "All levels", labelZh: "全部難度" },
  { id: "easy", labelEn: "Easy", labelZh: "易" },
  { id: "medium", labelEn: "Medium", labelZh: "中" },
  { id: "hard", labelEn: "Hard", labelZh: "難" },
];

export const DIFFICULTY_MAP = {
  Foundation: "easy",
  Standard: "medium",
  Applied: "hard",
};

export function difficultyLevel(q) {
  return DIFFICULTY_MAP[q.difficulty] || "medium";
}

export function createRng(seedStr) {
  let s = 0;
  const str = String(seedStr || "").trim();
  if (str) {
    for (let i = 0; i < str.length; i++) s = (Math.imul(31, s) + str.charCodeAt(i)) | 0;
  } else {
    s = (Date.now() ^ (Math.random() * 0x7fffffff)) | 0;
  }
  if (s === 0) s = 1;
  return {
    random() {
      s = (Math.imul(1664525, s) + 1013904223) | 0;
      return (s >>> 0) / 0x100000000;
    },
  };
}

export function seededShuffle(arr, seedStr) {
  const rng = createRng(seedStr);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripLeadingQuestionNumber(text) {
  return String(text || "").replace(/^\d+\.(?:\s+)?/, "").trim();
}

function stemParagraphHtml(block) {
  const trimmed = block.trim();
  const isStatement = /^\(\d+\)/.test(trimmed);
  const cls = isStatement
    ? "stem-block stem-statement split-text-target mb-3 last:mb-0 leading-snug"
    : "stem-block split-text-target mb-4 last:mb-0 leading-snug";
  return `<p class="${cls}">${block.replace(/\n/g, "<br>")}</p>`;
}

function expandStemBlocks(block) {
  if (/\(\d+\)/.test(block)) {
    const parts = block.split(/(?=\(\d+\))/).map((part) => part.trim()).filter(Boolean);
    if (parts.length > 1) return parts;
  }
  return [block];
}

/** Split numbered statements (1)(2)(3) onto separate paragraphs for clearer MCQ stems. */
export function formatStemHtml(text) {
  if (!text) return "";
  const s = escHtml(stripLeadingQuestionNumber(text));
  return s
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((section) => expandStemBlocks(section).map(stemParagraphHtml).join(""))
    .join("");
}

export function questionFormat(q) {
  return q.format || "mcq";
}

/** Worksheet filters for question format (MCQ / T/F / fill). */
export const QUIZ_FORMAT_FILTERS = [
  { id: "mcq", labelEn: "Multiple choice", labelZh: "選擇題", labelZhHans: "选择题" },
  { id: "tf", labelEn: "True / False", labelZh: "是非題", labelZhHans: "是非题" },
  { id: "fill", labelEn: "Fill in the blanks", labelZh: "填充題", labelZhHans: "填空题" },
];

export function formatFilterLabel(filter, lang) {
  if (lang === "zh") return filter.labelZhHans || filter.labelZh;
  if (lang === "zh-Hant") return filter.labelZh;
  return filter.labelEn;
}

/** Count questions per section, per format, and section×format matrix. */
export function buildQuizBankStats(questions, sectionIds, formatIds) {
  const bySection = {};
  const byFormat = Object.fromEntries(formatIds.map((id) => [id, 0]));
  const matrix = {};
  for (const sid of sectionIds) {
    matrix[sid] = Object.fromEntries(formatIds.map((fid) => [fid, 0]));
  }
  for (const q of questions) {
    const fmt = questionFormat(q);
    if (!sectionIds.includes(q.section) || !formatIds.includes(fmt)) continue;
    bySection[q.section] = (bySection[q.section] || 0) + 1;
    byFormat[fmt] = (byFormat[fmt] || 0) + 1;
    if (matrix[q.section]) matrix[q.section][fmt] = (matrix[q.section][fmt] || 0) + 1;
  }
  return { total: questions.length, bySection, byFormat, matrix };
}

export function filterQuizPool(allQuestions, { sections, formats, difficulty }) {
  let pool = allQuestions.filter(
    (q) => sections.includes(q.section) && formats.includes(questionFormat(q))
  );
  if (difficulty && difficulty !== "all") {
    pool = pool.filter((q) => difficultyLevel(q) === difficulty);
  }
  return pool;
}

export function formatTypeLabel(q) {
  const f = questionFormat(q);
  if (f === "tf") return "T/F";
  if (f === "fill") return "FILL";
  return "MCQ";
}

export function normalizeFillAnswer(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[.,;]/g, "");
}

export function fillAnswerMatches(input, acceptList) {
  const n = normalizeFillAnswer(input);
  if (!n) return false;
  return (acceptList || []).some((a) => normalizeFillAnswer(a) === n);
}

/** @returns {{ segments: Array<{type:'text'|'blank', value?: string, accept?: string[]}> }[]} */
export function getFillLines(q) {
  if (q.lines?.length) return q.lines;
  return (q.fields || []).map((field) => ({
    segments: [
      { type: "text", value: String(field.label || "").replace(/_+/g, "") },
      { type: "blank", accept: field.accept || [] },
    ],
  }));
}

export function countFillBlanks(q) {
  return getFillLines(q).reduce(
    (n, line) => n + line.segments.filter((s) => s.type === "blank").length,
    0
  );
}

export function fillLineAnswerText(line) {
  return line.segments
    .map((seg) => {
      if (seg.type === "text") return seg.value || "";
      return seg.accept?.[0] || "___";
    })
    .join("");
}

export function allFillFieldsCorrect(q, values) {
  const lines = getFillLines(q);
  if (!lines.length) return false;
  let i = 0;
  for (const line of lines) {
    for (const seg of line.segments) {
      if (seg.type !== "blank") continue;
      if (!fillAnswerMatches(values[i], seg.accept)) return false;
      i += 1;
    }
  }
  return i === values.length && i > 0;
}

export function modelAnswerText(q) {
  const f = questionFormat(q);
  if (f === "tf") {
    const opt = q.options?.find((o) => o.key === q.answer);
    const word = opt?.text || (q.answer === "T" ? "True" : "False");
    const wordZh = opt?.textZh || (q.answer === "T" ? "正確" : "錯誤");
    return { en: `${word}.`, zh: `${wordZh}。` };
  }
  if (f === "fill") {
    const lines = getFillLines(q);
    if (lines.length) {
      return { en: lines.map((line) => fillLineAnswerText(line)).join(" | "), zh: "" };
    }
  }
  const opt = q.options?.find((o) => o.key === q.answer);
  const en = opt ? `${q.answer}. ${opt.text}` : q.answer;
  const zh = opt?.textZh ? `${q.answer}. ${opt.textZh}` : "";
  return { en, zh };
}

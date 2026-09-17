import { QUIZ_SECTIONS } from "./quizData.js";
import { escHtml, isChineseUI } from "./quizUtils.js";

export function sectionLabel(id, lang) {
  const row = QUIZ_SECTIONS.find((s) => s.id === id);
  if (!row) return id;
  return isChineseUI(lang) ? row.labelZh : row.label;
}

export function buildRevisionSuggestions({ total, correct, firstTry, failed, incomplete, byType, t, lang }) {
  const lines = [];
  const seen = new Set();
  const add = (s) => {
    if (!s || seen.has(s)) return;
    seen.add(s);
    lines.push(s);
  };

  const pctAll = total ? Math.round((100 * correct) / total) : 0;
  const ftPctAll = total ? Math.round((100 * firstTry) / total) : 0;

  if (pctAll >= 85) add(t("revBandExcellent"));
  else if (pctAll >= 65) add(t("revBandGood"));
  else if (pctAll >= 40) add(t("revBandFair"));
  else add(t("revBandLow"));

  const typeRows = [];
  byType.forEach((agg, sid) => {
    if (!agg?.total) return;
    typeRows.push({
      name: sectionLabel(sid, lang),
      id: sid,
      total: agg.total,
      correct: agg.correct,
      pct: Math.round((100 * agg.correct) / agg.total),
    });
  });
  typeRows.sort((a, b) => a.pct - b.pct || b.total - a.total);

  let weak = typeRows.filter((r) => r.total >= 2 && r.pct < 66);
  if (!weak.length) weak = typeRows.filter((r) => r.total >= 1 && r.pct < 50);
  weak.slice(0, 2).forEach((r) => {
    add(
      t("revWeakOne")
        .replace("{type}", r.name)
        .replace("{c}", String(r.correct))
        .replace("{t}", String(r.total))
        .replace("{pct}", String(r.pct))
    );
  });

  const strong = typeRows.filter((r) => r.total >= 2 && r.pct === 100);
  if (strong.length && !weak.length) {
    add(t("revStrongOne").replace("{type}", strong[0].name).replace("{n}", String(strong[0].total)));
  }

  if (total >= 4 && pctAll >= 45 && ftPctAll < 40) add(t("revFirstTryLow"));
  if (failed.length) add(t("revTwoStrike"));
  if (incomplete.length) add(t("revIncomplete"));
  if (!weak.length && typeRows.length >= 2 && pctAll >= 35 && pctAll < 78) add(t("revBalanced"));

  return lines;
}

export function renderSessionSummary({ questions, attemptMap, panel, t, lang }) {
  if (!questions.length) {
    alert(t("alertNoQuiz"));
    return;
  }

  const total = questions.length;
  let correct = 0;
  let firstTry = 0;
  const failed = [];
  const incomplete = [];
  const byType = new Map();

  questions.forEach((q, idx) => {
    const st = attemptMap.get(q.id) || { wrong: 0, solved: false };
    const n = idx + 1;
    const sid = q.section;
    if (!byType.has(sid)) byType.set(sid, { total: 0, correct: 0, firstTry: 0 });
    const agg = byType.get(sid);
    agg.total += 1;

    if (st.solved && st.wrong < 2) {
      correct += 1;
      agg.correct += 1;
      if (st.wrong === 0) {
        firstTry += 1;
        agg.firstTry += 1;
      }
    } else if (st.solved && st.wrong >= 2) {
      failed.push({ n, q });
    } else {
      incomplete.push(n);
    }
  });

  let html = `<h3 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-3">${escHtml(t("summaryTitle"))}</h3>`;
  html += `<div class="text-body-md font-label-bold text-on-surface mb-1">${escHtml(t("summaryScoreLabel"))}: ${correct} / ${total}</div>`;
  html += `<p class="text-body-sm text-on-surface-variant mb-4">${escHtml(t("summaryFirstTry"))}: ${firstTry} / ${total}</p>`;

  html += `<div class="font-label-bold text-on-surface text-body-sm mb-2">${escHtml(t("summaryByTypeTitle"))}</div>`;
  html += `<div class="overflow-x-auto mb-4"><table class="w-full text-left text-body-sm border-collapse summary-type-table">
    <thead><tr class="border-b border-outline-variant/30 text-on-surface-variant">
      <th class="p-2">${escHtml(t("summaryByTypeColType"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColFraction"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColRate"))}</th>
      <th class="p-2 text-right">${escHtml(t("summaryByTypeColFirst"))}</th>
    </tr></thead><tbody>`;

  QUIZ_SECTIONS.forEach((sec) => {
    const agg = byType.get(sec.id);
    if (!agg?.total) return;
    const pct = Math.round((100 * agg.correct) / agg.total);
    const name = isChineseUI(lang) ? sec.labelZh : sec.label;
    html += `<tr class="border-b border-outline-variant/15">
      <td class="p-2 font-label-bold text-on-surface">${escHtml(name)}</td>
      <td class="p-2 text-right tabular-nums">${agg.correct} / ${agg.total}</td>
      <td class="p-2 text-right tabular-nums">${pct}%</td>
      <td class="p-2 text-right tabular-nums">${agg.firstTry} / ${agg.total}</td>
    </tr>`;
  });
  html += "</tbody></table></div>";

  const revLines = buildRevisionSuggestions({ total, correct, firstTry, failed, incomplete, byType, t, lang });
  html += `<div class="p-4 rounded-xl bg-primary-fixed/40 border border-primary/15 mb-4">
    <h4 class="font-label-bold text-primary mb-2">${escHtml(t("revTitle"))}</h4>
    <ul class="list-disc list-inside text-body-sm text-on-surface-variant space-y-1">`;
  revLines.forEach((line) => {
    html += `<li>${escHtml(line)}</li>`;
  });
  html += "</ul></div>";

  html += `<div class="font-label-bold text-on-surface text-body-sm mb-2">${escHtml(t("summaryWrongTitle"))}</div>`;
  if (!failed.length) {
    html += `<p class="text-secondary font-label-bold text-body-sm">${escHtml(t("summaryNoneWrong"))}</p>`;
  } else {
    html += '<ul class="space-y-2">';
    failed.forEach(({ n, q }) => {
      const label = sectionLabel(q.section, lang);
      html += `<li class="p-3 rounded-xl bg-tertiary/10 border border-tertiary/25 text-body-sm font-label-bold text-tertiary">Q${n} · ${escHtml(label)}</li>`;
    });
    html += "</ul>";
  }

  if (incomplete.length) {
    const sep = isChineseUI(lang) ? "、" : ", ";
    html += `<p class="text-body-sm text-on-surface-variant mt-4">${escHtml(t("summaryIncomplete"))}: ${incomplete.map((x) => "Q" + x).join(sep)}</p>`;
  }

  panel.hidden = false;
  panel.innerHTML = html;
}

import {
  escHtml,
  noQuizAlertMessage,
  modelAnswerText,
  questionFormat,
  getFillLines,
  splitNumberedStatements,
  formatQuizText,
} from "./quizUtils.js?v=20260709b";

const EXPORT_FIG_STYLE = "page-break-inside:avoid;break-inside:avoid-page;margin:0.75rem 0";
const EXPORT_HEAD_STYLE =
  "<style>.export-q{margin-bottom:1rem}.export-q h2{margin-top:0}.export-fig{page-break-inside:avoid;break-inside:avoid-page}.export-fig img{max-width:100%;height:auto;display:block}</style>";

const PRINT_DOC_STYLE = `
@page { margin: 12mm; size: A4 portrait; }
* { box-sizing: border-box; }
html, body {
  margin: 0;
  padding: 0;
  min-height: 0 !important;
  height: auto !important;
  background: #fff;
}
body {
  font-family: Inter, "Segoe UI", sans-serif;
  font-size: 12pt;
  line-height: 1.45;
  color: #191c1e;
}
h1 { font-size: 18pt; margin: 0 0 1rem; }
h2 { font-size: 13pt; margin: 0 0 0.5rem; }
p, ul, ol { margin: 0.35em 0; }
ul, ol { padding-left: 1.25rem; }
.export-q { margin-bottom: 1rem; }
.export-fig {
  page-break-inside: avoid;
  break-inside: avoid-page;
  margin: 0.75rem 0;
}
.export-fig img {
  max-width: 100%;
  height: auto;
  display: block;
}
figcaption { font-size: 10pt; color: #414753; margin-top: 0.25rem; }
table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
th, td { border: 1px solid #c1c6d5; padding: 6px; text-align: left; }
`;

function fillLineExportHtml(line, answersMode) {
  let html = "";
  line.segments.forEach((seg) => {
    if (seg.type === "text") {
      html += escHtml(seg.value || "");
      return;
    }
    if (answersMode) {
      html += `<b>${escHtml(seg.accept?.[0] || "")}</b>`;
    } else {
      html += "__________";
    }
  });
  return html;
}

export function resolveExportAssetUrl(src) {
  if (!src) return "";
  try {
    return new URL(src, window.location.href).href;
  } catch {
    return src;
  }
}

function buildExportFigureHtml(fig) {
  const src = resolveExportAssetUrl(fig.src);
  if (!src) return "";
  const alt = escHtml(fig.alt || fig.caption || "Diagram");
  const caption = fig.caption ? `<figcaption>${escHtml(fig.caption)}</figcaption>` : "";
  return `<figure class="export-fig" style="${EXPORT_FIG_STYLE}"><img src="${escHtml(src)}" alt="${alt}" style="max-width:100%;height:auto;display:block" />${caption}</figure>`;
}

export function buildExportFiguresHtml(q) {
  const figs = q.images?.length ? q.images : q.image?.src ? [q.image] : [];
  return figs.map(buildExportFigureHtml).join("");
}

function collectImageUrlsFromHtml(html) {
  const urls = [];
  const re = /<img[^>]+src="([^"]+)"/gi;
  let match;
  while ((match = re.exec(html)) !== null) urls.push(match[1]);
  return urls;
}

function preloadImageUrls(urls) {
  const unique = [...new Set(urls.filter(Boolean))];
  if (!unique.length) return Promise.resolve();
  return Promise.all(
    unique.map(
      (url) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = url;
        })
    )
  );
}

function buildDocBody(questions, answersMode) {
  let body = "";
  questions.forEach((q, i) => {
    const fmt = questionFormat(q);
    body += `<div class="export-q">`;
    body += `<h2>Q${i + 1} · ${escHtml(q.section)} · ${escHtml(q.difficulty)} · ${escHtml(fmt.toUpperCase())}</h2>`;

    const { intro, statements } = splitNumberedStatements(q.stem);
    if (statements) {
      body += `<p><b>EN:</b> ${escHtml(formatQuizText(intro))}</p>`;
      statements.forEach((stmt) => {
        body += `<p style="margin:0.35em 0 0.35em 1.25em">${escHtml(formatQuizText(stmt))}</p>`;
      });
    } else {
      body += `<p><b>EN:</b> ${escHtml(formatQuizText(q.stem))}</p>`;
    }
    if (q.stemZh) body += `<p><b>中文：</b> ${escHtml(q.stemZh)}</p>`;

    body += buildExportFiguresHtml(q);

    if (!answersMode) {
      if (fmt === "fill" && getFillLines(q).length) {
        if (q.wordBank?.length) {
          body += `<p><i>Word bank:</i> ${escHtml(q.wordBank.join(", "))}</p>`;
        }
        body += "<ol>";
        getFillLines(q).forEach((line) => {
          body += `<li>${fillLineExportHtml(line, answersMode)}</li>`;
        });
        body += "</ol>";
      } else if (q.optionsLayout === "table" && q.optionTable?.rows?.length) {
        const headers = q.optionTable.headers || [];
        body +=
          "<table border='1' cellpadding='6' cellspacing='0' style='border-collapse:collapse;width:100%;max-width:100%'><tr><th></th>";
        headers.forEach((h) => {
          body += `<th>${escHtml(h)}</th>`;
        });
        body += "</tr>";
        q.optionTable.rows.forEach((row) => {
          body += `<tr><td><b>${escHtml(row.key)}</b></td>`;
          (row.cells || []).forEach((cell) => {
            body += `<td>${escHtml(formatQuizText(cell))}</td>`;
          });
          body += "</tr>";
        });
        body += "</table>";
      } else if (q.options?.length) {
        body += "<ul>";
        q.options.forEach((opt) => {
          const zh = opt.textZh ? ` / ${escHtml(opt.textZh)}` : "";
          body += `<li><b>${escHtml(opt.key)}.</b> ${escHtml(formatQuizText(opt.text))}${zh}</li>`;
        });
        body += "</ul>";
      }
    }

    if (answersMode) {
      const ma = modelAnswerText(q);
      body += `<p><b>Answer / 答案：</b> ${escHtml(formatQuizText(ma.en))}</p>`;
      if (ma.zh) body += `<p>${escHtml(formatQuizText(ma.zh))}</p>`;
      body += `<p><i>Hint / 提示:</i> ${escHtml(formatQuizText(q.hint || ""))}</p>`;
    }

    body += "</div>";
  });
  return body;
}

function buildPrintDocument(titleEn, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en" translate="no">
<head>
<meta charset="utf-8">
<meta name="google" content="notranslate">
<title>${escHtml(titleEn)}</title>
<style>${PRINT_DOC_STYLE}</style>
</head>
<body>${bodyHtml}
<script>window.onload=function(){setTimeout(function(){window.print();},300);};<\/script>
</body>
</html>`;
}

async function printStandaloneHtml(titleEn, bodyHtml) {
  await preloadImageUrls(collectImageUrlsFromHtml(bodyHtml));
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to print the worksheet.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(buildPrintDocument(titleEn, bodyHtml));
  printWindow.document.close();
  printWindow.focus();
}

/**
 * @param {{
 *   titleEnQuestions: string;
 *   titleEnAnswers: string;
 *   titleZhQuestions?: string;
 *   titleZhAnswers?: string;
 *   filePrefix: string;
 * }} meta
 */
export function createQuizExport(meta) {
  const titleZhQuestions = meta.titleZhQuestions || meta.titleEnQuestions;
  const titleZhAnswers = meta.titleZhAnswers || meta.titleEnAnswers;

  function downloadWord(questions, answersMode, lang) {
    if (!questions.length) {
      alert(noQuizAlertMessage(lang));
      return;
    }
    const titleEn = answersMode ? meta.titleEnAnswers : meta.titleEnQuestions;
    const titleZh = answersMode ? titleZhAnswers : titleZhQuestions;
    const body = buildDocBody(questions, answersMode);
    const html =
      '<html translate="no" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">' +
      `<head><meta charset="utf-8"><meta name="google" content="notranslate"><title>${escHtml(titleEn)}</title>${EXPORT_HEAD_STYLE}</head><body>` +
      `<h1>${escHtml(titleEn)}</h1><h2 style="font-size:14pt">${escHtml(titleZh)}</h2>${body}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const a = document.createElement("a");
    const ts = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = URL.createObjectURL(blob);
    a.download = (answersMode ? `${meta.filePrefix}_answers_` : `${meta.filePrefix}_questions_`) + ts + ".doc";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function printSheet(questions, answersMode, lang) {
    if (!questions.length) {
      alert(noQuizAlertMessage(lang));
      return;
    }
    const titleEn = answersMode ? meta.titleEnAnswers : meta.titleEnQuestions;
    const bodyHtml = `<h1>${escHtml(titleEn)}</h1>${buildDocBody(questions, answersMode)}`;
    await printStandaloneHtml(titleEn, bodyHtml);
  }

  return { downloadWord, printSheet };
}

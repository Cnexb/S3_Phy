#!/usr/bin/env python3
"""Build EM wave quiz UI from extracted draft JSON."""
import json
import re
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATES = ROOT.parent.parent.parent / ".agents" / "skills" / "create-quiz" / "templates"
NOTES_CH4 = ROOT / "sources" / "chapter-4"
TITLE = "S3 · Optics Ch.4 · Electromagnetic Waves"
SECTION_ID = "em-waves"
QUIZ_SECTIONS = [
    {"id": SECTION_ID, "label": "EM waves", "labelZh": "電磁波"},
]

FILL_ITEMS = [
    {
        "id": "ch4-q20",
        "section": SECTION_ID,
        "difficulty": "Standard",
        "format": "fill",
        "stem": "Figure below shows part of the electromagnetic spectrum.",
        "lines": [
            {
                "segments": [
                    {"type": "text", "value": "(a) Which one has the longest wavelength, P, Q, R or S? "},
                    {"type": "blank", "accept": ["P"]},
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(b) Which one has the highest speed in a vacuum? "},
                    {
                        "type": "blank",
                        "accept": ["same", "Same", "the same"],
                    },
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(c) What is the speed of Q in a vacuum? "},
                    {
                        "type": "blank",
                        "accept": [
                            "3×10^8 m s^-1",
                            "3×10^(8) m s^(-1)",
                            "3×10^8 m/s",
                            "3 x 10^8 m s^-1",
                            "3 x 10^8 m s-1",
                            "3 x 10^8 m/s",
                            "3×10^8 ms-1",
                            "3×10^8 ms^-1",
                            "3×10^(8) ms^(-1)",
                            "3 x 10^8 ms^-1",
                        ],
                    },
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(d) Name P: "},
                    {
                        "type": "blank",
                        "accept": [
                            "infared",
                            "infrared",
                            "infra-red",
                            "infared radiation",
                            "infrared radiation",
                            "infra-red radiation",
                        ],
                    },
                    {"type": "text", "value": " ; Name S: "},
                    {
                        "type": "blank",
                        "accept": [
                            "ultraviolet",
                            "ultra-violet",
                            "ultraviolet radiation",
                            "ultra-violet radiation",
                        ],
                    },
                ]
            },
        ],
        "hint": "All EM waves travel at the same speed c in vacuum. Wavelength increases toward the red end of the diagram.",
        "imageSource": str(NOTES_CH4 / "Q20.png"),
    },
    {
        "id": "ch4-q21",
        "section": SECTION_ID,
        "difficulty": "Standard",
        "format": "fill",
        "stem": "The electromagnetic spectrum is shown in the figure (radio waves, X, infra-red, visible light, Y, X-rays, Z).",
        "lines": [
            {
                "segments": [
                    {"type": "text", "value": "(a) X = "},
                    {"type": "blank", "accept": ["microwave", "microwaves"]},
                    {"type": "text", "value": " ; Y = "},
                    {"type": "blank", "accept": ["ultraviolet", "ultra-violet", "ultraviolet radiation"]},
                    {"type": "text", "value": " ; Z = "},
                    {"type": "blank", "accept": ["gamma rays", "gamma ray", "gamma radiation", "gamma"]},
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(b)(i) Shortest wavelength: "},
                    {"type": "blank", "accept": ["gamma rays", "gamma", "Z", "gamma radiation"]},
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(b)(ii) Lowest frequency: "},
                    {"type": "blank", "accept": ["radio waves", "radio wave", "radio"]},
                ]
            },
            {
                "segments": [
                    {"type": "text", "value": "(c) One application of Z: "},
                    {
                        "type": "blank",
                        "accept": ["killing cancer cells", "radiotherapy"],
                    },
                ]
            },
        ],
        "hint": "Frequency increases toward the gamma-ray end; radio waves have the longest wavelength and lowest frequency.",
        "imageSource": str(NOTES_CH4 / "Q21.png"),
    },
]

TEMPLATE_FILES = [
    "quiz.html",
    "js/quizApp.js",
    "js/quizUtils.js",
    "js/quizSummary.js",
    "js/quizExport.js",
    "js/quizEffects.js",
]

UI_PATCHES = {
    "en": {
        "appSubtitle": "S3 Optics Ch.4 — EM waves, spectrum & applications — English UI",
        "revBandFair": "Mixed performance: re-read weaker Ch.4 EM wave topics, then regenerate.",
        "revBandLow": (
            "Several concepts need consolidation. Review EM wave nature, the spectrum order, "
            "band properties, and applications/safety before the next round."
        ),
    },
    "zh-Hant": {
        "appSubtitle": "中三光學 第4章 電磁波 — 繁體中文介面",
        "revBandFair": "表現參差：請先溫習較弱的第4章電磁波課題，再重新出題。",
        "revBandLow": (
            "多個概念仍需鞏固。請先溫習電磁波性質、電磁譜次序、各波段特性，以及應用與安全，再進行下一輪。"
        ),
        "revWeakOne": "建議優先溫習「{type}」：本題得分 {c}/{t}（{pct}%）。",
    },
    "zh": {
        "revBandLow": "多个概念仍需巩固。请先温习电磁波性质、电磁波谱次序、各波段特性，以及应用与安全。",
    },
}

USES_TABLE_FIX = {
    "stem_suffix": (
        "Microwaves Radio waves Ultraviolet radiation",
        "Microwaves, Radio waves, Ultraviolet radiation",
    ),
    "options": {
        "A": "Radar, Burglar alarm, Medical diagnosis",
        "B": "Communication, TV broadcast, Checking banknote",
        "C": "Tracer, Sterilizing water, Remote control",
        "D": "Cooking, Radiotherapy, Thermography",
    },
}

APP_TABLE_FIX = {
    "stem_suffix": (
        "Electromagnetic wave Application",
        "Electromagnetic wave, Application",
    ),
    "options": {
        "A": "Ultra-violet, Camera autofocusing",
        "B": "Infra-red, Detecting survivors buried in landslides",
        "C": "Microwaves, Satellite communication",
    },
}

QUESTION_TEXT_FIXES = {
    "ch4-q07": USES_TABLE_FIX,
    "ex-q22": USES_TABLE_FIX,
    "ch4-q14": {**APP_TABLE_FIX, "options": {**APP_TABLE_FIX["options"], "D": "X-rays, Detecting weapons hidden in suitcases"}},
    "ex-q04": APP_TABLE_FIX,
}

EXAM_META = re.compile(
    r"^\d{2,4}-\d+\s*(?:(?:\(CE\)|\(DSE\)|\(modified\)|\(\d{1,3}%\))\s*)+",
    re.I,
)


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def strip_exam_metadata(stem: str) -> str:
    if not stem:
        return ""
    stem = stem.strip()
    stem = EXAM_META.sub("", stem)
    stem = re.sub(r"^\d{2,4}-\d+\s+", "", stem)
    stem = re.sub(r"^\([A-D]\)\s*(?:→|\uF0E0|->)\s*\([A-D]\)\s*", "", stem)
    stem = re.sub(r"^(?:→|\uF0E0|->)\s*\([A-D]\)\s*", "", stem)
    return stem.strip()


def fix_statement_markers(stem: str) -> str:
    if not stem:
        return ""
    return re.sub(r"(?<!\()\s+(\d+)\)", r" (\1)", stem)


def format_multi_stem(stem: str) -> str:
    if not re.search(r"\(\d+\)", stem):
        return stem

    stem = stem.strip()
    stem = re.sub(
        r"\s+(Arrange the above|The waves listed in)",
        r"\n\n\1",
        stem,
        flags=re.I,
    )

    m = re.search(r"(Which of the following[^?]*\?)", stem, re.I)
    if m and m.start() > 0:
        intro = stem[: m.start()].strip()
        rest = stem[m.start() :]
        rest = re.sub(r"\s+\((\d+)\)", r"\n\n(\1)", rest)
        if intro:
            return f"{intro}\n\n{rest.lstrip()}"
        return rest.lstrip()

    return re.sub(r"\s+\((\d+)\)", r"\n\n(\1)", stem)


def format_stem(stem: str) -> str:
    if not stem:
        return ""
    return format_multi_stem(fix_statement_markers(strip_exam_metadata(stem)))


def apply_question_text_fixes(qid, stem, options, hint=None):
    fixes = QUESTION_TEXT_FIXES.get(qid)
    if not fixes:
        return stem, options, hint
    old_suffix, new_suffix = fixes.get("stem_suffix", ("", ""))
    if old_suffix and old_suffix in stem:
        stem = stem.replace(old_suffix, new_suffix)
    if hint and old_suffix and old_suffix in hint:
        hint = hint.replace(old_suffix, new_suffix)
    option_fixes = fixes.get("options") or {}
    if option_fixes:
        options = dict(options or {})
        for key, text in option_fixes.items():
            options[key] = text
    return stem, options, hint


def build_quiz_data(sections, questions, fill_items, image_map):
    lines = [
        "/** S3 Optics Ch.4 — Electromagnetic Waves */",
        "export const QUIZ_SECTIONS = " + json.dumps(sections, ensure_ascii=False, indent=2) + ";",
        "",
        "export const QUIZ_ITEMS = [",
    ]
    all_items = list(questions) + list(fill_items)
    for q in all_items:
        fmt = q.get("format", "mcq")
        stem_raw = q["stem"]
        hint_raw = q.get("hint")
        options_raw = q.get("options") or {}
        if fmt != "fill":
            stem_raw, options_raw, hint_raw = apply_question_text_fixes(
                q["id"], stem_raw, options_raw, hint_raw
            )
        item = {
            "id": q["id"],
            "section": q["section"],
            "difficulty": q.get("difficulty", "Foundation"),
            "stem": format_stem(stem_raw),
        }
        if fmt == "fill":
            item["format"] = "fill"
            item["lines"] = q["lines"]
            if q.get("wordBank"):
                item["wordBank"] = q["wordBank"]
        else:
            item["options"] = [{"key": k, "text": v} for k, v in sorted(options_raw.items())]
            item["answer"] = q.get("answer", "")
        if hint_raw:
            hint = format_stem(hint_raw)
            if hint:
                item["hint"] = hint
        im = image_map.get(q["id"])
        if im:
            item["image"] = {
                "src": f"./assets/{im['file']}",
                "alt": im.get("alt", f"Diagram for {q['id']}"),
                "caption": im.get("caption", f"Fig - {q['id']}"),
            }
        lines.append("  " + json.dumps(item, ensure_ascii=False) + ",")
    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def build_fill_image_map():
    image_map = {}
    for item in FILL_ITEMS:
        src = Path(item["imageSource"])
        if not src.is_file():
            continue
        qid = item["id"]
        image_map[qid] = {
            "file": f"{qid}.png",
            "source": src.name,
            "sourcePath": str(src),
            "alt": f"Diagram for {qid}",
            "caption": f"Fig - {qid}",
        }
    return image_map


def copy_assets(questions, fill_items, image_map):
    assets = ROOT / "assets"
    assets.mkdir(parents=True, exist_ok=True)
    copied = 0
    for q in list(questions) + list(fill_items):
        qid = q["id"]
        im = image_map.get(qid)
        if not im:
            continue
        src = Path(im.get("sourcePath") or "")
        if not src.is_file() and q.get("cropSource"):
            src = Path(q["cropSource"])
        if not src.is_file() and q.get("imageSource"):
            src = Path(q["imageSource"])
        dest = assets / f"{qid}.png"
        if src.is_file():
            shutil.copy2(src, dest)
            copied += 1
    return copied


def patch_quiz_html(html: str) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{TITLE}</title>", html, count=1)
    html = html.replace("CH · CHAPTER LABEL", "CH 4 · Electromagnetic Waves")
    if "quiz-num-count" in html:
        if re.search(r'id="quiz-num-count"[^>]*\svalue="', html):
            html = re.sub(
                r'(id="quiz-num-count"[^>]*\svalue=")[^"]*(")',
                r"\g<1>10\g<2>",
                html,
                count=1,
            )
        else:
            html = re.sub(
                r'(<input[^>]*id="quiz-num-count")',
                r'\1 value="10"',
                html,
                count=1,
            )
    html = re.sub(
        r'<script type="module" src="\./js/quizApp\.js"></script>',
        '<script src="./js/quiz.bundle.js" defer></script>',
        html,
        count=1,
    )
    html = re.sub(
        r'<div class="grid grid-cols-1 xl:grid-cols-\[minmax\(220px,260px\)_1fr\] gap-6 items-start">\s*'
        r'<aside class="hidden xl:block focus-dim transition-all duration-500">.*?</aside>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<div class="xl:hidden mb-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/15 focus-dim">\s*'
        r'<p class="text-body-sm text-on-surface-variant" id="quiz-hint-text-mobile">.*?</p>\s*</div>\s*',
        "",
        html,
        count=1,
        flags=re.S,
    )
    return html


def patch_quiz_utils(js: str) -> str:
    js = re.sub(
        r'\s*\{ id: "tf", labelEn: "True / False", labelZh: "[^"]*", labelZhHans: "[^"]*" \},?\n',
        "\n",
        js,
    )
    return patch_quiz_utils_fill(js)


def patch_quiz_utils_fill(js: str) -> str:
    old = """export function normalizeFillAnswer(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\\s+/g, " ")
    .replace(/[.,;]/g, "");
}"""
    new = """export function normalizeFillAnswer(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/\\^\\s*\\(\\s*-\\s*1\\s*\\)/g, "^-1")
    .replace(/\\^\\s*\\(\\s*(\\d+)\\s*\\)/g, "^$1")
    .replace(/ms(\\^-1|-1)/g, "m s$1")
    .replace(/m s-1/g, "m s^-1")
    .replace(/\\s+/g, " ")
    .replace(/[.,;]/g, "");
}"""
    if old not in js:
        raise ValueError("patch_quiz_utils_fill: normalizeFillAnswer template mismatch")
    return js.replace(old, new)


def patch_quiz_effects(js: str) -> str:
    old = """export function animateSplitText(element) {
  if (!element) return;
  const text = element.textContent?.trim() || "";
  if (!text) return;
  element.classList.remove("reveal");
  element.innerHTML = text
    .split(/\\s+/)
    .map((word, i) => `<span class="split-word" style="transition-delay:${i * 28}ms">${word}</span>`)
    .join(" ");
  requestAnimationFrame(() => {
    setTimeout(() => element.classList.add("reveal"), 40);
  });
}"""
    new = """export function animateSplitText(element) {
  if (!element) return;
  const text = element.textContent?.trim() || "";
  if (!text) return;
  element.classList.remove("reveal");
  let delay = 0;
  const paragraphs = text.split(/\\n\\n+/);
  element.innerHTML = paragraphs
    .map((para, pi) => {
      const words = para.trim().split(/\\s+/).filter(Boolean);
      const html = words
        .map((word) => {
          const span = `<span class="split-word" style="transition-delay:${delay * 28}ms">${word}</span>`;
          delay += 1;
          return span;
        })
        .join(" ");
      return pi < paragraphs.length - 1 ? html + "<br><br>" : html;
    })
    .join("");
  requestAnimationFrame(() => {
    setTimeout(() => element.classList.add("reveal"), 40);
  });
}"""
    if old not in js:
        raise ValueError("patch_quiz_effects: animateSplitText template mismatch")
    return js.replace(old, new)


def patch_quiz_app_hints(js: str) -> str:
    js = re.sub(
        r'\s*hintText: document\.getElementById\("quiz-hint-text"\),\n'
        r'\s*hintTextMobile: document\.getElementById\("quiz-hint-text-mobile"\),\n',
        "\n",
        js,
    )
    js = re.sub(r"\n  function setHint\(text\) \{.*?\n  \}\n", "\n", js, flags=re.S)
    js = js.replace("      setHint(null);\n      return;", "      return;")
    js = js.replace("    if (firstOpen) setHint(firstOpen.hint);\n\n", "")
    js = re.sub(
        r'\s*wrap\.addEventListener\("mouseenter", \(\) => setHint\(q\.hint\)\);\n'
        r'\s*wrap\.addEventListener\("focusin", \(\) => setHint\(q\.hint\)\);\n',
        "\n",
        js,
    )
    js = js.replace("  setHint(null);\n\n  bindTrueFocus", "  bindTrueFocus")
    return js


def bundle_quiz_js():
    npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
    subprocess.run(
        [
            npx,
            "--yes",
            "esbuild",
            str(ROOT / "js" / "quizApp.js"),
            "--bundle",
            "--format=iife",
            "--platform=browser",
            f"--outfile={ROOT / 'js' / 'quiz.bundle.js'}",
        ],
        check=True,
    )


def patch_string_field(block: str, key: str, value: str) -> str:
    repl = json.dumps(value, ensure_ascii=False)
    lines = block.splitlines()
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.lstrip()
        if stripped.startswith(key + ":"):
            indent = line[: len(line) - len(stripped)]
            out.append(f"{indent}{key}: {repl},")
            i += 1
            while i < len(lines):
                cont = lines[i].lstrip()
                if cont.startswith('"') and not re.match(r"^[A-Za-z_][\w-]*:", cont):
                    i += 1
                    continue
                break
            continue
        out.append(line)
        i += 1
    return "\n".join(out)


def lang_block_pattern(lang: str) -> str:
    if lang == "zh-Hant":
        return rf"\n\s*\"{re.escape(lang)}\":\s*\{{"
    return rf"\n\s*{re.escape(lang)}:\s*\{{"


def patch_quiz_app(js: str) -> str:
    for lang, patches in UI_PATCHES.items():
        m = re.search(lang_block_pattern(lang), js)
        if not m:
            continue
        brace = js.find("{", m.start())
        depth = 0
        end = brace
        for i in range(brace, len(js)):
            if js[i] == "{":
                depth += 1
            elif js[i] == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        block = js[brace:end]
        for key, val in patches.items():
            block = patch_string_field(block, key, val)
        js = js[:brace] + block + js[end:]
    return js


def copy_templates():
    (ROOT / "js").mkdir(parents=True, exist_ok=True)
    for rel in TEMPLATE_FILES:
        src = TEMPLATES / rel
        dest = ROOT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)


def main():
    sections_path = ROOT / "extracted" / "sections.json"
    questions_path = ROOT / "draft" / "questions-full.json"
    image_map_path = ROOT / "draft" / "image-map.json"
    for p in (questions_path, image_map_path):
        if not p.is_file():
            raise SystemExit(f"Missing required file: {p}")

    sections = QUIZ_SECTIONS
    sections_path.write_text(json.dumps(sections, ensure_ascii=False, indent=2), encoding="utf-8")

    questions = load_json(questions_path)
    for q in questions:
        q["section"] = SECTION_ID

    image_map = load_json(image_map_path)
    image_map.update(build_fill_image_map())
    image_map_path.write_text(json.dumps(image_map, ensure_ascii=False, indent=2), encoding="utf-8")

    copy_templates()
    copied = copy_assets(questions, FILL_ITEMS, image_map)

    quiz_html = (TEMPLATES / "quiz.html").read_text(encoding="utf-8")
    (ROOT / "quiz.html").write_text(patch_quiz_html(quiz_html), encoding="utf-8")

    quiz_app = (TEMPLATES / "js" / "quizApp.js").read_text(encoding="utf-8")
    quiz_app = patch_quiz_app(quiz_app)
    quiz_app = patch_quiz_app_hints(quiz_app)
    (ROOT / "js" / "quizApp.js").write_text(quiz_app, encoding="utf-8")

    quiz_utils = (TEMPLATES / "js" / "quizUtils.js").read_text(encoding="utf-8")
    (ROOT / "js" / "quizUtils.js").write_text(patch_quiz_utils(quiz_utils), encoding="utf-8")

    quiz_effects = (TEMPLATES / "js" / "quizEffects.js").read_text(encoding="utf-8")
    (ROOT / "js" / "quizEffects.js").write_text(patch_quiz_effects(quiz_effects), encoding="utf-8")

    all_items = questions + FILL_ITEMS
    (ROOT / "js" / "quizData.js").write_text(
        build_quiz_data(sections, questions, FILL_ITEMS, image_map), encoding="utf-8"
    )
    bundle_quiz_js()

    mcq_ans = sum(1 for q in questions if q.get("answer"))
    print(f"Built quizData.js: {len(all_items)} items ({len(questions)} MCQ + {len(FILL_ITEMS)} fill)")
    print(f"MCQ answers: {mcq_ans}/{len(questions)}")
    print(f"Copied {copied} images to assets/")
    print(f"quiz.html -> {ROOT / 'quiz.html'}")


if __name__ == "__main__":
    main()
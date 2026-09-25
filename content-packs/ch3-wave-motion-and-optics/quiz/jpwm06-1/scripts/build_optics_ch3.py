#!/usr/bin/env python3
import json, re, subprocess, sys, zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
QUIZ_SRC = ROOT / "sources"
ASSETS = ROOT / "assets"
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))
from attach_cropped_figures import attach_cropped_figures

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
SECTIONS = [
    {"id": "reflection", "label": "Reflection"},
    {"id": "refraction-snells-law", "label": "Refraction and Snell's Law"},
    {"id": "total-internal-reflection", "label": "Total Internal Reflection"},
    {"id": "convex-lens", "label": "Convex Lens"},
    {"id": "magnification-lens-formula", "label": "Magnification and Lens Formula"},
    {"id": "concave-lens", "label": "Concave Lens"},
]
SOURCE_FILES = [
    ("Ch.3.1 Light reflection.docx", "reflection", "ch31", "r", 10),
    ("Ch.3.2 Light refraction.docx", "refraction-snells-law", "ch32", "f", 10),
    ("Ch.3.3 Total internal reflection.docx", "total-internal-reflection", "ch33", "t", 10),
    ("Ch.3.4 Convex lens.docx", "convex-lens", "ch34", "c", 10),
    ("Ch.3.5 Magnification and lens formula.docx", "magnification-lens-formula", "ch35", "m", 10),
    ("Ch.3.6 Concave lens.docx", "concave-lens", "ch36", "v", 10),
]
ANS_MARKER = re.compile(r"--\s*ans", re.I)
ANS_END = re.compile(r"--\s*ans\s+end", re.I)
NUM_START = re.compile(r"^(\d+)\.\s*")
LEADING_QNUM = re.compile(r"^\d+\.(?:\s*)")


def strip_leading_qnum(text):
    return LEADING_QNUM.sub("", text or "").strip()

OPT_LINE = re.compile(r"^([A-D])(?:[.)]\s*|\s*)(.+)$")
OPT_COMPACT = re.compile(r"^([A-D])([A-Za-z(0-9].*)$")
SINGLE_LETTER = re.compile(r"^[A-D]$")
Q_START = re.compile(r"(?:^|\s)(\d+)\.\s*(?=[A-Za-z(])")
DEG = "\u00b0"
STEM_MARKERS = (
    "Which of the following", "What is", "Where is", "Why does", "How far",
    "Find the", "In the figure", "In the following", "The figure", "A ray",
    "An object", "Simon stands", "Heidi is", "Object O", "P is an emergent",
    "Three light", "Parallel rays", "Fig.", "Fig a",
)
OPTION_REPAIRS = [
    {"match": "positions of an object and its image formed by a convex lens",
     "options": [("A", "8/3 cm"), ("B", "2 cm"), ("C", "6 cm"), ("D", "4 cm")]},
    {"match": "The object distance is", "also": "concave lens is 9 cm",
     "options": [("A", "6 cm"), ("B", "12 cm"), ("C", "18 cm"), ("D", "24 cm")]},
    {"match": "correct description of the lens",
     "options": [
         ("A", "3.75 cm, diverging lens"), ("B", "3.75 cm, converging lens"),
         ("C", "15 cm, diverging lens"), ("D", "15 cm, converging lens"),
     ]},
    {"match": "image distance and the focal length",
     "options": [
         ("A", "1 cm, 0.75 cm"), ("B", "1 cm, 1.5 cm"),
         ("C", "9 cm, 2.25 cm"), ("D", "9 cm, 4.5 cm"),
     ]},
]


def load_paras(path):
    with zipfile.ZipFile(path) as z:
        doc = ET.fromstring(z.read("word/document.xml"))
        paras = []
        for p in doc.iter(W + "p"):
            texts = [t.text or "" for t in p.iter(W + "t")]
            text = "".join(texts).strip()
            if text:
                paras.append({"text": text, "images": []})
    return paras


def normalize(text):
    text = (text or "").replace("\u00a0", " ")
    text = text.replace("\u2013", "-").replace("\u2014", "-").replace("\u2212", "-")
    text = text.replace("\u2018", "'").replace("\u2019", "'")
    text = re.sub(r"(\d+)\s*[Xx]\b", lambda m: m.group(1) + DEG, text)
    text = re.sub(r"(\d+)\s*" + re.escape(DEG) + r"\s*([A-Za-z])", lambda m: m.group(1) + DEG + " " + m.group(2), text)
    text = re.sub(r"(\d+)" + re.escape(DEG) + r"(?=[A-Za-z])", lambda m: m.group(1) + DEG + " ", text)
    text = re.sub(r"(\d+)\s*m\s*s-?1", lambda m: f"{m.group(1)} m s⁻¹", text)
    text = re.sub(r"(\d+)\s*10\s*8\s*m", lambda m: f"{m.group(1)} × 10⁸ m", text)
    text = re.sub(r"Snell.s law", "Snell's law", text, flags=re.I)
    return re.sub(r"\s+", " ", text).strip()


def is_noise(text):
    t = normalize(text)
    if not t or t == "-":
        return True
    if len(t) <= 2 and t.isalpha() and t.isupper():
        return True
    if re.fullmatch(r"[A-Z]{1,4}", t):
        return True
    if len(t) >= 8 and " " not in t and len(set(t.lower())) <= 6:
        return True
    if re.fullmatch(r"[\d\s" + re.escape(DEG) + r"cmM.]+", t):
        return True
    return False


def parse_option(text):
    text = normalize(text)
    if not text:
        return None
    m = OPT_LINE.match(text) or OPT_COMPACT.match(text)
    if m:
        return m.group(1), normalize(m.group(2))
    if SINGLE_LETTER.fullmatch(text):
        return text, f"Option {text}"
    return None


def strip_diagram_noise(text):
    text = normalize(text)
    text = re.sub(r"--\s*ans\s+end\s*--", " ", text, flags=re.I)
    text = re.sub(r"--\s*ans\s*--?", " ", text, flags=re.I)
    text = re.sub(r"\bOPQROPQR\b|\bOPROPR\b", " ", text)
    text = re.sub(r"Simonobstaclemirror+", " ", text, flags=re.I)
    text = re.sub(r"(?:principal axis\s*)+", " ", text, flags=re.I)
    text = re.sub(r"(?:\bwater\b\s*){2,}", " ", text, flags=re.I)
    text = re.sub(r"(?:\bair\b\s*){2,}", " ", text, flags=re.I)
    text = re.sub(r"(?:\d+\s*cm)+\s*(?:\d+\s*m)?(?:wall mirror)?(?:\s*(?:\d+\s*cm)+\s*)*", " ", text)
    text = re.sub(r"(?:\bM[12]\b\s*)+(?:\bHeidi\b\s*)?(?:\bI\d+\b\s*)*(?:\b1\s*m\b\s*)*", " ", text)
    text = re.sub(r"(?:[A-Za-z0-9]{6,})(?:object|image){2,}(?:[A-Za-z0-9]{6,})*", " ", text, flags=re.I)
    text = re.sub(r"\b(?:medium [XYZ]|rimedium|XYZ)+\b", " ", text, flags=re.I)
    text = re.sub(r"\b(?:convex lens|translucent screen)+\b", " ", text, flags=re.I)
    text = re.sub(r"\b(?:mvmv|mv)+\b", " ", text, flags=re.I)
    text = re.sub(r"\bPHYSICS AT WORK\b(?:\s*lens\b)?", " ", text, flags=re.I)
    text = re.sub(r"\bobserver.?s eyeapparent position of goldfish\b", " ", text, flags=re.I)
    text = re.sub(r"\b(?:light rays?)\b(?=\s+Why\b)", "", text, flags=re.I)
    text = re.sub(r"\b(?:60\s*30\s*){2,}", " ", text)
    text = re.sub(r"\b(?:Fig a|Fig b)\b", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def clean_stem(stem):
    stem = strip_diagram_noise(stem)
    matches = list(Q_START.finditer(stem))
    if matches:
        stem = stem[matches[-1].start():].lstrip()
    stem = re.sub(r"^(?:\u2234\s*(?:\(\d+\)\s*)?[^.?]+[.?]\s*)+", "", stem).strip()
    stem = re.sub(r"^Formation of image by a concave lens:\s*", "", stem, flags=re.I)
    stem = re.sub(r"^Only incident ray parallel to the principal axis[^.]+\.\s*", "", stem)
    stem = re.sub(r"^Height of her eyes[^?]+\?\s*", "", stem, flags=re.I)
    stem = re.sub(r"^Each lens has two principal foci[^?]+\?\s*", "", stem, flags=re.I)
    for marker in STEM_MARKERS:
        idx = stem.find(marker)
        if 0 < idx < 250:
            stem = stem[idx:]
            break
    stem = re.sub(r"\s+", " ", stem).strip()
    stem = strip_leading_qnum(stem)
    if not stem or stem in {"Refer to the figure.", "What is ?", "What is ?"}:
        return "Refer to the figure."
    return stem


def clean_hint(hint, stem):
    hint = strip_diagram_noise(hint)
    hint = strip_leading_qnum(hint)
    hint = re.sub(r"^(?:\u2234\s*(?:\(\d+\)\s*)?[^.?]+[.?]\s*)+", "", hint).strip()
    if hint[:60] == stem[:60] or len(hint) < 20:
        hint = stem[:180]
    return hint[:320]


def find_options_before(lines, marker_idx, min_idx=0):
    opts, j = [], marker_idx - 1
    while j >= min_idx and len(opts) < 4:
        parsed = parse_option(lines[j])
        if parsed:
            letter, body = parsed
            if not any(o["key"] == letter for o in opts):
                opts.insert(0, {"key": letter, "text": body or f"Option {letter}"})
            j -= 1
        elif opts:
            break
        else:
            j -= 1
    opt_start = j + 1
    if len(opts) < 2:
        letters, j = [], marker_idx - 1
        while j >= min_idx and len(letters) < 4:
            t = lines[j].strip()
            if SINGLE_LETTER.fullmatch(t):
                letters.insert(0, t)
                j -= 1
            elif letters:
                break
            else:
                j -= 1
        if len(letters) >= 2:
            return [{"key": L, "text": f"Option {L}"} for L in letters], j + 1
        j = marker_idx - 1
        while j >= min_idx and (is_noise(lines[j]) or not lines[j].strip()):
            j -= 1
        return [{"key": L, "text": f"Option {L}"} for L in "ABCD"], j + 1
    return opts, opt_start


def next_question_stem_start(lines, marker_idx, next_marker):
    if next_marker is None:
        return len(lines)
    min_idx = marker_idx + 2
    opts, first_opt = find_options_before(lines, next_marker, min_idx)
    if len(opts) < 2:
        return next_marker
    j, stem_start = first_opt - 1, next_marker
    while j > marker_idx + 1:
        if is_noise(lines[j]) or parse_option(lines[j]):
            if parse_option(lines[j]):
                break
            j -= 1
            continue
        stem_start = j
        j -= 1
    return stem_start


def parse_questions(paras):
    lines = [p["text"] for p in paras if p["text"]]
    markers = [i for i, t in enumerate(lines) if ANS_MARKER.search(t) and not ANS_END.search(t)]
    questions = []
    for k, mi in enumerate(markers):
        min_idx = (markers[k - 1] + 2) if k else 0
        opts, opt_start = find_options_before(lines, mi, min_idx)
        if len(opts) < 2:
            continue
        if k:
            stem_start = next_question_stem_start(lines, markers[k - 1], mi)
            if stem_start >= opt_start:
                j, stem_start = opt_start - 1, opt_start
                while j > markers[k - 1] + 1:
                    if is_noise(lines[j]) or parse_option(lines[j]):
                        if parse_option(lines[j]):
                            break
                        j -= 1
                        continue
                    stem_start = j
                    j -= 1
        else:
            stem_start = 0
        stem_parts = [normalize(t) for idx in range(stem_start, opt_start)
                      for t in [lines[idx]] if not is_noise(t) and not parse_option(t)]
        stem = clean_stem(" ".join(stem_parts))
        ans = None
        if mi + 1 < len(lines) and SINGLE_LETTER.fullmatch(lines[mi + 1].strip()):
            ans = lines[mi + 1].strip()
        if not ans:
            m = re.search(r"\b([A-D])\b", lines[mi])
            ans = m.group(1) if m else None
        if not ans:
            continue
        next_mi = markers[k + 1] if k + 1 < len(markers) else None
        expl_end = next_question_stem_start(lines, mi, next_mi)
        expl = [normalize(lines[idx]) for idx in range(mi + 2, expl_end)
                if normalize(lines[idx]) and not is_noise(lines[idx])
                and not parse_option(lines[idx]) and not ANS_MARKER.search(lines[idx])]
        hint = clean_hint(" ".join(expl), stem)
        questions.append({"stem": stem, "options": opts[:4], "answer": ans, "hint": hint})
    return questions


def fallback_bare_answer(paras, existing):
    if len(existing) >= 10:
        return existing
    lines = [p["text"] for p in paras if p["text"]]
    for i in range(len(lines) - 5):
        if not SINGLE_LETTER.fullmatch((lines[i + 1].strip() or "")):
            continue
        if ANS_MARKER.search(lines[i]) or ANS_MARKER.search(lines[i + 1]):
            continue
        opts, opt_start = find_options_before(lines, i + 1, 0)
        if len(opts) < 4:
            continue
        stem_parts, j = [], opt_start - 1
        while j >= 0:
            if parse_option(lines[j]) or is_noise(lines[j]) or ANS_MARKER.search(lines[j]):
                if stem_parts:
                    break
                j -= 1
                continue
            stem_parts.insert(0, normalize(lines[j]))
            j -= 1
        stem = clean_stem(" ".join(stem_parts))
        if any(q["stem"] == stem or q["stem"][:80] == stem[:80] for q in existing):
            continue
        expl = [normalize(x) for x in lines[i + 2:i + 8] if normalize(x) and not is_noise(x)]
        existing.append({
            "stem": stem,
            "options": opts[:4],
            "answer": lines[i + 1].strip(),
            "hint": clean_hint(" ".join(expl), stem),
        })
        if len(existing) >= 10:
            break
    return existing[:10]


def broken_options(opts):
    if len(opts) < 2:
        return True
    texts = [o["text"] for o in opts]
    if all(t.startswith("Option ") for t in texts):
        return True
    if all(t.rstrip(".") == "cm" for t in texts):
        return True
    if re.fullmatch(r"\d+", texts[0] or ""):
        return True
    return False


def repair_options(stem, opts):
    if not broken_options(opts):
        return opts
    for rule in OPTION_REPAIRS:
        if rule["match"] not in stem:
            continue
        if rule.get("also") and rule["also"] not in stem:
            continue
        return [{"key": k, "text": v} for k, v in rule["options"]]
    return opts


def extract_table_options(path):
    tables = []
    with zipfile.ZipFile(path) as z:
        root = ET.fromstring(z.read("word/document.xml"))
        body = root.find(W + "body")
        if body is None:
            return tables
        for child in body:
            if child.tag != W + "tbl":
                continue
            rows = []
            for tr in child.iter(W + "tr"):
                cells = [normalize("".join((x.text or "") for x in tc.iter(W + "t")))
                         for tc in tr.iter(W + "tc")]
                if any(cells):
                    rows.append(cells)
            if len(rows) >= 2 and rows[1][0] in "ABCD":
                opts = []
                for row in rows[1:5]:
                    if not row or row[0] not in "ABCD":
                        continue
                    text = ", ".join(c for c in row[1:] if c) or f"Option {row[0]}"
                    opts.append({"key": row[0], "text": text})
                if len(opts) >= 2:
                    tables.append(opts)
    return tables


def classify(stem):
    if re.search(r"calculate|estimate|refractive index|focal length|magnification|find the", stem, re.I):
        return "Applied"
    if re.search(r"which of the following statements", stem, re.I):
        return "Foundation"
    return "Standard"


def load_stem_overrides():
    path = ROOT / "draft" / "stem-overrides.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def load_option_overrides():
    path = ROOT / "draft" / "option-overrides.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def apply_overrides(item, stem_overrides, option_overrides=None):
    o = stem_overrides.get(item["id"], {})
    if o.get("stem"):
        item["stem"] = o["stem"]
    if o.get("hint"):
        item["hint"] = o["hint"]
    if option_overrides:
        oo = option_overrides.get(item["id"], {})
        if oo.get("options"):
            item["options"] = oo["options"]


def extract_docx(path, section, prefix, letter, expected, stem_overrides, option_overrides=None):
    paras = load_paras(path)
    raw = parse_questions(paras)
    table_opts = extract_table_options(path)
    table_i = 0
    if len(raw) < expected:
        raw = fallback_bare_answer(paras, raw)
    items = []
    for n, q in enumerate(raw[:expected], 1):
        options = repair_options(q["stem"], q["options"])
        if broken_options(options) and table_i < len(table_opts):
            options = table_opts[table_i]
            table_i += 1
        item = {
            "id": f"{prefix}-{letter}{n:02d}",
            "section": section,
            "difficulty": classify(q["stem"]),
            "stem": q["stem"],
            "options": options,
            "answer": q["answer"],
            "hint": q["hint"],
        }
        apply_overrides(item, stem_overrides, option_overrides)
        items.append(item)
    if len(items) != expected:
        raise RuntimeError(f"{path.name}: expected {expected}, got {len(items)}")
    return items


def write_outputs(all_items, image_map):
    for d in ["sources", "extracted", "draft", "js"]:
        (ROOT / d).mkdir(parents=True, exist_ok=True)
    manifest = {
        "chapter": "S3 Optics Ch.3",
        "uiLangs": ["en"],
        "sources": [{"file": str(QUIZ_SRC / f), "label": f, "section": s} for f, s, _, _, _ in SOURCE_FILES],
    }
    (ROOT / "sources/manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    (ROOT / "extracted/sections.json").write_text(json.dumps(SECTIONS, indent=2), encoding="utf-8")
    counts = {}
    for item in all_items:
        counts[item["section"]] = counts.get(item["section"], 0) + 1
    lines = ["# Draft question bank", "", f"Total: {len(all_items)} MCQ", ""]
    for sec in SECTIONS:
        lines.append(f"- **{sec['label']}**: {counts.get(sec['id'], 0)}")
    lines += ["", "| # | id | section | diff | ans | img | stem |", "|---|-----|---------|------|-----|-----|------|"]
    for i, item in enumerate(all_items, 1):
        img = "yes" if item["id"] in image_map else "no"
        stem = item["stem"][:70].replace("|", "/")
        lines.append(f"| {i} | {item['id']} | {item['section']} | {item['difficulty']} | {item['answer']} | {img} | {stem} |")
    (ROOT / "draft/quiz-review.md").write_text("\n".join(lines), encoding="utf-8")
    flat_map = {}
    for qid, m in image_map.items():
        if "images" in m:
            flat_map[qid] = m
        else:
            flat_map[qid] = {"file": m["file"], "alt": m["alt"], "caption": m["caption"]}
    (ROOT / "draft/image-map.json").write_text(json.dumps(flat_map, indent=2, ensure_ascii=False), encoding="utf-8")
    (ROOT / "extracted/content-map.json").write_text(json.dumps({"counts": counts, "total": len(all_items)}, indent=2), encoding="utf-8")
    (ROOT / "extracted/extraction-review.md").write_text(
        "\n".join([
            "# Extraction review", "",
            f"- Total MCQ: **{len(all_items)}**",
            f"- Cropped images: **{len(image_map)}**",
            f"- Text-only (no crop): **{len(all_items) - len(image_map)}**", "",
            "## By section",
            *[f"- {s['label']}: {counts.get(s['id'], 0)}" for s in SECTIONS],
        ]), encoding="utf-8")
    out = ["/** S3 Optics Ch.3 \u2014 Light & Lens */",
           "export const QUIZ_SECTIONS = " + json.dumps(SECTIONS, indent=2) + ";", "",
           "export const QUIZ_ITEMS = ["]
    for item in all_items:
        obj = {k: item[k] for k in ("id", "section", "difficulty", "stem", "options", "answer", "hint")}
        m = image_map.get(item["id"])
        if m:
            if "images" in m:
                obj["images"] = [{"src": x["src"], "alt": x["alt"], "caption": x["caption"]} for x in m["images"]]
            else:
                obj["image"] = {"src": m["src"], "alt": m["alt"], "caption": m["caption"]}
        out.append("  " + json.dumps(obj, ensure_ascii=False) + ",")
    out.append("];")
    out.append("")
    (ROOT / "js/quizData.js").write_text("\n".join(out), encoding="utf-8")


def bundle_quiz_js():
    import shutil
    npx = shutil.which("npx.cmd") or shutil.which("npx") or "npx"
    subprocess.run([
        npx, "--yes", "esbuild", str(ROOT / "js" / "quizApp.js"),
        "--bundle", "--format=iife", "--platform=browser",
        f"--outfile={ROOT / 'js' / 'quiz.bundle.js'}",
    ], check=True)


def main():
    stem_overrides = load_stem_overrides()
    option_overrides = load_option_overrides()
    image_map = attach_cropped_figures(clear_assets=True)
    all_items = []
    for fname, section, prefix, letter, expected in SOURCE_FILES:
        items = extract_docx(
            QUIZ_SRC / fname, section, prefix, letter, expected,
            stem_overrides, option_overrides,
        )
        all_items.extend(items)
    write_outputs(all_items, image_map)
    bundle_quiz_js()
    print(f"Built {len(all_items)} items, {len(image_map)} cropped, {len(all_items)-len(image_map)} text-only")


if __name__ == "__main__":
    main()
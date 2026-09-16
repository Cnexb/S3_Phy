#!/usr/bin/env python3
from __future__ import annotations
import json, re, shutil
from pathlib import Path
import fitz

BASE = Path(r"C:\Users\UniplusUser02\Desktop\PHYS\S3\Optics\Final exam")
OUT = BASE / "quiz" / "optics-light-lens"
PAPERS = [
    {"id":"light-2024","topic":"light","label":"F3 Final exam (Light) MC 2024-25","question":BASE/"Light"/"F3 Final exam (Light) MC 2024-25.pdf","answer":BASE/"Light"/"F3 Final exam (Light) MC 2024-25 Ans.pdf","expected":54},
    {"id":"light-2024b","topic":"light","label":"F3 Final exam (Light) MC 2 2024-25","question":BASE/"Light"/"F3 Final exam (Light) MC 2 2024-25.pdf","answer":BASE/"Light"/"F3 Final exam (Light) MC 2 2024-25 Ans.pdf","expected":35},
    {"id":"lens-2024","topic":"lens","label":"F3 Final exam (Lens) MC 2024-25","question":BASE/"Lenses"/"F3 Final exam (Lens) MC 2024-25.pdf","answer":BASE/"Lenses"/"F3 Final exam (Lens) MC 2024-25 Ans.pdf","expected":50},
    {"id":"lens-2526","topic":"lens","label":"F3 Final exam (Lens) 2025-26","question":BASE/"Lenses"/"F3 Final exam (Lens) 2025-26.pdf","answer":BASE/"Lenses"/"F3 Final exam (Lens) 2025-26 Ans.pdf","expected":28},
]
SECTIONS = [
    {"id":"light-reflection","label":"Plane mirrors & reflection","labelZh":"平面鏡與反射","topic":"light"},
    {"id":"light-refraction","label":"Refraction & ray diagrams","labelZh":"折射與光路圖","topic":"light"},
    {"id":"light-rays","label":"Light ray types & optical paths","labelZh":"光線類型與光路","topic":"light"},
    {"id":"lens-properties","label":"Lens types & properties","labelZh":"透鏡種類與性質","topic":"lens"},
    {"id":"lens-ray-diagrams","label":"Lens ray diagrams & image formation","labelZh":"透鏡光路圖與成像","topic":"lens"},
    {"id":"lens-applications","label":"Focal length, magnification & applications","labelZh":"焦距、放大率與應用","topic":"lens"},
]
QSTART_RE = re.compile(r"(?=\n\s*\d{1,2}\.\s)")
OPTION_RE = re.compile(r"(?:^|\n)\s*([A-D])[\.\)]?\s+(.+?)(?=\n\s*[A-D][\.\)]?\s|\n\s*\d{1,2}\.\s|\Z)", re.S)
STEM_FIG_RE = re.compile(r"figure|shown|diagram|below|above|following|in the figure|as shown", re.I)
HEADER_RE = re.compile(r"Unit Education|Tel:|revision|警告|不可翻印|薈進|Light revision|Lens revision", re.I)

def normalize_ws(text):
    return re.sub(r"\s+", " ", text).strip()

def extract_pages(pdf_path):
    doc = fitz.open(str(pdf_path))
    pages = [{"page": i + 1, "text": doc[i].get_text()} for i in range(len(doc))]
    doc.close()
    return pages

def parse_options(body):
    opts = {}
    for m in OPTION_RE.finditer(body):
        opts.setdefault(m.group(1), normalize_ws(m.group(2)))
    return opts

def parse_stem(body):
    cut = re.search(r"\n\s*A[\.\)]?\s", body)
    stem = normalize_ws(HEADER_RE.sub("", body[:cut.start()] if cut else body))
    return stem

def parse_question_block(num, body):
    opts = parse_options(body)
    if len(opts) < 2:
        return None
    stem = parse_stem(body)
    if len(stem) < 10:
        return None
    return {"num": num, "stem": stem, "options": opts, "diagramRequired": bool(STEM_FIG_RE.search(stem))}

def parse_questions_from_text(full_text):
    found = {}
    for chunk in QSTART_RE.split("\n" + full_text):
        m = re.match(r"\s*(\d{1,2})\.\s", chunk)
        if not m:
            continue
        num = int(m.group(1))
        parsed = parse_question_block(num, chunk[m.end():].strip())
        if parsed and (num not in found or len(parsed["stem"]) > len(found[num]["stem"])):
            found[num] = parsed
    return found

def parse_questions_with_pages(pages):
    found, page_of = {}, {}
    for page in pages:
        for num, q in parse_questions_from_text(page["text"]).items():
            if num not in found or len(q["stem"]) > len(found[num]["stem"]):
                found[num] = q
                page_of[num] = page["page"]
    for num in found:
        found[num]["page"] = page_of[num]
    return found

def extract_answer_letter(rest, block):
    """Answer key often puts the letter after all options, not at the start."""
    if block and block.get("options"):
        last_key = max(block["options"].keys())
        last_text = block["options"][last_key]
        pos = rest.find(last_text)
        if pos >= 0:
            tail = rest[pos + len(last_text) :]
            ans_m = re.search(r"(?:^|\n)\s*([A-D])\s*(?:\n|$)", tail)
            if ans_m:
                return ans_m.group(1)
    ans_m = re.search(r"(?:^|\n)\s*([A-D])\s*(?:\n|$)", rest[:200])
    if ans_m:
        return ans_m.group(1)
    for ans_m in re.finditer(r"(?:^|\n)\s*([A-D])\s*(?:\n|$)", rest):
        letter = ans_m.group(1)
        if block and letter in block.get("options", {}):
            return letter
    return ""


def parse_answers_from_text(full_text):
    answers = {}
    for m in re.finditer(r"(?:^|\n)\s*([A-D])\s*\n\s*(\d{1,2})\.\s([\s\S]*?)(?=(?:\n\s*[A-D]\s*\n\s*\d{1,2}\.\s)|\Z)", full_text):
        num = int(m.group(2))
        rest = m.group(3)
        block = parse_question_block(num, rest)
        hint = normalize_ws(re.sub(r"(?:^|\n)\s*[A-D][\.\)]?[\s\S]*?(?=\n\s*\d|\Z)", "", rest))
        answers[num] = {"answer": m.group(1), "hint": hint[:600] if len(hint) >= 8 else "", "stem": block["stem"] if block else "", "options": block["options"] if block else {}}
    for chunk in QSTART_RE.split("\n" + full_text):
        m = re.match(r"\s*(\d{1,2})\.\s", chunk)
        if not m:
            continue
        num = int(m.group(1))
        rest = chunk[m.end():]
        block = parse_question_block(num, rest)
        letter = extract_answer_letter(rest, block)
        if not letter:
            continue
        hint = normalize_ws(re.sub(r"(?:^|\n)\s*[A-D][\.\)]?[\s\S]*?(?=\n\s*\d|\Z)", "", rest))
        entry = {"answer": letter, "hint": hint[:600] if len(hint) >= 8 else "", "stem": block["stem"] if block else "", "options": block["options"] if block else {}}
        if num not in answers or len(entry["stem"]) > len(answers[num].get("stem", "")):
            answers[num] = entry
    return answers

def build_questions(paper, q_found, a_found):
    questions = []
    for num in range(1, paper["expected"] + 1):
        qid = f"{paper['id']}-q{num:02d}"
        q = q_found.get(num, {})
        a = a_found.get(num, {})
        stem = q.get("stem") or a.get("stem") or ""
        options = q.get("options") or a.get("options") or {}
        placeholder = False
        if not stem and not options:
            stem = f"[Diagram-based MCQ - Question {num}] Refer to the figure."
            options = {"A": "A", "B": "B", "C": "C", "D": "D"}
            diagram_required = True
            placeholder = True
        elif not options:
            continue
        else:
            diagram_required = bool(q.get("diagramRequired") or STEM_FIG_RE.search(stem))
            if not stem:
                stem = f"[Diagram-based MCQ - Question {num}] Refer to the figure."
                diagram_required = True
                placeholder = True
        questions.append({"id": qid, "paperId": paper["id"], "num": num, "page": q.get("page") or max(1, (num - 1) // 3 + 1), "stem": stem, "options": options, "answer": a.get("answer", ""), "hint": a.get("hint", ""), "diagramRequired": diagram_required, "placeholder": placeholder, "format": "mcq"})
    return questions

def classify_section(q, topic):
    s = q["stem"].lower()
    if topic == "light":
        if any(w in s for w in ["mirror", "periscope", "clock", "lateral", "cardboard", "screen"]):
            return "light-reflection"
        if any(w in s for w in ["convergent", "divergent", "parallel", "light ray", "ray of light"]):
            return "light-rays"
        return "light-refraction"
    if any(w in s for w in ["focal length", "magnif", "power of lens", "1/f", "dioptre", "camera", "projector", "magnifying"]):
        return "lens-applications"
    if any(w in s for w in ["figure", "shown", "ray", "path", "foci", "focus", "image formed", "object", "emergent", "diagram"]):
        return "lens-ray-diagrams"
    if any(w in s for w in ["convex", "concave", "converging", "diverging", "lens is", "thicker at the centre"]):
        return "lens-properties"
    return "lens-ray-diagrams" if q.get("diagramRequired") else "lens-properties"

def classify_difficulty(q):
    s = q["stem"].lower()
    if any(w in s for w in ["calculate", "find the", "what is the value", "speed", "distance", "refractive index", "how long", "how far"]):
        return "Applied"
    if q.get("diagramRequired") or "(1)" in q["stem"] or len(q["stem"]) > 160:
        return "Standard"
    return "Foundation"

def extract_images(pdf_path, paper_id, raw_dir):
    doc = fitz.open(str(pdf_path))
    images = []
    for page_idx in range(len(doc)):
        page = doc[page_idx]
        for img_idx, img in enumerate(page.get_images(full=True)):
            try:
                pix = fitz.Pixmap(doc, img[0])
                if pix.width < 80 or pix.height < 80:
                    continue
                if pix.n >= 5:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                fname = f"{paper_id}-p{page_idx + 1}-img{img_idx + 1}.png"
                pix.save(str(raw_dir / fname))
                rects = page.get_image_rects(img[0])
                y0 = rects[0].y0 if rects else 0
                images.append({"file": fname, "page": page_idx + 1, "area": pix.width * pix.height, "y0": y0})
            except Exception:
                continue
    doc.close()
    return images

def map_images(questions, images):
    by_page = {}
    for img in images:
        by_page.setdefault(img["page"], []).append(img)
    mapping = {}
    for q in questions:
        if not (q.get("diagramRequired") or q.get("placeholder")):
            continue
        candidates = []
        for p in [q["page"], q["page"] + 1, q["page"] - 1]:
            candidates.extend(by_page.get(p, []))
        if not candidates:
            continue
        best = max(candidates, key=lambda x: x["area"])
        mapping[q["id"]] = {"file": best["file"], "alt": f"Diagram for {q['id']}", "caption": f"Fig - Question {q['num']}", "confidence": "high" if best["page"] == q["page"] else "medium"}
    return mapping

def build_quiz_data_js(questions, image_map):
    lines = ["export const QUIZ_SECTIONS = " + json.dumps([{k: v for k, v in s.items() if k != "topic"} for s in SECTIONS], ensure_ascii=False, indent=2) + ";\n", "export const QUIZ_ITEMS = ["]
    for q in questions:
        item = {"id": q["id"], "section": q["section"], "difficulty": q["difficulty"], "stem": q["stem"], "options": [{"key": k, "text": v} for k, v in sorted(q["options"].items())], "answer": q["answer"]}
        if q.get("hint"):
            item["hint"] = q["hint"]
        if q["id"] in image_map:
            im = image_map[q["id"]]
            item["image"] = {"src": f"./assets/{im['file']}", "alt": im["alt"], "caption": im["caption"]}
        lines.append("  " + json.dumps(item, ensure_ascii=False) + ",")
    lines.append("];")
    return "\n".join(lines) + "\n"

def write_extraction_review(questions, paper_stats):
    md = ["# Extraction review", "", "| Metric | Value |", "|--------|-------|", f"| Total MCQ | {len(questions)} |", f"| With answer | {sum(1 for q in questions if q.get('answer'))} |", f"| Image mapped | {sum(1 for q in questions if q.get('hasImage'))} |", f"| Placeholder stems | {sum(1 for q in questions if q.get('placeholder'))} |", "", "## By paper", "", "| Paper | Expected | Extracted | Answers |", "|-------|----------|-----------|---------|"]
    for s in paper_stats:
        md.append(f"| {s['label']} | {s['expected']} | {s['count']} | {s['withAnswer']} |")
    return "\n".join(md) + "\n"

def write_quiz_review(questions):
    sec_counts = {s["id"]: 0 for s in SECTIONS}
    for q in questions:
        sec_counts[q["section"]] += 1
    md = [f"# Draft question bank\n\nTotal: {len(questions)} MCQ\n"]
    for s in SECTIONS:
        md.append(f"- **{s['label']}**: {sec_counts.get(s['id'], 0)}")
    md.append("\n| # | id | section | diff | ans | img | stem |")
    md.append("|---|-----|---------|------|-----|-----|------|")
    for i, q in enumerate(questions, 1):
        img = "yes" if q.get("hasImage") else ("req" if q.get("diagramRequired") else "no")
        stem = q["stem"][:45].replace("|", "/")
        md.append(f"| {i} | {q['id']} | {q['section']} | {q['difficulty']} | {q.get('answer', '?')} | {img} | {stem}... |")
    return "\n".join(md) + "\n"

def main():
    for sub in ["sources", "extracted", "draft", "assets", "assets/raw", "js"]:
        (OUT / sub).mkdir(parents=True, exist_ok=True)
    manifest = {"chapter": "S3 Optics - Light & Lens", "sources": [{"id": p["id"], "label": p["label"], "question": str(p["question"]), "answer": str(p["answer"])} for p in PAPERS], "uiLangs": ["en", "zh-Hant"]}
    (OUT / "sources" / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    all_questions, paper_stats, all_image_map, content_map = [], [], {}, []
    raw_dir, assets_dir = OUT / "assets" / "raw", OUT / "assets"
    for paper in PAPERS:
        q_pages = extract_pages(paper["question"])
        a_pages = extract_pages(paper["answer"])
        q_found = parse_questions_with_pages(q_pages)
        a_found = parse_answers_from_text("\n".join(p["text"] for p in a_pages))
        for num, a in a_found.items():
            if num not in q_found and a.get("stem") and a.get("options"):
                q_found[num] = {"stem": a["stem"], "options": a["options"], "diagramRequired": bool(STEM_FIG_RE.search(a["stem"])), "page": max(1, (num - 1) // 3 + 1)}
        qs = build_questions(paper, q_found, a_found)
        for q in qs:
            q["section"] = classify_section(q, paper["topic"])
            q["difficulty"] = classify_difficulty(q)
            q["sourcePaper"] = paper["label"]
        images = extract_images(paper["question"], paper["id"], raw_dir)
        img_map = map_images(qs, images)
        all_image_map.update(img_map)
        for q in qs:
            if q["id"] in img_map:
                q["hasImage"] = True
        paper_stats.append({"label": paper["label"], "expected": paper["expected"], "count": len(qs), "withAnswer": sum(1 for q in qs if q.get("answer"))})
        all_questions.extend(qs)
        content_map.append({"paperId": paper["id"], "questions": len(qs), "images": len(images)})
    used = set()
    for im in all_image_map.values():
        src = raw_dir / im["file"]
        if src.exists() and im["file"] not in used:
            shutil.copy2(src, assets_dir / im["file"])
            used.add(im["file"])
    sections_out = [{k: v for k, v in s.items() if k != "topic"} for s in SECTIONS]
    (OUT / "extracted" / "sections.json").write_text(json.dumps(sections_out, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "extracted" / "content-map.json").write_text(json.dumps(content_map, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "extracted" / "extraction-review.md").write_text(write_extraction_review(all_questions, paper_stats), encoding="utf-8")
    (OUT / "draft" / "quiz-review.md").write_text(write_quiz_review(all_questions), encoding="utf-8")
    (OUT / "draft" / "image-map.json").write_text(json.dumps(all_image_map, ensure_ascii=False, indent=2), encoding="utf-8")
    (OUT / "js" / "quizData.js").write_text(build_quiz_data_js(all_questions, all_image_map), encoding="utf-8")
    (OUT / "draft" / "questions-full.json").write_text(json.dumps(all_questions, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Extracted", len(all_questions), "questions")
    for s in paper_stats:
        print(" ", s["label"], s["count"], "/", s["expected"], "answers", s["withAnswer"])
    print("Images mapped", len(all_image_map))

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""Map user-cropped figures (Ch.3.X - Qn.png) to quiz item ids and copy into assets/."""
import json
import re
import shutil
from pathlib import Path

ROOT = Path(r"C:\Users\UniplusUser02\Desktop\PHYS\S3\Optics\Quiz\optics-ch3")
QUIZ_SRC = ROOT.parent
ASSETS = ROOT / "assets"
DRAFT = ROOT / "draft"

CHAPTER_MAP = {
    "3.1": ("ch31", "r"),
    "3.2": ("ch32", "f"),
    "3.3": ("ch33", "t"),
    "3.4": ("ch34", "c"),
    "3.5": ("ch35", "m"),
    "3.6": ("ch36", "v"),
}

CROP_RE = re.compile(
    r"^Ch\.(\d+\.\d+)\s*-\s*Q(\d+)(?:-(\d+))?\.(png|jpe?g|gif|webp)$",
    re.I,
)


def quiz_id(chapter: str, q_num: int) -> str:
    prefix, letter = CHAPTER_MAP[chapter]
    return f"{prefix}-{letter}{q_num:02d}"


def scan_cropped_files():
    """Return {quiz_id: [(part_index, source_path), ...]}."""
    grouped = {}
    for path in sorted(QUIZ_SRC.glob("Ch.3.* - Q*.*")):
        if not path.is_file():
            continue
        m = CROP_RE.match(path.name)
        if not m:
            continue
        chapter, q_str, part_str, _ext = m.groups()
        qid = quiz_id(chapter, int(q_str))
        part = int(part_str) if part_str else 1
        grouped.setdefault(qid, []).append((part, path))
    for qid in grouped:
        grouped[qid].sort(key=lambda x: x[0])
    return grouped


def attach_cropped_figures(clear_assets: bool = True):
    ASSETS.mkdir(parents=True, exist_ok=True)
    if clear_assets:
        for p in ASSETS.iterdir():
            if p.is_file():
                p.unlink()
            elif p.is_dir():
                shutil.rmtree(p)

    grouped = scan_cropped_files()
    image_map = {}
    audit = []

    for qid in sorted(grouped):
        entries = grouped[qid]
        files_meta = []
        for part, src in entries:
            ext = src.suffix.lower()
            if len(entries) == 1:
                dest_name = f"{qid}-fig{ext}"
            else:
                dest_name = f"{qid}-fig-{part}{ext}"
            dest = ASSETS / dest_name
            shutil.copy2(src, dest)
            meta = {
                "file": dest_name,
                "src": f"./assets/{dest_name}",
                "alt": f"Diagram for {qid}",
                "caption": f"Fig \u00b7 {qid}" + (f" ({part}/{len(entries)})" if len(entries) > 1 else ""),
                "source": src.name,
            }
            files_meta.append(meta)
            audit.append({"quiz_id": qid, "source": src.name, "dest": dest_name})

        if len(files_meta) == 1:
            image_map[qid] = files_meta[0]
        else:
            image_map[qid] = {"images": files_meta}

    DRAFT.mkdir(parents=True, exist_ok=True)
    (DRAFT / "cropped-image-map.json").write_text(
        json.dumps(image_map, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    lines = [
        "# Cropped figure map",
        "",
        f"- Questions with crops: **{len(image_map)}**",
        f"- Source files: **{len(audit)}**",
        "",
        "| quiz_id | source | asset |",
        "|---------|--------|-------|",
    ]
    for row in audit:
        lines.append(f"| {row['quiz_id']} | {row['source']} | {row['dest']} |")
    (DRAFT / "cropped-image-review.md").write_text("\n".join(lines), encoding="utf-8")
    return image_map


if __name__ == "__main__":
    mp = attach_cropped_figures(clear_assets=True)
    print(f"Attached {len(mp)} question(s), {sum(1 for v in mp.values() if 'images' in v)} multi-image")

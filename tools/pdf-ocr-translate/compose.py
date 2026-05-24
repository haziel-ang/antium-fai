"""
Modulo 3: Ricomposizione del testo tradotto in output finali.

Genera:
- File Markdown per capitolo (singoli)
- Documento Markdown completo
- PDF finale (opzionale, richiede weasyprint)
"""

import sys
from pathlib import Path

from config import OUTPUT_DIR

MD_TEMPLATE = """\
---
title: "{title}"
source: "{source}"
chapters: {n_chapters}
---

# {title}

{toc}

---

{body}

---

*Documento generato automaticamente dal pipeline OCR + Traduzione.*
"""

CHAPTER_MD = """\
## {title}

{meta}

{text}

"""

HTML_WRAPPER = """\
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
  body {{ font-family: 'Georgia', serif; max-width: 700px; margin: 2em auto;
         padding: 0 1em; line-height: 1.7; color: #2c2c2c; }}
  h1 {{ text-align: center; border-bottom: 2px solid #C8471A; padding-bottom: 0.5em; }}
  h2 {{ color: #C8471A; margin-top: 2em; }}
  hr {{ border: none; border-top: 1px solid #ddd; margin: 2em 0; }}
  .meta {{ font-size: 0.85em; color: #666; font-style: italic; }}
  @page {{ margin: 2.5cm; @bottom-center {{ content: counter(page); }} }}
</style>
</head>
<body>
{content}
</body>
</html>
"""


def compose_markdown(translated_chapters: list[dict], title: str, source: str) -> str:
    """Compone il documento Markdown completo."""
    toc_lines = []
    body_parts = []

    for i, ch in enumerate(translated_chapters, 1):
        anchor = f"capitolo-{i}"
        toc_lines.append(f"{i}. [{ch['title']}](#{anchor})")

        meta = ""
        if ch.get("pages"):
            meta = f"*Pagine originali: {ch['pages'][0]}–{ch['pages'][-1]}*\n"

        body_parts.append(CHAPTER_MD.format(
            title=ch["title"],
            meta=meta,
            text=ch["translation"],
        ))

    toc = "\n".join(toc_lines)
    body = "\n---\n\n".join(body_parts)

    return MD_TEMPLATE.format(
        title=title,
        source=source,
        n_chapters=len(translated_chapters),
        toc=toc,
        body=body,
    )


def save_chapters_individually(translated_chapters: list[dict], output_dir: Path):
    """Salva ogni capitolo come file Markdown separato."""
    chapters_dir = output_dir / "capitoli"
    chapters_dir.mkdir(parents=True, exist_ok=True)

    for i, ch in enumerate(translated_chapters, 1):
        filename = f"{i:02d}_{_slugify(ch['title'])}.md"
        filepath = chapters_dir / filename

        content = f"# {ch['title']}\n\n"
        if ch.get("pages"):
            content += f"*Pagine originali: {ch['pages'][0]}–{ch['pages'][-1]}*\n\n"
        content += ch["translation"]

        filepath.write_text(content, encoding="utf-8")

    print(f"  → {len(translated_chapters)} capitoli salvati in: {chapters_dir}")


def compose_pdf(translated_chapters: list[dict], title: str, output_path: Path):
    """Genera un PDF dal testo tradotto usando weasyprint."""
    try:
        from weasyprint import HTML as WeasyHTML
    except ImportError:
        print("  ⚠ weasyprint non installato, salto generazione PDF.")
        print("    Installa con: pip install weasyprint")
        return

    body_html = f"<h1>{title}</h1>\n<hr>\n"

    for ch in translated_chapters:
        body_html += f"<h2>{ch['title']}</h2>\n"
        if ch.get("pages"):
            body_html += f'<p class="meta">Pagine originali: {ch["pages"][0]}–{ch["pages"][-1]}</p>\n'

        paragraphs = ch["translation"].split("\n\n")
        for para in paragraphs:
            if para.strip():
                body_html += f"<p>{para.strip()}</p>\n"
        body_html += "<hr>\n"

    html_content = HTML_WRAPPER.format(title=title, content=body_html)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    WeasyHTML(string=html_content).write_pdf(str(output_path))
    print(f"  → PDF generato: {output_path}")


def _slugify(text: str) -> str:
    """Converte un titolo in slug per nome file."""
    import re
    slug = text.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s-]+", "_", slug)
    return slug[:50]


def run(translated_chapters: list[dict], stem: str, title: str = ""):
    """Esegue la composizione completa."""
    if not title:
        title = stem.replace("_", " ").title()

    source = f"{stem}.pdf"
    output_dir = OUTPUT_DIR / stem

    print(f"\n📝 Composizione output per: {title}")

    full_md = compose_markdown(translated_chapters, title, source)
    md_path = output_dir / f"{stem}_completo.md"
    md_path.parent.mkdir(parents=True, exist_ok=True)
    md_path.write_text(full_md, encoding="utf-8")
    print(f"  → Markdown completo: {md_path}")

    save_chapters_individually(translated_chapters, output_dir)

    pdf_path = output_dir / f"{stem}_tradotto.pdf"
    compose_pdf(translated_chapters, title, pdf_path)


if __name__ == "__main__":
    print("Questo modulo va usato tramite pipeline.py o importato.")

#!/usr/bin/env python3
"""Genera i PDF delle sezioni del sito Antium a partire dalle pagine HTML.

Per ogni pagina in `sezioni/` estrae il contenuto editoriale (titolo del hero,
sottotitolo, corpo dell'articolo e i box delle note laterali) e lo impagina con
un foglio di stampa pulito e uniforme, indipendente dal CSS del sito (che non e
adatto al motore di stampa). Output: docs/<nome>.pdf

Regola di progetto: dopo ogni modifica al testo di una sezione, rigenerare il PDF
associato con questo script.

    python scripts/build_pdfs.py            # tutte le sezioni
    python scripts/build_pdfs.py tor-caldara volsci-cicerone-culti   # solo alcune
"""

import hashlib
import os
import sys
import tempfile

from bs4 import BeautifulSoup
from PIL import Image
from weasyprint import HTML

# Cartella temporanea per le immagini ridimensionate/ricompresse
IMG_CACHE = os.path.join(tempfile.gettempdir(), "antium_pdf_imgs")
MAX_IMG_W = 1100  # px: larghezza massima delle immagini incorporate nel PDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEZIONI = os.path.join(ROOT, "sezioni")
DOCS = os.path.join(ROOT, "docs")

# nome-pagina (senza .html)  ->  nome-pdf (senza .pdf)
SECTION_TO_PDF = {
    "necropoli-protostoriche": "necropoli-preistoriche",
    "vallo": "vallo",
    "volsci-cicerone-culti": "storia-urbana",
    "antium-guide": "antium-guide",
    "tomba-mulakia": "tomba-mulakia",
    "villa-imperiale": "villa-imperiale",
    "teatro-romano": "teatro-romano",
    "monumenti-citta-alta": "monumenti-citta-alta",
    "xystus-terme-citta-alta": "xystus-terme-citta-alta",
    "cisternone-caffeaus": "cisternone-caffeaus",
    "tor-caldara": "tor-caldara",
}

PRINT_CSS = """
@page {
  size: A4;
  margin: 20mm 18mm 20mm 18mm;
  @bottom-left { content: element(pdfFooter); }
  @bottom-right {
    content: counter(page);
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 11pt;
    font-weight: 700;
    color: #6b3410;
  }
}
.pdf-footer {
  position: running(pdfFooter);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 7.5pt;
  line-height: 1.35;
  color: #9a8a6a;
}
.pdf-footer strong { color: #8a4a1c; font-weight: 700; letter-spacing: .04em; }
.pdf-footer a { color: #9a8a6a; text-decoration: none; }
* { box-sizing: border-box; }
body {
  font-family: Georgia, 'Times New Roman', serif;
  color: #2b2218;
  font-size: 10.5pt;
  line-height: 1.5;
}
.doc-head { border-bottom: 2px solid #C8471A; padding-bottom: 8pt; margin-bottom: 14pt; }
.doc-brand {
  font-family: 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: .28em; font-size: 8.5pt; color: #C8471A; font-weight: 700;
  text-transform: uppercase;
}
.doc-title { font-size: 22pt; line-height: 1.1; margin: 4pt 0 2pt; color: #6b3410; }
.doc-sub { font-size: 10.5pt; font-style: italic; color: #5a4a32; margin: 0 0 2pt; }
.doc-meta { font-family: Arial, sans-serif; font-size: 8pt; letter-spacing: .08em; color: #9a8a6a; text-transform: uppercase; }
h2 { font-size: 15pt; color: #6b3410; border-bottom: 1px solid #e3d4b3; padding-bottom: 3pt; margin: 16pt 0 7pt; }
h3 { font-size: 12.5pt; color: #8a4a1c; font-style: italic; margin: 13pt 0 5pt; }
h4 { font-size: 11pt; color: #2b2218; margin: 10pt 0 4pt; font-weight: 700; }
p { margin: 0 0 7pt; text-align: justify; }
.panel-lede { font-size: 11.5pt; color: #4a3a22; font-style: italic; }
ul { margin: 0 0 7pt 0; padding-left: 16pt; }
li { margin-bottom: 3pt; }
a { color: #8a4a1c; text-decoration: none; }
em { font-style: italic; }
strong { font-weight: 700; }
figure { margin: 9pt 0; page-break-inside: avoid; text-align: center; }
figure img { max-width: 100%; max-height: 95mm; }
figcaption { font-size: 8.5pt; color: #6a5a40; font-style: italic; margin-top: 3pt; text-align: left; }
.quote-block {
  border-left: 3px solid #d8b25a; background: #fbf5e6; padding: 6pt 10pt;
  font-style: italic; color: #5a4320; margin: 9pt 0;
}
.quote-block cite { display: block; font-style: normal; font-size: 8.5pt; color: #9a8a6a; margin-top: 3pt; }
table { border-collapse: collapse; width: 100%; font-size: 9pt; margin: 8pt 0; }
th, td { border: 1px solid #e0d2b2; padding: 3pt 5pt; text-align: left; vertical-align: top; }
th { background: #f3e8cf; color: #6b3410; }
.callout { border: 1px solid #e3d4b3; border-left: 4px solid #d8b25a; background: #fcf8ee; padding: 7pt 10pt; margin: 8pt 0; page-break-inside: avoid; }
.callout--critica { border-left-color: #C8471A; background: #fbf0ea; }
.callout-label { font-weight: 700; color: #6b3410; display: block; margin-bottom: 3pt; font-size: 10pt; }
.callout-icon { color: #C8471A; margin-right: 4pt; }
.notes-head { margin-top: 18pt; }
"""


def build_one(section: str, pdf_name: str) -> str:
    src = os.path.join(SEZIONI, section + ".html")
    with open(src, encoding="utf-8") as fh:
        soup = BeautifulSoup(fh.read(), "html.parser")

    def txt(sel):
        el = soup.select_one(sel)
        return el.get_text(" ", strip=True) if el else ""

    title = txt(".hero-title")
    subtitle = txt(".hero-subtitle")
    meta = txt(".hero-meta")

    body = soup.select_one(".article-body")
    if body is None:
        raise RuntimeError(f"{section}: nessun .article-body trovato")

    # le note laterali (callout) vanno in coda, sotto un titolo
    notes = soup.select(".side-notes .callout")
    for note in notes:
        for svg in note.find_all("svg"):
            svg.decompose()
        for a in note.find_all("a"):
            if not a.get("href", "").startswith("http"):
                a.unwrap()

    # ripulisce il corpo: via gli SVG, le immagini decorative restano
    for svg in body.find_all("svg"):
        svg.decompose()

    # i link interni (../altra-sezione.html, crosslink, ancore) diventano testo
    # semplice: in un PDF scaricato non avrebbero un bersaglio valido. Restano
    # cliccabili solo i link esterni (http/https: CC, Wikimedia, Treccani, ...).
    for a in body.find_all("a"):
        href = a.get("href", "")
        if not href.startswith("http"):
            a.unwrap()

    # pre-processa le immagini delle figure: ridimensiona e ricomprimi in JPEG
    # cosi il PDF non si gonfia con le webp a piena risoluzione
    os.makedirs(IMG_CACHE, exist_ok=True)
    for img in body.find_all("img"):
        src = img.get("src", "")
        if not src:
            continue
        abspath = os.path.normpath(os.path.join(SEZIONI, src))
        if not os.path.isfile(abspath):
            continue
        key = hashlib.md5(abspath.encode()).hexdigest()[:16]
        outimg = os.path.join(IMG_CACHE, key + ".jpg")
        if not os.path.exists(outimg):
            im = Image.open(abspath).convert("RGB")
            if im.width > MAX_IMG_W:
                h = round(im.height * MAX_IMG_W / im.width)
                im = im.resize((MAX_IMG_W, h), Image.LANCZOS)
            im.save(outimg, "JPEG", quality=80, optimize=True)
        img["src"] = "file://" + outimg

    parts = [
        '<div class="pdf-footer">'
        '<strong>Antium &middot; Historia et Memoria</strong><br>'
        'A cura di Riccardo Pau &middot; Gruppo FAI Anzio-Nettuno<br>'
        '&copy; 2026 &middot; <a href="https://creativecommons.org/licenses/by/4.0/">'
        'Licenza CC BY 4.0</a>'
        '</div>',
        '<div class="doc-head">',
        f'<div class="doc-brand">Antium &middot; Historia et Memoria</div>',
        f'<h1 class="doc-title">{title}</h1>',
        (f'<p class="doc-sub">{subtitle}</p>' if subtitle else ""),
        (f'<p class="doc-meta">{meta}</p>' if meta else ""),
        "</div>",
        body.decode_contents(),
    ]
    if notes:
        parts.append('<h2 class="notes-head">Note e approfondimenti</h2>')
        for c in notes:
            parts.append(str(c))

    html_doc = (
        "<!doctype html><html lang='it'><head><meta charset='utf-8'>"
        f"<style>{PRINT_CSS}</style></head><body>" + "".join(parts) + "</body></html>"
    )

    out = os.path.join(DOCS, pdf_name + ".pdf")
    # base_url = cartella sezioni/, cosi i path ../img/... si risolvono.
    # options: comprime e abbassa la risoluzione delle immagini per non gonfiare il PDF.
    HTML(string=html_doc, base_url=SEZIONI + os.sep).write_pdf(
        out,
        options={"optimize_images": True, "jpeg_quality": 80, "dpi": 150},
    )
    return out


def main():
    requested = sys.argv[1:]
    items = SECTION_TO_PDF.items()
    if requested:
        items = [(s, SECTION_TO_PDF[s]) for s in requested if s in SECTION_TO_PDF]
    for section, pdf_name in items:
        out = build_one(section, pdf_name)
        size = os.path.getsize(out)
        print(f"OK  {section:28s} -> docs/{pdf_name}.pdf  ({size//1024} KB)")


if __name__ == "__main__":
    main()

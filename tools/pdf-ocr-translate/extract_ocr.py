"""
Modulo 1: Estrazione testo da PDF scansionati.

Strategia a due livelli:
1. Prova estrazione diretta con PyMuPDF (se il PDF ha testo embedded)
2. Fallback su OCR (pdf2image + pytesseract) per pagine scansionate
"""

import re
import sys
from pathlib import Path

import fitz  # pymupdf
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
from tqdm import tqdm

from config import CHAPTER_MARKERS, DPI, OUTPUT_DIR, TEMP_DIR, TESSERACT_LANGS


def extract_text_direct(pdf_path: Path) -> list[dict]:
    """Estrae testo direttamente dal PDF (se disponibile)."""
    doc = fitz.open(pdf_path)
    pages = []
    for i, page in enumerate(doc):
        text = page.get_text()
        pages.append({"page": i + 1, "text": text.strip(), "method": "direct"})
    doc.close()
    return pages


def extract_text_ocr(pdf_path: Path) -> list[dict]:
    """Converte ogni pagina in immagine e applica OCR."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    images = convert_from_path(str(pdf_path), dpi=DPI, output_folder=str(TEMP_DIR))

    pages = []
    for i, img in enumerate(tqdm(images, desc="OCR in corso")):
        text = pytesseract.image_to_string(img, lang=TESSERACT_LANGS)
        pages.append({"page": i + 1, "text": text.strip(), "method": "ocr"})

    return pages


def extract_smart(pdf_path: Path, ocr_threshold: int = 50) -> list[dict]:
    """
    Estrazione intelligente: usa testo diretto dove disponibile,
    OCR dove il testo è scarso (< ocr_threshold caratteri per pagina).
    """
    direct_pages = extract_text_direct(pdf_path)

    sparse_pages = [p for p in direct_pages if len(p["text"]) < ocr_threshold]

    if len(sparse_pages) > len(direct_pages) * 0.5:
        print(f"  → {len(sparse_pages)}/{len(direct_pages)} pagine con poco testo, uso OCR completo")
        return extract_text_ocr(pdf_path)

    print(f"  → Testo diretto sufficiente ({len(direct_pages) - len(sparse_pages)} pagine valide)")
    return direct_pages


def detect_chapters(pages: list[dict]) -> list[dict]:
    """Rileva i confini dei capitoli basandosi su pattern testuali."""
    chapters = []
    current_chapter = {"title": "Prefazione", "pages": [], "text": ""}

    pattern = re.compile("|".join(CHAPTER_MARKERS), re.IGNORECASE | re.MULTILINE)

    for page in pages:
        matches = pattern.findall(page["text"])
        if matches:
            if current_chapter["text"].strip():
                chapters.append(current_chapter)

            title = matches[0].strip()
            current_chapter = {"title": title, "pages": [page["page"]], "text": page["text"]}
        else:
            current_chapter["pages"].append(page["page"])
            current_chapter["text"] += "\n\n" + page["text"]

    if current_chapter["text"].strip():
        chapters.append(current_chapter)

    return chapters


def save_raw_text(pages: list[dict], output_path: Path):
    """Salva il testo grezzo estratto in un file."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        for page in pages:
            f.write(f"\n{'='*60}\n")
            f.write(f"PAGINA {page['page']} [{page['method']}]\n")
            f.write(f"{'='*60}\n\n")
            f.write(page["text"])
            f.write("\n")
    print(f"  → Testo grezzo salvato in: {output_path}")


def run(pdf_path: str) -> tuple[list[dict], list[dict]]:
    """Esegue l'estrazione completa. Ritorna (pagine, capitoli)."""
    pdf = Path(pdf_path)
    if not pdf.exists():
        print(f"Errore: file non trovato: {pdf}")
        sys.exit(1)

    print(f"\n📄 Elaborazione: {pdf.name}")
    print(f"   Dimensione: {pdf.stat().st_size / 1024 / 1024:.1f} MB")

    pages = extract_smart(pdf)
    print(f"  → Estratte {len(pages)} pagine")

    raw_output = OUTPUT_DIR / f"{pdf.stem}_raw.txt"
    save_raw_text(pages, raw_output)

    chapters = detect_chapters(pages)
    print(f"  → Rilevati {len(chapters)} capitoli")
    for ch in chapters:
        print(f"     • {ch['title']} (pp. {ch['pages'][0]}-{ch['pages'][-1]})")

    return pages, chapters


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python extract_ocr.py <percorso_pdf>")
        sys.exit(1)
    run(sys.argv[1])

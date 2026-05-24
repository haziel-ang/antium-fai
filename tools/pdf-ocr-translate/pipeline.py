#!/usr/bin/env python3
"""
Pipeline completo: PDF antico → OCR → Traduzione → Documento italiano moderno.

Uso:
    python pipeline.py libro_antico.pdf
    python pipeline.py libro_antico.pdf --title "De Rebus Antiquis"
    python pipeline.py libro_antico.pdf --skip-ocr --input-text raw.txt
    python pipeline.py libro_antico.pdf --only-ocr
    python pipeline.py libro_antico.pdf --pages 10-50
"""

import argparse
import sys
from pathlib import Path

from config import OUTPUT_DIR, TEMP_DIR


def parse_args():
    parser = argparse.ArgumentParser(
        description="Pipeline OCR + Traduzione per libri antichi scansionati"
    )
    parser.add_argument("pdf", help="Percorso al file PDF da elaborare")
    parser.add_argument("--title", help="Titolo del documento (default: nome file)")
    parser.add_argument("--only-ocr", action="store_true",
                        help="Esegui solo estrazione OCR senza traduzione")
    parser.add_argument("--skip-ocr", action="store_true",
                        help="Salta OCR e usa un file di testo preesistente")
    parser.add_argument("--input-text",
                        help="File di testo da usare al posto dell'OCR")
    parser.add_argument("--pages",
                        help="Range di pagine da elaborare (es. 10-50)")
    parser.add_argument("--no-pdf", action="store_true",
                        help="Non generare il PDF finale")
    parser.add_argument("--delay", type=float, default=1.0,
                        help="Pausa tra chiamate API in secondi (default: 1.0)")
    return parser.parse_args()


def filter_pages(pages: list[dict], page_range: str) -> list[dict]:
    """Filtra le pagine in base al range specificato."""
    if not page_range:
        return pages
    start, end = map(int, page_range.split("-"))
    return [p for p in pages if start <= p["page"] <= end]


def main():
    args = parse_args()
    pdf_path = Path(args.pdf)

    if not pdf_path.exists() and not args.skip_ocr:
        print(f"Errore: file non trovato: {pdf_path}")
        sys.exit(1)

    stem = pdf_path.stem
    title = args.title or stem.replace("_", " ").replace("-", " ").title()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print(f"  PIPELINE OCR + TRADUZIONE")
    print(f"  File: {pdf_path.name}")
    print(f"  Titolo: {title}")
    print("=" * 60)

    # Fase 1: Estrazione OCR
    if args.skip_ocr and args.input_text:
        print("\n⏭ OCR saltato, caricamento testo da file...")
        text_path = Path(args.input_text)
        text = text_path.read_text(encoding="utf-8")
        pages = [{"page": i + 1, "text": para, "method": "file"}
                 for i, para in enumerate(text.split("\n\n")) if para.strip()]
    else:
        from extract_ocr import run as run_ocr
        pages, _ = run_ocr(str(pdf_path))

    if args.pages:
        pages = filter_pages(pages, args.pages)
        print(f"  → Filtrate pagine: {args.pages} ({len(pages)} pagine)")

    if args.only_ocr:
        print("\n✅ Estrazione OCR completata. Usa --skip-ocr per tradurre in seguito.")
        return

    # Fase 2: Rilevamento capitoli
    from extract_ocr import detect_chapters
    chapters = detect_chapters(pages)
    print(f"\n📚 {len(chapters)} capitoli rilevati")

    # Fase 3: Traduzione
    from translate import run as run_translate
    translated = run_translate(chapters, stem)

    # Fase 4: Composizione
    from compose import run as run_compose
    run_compose(translated, stem, title)

    # Pulizia
    if TEMP_DIR.exists():
        import shutil
        shutil.rmtree(TEMP_DIR, ignore_errors=True)

    print("\n" + "=" * 60)
    print(f"  ✅ COMPLETATO")
    print(f"  Output in: {OUTPUT_DIR / stem}")
    print("=" * 60)


if __name__ == "__main__":
    main()

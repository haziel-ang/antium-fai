#!/usr/bin/env python3
"""
estrai_immagini.py — Estrae le immagini da un tomo PDF e prepara una scheda
editabile (manifest) con didascalia candidata e credito, da rivedere a mano
prima di inserirle nella guida con inserisci_figure.py.

Uso tipico:
    python estrai_immagini.py tomo.pdf \
        --out figure_estratte \
        --pagine 1-40 \
        --credito "Universitätsbibliothek Heidelberg, DOI 10.11588/diglit.30719" \
        --min-lato 200

Cosa produce nella cartella --out:
    - i file immagine (PNG), uno per figura, con nome fig_<n>.png
    - manifest.json : la scheda editabile (vedi sotto)
    - manifest.csv  : la stessa scheda, comoda da aprire su iPhone in un foglio

Ogni voce del manifest:
    id              numero della figura (usato poi nel segnaposto {{FIG:id}})
    file            nome del file immagine salvato
    pagina          pagina del PDF da cui proviene (1-based)
    larghezza/altezza  pixel
    didascalia      DA RIVEDERE: testo pescato vicino all'immagine, spesso impreciso
    crediti         valore di --credito (uguale per tutte: correggi se serve)
    ancora          vuoto: ci scriverai dove va la figura, es. {{FIG:3}}

Niente didascalie e crediti vengono inventati come fatti storici: la
didascalia candidata è solo testo grezzo vicino all'immagine, da correggere.
"""

import argparse
import csv
import json
import os
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Manca PyMuPDF. Installa con:  pip install pymupdf --break-system-packages")


def parse_pagine(spec, n_pagine):
    """'1-40' o '3,5,8' o '2-9,15' -> set di indici 0-based. None = tutte."""
    if not spec:
        return set(range(n_pagine))
    out = set()
    for pezzo in spec.split(","):
        pezzo = pezzo.strip()
        if "-" in pezzo:
            a, b = pezzo.split("-")
            out.update(range(int(a) - 1, int(b)))
        else:
            out.add(int(pezzo) - 1)
    return {i for i in out if 0 <= i < n_pagine}


def didascalia_candidata(page, bbox):
    """Pesca il blocco di testo subito sotto l'immagine come didascalia di tentativo."""
    if bbox is None:
        return ""
    sotto = fitz.Rect(bbox.x0, bbox.y1, bbox.x1, bbox.y1 + 90)
    testo = page.get_textbox(sotto).strip().replace("\n", " ")
    return " ".join(testo.split())[:300]


def estrai(pdf, out_dir, pagine_spec, credito, min_lato):
    doc = fitz.open(pdf)
    pagine = parse_pagine(pagine_spec, len(doc))
    os.makedirs(out_dir, exist_ok=True)

    voci = []
    visti = set()  # xref già salvati: evita di duplicare la stessa immagine ripetuta
    n = 0

    for i in sorted(pagine):
        page = doc[i]
        for img in page.get_images(full=True):
            xref = img[0]
            if xref in visti:
                continue
            visti.add(xref)

            pix = fitz.Pixmap(doc, xref)
            # normalizza spazi colore esotici (CMYK, con canale alfa) a RGB
            if pix.n - pix.alpha >= 4:
                pix = fitz.Pixmap(fitz.csRGB, pix)
            if pix.alpha:
                pix = fitz.Pixmap(pix, 0)

            if pix.width < min_lato and pix.height < min_lato:
                continue  # scarto loghi, filetti, residui di scansione

            n += 1
            nome = f"fig_{n}.png"
            pix.save(os.path.join(out_dir, nome))

            try:
                bbox = page.get_image_bbox(img)
            except Exception:
                bbox = None

            voci.append({
                "id": n,
                "file": nome,
                "pagina": i + 1,
                "larghezza": pix.width,
                "altezza": pix.height,
                "didascalia": didascalia_candidata(page, bbox),
                "crediti": credito,
                "ancora": "",
            })

    with open(os.path.join(out_dir, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(voci, f, ensure_ascii=False, indent=2)

    with open(os.path.join(out_dir, "manifest.csv"), "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["id", "file", "pagina", "larghezza",
                                          "altezza", "didascalia", "crediti", "ancora"])
        w.writeheader()
        w.writerows(voci)

    return voci


def main():
    ap = argparse.ArgumentParser(description="Estrae immagini da un tomo PDF.")
    ap.add_argument("pdf", help="percorso del tomo PDF")
    ap.add_argument("--out", default="figure_estratte", help="cartella di destinazione")
    ap.add_argument("--pagine", default=None, help="es. 1-40 oppure 3,5,8 (default: tutte)")
    ap.add_argument("--credito", default="fonte da indicare",
                    help="credito grafico applicato a tutte le figure")
    ap.add_argument("--min-lato", type=int, default=200,
                    help="ignora immagini con entrambi i lati sotto questi pixel")
    args = ap.parse_args()

    voci = estrai(args.pdf, args.out, args.pagine, args.credito, args.min_lato)

    if not voci:
        print("Nessuna immagine utile trovata. "
              "Se il tomo è scansionato come pagine intere, le 'immagini' sono le pagine: "
              "abbassa --min-lato o estrai le pagine come figure a parte.")
        return
    print(f"Estratte {len(voci)} figure in '{args.out}/'.")
    print(f"Scheda da rivedere: {args.out}/manifest.csv (o manifest.json)")
    print("Prossimo passo: correggi didascalia e crediti, scrivi l'ancora {{FIG:id}}, "
          "poi lancia inserisci_figure.py.")
    for v in voci:
        d = (v["didascalia"][:60] + "…") if len(v["didascalia"]) > 60 else v["didascalia"]
        print(f"  fig {v['id']}: pag.{v['pagina']} {v['larghezza']}x{v['altezza']}  «{d}»")


if __name__ == "__main__":
    main()

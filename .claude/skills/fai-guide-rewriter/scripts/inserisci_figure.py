#!/usr/bin/env python3
"""
inserisci_figure.py — Inserisce nella guida HTML le figure estratte, al posto
dei segnaposto {{FIG:id}}, con didascalia e crediti già formattati. Copia le
immagini accanto alla guida così il file è autonomo (pronto per lo zip/Vercel).

Uso tipico:
    python inserisci_figure.py guida.html figure_estratte/manifest.json \
        --img-src figure_estratte \
        --out guida_con_figure.html

Flusso:
    1) Nella guida scrivi un segnaposto dove vuoi la figura, su una riga sua:
           {{FIG:3}}
    2) Nel manifest la figura 3 deve avere didascalia e crediti corretti.
    3) Questo script sostituisce {{FIG:3}} con il blocco <figure> completo
       e copia fig_3.png nella cartella images/ accanto alla guida.

Le figure del manifest senza un segnaposto corrispondente NON vengono inserite:
lo script le elenca a fine esecuzione, così non perdi nulla per distrazione.
Richiede che il CSS della guida contenga le classi figure/figcaption/credito
(sono nel template della skill: assets/guida-template.html).
"""

import argparse
import html
import json
import os
import re
import shutil
import sys


def blocco_figura(voce, cartella_img):
    src = f"{cartella_img}/{voce['file']}"
    alt = html.escape(voce.get("didascalia", "") or voce["file"])
    didascalia = html.escape(voce.get("didascalia", "").strip())
    crediti = html.escape(voce.get("crediti", "").strip())
    righe = [f'<figure>',
             f'  <img src="{src}" alt="{alt}" loading="lazy">',
             f'  <figcaption>']
    if didascalia:
        righe.append(f'    {didascalia}')
    if crediti:
        righe.append(f'    <span class="credito">Crediti: {crediti}</span>')
    righe.append('  </figcaption>')
    righe.append('</figure>')
    return "\n".join(righe)


def main():
    ap = argparse.ArgumentParser(description="Inserisce le figure nella guida ai segnaposto {{FIG:id}}.")
    ap.add_argument("html", help="guida HTML di destinazione")
    ap.add_argument("manifest", help="manifest.json rivisto (didascalie e crediti corretti)")
    ap.add_argument("--img-src", default="figure_estratte",
                    help="cartella dove si trovano i file immagine estratti")
    ap.add_argument("--out", default=None, help="file di output (default: <guida>_con_figure.html)")
    ap.add_argument("--img-dir", default="images",
                    help="sottocartella, accanto alla guida, dove copiare le immagini")
    args = ap.parse_args()

    with open(args.html, encoding="utf-8-sig") as f:
        testo = f.read()
    with open(args.manifest, encoding="utf-8") as f:
        voci = {int(v["id"]): v for v in json.load(f)}

    out_path = args.out or os.path.splitext(args.html)[0] + "_con_figure.html"
    dest_dir = os.path.join(os.path.dirname(os.path.abspath(out_path)) or ".", args.img_dir)

    inserite, mancanti_segnaposto, mancanti_file = [], [], []

    # quali segnaposto esistono davvero nella guida
    presenti = set(int(x) for x in re.findall(r"\{\{FIG:(\d+)\}\}", testo))

    for fid in sorted(presenti):
        if fid not in voci:
            mancanti_segnaposto.append(fid)
            continue
        voce = voci[fid]
        sorgente = os.path.join(args.img_src, voce["file"])
        if not os.path.exists(sorgente):
            mancanti_file.append(voce["file"])
            continue
        os.makedirs(dest_dir, exist_ok=True)
        shutil.copy2(sorgente, os.path.join(dest_dir, voce["file"]))
        testo = testo.replace("{{FIG:%d}}" % fid,
                              blocco_figura(voce, args.img_dir))
        inserite.append(fid)

    # figure nel manifest che nessun segnaposto richiama
    senza_ancora = [v["id"] for v in voci.values() if v["id"] not in presenti]

    with open(out_path, "w", encoding="utf-8-sig") as f:  # utf-8-sig = BOM, come da regola FAI
        f.write(testo)

    print(f"Guida scritta: {out_path}")
    print(f"Figure inserite: {sorted(inserite) or 'nessuna'}")
    if mancanti_segnaposto:
        print(f"ATTENZIONE — segnaposto {{FIG:id}} senza voce nel manifest: {mancanti_segnaposto}")
    if mancanti_file:
        print(f"ATTENZIONE — file immagine non trovati in {args.img_src}: {mancanti_file}")
    if senza_ancora:
        print(f"Figure nel manifest non collocate (nessun segnaposto): {senza_ancora}. "
              f"Aggiungi {{FIG:id}} nella guida dove le vuoi, poi rilancia.")


if __name__ == "__main__":
    main()

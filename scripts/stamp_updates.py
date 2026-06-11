#!/usr/bin/env python3
"""Stampiglia la data di ultimo aggiornamento in ogni pagina del sito.

Cerca il segnaposto <p class="page-updated">…</p> e lo riscrive con la data
dell'ultima modifica reale della pagina: la data odierna se il file ha
modifiche non ancora committate, altrimenti la data dell'ultimo commit che
lo ha toccato. Da eseguire prima di ogni commit, insieme a
build_search_index.py.
"""
import re
import subprocess
import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES = [ROOT / 'index.html'] + sorted((ROOT / 'sezioni').glob('*.html'))

MESI = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
        'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre']

MARKER = re.compile(r'<p class="page-updated">[^<]*</p>')


def data_italiana(d: datetime.date) -> str:
    articolo = "l'" if d.day in (1, 8, 11) else 'il '
    return f"{articolo}{d.day} {MESI[d.month - 1]} {d.year}"


def ultima_modifica(path: Path) -> datetime.date:
    rel = path.relative_to(ROOT).as_posix()
    dirty = subprocess.run(['git', 'status', '--porcelain', '--', rel],
                           cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if dirty:
        return datetime.date.today()
    out = subprocess.run(['git', 'log', '-1', '--format=%as', '--', rel],
                         cwd=ROOT, capture_output=True, text=True).stdout.strip()
    if out:
        return datetime.date.fromisoformat(out)
    return datetime.date.today()


def main() -> None:
    for page in PAGES:
        s = page.read_text(encoding='utf-8')
        if not MARKER.search(s):
            continue
        d = ultima_modifica(page)
        nuovo = f'<p class="page-updated">Pagina aggiornata {data_italiana(d)}</p>'
        s2 = MARKER.sub(nuovo, s, count=1)
        if s2 != s:
            page.write_text(s2, encoding='utf-8')
            print(f'{page.relative_to(ROOT)}: {data_italiana(d)}')


if __name__ == '__main__':
    main()

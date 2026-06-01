#!/usr/bin/env python3
"""Genera l'indice di ricerca full-text per il sito Antium.

Estrae il testo di tutte le pagine (index.html + sezioni/*.html) limitandosi al
contenuto di <main id="contenuto">, suddividendolo in "passaggi" (blocchi di
testo) nello stesso ordine del documento. L'ordine dei passaggi coincide con
l'ordine in cui il TreeWalker di main.js incontra i nodi di testo: questo permette
di calcolare a runtime l'indice esatto dell'occorrenza da evidenziare.

Output: js/search-index.js -> window.ANTIUM_SEARCH_INDEX = [...]
"""

import json
import os
import re
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Pagine da indicizzare: (url relativo alla root del sito, percorso file)
PAGES = []
PAGES.append(("index.html", os.path.join(ROOT, "index.html")))
SEZIONI_DIR = os.path.join(ROOT, "sezioni")
for name in sorted(os.listdir(SEZIONI_DIR)):
    if name.endswith(".html"):
        PAGES.append(("sezioni/" + name, os.path.join(SEZIONI_DIR, name)))

# Tag che aprono un nuovo passaggio
BLOCK_TAGS = {
    "p", "li", "h1", "h2", "h3", "h4", "h5", "h6",
    "blockquote", "figcaption", "dd", "dt", "summary",
    "td", "th", "caption",
}
# Tag il cui contenuto va ignorato
SKIP_TAGS = {"script", "style", "svg", "noscript"}


class MainExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_main = False
        self.main_depth = 0
        self.skip_depth = 0
        self.passages = []
        self.buffer = []

    def _flush(self):
        text = " ".join(self.buffer).strip()
        text = re.sub(r"\s+", " ", text)
        if text:
            self.passages.append(text)
        self.buffer = []

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        if not self.in_main:
            if tag == "main" and attrs_d.get("id") == "contenuto":
                self.in_main = True
                self.main_depth = 1
            return
        if tag == "main":
            self.main_depth += 1
        if self.skip_depth > 0:
            if tag in SKIP_TAGS:
                self.skip_depth += 1
            return
        if tag in SKIP_TAGS:
            self.skip_depth = 1
            return
        if tag in BLOCK_TAGS:
            self._flush()
        if tag == "br":
            self.buffer.append(" ")

    def handle_endtag(self, tag):
        if not self.in_main:
            return
        if self.skip_depth > 0:
            if tag in SKIP_TAGS:
                self.skip_depth -= 1
            return
        if tag in BLOCK_TAGS:
            self._flush()
        if tag == "main":
            self.main_depth -= 1
            if self.main_depth == 0:
                self._flush()
                self.in_main = False

    def handle_data(self, data):
        if self.in_main and self.skip_depth == 0:
            if data.strip():
                self.buffer.append(data)


TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def extract_title(html):
    m = TITLE_RE.search(html)
    if not m:
        return ""
    title = re.sub(r"\s+", " ", m.group(1)).strip()
    # rimuove i prefissi tipo "Antium · " / "Antium - "
    title = re.sub(r"^Antium\s*[·\-–|:]\s*", "", title)
    return title or "Antium"


# Etichette personalizzate per alcune pagine (titoli <title> troppo lunghi)
TITLE_OVERRIDES = {
    "index.html": "Home",
}


def main():
    index = []
    for url, path in PAGES:
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        title = extract_title(html)
        title = TITLE_OVERRIDES.get(url, title)
        parser = MainExtractor()
        parser.feed(html)
        passages = parser.passages
        if not passages:
            continue
        index.append({"url": url, "title": title, "passages": passages})

    out_path = os.path.join(ROOT, "js", "search-index.js")
    payload = json.dumps(index, ensure_ascii=False, separators=(",", ":"))
    banner = (
        "/* File generato automaticamente da scripts/build_search_index.py. "
        "Non modificare a mano. */\n"
    )
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(banner)
        fh.write("window.ANTIUM_SEARCH_INDEX = " + payload + ";\n")

    total_passages = sum(len(p["passages"]) for p in index)
    print(f"Indicizzate {len(index)} pagine, {total_passages} passaggi -> {out_path}")


if __name__ == "__main__":
    main()

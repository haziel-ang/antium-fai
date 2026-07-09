# Antium Wiki — Log

## [2026-07-09] ingest | Batch iniziale (42 fonti da wiki/raw/)
Prime pagine wiki create:
- `wiki/overview.md` — sintesi generale del dominio
- `wiki/index.md` — catalogo pagine con metadata
- `wiki/sources/` (26 pagine-fonte)
- `wiki/entities/` (7 pagine-entità)
- `wiki/concepts/` (10 pagine-concetto)
- `wiki/log.md` — cronologia iniziale

Fonte principale del batch: PDF estratti da `docs/` via `python scripts/extract_pdfs.py`.
Le pagine wiki sono state generate dall'LLM (OpenCode) basandosi sul contenuto
dei testi estratti e sulle pagine HTML esistenti in `sezioni/`.
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
## [2026-07-10] ingest | Nibby 1819 · Winckelmann 1783 · guida riveduta del Vallo (Nibby 1848)
Tre nuove fonti caricate dall'utente e integrate in guide web, PDF e wiki:
- `raw/nibby-viaggio-anzio-1819.md` — digest del Capo XXXI del *Viaggio antiquario* (1819)
- `raw/winckelmann-estratti-antium-1783.md` — estratti dalla *Storia delle Arti del Disegno* (ed. Fea 1783)
- `raw/vallo-di-antium-guida-2026.md` — testo della guida riveduta del Vallo (innesti da Nibby 1848)

Pagine wiki create: `sources/nibby-viaggio-1819`, `sources/winckelmann-1783`,
`entities/nibby`, `entities/winckelmann`, `entities/apollo-belvedere`,
`concepts/tempio-della-fortuna`.
Pagine aggiornate: `entities/volsci` (costituzione aristocratica, 24 trionfi, due monete),
`entities/nerone` (trionfo, incendio di Roma), `entities/villa-imperiale`
(testimonianze antiquarie 1819), `concepts/porto-neroniano` (interramento di
Alessandro VI, stato 1819), `sources/vallo` (materiale Nibby 1848), `overview.md`, `index.md`.

Sito aggiornato in parallelo (stessa operazione, fuori dal layer wiki):
`sezioni/vallo.html`, `sezioni/volsci-cicerone-culti.html`,
`sezioni/villa-imperiale.html`, `fonti.html`, PDF rigenerati
(`docs/vallo.pdf`, `docs/storia-urbana.pdf`, `docs/villa-imperiale.pdf`).
Tensioni tra fonti segnalate in ⚑: date di Cenone (Nibby 493 vs cronologie correnti
468/469), artista del Giove di Tarquinio (Winckelmann «volsco» vs Vulca di Veio),
attribuzione dell'opera capitolina.

## [2026-07-10] query | Occhi di allora vs scoperte di oggi (verifica incrociata antiquari-archeologia)
Verifica sistematica delle testimonianze antiquarie ingerite (Winckelmann 1783,
Nibby 1819/1848) contro i dati archeologici moderni già nel wiki:
- CONFERMATI dagli scavi: vestigia murarie di Nibby alle Vignacce (= muro scavato
  1980-81); ordine di grandezza del perimetro («tre miglia» ~4,4 km vs 3.900 m);
  stima a occhio del porto neroniano (semicerchio di mezzo miglio vs rilievo aereo
  1938 e ~34 ettari di Felici); lettura «magazzini/sostruzioni» dei corridoi
  sotterranei (coerente con criptoportico del Quartierone e gallerie sostruttive
  di Villa Adele 2023, identità non dimostrata).
- CORRETTI dalle cronologie/scoperte: resa di Anzio al 493 a.C. (oggi 469-467);
  «due monete e nient'altro» dell'arte volsca (oggi abbondante cultura materiale
  dai centri volsci; valido solo per l'arte maggiore); Giove di Tarquinio da
  artista «volsco» (tradizione prevalente: Vulca di Veio).
Esito riportato nelle pagine del sito (paragrafi e callout aggiornati in
volsci-cicerone-culti e villa-imperiale) e in `entities/volsci`.

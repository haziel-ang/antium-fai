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

## [2026-11-27] ingest | Swetnam-Burland 2024, Classical Antiquity 43.1
Articolo sui Fasti Antiates Ministrorum Domus Augustae (testo fornito in chat,
non archiviato in `raw/` per i diritti). Nuove pagine: `sources/swetnam-burland-2024`,
`concepts/fasti-anziati`. Aggiornate: `entities/villa-imperiale`,
`sources/jaia-anzio-fasti-2010`, `sources/teatro-romano`, `index`.

## [2026-11-27] query | Verifiche fattuali della riscrittura del sito (PR #137–#150)
Esiti confluiti nel wiki:
- Livio XXVII 38: trenta giorni, non «quaranta giovani» (`entities/volsci`).
- Incursione inglese: 5 ottobre 1813 (Lombardi 1847; Marshall 1823; O'Byrne 1849)
  (`entities/caffeaus`, `sources/tor-caldara`).
- Fasti Ministrorum: Musei Capitolini inv. 2447–2448; contenuto riletto
  (`concepts/fasti-anziati`).
- M. Aquilio: iscrizione onoraria, non statua; terme di Basso distinte dallo
  xystus; Nibby morto nel 1839 (`concepts/xystus`, `entities/nibby`).
- Tor Caldara: Frasch, Colli Albani, Gerba, Waters, Malick, Churchill, Pliocene
  (`sources/tor-caldara`).

## [2026-11-27] lint | Correzione di pagine in contrasto con le fonti
- `entities/caffeaus` riscritta: diceva cisterna ipogea adrianea della villa
  imperiale, trasformata in caffetteria negli anni '90. Errato: cisterna fuori
  terra del II sec. per la villa del Semaforo, Caffeaus Corsini del 1743.
- `concepts/cisterna-romana` riscritta per lo stesso motivo.
- `concepts/mitraismo`: tolta l'affermazione che il rilievo riporti i fasti consolari.
- `concepts/xystus`: tolta la collocazione dentro un impianto termale severiano.
- `entities/villa-imperiale`: il Cisternone non apparteneva alla villa imperiale.


## [2026-11-27] lint | antium-v5 archiviato
- Il PDF sorgente `docs/antium-v5.pdf` (25/04/2026) è stato spostato in `docs/archivio/antium-v5-2026-04-25.pdf`; al suo posto c'è la guida completa generata dal sito. `raw/antium-v5.md` resta la trascrizione dell'originale.
- Nota: l'attribuzione a Santamaria Scrinari del refuso «Agrippina Maggiore» madre di Nerone, presente in `raw/antium-v5.md`, non è verificata sull'originale ed è stata tolta dal sito.

## [2026-11-27] lint | Correzioni di fatto: Antonielli, capitale Italcable, scavi dei militari del Sanatorio
Verifica dei nomi e dei collegamenti del podcast della Necropoli («Altro che Volsci!»), su fonti esterne
e sulle fonti primarie di `raw/`. Tre affermazioni erano sbagliate; i file di `raw/` restano immutati
(sono estrazioni dei vecchi PDF) e qui si annota che cosa contengono di errato.

- **Ugo Antonielli non morì nel 1926.** Errore in `raw/antium-v5.md`, `raw/necropoli-preistoriche.md`,
  `raw/antium-necropoli-protostoriche-scheda.md`, `raw/antium-02-approfondimenti-produzione.md`
  («morì prematuramente nel 1926, prima di pubblicare»). Antonielli diresse il Museo Preistorico
  Etnografico di Roma dagli anni Venti, prese parte al recupero delle navi di Nemi (1929–1931), dal 1934
  guidò la Soprintendenza di Padova e morì a Padova nel 1935 (Museo Nazionale Scienza e Tecnologia,
  Archivi online, scheda «Antonielli»; atti della XLVI Riunione IIPP). Resta vero che lo scavo
  dell'Italcable del 1925 non lo pubblicò mai: lo fece Gierow (1960–1961, 1966).
- **I 200 milioni di lire non erano il costo del cavo.** Errore in `raw/necropoli-preistoriche.md`
  («L'opera costò duecento milioni di lire»). Erano il capitale della società Italcable, per metà
  (100 milioni) sottoscritto a piccole quote dagli emigrati italiani in America Latina (Associazione
  Italcable; *Il Granchio*, 23/3/2025). `raw/antium-necropoli-protostoriche-scheda.md` lo diceva già bene.
- **Gli scavi clandestini dei militari del Sanatorio non riguardano la necropoli.** Errore in
  `raw/necropoli-preistoriche.md` («Convalescenti che scavavano la necropoli sotto casa»). La fonte
  primaria, `raw/jaia-di-mario-anzio-e-nerone-2009.md`, li colloca nell'area della **villa imperiale**
  (Grotte di Nerone, Villa Aldobrandini), nel **1921**: nota di Paribeni al generale del 29 marzo 1921,
  risposta del Sanatorio sui «tubercolosi di guerra degenti». Il Sanatorio Militare esisteva quindi già nel
  1921; il 1934 è l'inaugurazione della nuova sede (risposta all'interrogazione parlamentare 4/13367).

Sito corretto in parallelo (fuori dal layer wiki): `sezioni/necropoli-protostoriche.html` (morte di
Antonielli, capitale Italcable, box dei militari tolto), `sezioni/villa-imperiale.html` (box «I soldati
del Sanatorio e le Grotte di Nerone»), `fonti.html`, PDF delle due sezioni e guida completa; podcast
della Necropoli riscritto e rigenerato.

## [2026-11-27] lint | Verifica frase per frase degli otto script podcast
Ogni affermazione degli script di `podcast/` confrontata con le pagine del sito, con Lugli 1940 (PDF della
rivista, *Saggio sulla topografia dell'antica Antium*, pp. 153–188), con `raw/jaia-di-mario-anzio-e-nerone-2009.md`
e con fonti esterne. Correzioni (podcast e, dove serviva, sito):
- **Teatro, tre porte con «soglie e cardini» ritrovati da Lugli**: in Lugli 1940 (p. 175–176) non ci sono; Lugli
  descrive solo un fornice centrale e due laterali per la cavea e le stanze sotto la scena. Il dettaglio veniva
  dalla vecchia guida PDF (`raw/teatro-romano.md`). Tolto da pagina e podcast.
- **Teatro, «ad Antium c'è una fossa lunga e stretta» per il sipario**: nessuna fonte di scavo trovata (viene dalla
  legenda della tavola ricostruttiva). Ora la pagina parla della fossa dei teatri romani in generale.
- **Necropoli, l'Apollo «nello stesso terreno/cantiere» delle tombe**: Lugli scrive solo «di recente l'Apollo
  scoperto presso l'Italcable». Non è detto che venga dallo scavo del 1925.
- **Necropoli, Antonielli «direttore»**: nel 1925 era «reggente» della Direzione del Museo Preistorico Etnografico
  (Di Mario e Jaia 2009).
- Podcast: Mulakia («saccheggiata in poche ore» → «prima che arrivassero le autorità»), Villa imperiale
  (Caligola «in Germania» → «sul Reno, fra i Treviri»), Tor Caldara (porta in alto e scala a pioli «in un
  disegno del Settecento»).

## [2026-11-28] lint | Villa imperiale: verifica sulle fonti primarie e citazione di Cicerone
Script del podcast della villa imperiale riscritto in ordine cronologico e verificato frase per frase su
Cicerone (*Ad Atticum* II e IV), Svetonio (*Aug.* 58, *Cal.* 8, *Nero* 6, 9, 25), Treccani EAA «Anzio»,
Felici e Swetnam-Burland 2024. Errori trovati:
- **«Nullum in Italia litus amoenius» (Ad Atticum II, 8) non esiste**: il testo vero è IV, 8, «nihil quietius,
  nihil alsius, nihil amoenius». Era in home, nella sezione, nei PDF e nello script. Corretto ovunque.
- Caligola e Nerone nati «nella villa»/«nelle stesse stanze»: le fonti dicono Anzio.
- Villa «già della famiglia imperiale» nel 2 a.C.: è una deduzione, ora detta come indizio.
- «Due giorni di carrozza» e «miasmi»: senza fonte, tolti dalla sezione.
- Cicerone «sul litorale», *patronus*, Marcello «esiliato ad Antium» in [[entities/cicerone]]: segnati da verificare.
Pagine aggiornate: [[entities/villa-imperiale]], [[entities/cicerone]]. Regola nuova (utente): la verifica
storica sulle fonti è obbligatoria per ogni testo, prima di scriverlo; da riapplicare a tutte le sezioni e a tutti
gli script tranne la villa imperiale.

## [2026-11-28] ingest | Nibby 1819 (tomo II), Matteucci 1872, Cramer 1826 (trad. it.)
- Nuove fonti in `wiki/raw/` dai file caricati dall'utente: `nibby-viaggio-antiquario-tomo2-1819.md` (testo integrale, ed. Marino 2017), `matteucci-cenni-storici-1872.md`, `cramer-1826-antium-it.md`. Winckelmann e il digest di Nibby erano già presenti, identici.
- Usate per la verifica della sezione Volsci: Solino e Ascanio, Anziati in aiuto degli Aricini contro Arunte (Nibby da Dionigi V), Catone in Servio sul dominio etrusco (Cramer). Pagine wiki entità/concetti da aggiornare al prossimo ingest.

## [2026-11-28] ingest | Nove studi caricati dall'utente
- Nuovi in `wiki/raw/`: `cacciotti-culti-orientali-antium-2008.md`, `jaia-ebanista-villa-comunale-2024.md`, `lva-via-lanuvio-anzio-2016.md`, `ebanista-anzio-residenze-eta-imperiale.md`, `jaia-villa-imperiale-anzio-2008.md`, `pergola-reperti-villa-imperiale-mnr.md`, `swetnam-burland-working-for-the-emperor-antium.md`, `bianchini-anzio-nettuno-geografia-urbana.md`. Riestratto con testo `studi-sulle-antichita-di-anzio-e-nettuno.md` (Pasqualini, recensione a Brandizzi Vittucci 2000), prima vuoto. Matteucci, Cramer e Jaia 2010 erano duplicati.
- Usati per ripristinare, con la fonte, contenuti tolti nelle verifiche: culti egizi e teste planetarie (Cacciotti), strade per Lanuvio e Selciatella (LVA 2016), Caenon al Pantano (Pasqualini), scavi di Villa Adele (Jaia-Ebanista). Da usare per Villa imperiale e Antium guide.

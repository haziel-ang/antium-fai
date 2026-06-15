# Antium FAI — Note di sviluppo per Claude

## Metodologia di deploy

**Ogni modifica va sempre mergiata in `main`, sempre e senza chiedere conferma.** Il
merge in `main` è il deploy: il workflow `.github/workflows/deploy.yml` aggiorna in
automatico il sito su GitHub Pages. Siamo in fase di rifinitura (errori e incongruenze):
priorità a operatività e velocità, quindi porta ogni task fino alla produzione da solo,
in un colpo unico, senza fermarti a chiedere il via libera per la PR o il merge.

Flusso per ogni task (eseguilo per intero, sempre):

1. **Branch fresco da `main`**: `git fetch origin main` poi
   `git switch -c claude/<nome-task> origin/main`. Non riutilizzare mai un branch
   già mergiato (dopo un merge squash diverge da `main` e la PR successiva va in conflitto).
2. `git add <file>` + `git commit` + `git push -u origin <branch>`.
3. Crea PR verso `main` (`mcp__github__create_pull_request`) e **mergiala subito** in
   squash (`mcp__github__merge_pull_request`): non lasciare mai un task fermo prima del merge.
4. Se capita un conflitto: `git fetch origin main` e `git merge -X ours origin/main`
   (il branch include già le modifiche squashate, quindi vince), poi rigenera l'indice
   di ricerca, verifica che convivano le tue aggiunte e gli aggiornamenti da `main`, e ripusha.

## Sincronizzazione PDF delle sezioni (vincolante)

Ogni pagina di `sezioni/` ha un **PDF associato** in `docs/`, ed esiste la pagina
`pdf.html` che li elenca tutti. **Regola: quando si modifica il testo di una sezione,
il PDF associato va sempre rigenerato e riallineato alla pagina. Sempre.** Non si lascia
mai un PDF disallineato dalla versione web. Una sezione nuova deve avere il suo PDF in
`docs/` e la sua voce in `pdf.html`.

Mappa sezione → PDF (da tenere aggiornata):

- `necropoli-protostoriche` → `docs/necropoli-preistoriche.pdf`
- `vallo` → `docs/vallo.pdf`
- `volsci-cicerone-culti` → `docs/storia-urbana.pdf`
- `antium-guide` → `docs/antium-guide.pdf`
- `tomba-mulakia` → `docs/tomba-mulakia.pdf`
- `villa-imperiale` → `docs/villa-imperiale.pdf`
- `teatro-romano` → `docs/teatro-romano.pdf`
- `monumenti-citta-alta` → `docs/monumenti-citta-alta.pdf`
- `xystus-terme-citta-alta` → `docs/xystus-terme-citta-alta.pdf`
- `cisternone-caffeaus` → `docs/cisternone-caffeaus.pdf`
- `tor-caldara` → `docs/tor-caldara.pdf`

I PDF si rigenerano con lo script dedicato (WeasyPrint + foglio di stampa pulito,
immagini ridimensionate): `python scripts/build_pdfs.py` per tutte le sezioni, oppure
`python scripts/build_pdfs.py <sezione> …` per alcune. La mappa nome-sezione → nome-PDF
è dentro lo script (`SECTION_TO_PDF`): una sezione nuova va aggiunta lì e a `pdf.html`.

Ogni pagina dei PDF ha un **footer** con: una sottile linea di demarcazione a tutta
larghezza, il numero di pagina ben leggibile a destra, e a sinistra tre righe piccole
(Antium · Historia et Memoria; «A cura di Riccardo Pau · Gruppo FAI Anzio-Nettuno»;
© anno e link cliccabile CC BY 4.0). I link interni alle altre sezioni vengono resi come
testo semplice (nel PDF non avrebbero bersaglio); restano cliccabili solo i link esterni.

## Struttura del progetto

Sito statico (HTML/CSS/JS puro) senza build step. GitHub Pages serve la root del repo.

- `index.html` — pagina unica con tab in-page
- `css/style.css` — tutto lo stile, palette FAI (#C8471A arancio + avorio + marrone)
- `js/main.js` — scroll reveal, tab switching, 3D tilt, lightbox
- `img/` — immagini WebP
- `docs/antium-v5.pdf` — documento sorgente

## Convenzioni

- Solo tema chiaro (dark mode rimossa)
- Font: Cormorant Garamond (display) + Inter (body)
- Design token-based: usare sempre `var(--sp-*)`, `var(--r-*)`, `var(--text-*)` ecc.
- Callout: striscia sinistra via `box-shadow: inset 4px 0 0 <colore>` (non ::before)
- Tab: card verticali con icona SVG + numero + nome
- Fonti, bibliografie e crediti grafici sono centralizzati in `fonti.html` (menu Crediti): non duplicare sezioni bibliografiche o liste di fonti nel corpo delle pagine in `sezioni/`.
- **Crediti grafici di sezione: due posti da tenere allineati.** Il popup «Crediti grafici»
  che si apre dalla didascalia di una figura legge il registro `creditsCatalog` in
  `js/main.js` (chiave per pagina, es. `'sezioni/tor-caldara.html'`, con `rows[]` di
  `element/author/note`), **non** `fonti.html`. Quando aggiungi o cambi un'immagine in una
  sezione, aggiorna sia la voce in `creditsCatalog` (per il popup) sia la tabella dei crediti
  grafici in `fonti.html` (per la pagina Crediti): se manca la chiave in `creditsCatalog` il
  popup mostra «Nessun credito grafico specifico registrato per questa sezione».

## Stile editoriale (vincolante per tutto il progetto)

- **Niente trattini lunghi.** Il trattino lungo (`—`, `&mdash;`) è vietato in tutto il testo del sito:
  al suo posto usare virgole, due punti, punto fermo o parentesi, riscrivendo se serve.
  Il trattino corto (`–`) è ammesso **solo** negli intervalli numerici e di pagina
  (1980–1981, IV–II sec., pp. 153–188), mai come pausa nel discorso.
  Unica eccezione: i trattini presenti dentro citazioni testuali «» di fonti, che restano alla lettera.
- **Il registro di riferimento è la home page (`index.html`)**: stessa voce in tutte le sezioni.
  Narrativo, semplice, con ganci e domande lasciate in sospeso; frasi corte alternate a lunghe;
  niente registri da manuale universitario. Regole complete in
  `.claude/skills/fai-guide-rewriter/references/scrittura-umana.md`.
- **Sezioni a colonna unica sotto i 1024px**: su tablet in portrait e mobile il corpo
  dell'articolo e le side-notes/curiosità scorrono uno sotto l'altro, mai affiancati.
  `.article-layout` (e `--media`) è grid a una sola colonna di base: non reintrodurre
  layout a due colonne fuori dalla media query desktop.
  **Eccezione desktop (≥1024px)**: dentro `@media (min-width:1024px)` le pagine di
  `sezioni/` adottano un layout editoriale «a colonna di lettura + rail di note»
  (vedi blocco «REVISIONE UI/UX SEZIONI» in `css/style.css` e `initArticleRail` in
  `js/main.js`):
  - **colonna di lettura** centrata (~74ch) con testo, figure e tabelle
  - **rail sticky a destra** (`<aside class="article-rail">`, larghezza
    `clamp(360px, 32vw, 700px)` — si adatta alla viewport invece di
    restare fisso, per coprire tutta la zona a destra del body)
    che raccoglie TUTTI i callout e il blocco side-notes in un'unica
    sidebar scrollabile. Il rail è `position: fixed` ancorato al
    viewport (JS lo posiziona sotto l'header, accanto al lato destro
    del body); si nasconde solo sopra l'hero e quando il footer sale
    a coprire la sua area. Scrollbar sottilissima in oro (4px),
    hover più visibile; rotella del mouse fa scrollare il rail senza
    propagarsi alla pagina. JS appende il rail a `<body>` per sfuggire
    al `transform` di fade-in dell'articolo (che creerebbe un nuovo
    containing block per `position: fixed`).
  - I callout, le side-notes e le section-endnotes **non devono comparire
    nel flusso centrale del testo**: `initArticleRail` li sposta nel
    rail automaticamente. Non replicare quei box in colonna centrale.
  - Sotto i 1024px il rail non viene creato: i callout restano inline
    come elementi di paragrafo.
- **Figure senza stili inline**: `<figure class="article-figure">` (+ `--narrow` per le strette) con `<figcaption>` nudo. Margini, ombre, raggi e didascalie sono nel CSS centralizzato: non duplicarli inline.
- **Liste con rientro pieno**: `.article-body ul` ha padding-left 1.6rem (rombo dorato interno al margine). Non aggiungere margini negativi.
- **Gerarchia dei titoli (identica in tutte le sezioni)**: `h1` solo nel hero (`.hero-title`);
  `h2` solo per il titolo dell'articolo, **uno per pagina** (`--text-xl`, display, filetto sotto);
  `h3` per le sezioni (`--text-lg`, display corsivo); `h4` per le sottosezioni
  (`--text-md`, display, peso 600). Mai saltare livelli né usare h2 multipli nel corpo.
- **Tipografia uniforme**: la prosa di lettura usa il token `--text-prose`
  (condiviso da `.intro-body p` in home e `.article-body p / ul li` nelle sezioni).
  Non introdurre mai font-size ad hoc per i paragrafi: usare i token.
- **Struttura canonica delle pagine in `sezioni/`** (uniformare sempre a `villa-imperiale.html`):
  - **Wrapper articolo** obbligatorio in entrambe le varianti:
    `<div class="article-layout article-layout--media">` che contiene
    `<div class="article-body article-body--long">`. Non omettere mai nessuna delle
    quattro classi: servono ad attivare il layout a colonna unica sotto i 1024px
    e le note di margine desktop (gutter destro per callout e side-notes).
  - **Hero**: `<section class="hero hero--editorial section-page-hero">` con `hero-bg`,
    `hero-overlay`, `hero-content container`, `hero-title` (h1), `hero-divider`,
    `hero-subtitle`, `hero-meta` (arco cronologico) e
    `hero-actions hero-actions--section-dual` con due `era-card` (Home + PDF).
    Le varianti `hero--fit-viewport`, `hero-copy` e la classe di pagina
    (`*-page-hero`) si aggiungono **solo** quando servono per un fit specifico
    (volsci, antium-guide, tor-caldara): non replicarle a tappeto.
  - **Apertura articolo**: dopo `<h2>` di pagina, **sempre** un `<p class="panel-lede">`
    (sommario narrativo di 1–2 frasi) e, dove la pagina cita una fonte antica
    in esergo, un `<div class="quote-block reveal">` con `quote-text` e `quote-source`.
  - **Figure**: `<figure class="article-figure">` (+ `--narrow` per le strette,
    `--portrait` per le verticali) con `<figcaption>` nudo. Niente stili inline.
  - **Callout** (tre varianti cromatiche, gestite da CSS):
    `callout--curiosita` (icona ✦, arancio, FAI), `callout--critica` (icona ⚑,
    arancio scuro, osservazione/errore storiografico), `callout--suggerimento`
    (icona ◎, oro, "dove andare"). Ogni callout ha sempre
    `<div class="callout-header">` con `<span class="callout-icon">` e
    `<span class="callout-label">`, seguito da `<p class="callout-text">`.
  - **Tabelle**: wrapper `<div class="table-wrap">` con `<table class="data-table">`
    dentro. Intestazione in `<thead>` con `<th>`, corpo in `<tbody>` con `<td>`.
    Sempre la classe `data-table` (uniforma bordi, hover e tipografia).
  - **Blocco "fase"**: quando si scandisce una storia costruttiva in fasi
    (villa imperiale, cisternone, terme), usare `<div class="phase-block">` con
    `<h4>` interno. Le pagine che hanno scansione cronologica lineare
    (vallo, necropoli, volsci) usano solo `h3`/`h4` senza wrapper.
  - **Side-notes finali**: `<aside class="side-notes section-endnotes">`
    con callout di chiusura (riepilogo, dove vedere i reperti, citazioni).
    Sempre `section-endnotes` insieme a `side-notes`: la prima classe attiva
    lo styling di chiusura, la seconda lo stile base del componente.
  - **Pager di sezione**: sempre presente in fondo a ogni pagina canonica
    (`<nav class="section-pager">` con `pager-link--prev` e `pager-link--next`,
    `pager-eyebrow` + `pager-title`). L'ordine canonico è in
    "Pager di sezione e date di aggiornamento" più sotto.
  - **Footer**: `<footer class="simple-footer">` con `.footer-summary` (logo,
    brand-name `ANTIVM`, citazione Cicerone) e `.footer-meta` (autore,
    Gruppo FAI Anzio-Nettuno, rimando a `fonti.html`, licenza CC BY 4.0).
  - **Chiusura standard**: dopo il `</main>` ma prima del `</body>` sempre
    `<div class="lightbox">`, `<button class="back-to-top">` e lo script
    `js/main.js` in `defer`. `<p class="page-updated">` è gestito da
    `scripts/stamp_updates.py`: non aggiornarlo a mano.

## Lemmi: glossario interattivo (ville e termini tecnici)

- Registro centrale in `js/lemmi.js` (`window.ANTIUM_LEMMI`): per ogni voce `eyebrow`,
  `titolo`, `nota` (spiegazione breve) e opzionale `righe` (timeline `[periodo, evento]`,
  usata per le ville che hanno cambiato nome e proprietari).
- Nel testo: `<span class="lemma" data-lemma="id">…</span>` (su `.termine` o `<em>` basta
  aggiungere la classe e il data-attribute). **Solo la prima occorrenza per pagina**,
  mai dentro citazioni «» o didascalie. Popup a pergamena gestito da `js/main.js`.
- **Resa visiva del lemma**: **niente sfondo**. Testo nel colore del corpo (leggibile),
  peso 500, con **sottolineatura a puntini dorata (`--fai-gold`)** offset dal testo, così
  segnala l'interattività senza appesantire la parola (hover/focus: la parola e i puntini
  diventano dorati). Lo stile è centralizzato in `.lemma` (`css/style.css`) e vale
  automaticamente per tutti i lemmi: non applicarlo inline.
  I crosslink tra sezioni restano invece **tratteggiati (dashed) in arancio** con marcatore ◇:
  resa diversa (puntini dorati vs trattini arancio), così non si confondono.
  Voci nuove si aggiungono al registro, mai inline.
- `js/lemmi.js` è caricato dinamicamente con cache-busting `?v=LEMMI_VERSION`. **Dopo
  ogni modifica al registro, aggiorna la costante `LEMMI_VERSION` in `js/main.js`** (data
  odierna), altrimenti i browser continuano a servire la versione vecchia dopo il deploy.
- **Verifica obbligatoria prima del deploy**: ogni `data-lemma` usato nelle pagine deve
  avere la sua voce nel registro, altrimenti la parola appare sottolineata ma il popup non
  si apre. Controlla che l'elenco sia vuoto con:
  ```
  python -c "import re,glob; src=open('js/lemmi.js',encoding='utf-8').read(); keys=set(re.findall(r\"(?m)^  '([\w-]+)':\s*\{\", src)); used=set(); [used.update(re.findall(r'data-lemma=\"([^\"]+)\"', open(f,encoding='utf-8').read())) for f in ['index.html']+sorted(glob.glob('sezioni/*.html'))]; print('Lemmi senza voce:', sorted(used-keys) or 'nessuno')"
  ```

## Pager di sezione e date di aggiornamento

- In fondo a ogni pagina di `sezioni/` c'è un `<nav class="section-pager">` con i link
  «precedente / successiva». L'ordine del percorso è: necropoli-protostoriche → vallo →
  volsci-cicerone-culti → antium-guide → tomba-mulakia → villa-imperiale → teatro-romano →
  monumenti-citta-alta → xystus-terme-citta-alta → cisternone-caffeaus → tor-caldara
  (prima: home; dopo: fonti).
  **Una sezione nuova va inserita nel pager** delle pagine adiacenti.
- Ogni pagina ha `<p class="page-updated">…</p>` riscritto da `scripts/stamp_updates.py`
  (data odierna se il file è modificato, altrimenti l'ultimo commit): non aggiornarlo a mano.

## Gestione immagini

**Ogni immagine deve essere in formato WebP.** Flusso obbligatorio per qualsiasi nuovo file immagine (PNG, JPG, ecc.):

1. Converti in WebP con qualità 82 usando Python + Pillow:
   ```
   python -c "from PIL import Image; Image.open('img/NOME.ext').save('img/NOME.webp', 'WEBP', quality=82, method=6)"
   ```
2. Elimina il file originale **solo dopo** aver verificato che il `.webp` esiste.
3. Usa sempre percorsi relativi `../img/NOME.webp` nei file HTML sotto `sezioni/`.

## Ricerca full-text globale

Il campo di ricerca cerca in **tutte** le sezioni del sito, non solo nella pagina corrente.

- L'indice è in `js/search-index.js` (`window.ANTIUM_SEARCH_INDEX`), **generato** da
  `scripts/build_search_index.py`. Non modificarlo a mano.
- **Dopo ogni modifica al testo** di `index.html` o di una pagina in `sezioni/`,
  rigenera l'indice e stampiglia le date di aggiornamento:
  ```
  python scripts/build_search_index.py
  python scripts/stamp_updates.py
  ```
- Digitando appare un menù a tendina coi risultati raggruppati per sezione. Al click
  si naviga a `sezioni/<pagina>.html?q=<termine>&hit=<N>`: la pagina di destinazione
  evidenzia tutte le occorrenze e scorre esattamente a quella cliccata.
- L'indice è caricato dinamicamente da `js/main.js` (funzione `initSiteSearch`); non
  serve aggiungere `<script>` nelle pagine.


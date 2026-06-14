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
- **Sezioni sempre a colonna unica**: il corpo dell'articolo e le side-notes/curiosità
  scorrono uno sotto l'altro, mai affiancati su due colonne, a qualsiasi larghezza
  (compresi i tablet in portrait). `.article-layout` (e `--media`) è grid a una sola
  colonna nel CSS centralizzato: non reintrodurre layout a due colonne né `grid-template-columns`
  con una colonna laterale nelle pagine di `sezioni/`.
- **Figure senza stili inline**: `<figure class="article-figure">` (+ `--narrow` per le strette) con `<figcaption>` nudo. Margini, ombre, raggi e didascalie sono nel CSS centralizzato: non duplicarli inline.
- **Liste con rientro pieno**: `.article-body ul` ha padding-left 1.6rem (rombo dorato interno al margine). Non aggiungere margini negativi.
- **Gerarchia dei titoli (identica in tutte le sezioni)**: `h1` solo nel hero (`.hero-title`);
  `h2` solo per il titolo dell'articolo, **uno per pagina** (`--text-xl`, display, filetto sotto);
  `h3` per le sezioni (`--text-lg`, display corsivo); `h4` per le sottosezioni
  (`--text-md`, display, peso 600). Mai saltare livelli né usare h2 multipli nel corpo.
- **Tipografia uniforme**: la prosa di lettura usa il token `--text-prose`
  (condiviso da `.intro-body p` in home e `.article-body p / ul li` nelle sezioni).
  Non introdurre mai font-size ad hoc per i paragrafi: usare i token.

## Lemmi: glossario interattivo (ville e termini tecnici)

- Registro centrale in `js/lemmi.js` (`window.ANTIUM_LEMMI`): per ogni voce `eyebrow`,
  `titolo`, `nota` (spiegazione breve) e opzionale `righe` (timeline `[periodo, evento]`,
  usata per le ville che hanno cambiato nome e proprietari).
- Nel testo: `<span class="lemma" data-lemma="id">…</span>` (su `.termine` o `<em>` basta
  aggiungere la classe e il data-attribute). **Solo la prima occorrenza per pagina**,
  mai dentro citazioni «» o didascalie. Popup a pergamena gestito da `js/main.js`.
- **Resa visiva del lemma**: evidenziato con **sfondo dorato (`--fai-gold`) e testo
  quasi nero in grassetto**, così risalta più delle parole normali per la sua importanza
  (hover/focus: sfondo `--fai-gold-l`). Lo stile è centralizzato in `.lemma` (`css/style.css`)
  e vale automaticamente per tutti i lemmi: non applicarlo inline e non sottolinearli.
  I crosslink tra sezioni restano invece tratteggiati in arancio (resa diversa, non confonderli).
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


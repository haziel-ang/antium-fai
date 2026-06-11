# Antium FAI — Note di sviluppo per Claude

## Metodologia di deploy

**Ogni modifica va sempre committata e mergiata in `main`** così da aggiornare
automaticamente il sito su GitHub Pages tramite il workflow in `.github/workflows/deploy.yml`.

### Flusso obbligatorio dopo ogni modifica

1. `git add <file>` + `git commit`
2. `git push -u origin <branch>`
3. Crea PR verso `main` con `mcp__github__create_pull_request`
4. Mergia immediatamente con `mcp__github__merge_pull_request` (squash)
5. GitHub Actions esegue il deploy automatico — nessun passo manuale

Branch di sviluppo: `claude/github-pages-deployment-Nbrty`

## Struttura del progetto

Sito statico (HTML/CSS/JS puro) senza build step. GitHub Pages serve la root del repo.

- `index.html` — pagina unica con tab in-page
- `css/style.css` — tutto lo stile, palette FAI (#C8471A arancio + avorio + marrone)
- `js/main.js` — scroll reveal, tab switching, 3D tilt, lightbox
- `img/` — immagini WebP (fanciulla-anzio, arco-muto, caffeaus)
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
- **Figure senza stili inline**: `<figure class="article-figure">` (+ `--narrow` per le strette) con `<figcaption>` nudo. Margini, ombre, raggi e didascalie sono nel CSS centralizzato: non duplicarli inline.
- **Liste con rientro pieno**: `.article-body ul` ha padding-left 1.6rem (rombo dorato interno al margine). Non aggiungere margini negativi.
- **Tipografia uniforme**: la prosa di lettura usa il token `--text-prose`
  (condiviso da `.intro-body p` in home e `.article-body p / ul li` nelle sezioni).
  Non introdurre mai font-size ad hoc per i paragrafi: usare i token.

## Gestione immagini

**Ogni immagine deve essere in formato WebP.** Flusso obbligatorio per qualsiasi nuovo file immagine (PNG, JPG, ecc.):

1. Converti in WebP con qualità 82 usando Python + Pillow:
   ```
   python -c "from PIL import Image; Image.open(r'img\NOME.ext').save(r'img\NOME.webp', 'WEBP', quality=82, method=6)"
   ```
2. Elimina il file originale (`Remove-Item img\NOME.ext -Force`) **solo dopo** aver verificato che il `.webp` esiste.
3. Usa sempre percorsi relativi `../img/NOME.webp` nei file HTML sotto `sezioni/`.

## Ricerca full-text globale

Il campo di ricerca cerca in **tutte** le sezioni del sito, non solo nella pagina corrente.

- L'indice è in `js/search-index.js` (`window.ANTIUM_SEARCH_INDEX`), **generato** da
  `scripts/build_search_index.py`. Non modificarlo a mano.
- **Dopo ogni modifica al testo** di `index.html` o di una pagina in `sezioni/`,
  rigenera l'indice:
  ```
  python scripts/build_search_index.py
  ```
- Digitando appare un menù a tendina coi risultati raggruppati per sezione. Al click
  si naviga a `sezioni/<pagina>.html?q=<termine>&hit=<N>`: la pagina di destinazione
  evidenzia tutte le occorrenze e scorre esattamente a quella cliccata.
- L'indice è caricato dinamicamente da `js/main.js` (funzione `initSiteSearch`); non
  serve aggiungere `<script>` nelle pagine.


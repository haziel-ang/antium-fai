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

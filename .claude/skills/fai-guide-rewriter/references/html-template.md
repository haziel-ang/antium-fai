# Template HTML

Output finale: un unico file HTML, codifica **UTF-8 con BOM**. Puoi partire da `assets/guida-template.html` (stesso CSS già pronto) e riempirlo. Box: ✦ Curiosità → `<div class="curiosita">`, ⚑ Nota critica → `<div class="nota">`.

## `<head>` minimo
```html
<!DOCTYPE html>
<html lang="it" style="background:#ffffff !important;color:#1a1a1a !important;color-scheme:light only !important">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light only">
  <title>[TITOLO GUIDA]</title>
  <style> /* CSS sotto */ </style>
</head>
<body style="background:#ffffff !important;color:#1a1a1a !important;color-scheme:light only !important">
  <!-- titolo, sottotitolo, blockquote anchor, sezioni, box, figure, tabelle, footer -->
</body>
</html>
```

## CSS completo
```css
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500&display=swap');

/* Guardia anti-dark-mode iOS — a 3 livelli, obbligatoria.
   Senza, su iPhone in tema scuro Safari ribalta testo e sfondo e la guida diventa illeggibile.
   Livello 1: <meta name="color-scheme" content="light only"> nel <head>.
   Livello 2: stile inline su <html> e <body> (vedi scheletro sopra).
   Livello 3: le regole CSS qui sotto + il blocco @media (prefers-color-scheme: dark) in fondo. */
:root{color-scheme:light only}
html,body{background:#ffffff !important;color:#1a1a1a !important;color-scheme:light only !important}

body{font-family:'EB Garamond',Georgia,serif;font-size:1.125rem;line-height:1.75;color:#1a1a1a;background:#fff;max-width:780px;margin:0 auto;padding:2rem 1.5rem 4rem}
h1,h2,h3{font-family:'EB Garamond',Georgia,serif;font-weight:600;line-height:1.2}
h1{font-size:2.2rem;margin-bottom:.4rem}
h2{font-size:1.5rem;margin-top:2.5rem;margin-bottom:.75rem;border-bottom:1px solid #e0d5c5;padding-bottom:.3rem}
h3{font-size:1.1rem;margin-top:0;margin-bottom:.5rem}
p{margin:0 0 1rem}
blockquote{border-left:3px solid #8B6914;padding-left:1rem;color:#555;font-style:italic;margin:1.5rem 0}
table{width:100%;border-collapse:collapse;font-family:'Inter',sans-serif;font-size:.9rem;margin:1.5rem 0}
th{background:#f5f0e8;text-align:left;padding:.6rem .8rem;border-bottom:2px solid #c9b98a}
td{padding:.5rem .8rem;border-bottom:1px solid #e8e0d0;vertical-align:top}

/* box Curiosità — verde tenue */
.curiosita{background:#f0f7f0;border-left:4px solid #3a7d44;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 4px 4px 0}
.curiosita h3{color:#2d6236;margin-top:0}
/* box Nota critica — oro tenue */
.nota{background:#fdf8ec;border-left:4px solid #8B6914;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 4px 4px 0}
.nota h3{color:#6b4f10;margin-top:0}
/* separatore interno ai box raggruppati */
hr.sep{border:none;border-top:1px solid #c8ddc8;margin:1rem 0}
.nota hr.sep{border-top-color:#d4b96a}

/* figure: immagine + didascalia + crediti (usate dallo script inserisci_figure.py) */
figure{margin:1.8rem 0;text-align:center}
figure img{max-width:100%;height:auto;border-radius:4px}
figcaption{font-family:'Inter',sans-serif;font-size:.85rem;color:#666;line-height:1.5;margin-top:.5rem}
figcaption .credito{display:block;font-size:.78rem;color:#999;margin-top:.2rem}

.footer{margin-top:4rem;padding-top:1.5rem;border-top:1px solid #e0d5c5;text-align:center;font-family:'Inter',sans-serif;font-size:.85rem;color:#777;line-height:1.7}

@media print{
  @page{size:A4;margin:2cm}
  html,body{background:#fff;color:#000}
  body{max-width:none;font-size:11pt;padding:0}
  h2,h3{break-after:avoid}
  .curiosita,.nota,blockquote,table,tr,figure{break-inside:avoid}
  .curiosita,.nota{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}

/* Livello 3 della guardia anti-dark-mode: ri-forza i colori quando il sistema è in tema scuro */
@media (prefers-color-scheme: dark){
  html,body{background:#ffffff !important;color:#1a1a1a !important}
  h1,h2,h3,p,li,td,th,blockquote,figcaption,em{color:#1a1a1a !important}
  .sottotitolo{color:#6b5d45 !important}
  .curiosita{background:#f0f7f0 !important}.curiosita h3{color:#2d6236 !important}
  .nota{background:#fdf8ec !important}.nota h3{color:#6b4f10 !important}
  th{background:#f5f0e8 !important}blockquote{color:#555 !important}.footer{color:#777 !important}
}
```

## Footer (in fondo al body)
```html
<div class="footer">
  FAI — Fondo Ambiente Italiano · [ATTRIBUZIONE PASSO 0]<br>
  A cura di [NOME/I PASSO 0]<br>
  © [ANNO] · CC BY 4.0
</div>
```

## Pubblicazione (da iPhone)
Cartella con `index.html` + cartella `images/` → zip → caricamento su Vercel (vercel.com/new, trascina lo zip) o GitHub Pages. Tieni la guida autonoma: un solo HTML più le immagini.

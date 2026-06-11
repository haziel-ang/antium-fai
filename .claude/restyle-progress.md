# Registro di avanzamento — uniformazione stile e tipografia

Obiettivo: tipografia identica home/sezioni (token `--text-prose`), zero trattini
lunghi in tutto il sito (sostituiti con virgole/due punti/punto/parentesi, mai
toccando le citazioni «» delle fonti), registro uniforme con la home come riferimento.

Se il lavoro si interrompe, riprendere dal primo elemento non spuntato.

## Infrastruttura
- [x] CSS: token `--text-prose` condiviso (`.intro-body p`, `.article-body p`, `.article-body ul li`) + media query mobile unificata
- [x] CLAUDE.md: sezione «Stile editoriale» (no trattini lunghi, home come registro, tipografia token)
- [x] Skill SKILL.md: guardrail no-trattini + voce unica
- [x] Skill references/scrittura-umana.md: regola trattini resa assoluta

## Bonifica trattini + allineamento stile (un file alla volta)
- [x] index.html (18): bonificata, 0 residui
- [x] sezioni/villa-imperiale.html (84): bonificata, 0 residui
- [x] sezioni/vallo.html (45): bonificata, 0 residui
- [x] sezioni/volsci-cicerone-culti.html (33): bonificata, 0 residui
- [x] sezioni/teatro-romano.html (31): bonificata + alleggerito il paragrafo sul declino
- [x] sezioni/antium-guide.html (23): bonificata, 0 residui
- [x] sezioni/xystus-terme-citta-alta.html (13): bonificata, 0 residui
- [x] sezioni/tomba-mulakia.html (13): bonificata, 0 residui
- [x] sezioni/cisternone-caffeaus.html (10): bonificata, 0 residui
- [x] sezioni/monumenti-citta-alta.html (6): bonificata, 0 residui
- [x] sezioni/necropoli-protostoriche.html (5): bonificata, 0 residui
- [x] fonti.html (40, separatore ·) / pdf.html (0) / podcast.html (0)

## Chiusura
- [x] Rigenerare js/search-index.js
- [x] Verifica finale: `grep -rn "—\|&mdash;" index.html sezioni/ fonti.html` deve restituire solo citazioni «» o intervalli legittimi
- [x] Commit + PR + merge in main

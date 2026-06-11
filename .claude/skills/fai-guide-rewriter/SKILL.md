---
name: fai-guide-rewriter
description: Riscrive guide culturali di archeologia, storia e cultura locale (FAI, Gruppo Anzio-Nettuno e Delegazione di Roma) in stile narrativo con tecniche di neuromarketing, in italiano accessibile a tutti — non da manuale universitario. Usa SEMPRE questa skill quando l'utente chiede di riscrivere, narrativizzare o "rendere più scorrevole" una guida o un testo storico/archeologico; quando carica un PDF o un documento storico da trasformare in guida; quando vuole inserire immagini prese da un tomo dentro una guida (con didascalie e crediti); quando vuole integrare una fonte o un tomo scoperto dopo dentro una guida già esistente; o quando chiede lo script podcast "Istantànee di Stòria". Si attiva anche solo se nomina Antium, Anzio, Nettuno, una guida FAI, o "riscrivi questa guida".
---

# Riscrittura guide culturali FAI

Trasformi un testo storico/archeologico corretto in una guida che prende il lettore dalla prima riga, **senza toccare il contenuto scientifico**. Cambi la consegna, non i fatti. Il pubblico non sono universitari: sono ragazzi, anziani, eruditi e muratori. Linguaggio semplice, narrazione che aggancia, rigore intatto sotto la superficie.

## PASSO 0 — l'unica domanda, sempre per prima

Prima di qualsiasi cosa, chiedi l'attribuzione e aspetta la risposta:

1. Gruppo FAI Anzio-Nettuno — a cura di Riccardo Pau
2. Delegazione FAI di Roma — a cura di Riccardo Pau e Vittorio Gamba

Non fare altre domande. L'attribuzione va **solo nel footer**, mai prima del titolo.

## Comandi che riconosci

- "Riscrivi questa guida" → riscrittura completa (flusso sotto).
- "Riscrivi questa guida e aggiungi lo script podcast" → riscrittura + leggi `references/podcast.md`.
- "Analizza il documento e dimmi quali pattern userai" → analisi, senza riscrivere.
- "Riscrivi solo la sezione [nome]" → intervieni solo lì, in Markdown.
- "Aggiorna la guida con questo tomo/fonte: …" → flusso di integrazione (vedi sotto).
- "Aggiungi le immagini del tomo" → flusso immagini (vedi sotto).

## Flusso di riscrittura

1. **Analisi interna** (non mostrarla). Individua: la struttura, i dati filologici da salvare alla lettera (citazioni «», datazioni, fonti con anno/pagina, note critiche ⚑), le immagini, e il dato più forte e verificabile di tutto il testo: sarà l'anchor.
2. **Applica i 7 pattern** di neuromarketing → `references/neuromarketing.md`.
3. **Scrivi in italiano per tutti** seguendo le regole anti-AI e di registro → `references/scrittura-umana.md`. È la parte che decide se la guida "prende subito": leggila ogni volta.
4. **Produci l'HTML completo** con il template → `references/html-template.md` (o parti da `assets/guida-template.html`).
5. **Inserisci immagini** se opportuno → `references/immagini.md`.
6. **Footer** con l'attribuzione del PASSO 0, © anno, CC BY 4.0.

Leggi i file di riferimento man mano che ti servono, non tutti in una volta.

## Struttura del documento finale

```
# TITOLO NARRATIVO (una frase, mai "X · Guida culturale")
### Sottotitolo evocativo
> Citazione anchor presa dall'originale
## APERTURA — [nome evocativo]
## [sezioni con titoli narrativi]
   box ✦ Curiosità  /  box ⚑ Nota critica
## [Un invito concreto a camminare/vedere il luogo oggi]
## Corrispondenze tra ieri e oggi   [tabella]
## Cronologia storica   [tabella: Data / Evento / Fonte]
### Bibliografia   [riprodotta integralmente dall'originale]
[footer]
```

## Regole inviolabili (guardrail)

Queste non si negoziano, nemmeno se rendono il testo meno "brillante":

- Le citazioni «» restano alla lettera. Mai parafrasarle.
- Le note critiche ⚑ si preservano e si arricchiscono. Mai eliminarle.
- Il FAI non compare **mai** tra le fonti. Fonti ammesse: accademiche, istituzionali, archivistiche (Treccani sì; Wikipedia, blog, portali turistici no). Un dato non verificabile lo segnali in ⚑ o lo ometti.
- **Nessun dato, data, citazione, didascalia o credito viene inventato** per rendere il testo più efficace. L'anchor è sempre un fatto reale del documento.
- I rimandi alle fonti (Livio II, 63; Dionigi IX, 56…) escono dal corpo del racconto e vivono nella cronologia e in bibliografia. Dentro la frase frenano la lettura.
- **Niente trattini lunghi (`—`, `&mdash;`), mai.** Incisi con le virgole o le parentesi, spiegazioni con i due punti, stacchi col punto fermo. Il trattino corto (–) solo negli intervalli numerici. Eccezioni: citazioni «» alla lettera e script podcast. (Dettagli in `references/scrittura-umana.md`.)
- **Una sola voce per tutto il progetto**: il registro di riferimento è la home (`index.html`). Ogni sezione nuova o aggiornata deve suonare come la home, e la prosa di lettura usa il token tipografico `--text-prose`, identico in home e sezioni.
- **Solo modalità chiara.** La guida non deve mai adattarsi al tema scuro: su iPhone diventa illeggibile. Applica sempre la guardia anti-dark-mode a 3 livelli del template (meta `color-scheme: light only` nel `<head>`; stile inline su `<html>` e `<body>`; blocco CSS `@media (prefers-color-scheme: dark)` che ri-forza i colori con `!important`). Vedi `references/html-template.md`.

## Revisione finale (obbligatoria prima della consegna)

Prima di consegnare o pubblicare, esegui questi controlli. Sono meccanici: falli davvero, non a memoria.

1. **Trattini**: `grep -n "—\|&mdash;"` sul file deve restituire zero (salvo citazioni «» e intervalli con –).
2. **Parole-spia**: `grep -in "onest\|fondamentale\|straordinari\|affascinante\|cruciale\|suggestiv\|prestigios"` deve restituire zero fuori dalle citazioni. La lista completa è in `references/scrittura-umana.md`.
3. **Tipografia**: nessun `font-size` inline nei paragrafi (solo token `--text-prose` e simili); nessuno stile inline su `<figure>`, `<img>` di figura o `<figcaption>` (esistono le classi `.article-figure`, `.article-figure--narrow`).
4. **Sito Antium**: dopo ogni modifica al testo, rigenera l'indice di ricerca (`python scripts/build_search_index.py`).
5. **Lettura ad alta voce** di apertura e chiusura: se suonano da manuale o da AI, riscrivile prima di consegnare.

## Box: composizione

- **✦ Curiosità** → `<div class="curiosita">`, titolo interno `### ✦ Curiosità · [titolo]`. Se due curiosità consecutive trattano lo stesso tema, fondile in un box solo con `<hr class="sep">` tra i blocchi.
- **⚑ Nota critica** → `<div class="nota">`, titolo interno `### ⚑ Nota critica · [titolo]`. Non raggrupparle mai, né tra loro né con le curiosità.

## Flusso immagini (dal tomo alla guida)

Quando l'utente vuole le immagini di un tomo PDF dentro la guida. Gira tutto qui dentro: l'utente carica il PDF, tu esegui gli script, restituisci la guida con le figure.

1. Estrai con lo script:
   ```
   python scripts/estrai_immagini.py TOMO.pdf --out figure --pagine 1-40 \
       --credito "Fonte/digitalizzazione, DOI se c'è" --min-lato 200
   ```
   Produce le immagini + `manifest.json`/`manifest.csv`: una scheda con didascalia candidata (grezza, da correggere) e credito.
2. **Rivedi la scheda con l'utente.** Le didascalie candidate sono testo pescato vicino all'immagine: vanno corrette. I crediti vanno confermati. Non scrivere come didascalia fatti che non puoi verificare.
3. Nella guida metti un segnaposto dove va ogni figura, su una riga sua: `{{FIG:3}}`.
4. Inserisci:
   ```
   python scripts/inserisci_figure.py guida.html figure/manifest.json \
       --img-src figure --out guida_finale.html
   ```
   Sostituisce i segnaposto con `<figure>` completi (didascalia + crediti), copia le immagini in `images/` accanto alla guida, mantiene il BOM UTF-8.

Regole editoriali sulle immagini (quando metterle, quante, come scriverle) → `references/immagini.md`.

## Flusso di integrazione (un tomo scoperto dopo)

Quando arriva una fonte nuova da innestare in una guida **già esistente**. Non riscrivere da zero.

1. Leggi la guida padre e la fonte nuova. Tieni il tono e la struttura della guida padre.
2. Innesta solo le informazioni nuove, nel punto tematicamente giusto. Se la fonte nuova porta un dato più forte dell'anchor attuale, valuta se promuoverlo (e dillo all'utente).
3. Aggiungi la fonte alla bibliografia, in coda, **senza** distinguere graficamente le voci vecchie dalle nuove.
4. Se la fonte porta immagini, usa il flusso immagini sopra.
5. **Segnala all'utente cosa è cambiato**: elenca le aggiunte e gli eventuali punti dove la nuova fonte corregge o mette in tensione la vecchia. Le tensioni tra fonti non si nascondono: si raccontano (spesso in una ⚑).

## Nota sul flusso da iPhone

L'utente lavora da iPhone: gli script non girano sul telefono, girano qui in Claude. Lui carica il PDF e scarica i risultati. Quando consegni la guida finale per la pubblicazione (cartella con `index.html` + `images/` → zip → Vercel), tienila autonoma: tutto in un file HTML più la cartella immagini.

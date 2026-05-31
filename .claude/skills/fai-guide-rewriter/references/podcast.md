# Script podcast — "Istantànee di Stòria" (ElevenLabs v3)

Si attiva col comando "Riscrivi questa guida e aggiungi lo script podcast". Valgono anche le regole di registro e anti-AI di `references/scrittura-umana.md`. L'attribuzione del PASSO 0 determina i crediti di chiusura.

## Intro fissa (obbligatoria, sempre identica)
```
Benvenuti a
[sound of camera shutter click]
Istantànee di Stòria: il passàto, un minùto alla volta.
[pause]
[1-2 righe di aggancio tematico. Nessun luogo nominato nell'intro.]
```
Mai ripetere la frase-tagline dell'intro nella chiusura. (Verifica che `[sound of camera shutter click]` renda in v3; se no, spostalo in post-produzione.)

## Limiti e formato
- Massimo 5.000 caratteri totali (testo + tag). Punta a ~4.500 reali: i numeri scritti per esteso gonfiano il conteggio.
- Se il documento è lungo, scegli le 3-4 scene più forti (apertura, rivelazione centrale, tracciato oggi, chiusura). Non riassumere: approfondisci quelle, taglia il resto.
- Output in `.md`. Separatore tra guida e script: due blocchi di tre trattini.

## Tag ElevenLabs v3
Niente SSML `<break>`: non è supportato in v3. Per le pause usa:
- pausa breve: `—` (em-dash); per una più lunga si concatenano più trattini;
- pausa media prima di una rivelazione: `[short pause]`;
- pausa lunga (max 2-3 per script): `[long pause]`.

Tag espressivi (max 1-2 per paragrafo): `[serious tone]` o `[reflective]` in apertura; `[awe]` o `[dramatic tone]` al climax; `[slows down]` sulla frase chiave; `[matter-of-fact]` per il tono presente; `[reflective]`/`[continues softly]` in chiusura; reazioni `[sighs]`, `[inhales]`, `[hesitates]`.

Note d'uso: i tag non sono case-sensitive; un tag a inizio riga dà il tono all'intera riga. Il modello li interpreta a senso: verifica alla prima generazione e, se la voce non reagisce, ripiega sulla punteggiatura. Non accostare due tag senza testo in mezzo. Non abusarne.

## Pronuncia (voce AI italiana)
**Tutti i numeri per esteso**, non solo i romani: "338 a.C." → "trecentotrentotto avanti Cristo"; "XI sec." → "undicesimo secolo"; "4 km" → "quattro chilometri".
Termini latini: respelling italiano senza sillabazione puntata (la voce legge i trattini come pause): "damnatio memoriae" → "damnàzio memòrie". Verifica alla prima generazione.
Accenti su parole ambigue: Àntium, màcco, Vòlsci; città, già, può, è, né, lì, sì.
Nomi studiosi per esteso: "Lugli" non "G. Lugli"; "Egidi e Guidi" non "Egidi-Guidi".

## Struttura
```
[INTRO FISSA]
[serious tone] FRASE APERTURA — paradosso o domanda, max 2 righe.
[short pause]
PARAGRAFO 1 — contesto. "Siamo nel…", "Immagina di…". Frasi brevi.
— [reflective] FRASE PIVOT — la posta in gioco emotiva.
[short pause]
PARAGRAFO 2 — prima rivelazione. Chiudi il primo filo.
[slows down] FRASE CHIAVE — la rivelazione, dizione lenta.
[short pause]
PARAGRAFO 3 — dove trovarlo oggi. [matter-of-fact]
[awe] FRASE CLIMAX — la vertigine temporale.
[long pause]
[reflective] CHIUSURA — domanda aperta, immagine concreta. Max 2 righe.
[CREDITI]
```

## Crediti di chiusura (dal PASSO 0)
- A) Riccardo Pau e Vittorio Gamba, Delegazione FAI di Roma.
- B) Riccardo Pau, Gruppo FAI Anzio-Nettuno.

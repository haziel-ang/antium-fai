# Script podcast: "Istantànee di Stòria" (ElevenLabs v3)

Si attiva col comando "Riscrivi questa guida e aggiungi lo script podcast". Valgono **tutte** le regole di `references/scrittura-umana.md`: qui sotto c'è solo come si adattano all'ascolto, più quello che vale solo per l'audio. L'attribuzione del PASSO 0 determina i crediti di chiusura. Aggiornato il 27/11/2026 sulle regole di scrittura più recenti (chiusure, mosse del divulgatore, varietà) e su quello che il podcast di Wanderlust ha insegnato su pronuncia e crediti.

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

## Non è la guida letta a voce

L'errore più facile è ripetere la pagina web frase per frase, con la stessa chiusura: è la sezione letta ad alta voce, non un racconto (a Wanderlust la prima versione di un episodio è stata scartata proprio per questo). Lo script ha un taglio suo: entra da un'altra porta (una persona, un oggetto, un giorno preciso), segue un filo solo e lascia fuori il resto. Gli stessi fatti verificati, ma nessuna frase identica alla sezione.

## La voce, adattata all'ascolto

- **Qualcuno dentro.** Ogni scena ha una persona che agisce, o l'ascoltatore messo sul posto, o un dettaglio che si sente con un senso. **Storia dal basso**: se la fonte lo dà, chi lavorava lì (gli operai dell'Italcable, i cavatori, i marinai) entra nel racconto accanto al cardinale e all'imperatore.
- **Come lo sappiamo.** Almeno una volta l'ascoltatore sente la prova, non solo il fatto: lo strato, la lapide, la lettera, il disegno d'archivio («quel disegno, chiuso in archivio, diventa la chiave per separare le epoche»). Si nomina la cosa; l'autore solo se è un personaggio della storia (Lanciani che disegna, Antonielli che scrive). Mai rimandi bibliografici a voce.
- **Le lacune si dicono.** «Non sappiamo chi la costruì» suona come una persona; un'ipotesi si dichiara come tale o si toglie.
- **Dal dettaglio al quadro.** Si parte stretti; entro la seconda scena il dettaglio dice perché conta per la storia di Anzio. Con un fatto, mai con un giudizio di importanza.
- **Una domanda vera**, al massimo una che anticipa l'obiezione, nel punto in cui l'ascoltatore se la sta facendo. Mai una formula fissa.
- **Leggerezza misurata**: un paragone di oggi o un'ironia sulle cose, una per episodio al massimo.
- **La prima persona del curatore** solo con esperienze vere fornite dall'utente: mai inventarle.

## Il respiro

Si scrive per l'orecchio: ogni frase si dice in un fiato. Frasi corte, ma non tutte uguali: il ritmo regolare stanca l'ascolto ancora più della lettura. Mai tre frasi di fila tra 17 e 23 parole. Una frase lunga ben costruita, tra due brevi, tiene l'attenzione meglio di dieci frasi da dieci parole.

## Apertura e chiusura

**L'apertura** (dopo l'intro fissa) parte da una persona, un gesto, una data secca o un fatto che stona. Non da una definizione, e non da formule fisse come «Siamo nel…» o «Immagina di…»: ripetute di episodio in episodio diventano la firma della serie.

**La chiusura aggiunge, non riassume.** Le regole sono quelle della sezione 3 di `scrittura-umana.md`, e nell'audio pesano di più, perché l'ultima frase è quella che resta in testa:

- **Prova della cancellazione**: togli l'ultima scena. Se l'ascoltatore non perde nessuna informazione, era un riassunto: via, e chiude la scena prima.
- **L'ultima frase porta qualcosa di nuovo**: un dettaglio tenuto da parte, una conseguenza che arriva fino a oggi, una citazione, una domanda che le fonti lasciano davvero aperta. Vale la chiusura circolare, se torna all'immagine d'apertura con un fatto che allora mancava. Il fatto nuovo deve stare nelle fonti.
- **Niente elenco riepilogativo** («Una cisterna che… Un padiglione che… Una torretta che…») e **niente morale** («Chi cammina in quel giardino, cammina anche qui»).
- **Formule consumate**, da non usare: «La prossima volta che…», «Fai una prova», «pensa a…» / «immagina…», «sotto i (tuoi) piedi», «Pochi luoghi/edifici…», «è ancora lì», «non si vede niente, ma c'è tutto», «e capisci perché».
- **I finali si ascoltano in serie**: prima di chiudere rileggi le chiusure degli altri script in `podcast/`. Se usano la stessa mossa, cambiala.

## Tag ElevenLabs v3

Niente SSML `<break>`: non è supportato in v3. **Niente trattini lunghi nemmeno come pausa**: il divieto vale anche qui (e la trascrizione dello script finisce sotto gli occhi di qualcuno). Per le pause usa:
- pausa breve: la punteggiatura (virgola, punto, due punti) oppure `[short pause]`;
- pausa media prima di una rivelazione: `[pause]`;
- pausa lunga (max 2-3 per script): `[long pause]`.

Tag espressivi (max 1-2 per paragrafo): `[serious tone]` o `[reflective]` in apertura; `[awe]` o `[dramatic tone]` al climax; `[slows down]` sulla frase chiave; `[matter-of-fact]` per il tono presente; `[reflective]`/`[continues softly]` in chiusura; reazioni `[sighs]`, `[inhales]`, `[hesitates]`. Anche i tag si leggono in serie: se tutti gli episodi aprono con `[serious tone]` e chiudono con `[reflective]`, cambia.

Note d'uso: i tag non sono case-sensitive; un tag a inizio riga dà il tono all'intera riga. Il modello li interpreta a senso: verifica alla prima generazione e, se la voce non reagisce, ripiega sulla punteggiatura. Non accostare due tag senza testo in mezzo. Non abusarne.

## Pronuncia (voce AI italiana)
**Tutti i numeri per esteso**, non solo i romani: "338 a.C." → "trecentotrentotto avanti Cristo"; "XI sec." → "undicesimo secolo"; "4 km" → "quattro chilometri".
Termini latini: tradotti, spiegati in poche parole o tolti, come nel testo scritto. Se uno resta, respelling italiano senza sillabazione puntata (la voce legge i trattini come pause): "damnatio memoriae" → "damnàzio memòrie".
Accenti su parole ambigue: Àntium, màcco, Vòlsci; città, già, può, è, né, lì, sì. L'accento grafico va solo dove serve davvero: uno script pieno di accenti forzati è più difficile da rileggere e non suona meglio.
Nomi studiosi per esteso: "Lugli" non "G. Lugli"; "Egidi e Guidi" non "Egidi-Guidi".

**Scheda di pronuncia, prima di generare.** La voce legge quello che trova e non verifica niente, e ogni generazione spende crediti. Prima dell'audio passa lo script parola per parola e annota in fondo, sotto lo script, ogni parola a rischio (nomi propri, toponimi, parole in *-ia*/*-io*, sdrucciole, latino e greco): accento, fonte consultata (dizionario di pronuncia, Treccani), e la scelta fatta (lasciata, accento forzato nel testo, sostituita con una parafrasi). Nel dubbio vero, parafrasi: non un'ipotesi. **Nessuna generazione di prova** per sentire come suona una parola. Le forzature che servono in più episodi vanno nel dizionario di pronuncia dell'utente su ElevenLabs, «Storia e FAI - Anzio Nettuno», invece che riscritte a mano ogni volta.

## Struttura
```
[INTRO FISSA]
[tono] APERTURA: persona, gesto, data secca o fatto che stona. Max 2 righe.
[short pause]
SCENA 1: il contesto, con qualcuno dentro. Frasi da un fiato.
[reflective] FRASE PIVOT: la posta in gioco.
[pause]
SCENA 2: la prima rivelazione, con la prova (come lo sappiamo). Chiudi il primo filo.
[slows down] FRASE CHIAVE: la rivelazione, dizione lenta.
[pause]
SCENA 3: dove trovarlo oggi. [matter-of-fact]
[awe] FRASE CLIMAX: la vertigine temporale.
[long pause]
[tono] CHIUSURA: un fatto nuovo, mai un riassunto né una morale. Max 2 righe.
[CREDITI]
```
Lo schema è un aiuto, non uno stampo: se due episodi vicini hanno le stesse mosse negli stessi punti, cambiane una.

## Prima di consegnare
1. Togli i tag e passa il testo al controllo automatico, che deve uscire senza rossi:
   ```
   sed -e 's/\[[^]]*\]//g' podcast/<script>.md | node .claude/skills/fai-guide-rewriter/scripts/controlla-testo.mjs -
   ```
2. Conta i caratteri (testo + tag) e resta sotto 5.000.
3. Rileggi gli accenti grafici uno per uno (`è`, `più`, `può`, `già`, `perché`, `città`).
4. Consegna con l'elenco delle parole forzate o sostituite, così il primo ascolto è mirato.

## Crediti di chiusura (dal PASSO 0)
- A) Riccardo Pau e Vittorio Gamba, Delegazione FAI di Roma.
- B) Riccardo Pau, Gruppo FAI Anzio-Nettuno.

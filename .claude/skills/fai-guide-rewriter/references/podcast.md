# Script podcast: "Istantanee di Storia" (ElevenLabs v3)

Si attiva col comando "Riscrivi questa guida e aggiungi lo script podcast". Valgono **tutte** le regole di `references/scrittura-umana.md`: qui sotto c'è solo come si adattano all'ascolto, più quello che vale solo per l'audio. L'attribuzione del PASSO 0 determina i crediti di chiusura. Aggiornato il 27/11/2026 sulle regole di scrittura più recenti (chiusure, mosse del divulgatore, varietà) e su quello che il podcast di Wanderlust ha insegnato su pronuncia e crediti.

## Intro fissa (obbligatoria, sempre identica)
```
Benvenuti a
[sound of camera shutter click]
Istantàne-e di Storia: il passato, un minuto alla volta.
[pause]
[1-2 righe di aggancio tematico. Nessun luogo nominato nell'intro.]
```
«Istantàne-e» è scritto così apposta, solo per la voce (il titolo della serie resta «Istantanee di Storia»): scelta dell'utente del 27/11/2026 dopo diverse prove d'ascolto. Scritta «Istantanee» o «Istantànee», la voce mette l'accento sulla prima delle due e (istantanèe); con la «e» staccata («Istantàne e») l'accento cade giusto ma si sente una parola in più. Il trattino corto tiene l'accento su «-tà-» e lega la «e» finale (va bene anche l'apostrofo, «Istantàne'e»). Unico caso in cui un trattino nel parlato è voluto. Nessun altro accento grafico nella frase: su «Stòria», «passàto» e «minùto» la voce storpiava tutto. Mai ripetere la frase-tagline dell'intro nella chiusura. (Verifica che `[sound of camera shutter click]` renda in v3; se no, spostalo in post-produzione.)

## Voce e generazione (decisione dell'utente del 27/11/2026)

Tutti i podcast di Antium si fanno con questa skill e con la voce della puntata della Necropoli, «Altro che Volsci!»: **Jarnathan - warm, confident, versatile** (`c6SfcYrb2t09NHXiT80T`), modello `eleven_v4`, italiano, stability 0,5, similarity 0,8, style 0,2, speaker boost attivo, mp3 mono 64 kbps, poi livellamento (sezione «Volume costante»). Le puntate già pubblicate con altre voci si riscrivono e si rigenerano.

- **Pronunce**: la chiave API della VPS non può leggere i dizionari ElevenLabs. Prima di generare si applicano al testo, come sostituzioni, gli alias del dizionario «Storia e FAI - Anzio Nettuno» che compaiono nello script: è quello che farebbe il dizionario.
- **Crediti**: piano Starter, 40.000 caratteri al mese. Prima di un lotto controlla quanti ne restano e dillo all'utente: una puntata costa 3.500-4.500 caratteri.
- **Dove vanno**: script e mp3 in `podcast/` (`podcast-antium-<sezione>.md`, `<sezione>.mp3`). Le puntate si ascoltano su Spotify, dove le carica l'utente: la pagina `podcast.html` rimanda agli episodi Spotify.

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

Tag espressivi (max 1-2 per paragrafo): `[serious tone]` o `[reflective]` in apertura; `[awe]` o `[dramatic tone]` al climax; `[slows down]` sulla frase chiave; `[matter-of-fact]` per il tono presente; `[reflective]` in chiusura; reazioni `[sighs]`, `[inhales]`, `[hesitates]`. Anche i tag si leggono in serie: se tutti gli episodi aprono con `[serious tone]` e chiudono con `[reflective]`, cambia.

Note d'uso: i tag non sono case-sensitive; un tag a inizio riga dà il tono all'intera riga. Il modello li interpreta a senso: verifica alla prima generazione e, se la voce non reagisce, ripiega sulla punteggiatura. Non accostare due tag senza testo in mezzo. Non abusarne.

## Pronuncia (voce AI italiana)
**Tutti i numeri per esteso**, non solo i romani: "338 a.C." → "trecentotrentotto avanti Cristo"; "XI sec." → "undicesimo secolo"; "4 km" → "quattro chilometri".
Termini latini: tradotti, spiegati in poche parole o tolti, come nel testo scritto. Se uno resta, si legge con la **pronuncia scolastica italiana** (scelta dell'utente del 27/11/2026): c e g dolci davanti a e/i, *ae* e *oe* = e, *ti* + vocale = zi, *h* muta, *x* = cs, accento secondo la quantità latina. Respelling italiano senza sillabazione puntata (la voce legge i trattini come pause): "damnatio memoriae" → "damnàzio memòrie". Il greco si legge all'italiana (Àcragas, kainòn).

**Il dizionario «Storia e FAI - Anzio Nettuno»** (ElevenLabs, 143 regole dal 27/11/2026) copre già i toponimi del Lazio antico, i termini latini e greci del sito (opus, cavea, xystus, scaenae frons, calidarium…), i nomi di studiosi e luoghi con accento a rischio (Paribèni, Nìbbi, Sàrsina, Trìpoli, Epìro) e le sigle (a.C., d.C., SPQR). Tutte le regole sono **alias** in grafia italiana accentata, non IPA: le regole fonetiche non sono affidabili su v3. Accenti dei nomi italiani verificati sul DiPI (`dipionline.it`). Una parola nuova si aggiunge lì con la stessa convenzione.
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

## Volume costante (dopo la generazione, sempre)

Il volume deve restare allo stesso livello dall'inizio alla fine. I tag espressivi lo fanno oscillare: nella prova della Necropoli (27/11/2026) la voce calava fino a 8 dB sui passaggi con `[awe]` e `[continues softly]`, e l'utente l'ha sentito subito. Quindi:

- **Niente tag che abbassano la voce**: `[continues softly]`, `[whispers]`, `[softly]`. In chiusura il tono raccolto si ottiene con la frase, non con il volume. `[awe]` e `[reflective]` con parsimonia.
- **Ogni mp3 si livella prima della consegna**, senza crediti:
  ```
  ffmpeg -i grezzo.mp3 -af "dynaudnorm=f=300:g=15:p=0.9:m=8:r=0.5,acompressor=threshold=-24dB:ratio=3:attack=10:release=250:makeup=4,loudnorm=I=-16:TP=-1.5:LRA=4" -ar 44100 -ac 1 -b:a 64k puntata.mp3
  ```
  Sulla Necropoli lo scarto tra il punto più basso e il più alto è sceso da 8,3 a 2 dB (finestre di cinque secondi, solo parlato). Obiettivo: sotto i 3 dB, a -16 LUFS integrati.

## Crediti di chiusura (dal PASSO 0)
- A) Riccardo Pau e Vittorio Gamba, Delegazione FAI di Roma.
- B) Riccardo Pau, Gruppo FAI Anzio-Nettuno.

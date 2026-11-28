# Verifica delle fonti: avanzamento

Registro del lavoro di riverifica avviato il 28/11/2026 (regola in `CLAUDE.md`, «Verifica delle
informazioni»). **Va aggiornato a ogni passo**, nello stesso commit della sezione o dello script
verificato (richiesta dell'utente del 28/11/2026: «aggiorna sempre documentazione e progresso attuale»).

## Metodo

- Ogni affermazione si confronta con il documento da cui viene: fonte antica nel testo originale,
  studio in `wiki/raw/`, testi dell'Ottocento su archive.org, schede del Ministero, Treccani, articoli
  scientifici. Mai una fonte sola se se ne trovano altre; mai Wikipedia da sola.
- Quello che non ha riscontro si toglie; le deduzioni si dicono come tali.
- Le citazioni «» si controllano alla lettera sul testo originale.
- **Nessuna eccezione per la «conoscenza consolidata»** (utente, 28/11/2026: «Verifica sempre»): anche i fatti noti si ricontrollano sul testo.
- Dopo ogni modifica HTML controllare che nessun callout abbia perso l'intestazione (`callout-header`) e che i tag siano bilanciati.
- Date archeologiche: solo il periodo, mai il metodo (niente carbonio 14, C14, laboratori).
- Pagine bloccate ai bot: `https://r.jina.ai/` davanti all'URL.
- All'utente si consegna la tabella affermazione / fonte / esito.
- Podcast: script completo in chat, audio solo dopo l'ok, controllo di pronuncia con il whisper
  `large-v3` di Minerva (dettagli in `.claude/skills/fai-guide-rewriter/references/podcast.md`).

## Stato

Ordine del percorso. «Pagina» = sezione HTML + PDF; «Podcast» = script + mp3.

| Sezione | Pagina | Podcast | PR |
|---|---|---|---|
| Home (`index.html`) | da fare (corretta solo la citazione di Cicerone) | – | #189 |
| Necropoli protostoriche | **fatta** | **fatto** | #193–#200 |
| Vallo | **fatta** | **fatto** | #199, #201, #202 |
| Volsci, Cicerone e i culti | **fatta** | – | #203, #204 |
| Antium guide | prossima | – | |
| Tomba Mulakia | da fare | da fare | |
| Villa imperiale | **fatta** | **fatto** | #189–#191 |
| Teatro romano | da fare | da fare | |
| Monumenti della città alta | da fare | – | |
| Xystus e terme | da fare | da fare | |
| Cisternone e Caffeaus | da fare | da fare | |
| Tor Caldara | da fare | da fare | |
| `fonti.html` | da fare | – | |

## Fonti originali trovate online (riusabili)

- Lugli 1940, *Saggio sulla topografia dell'antica Antium*: ancientportsantiques.com (PDF)
- *Notizie degli Scavi* 1889 (Lanciani, p. 164): archive.org `notiziedegliscav1889accauoft`
- Nibby 1848, *Analisi*, vol. I: archive.org `analisistoricoto01nibbiala`
- Lombardi 1847, *Cenni storici*: archive.org `bub_gb_7u-f8IRw3gMC`; Lombardi 1865: `anzioanticoemod00lombgoog`
- Soffredini 1879: archive.org `storiadianziosat00soff`
- Matteucci 1872: archive.org `cennistoricidell00matt`
- Treccani, *Enciclopedia dell'Arte Antica*, voce «Anzio»; *Enciclopedia Italiana*, voce «Lazio»
- Severino 2021 (Italcable): giornidistoria.net
- Minto, necrologio di Antonielli: *Studi Etruschi* IX (studietruschi.org)
- Autori latini: thelatinlibrary.com (Livio, Tacito, Svetonio, Ovidio, Cicerone *Ad Atticum*); Svetonio anche su LacusCurtius
- Autori greci in traduzione: LacusCurtius (Dionigi di Alicarnasso, Strabone, Polibio)
- Plinio, Macrobio, Svetonio (latino): LacusCurtius `Thayer/L/Roman/Texts/...`; Orazio: thelatinlibrary
- Treccani: «Valerio Anziate» (Enc. Italiana), «Corradino di Svevia» (Enc. Dantesca), «Frangipane, Giovanni»
- Catalogo generale dei Beni Culturali (catalogo.beniculturali.it): rilievo di Mitra da Anzio, Verona

## Punti aperti

- Cavallo Morto: il PDF di Angle et al. 2004 in `docs/` è una scansione senza testo (dati presi dalla Treccani).
- Santamaria Scrinari 1975 non consultabile online: le sue citazioni sono state tolte.
- Didascalia della foto della Selciatella («Latium Vetus et Adiectum, 2016»): credito non verificato.
- `wiki/entities/cicerone.md`: patronato di Cicerone, processo Coponio-Oltronio, Marcello «esiliato ad Antium» non verificati.

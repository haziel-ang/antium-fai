# Immagini: quando, quante, come

Lo strumento tecnico (estrazione e inserimento) è negli script, spiegato nel `SKILL.md`. Qui stanno le scelte editoriali: l'oculatezza che l'utente ha chiesto.

## Quando inserire un'immagine

Metti un'immagine solo se aiuta a capire o a vedere qualcosa che le parole da sole non danno: una pianta, un'incisione d'epoca, una mappa, un reperto, un luogo com'è oggi. Un'immagine decorativa che non aggiunge nulla si toglie. Meglio poche figure giuste che molte di riempimento.

Buoni candidati in una guida storica: piante e rilievi antichi (es. le tavole di Volpi 1726), incisioni, mappe topografiche, foto di reperti citati nel testo, confronto tra un luogo antico e lo stesso punto oggi.

## Dove collocarla

L'immagine sta vicino al punto del testo che illustra, non ammucchiata all'inizio o alla fine. Nella guida scrivi il segnaposto `{{FIG:id}}` su una riga sua, nel punto giusto del racconto. Una pianta del porto va dove parli del porto, non tre sezioni dopo.

## Didascalia

La didascalia dice cosa si vede e perché conta, in una o due frasi, in italiano semplice. Non ripete parola per parola il testo accanto. Lo script estrae una didascalia *candidata* dal testo vicino all'immagine nel tomo: è grezza e spesso imprecisa, va riscritta. **Non scrivere nella didascalia fatti che non puoi verificare**: se non sai cosa rappresenta esattamente un'incisione, dillo ("incisione settecentesca, soggetto non identificato con certezza") invece di inventare.

## Crediti grafici

Ogni immagine porta il suo credito, sempre. Per un tomo storico digitalizzato il credito è la fonte della digitalizzazione, non l'autore del 1726: per esempio "Universitätsbibliothek Heidelberg, DOI 10.11588/diglit.30719". Per una foto moderna: autore e licenza. Se non conosci il credito, non inventarlo: chiedi all'utente o segna "credito da verificare" e non pubblicare finché non è risolto.

Attenzione al diritto: un'incisione del 1726 è di pubblico dominio, ma la *digitalizzazione* può avere condizioni proprie. Indica sempre da dove arriva il file.

## Forma nell'HTML

Lo script `inserisci_figure.py` produce già la forma giusta:
```html
<figure>
  <img src="images/fig_3.png" alt="…" loading="lazy">
  <figcaption>
    Didascalia in italiano semplice.
    <span class="credito">Crediti: Fonte della digitalizzazione, DOI.</span>
  </figcaption>
</figure>
```
L'`alt` serve a chi non vede l'immagine (lettori di schermo, connessioni lente): descrivilo davvero, non lasciarlo vuoto.

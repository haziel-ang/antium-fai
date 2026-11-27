#!/usr/bin/env node
/* Controllo di stile su TESTO LIBERO in italiano (skill scrittura-umana).
   Uso:
     node controlla-testo.mjs testo.md        controlla un file (anche piu' file)
     cat testo.txt | node controlla-testo.mjs -   legge da stdin
     node controlla-testo.mjs --prova         prova che sa diventare rosso
   Esce con 1 se c'e' un ROSSO. I GIALLI segnalano e non bloccano.
   Niente intelligenza: segnali grossolani e dichiarati. Mostra il pezzo
   incriminato, la decisione resta di chi scrive. Distillato da
   wanderlust/scripts/diag-stile.mjs, senza dipendenze dal progetto. */
import { readFileSync } from "node:fs";

const MEDIA_MAX = 24, PIU_CORTA_MAX = 14, QUOTA_LUNGHE = 0.45;
const PARAGRAFO_UNICO_DA = 110, TRICOLON_PER_100 = 2, GULPEASE_MIN = 47;
const METRO_MIN = 17, METRO_MAX = 23, METRO_CORSA = 3;
const MIN_PAROLE = 40; // sotto questa lunghezza i controlli di ritmo non hanno senso
const EMDASH = String.fromCharCode(8212); // il trattino lungo, costruito per non scriverlo nel file

const num = (s) => s.split(/\s+/).filter(Boolean).length;
const frasi = (t) => t.replace(/\n+/g, " ").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => num(s) > 1);
const corto = (s, n = 70) => (s.length > n ? s.slice(0, n - 1) + "..." : s);

const LISTA_NERA = /\b(gioiell[oi]|scrign[oi]|cuore pulsante|fiore all'occhiello|custodisc\w+|racchiud\w+|a due passi|nel cuore (?:di|del|della|dei|delle)|mozzafiato|senza tempo|sospes[oa] nel tempo|da non perdere|angolo di paradiso|meta ideale|immers[oa] nel verde|da cartolina|non a caso|veri e propri)\b/i;
const SPIA = /\b(profond[oaie]|fondamental[ei]|cruciale|cruciali|trasformativ\w+|risonanza|esplorare|sviscerare|intrecciar\w+|sfaccettature|molteplici|evidenziar\w+|sottolinear\w+|testimonianza|silenziosamente|in silenzio|costante|costanti|saldo|salda|concret[oaie]|pratic[oaie]|affidabil[ei]|multiforme|dare forma a|fare da ponte)\b/gi;
const SEGNALI_AI = [
  [/\btestimonianza di\b|\bruolo (?:cruciale|fondamentale|chiave)\b|\bpunto di riferimento\b|\bsegna una svolta\b/i, "enfasi sull'importanza"],
  [/\b(?:funge da|si configura come|costituisce|rappresenta)\b/i, "copula evitata"],
  [/\bnon solo\b.{1,80}\b(?:ma anche|ma pure)\b|\bnon è semplicemente\b/i, "parallelismo negativo"],
  [/,\s*(?:sottolineando|evidenziando|testimoniando|offrendo|riflettendo|confermando)\b/i, "gerundio che commenta"],
  [/\bsecondo alcuni\b|\bmolti ritengono\b|\bgli esperti\b|\bsi ritiene che\b/i, "attribuzione vaga"],
  [/\bdeve affrontare\b|\bguarda al futuro\b|\bcontinua a essere\b/i, "chiusura sfide e futuro"],
];
const SERVIZIO = /(?<![\p{L}])(biglietti?|orari|parcheggio|prenotazion\p{L}*|prezzi?|contatti|ingresso (?:è|a pagamento|gratuito|libero)|visita (?:è|libera)|aperto (?:tutti|dal|il)|chiuso (?:il|di))(?![\p{L}])/iu;
/* Chiusure-stampino (27/11/2026). La regola "l'ultima frase e' una scena" ha prodotto
   finali tutti uguali: sul sito Antium 5 sezioni su 11 chiudevano con "La prossima volta
   che...", nel catalogo Wanderlust 127 schede su 1385 con una frase che comincia per "Poi".
   Si guarda l'ultimo paragrafo. Il riassunto vero e proprio non si misura (la sovrapposizione
   di parole col resto del testo e' stata provata e non distingue): resta la prova della
   cancellazione, a mano. */
const CHIUSURA_ROSSA = /(?<![\p{L}])(la prossima volta che|fai (?:una|questa) prova|pochi (?:luoghi|posti|edifici|borghi|paesi|monumenti)(?![\p{L}]))/iu;
const CHIUSURA_GIALLA = /(?<![\p{L}])(sotto i (?:tuoi )?piedi|immagina|pensa a|(?:è|sono|resta|restano) ancora lì|c'è tutto|(?:capisci|si capisce) perché)(?![\p{L}])/iu;
const ULTIMA_A_STAMPO = /^(Poi|La sera)(?![\p{L}])/u;
const DEFINIZIONE = /^.{0,90}?(?<![\p{L}])(è (?:un|uno|una|il|la|l')|si trova|si trovano|sorge|sorgono|è situat[oa])(?![\p{L}])/iu;
const VOCE = [
  [/(?<![\p{L}])[a-zàèéìòù]{3,}(?:ò|ì)(?![\p{L}])/u, "persona che agisce"],
  [/[a-zàèéìòù,;:]\s+si\s+(?:entra|sale|scende|cammina|vede|sente|arriva|gira|riconosce|attraversa|apre|respira|ascolta)\b/, "lettore nella scena"],
  [/\b(?:ti|tu|vedrai|sentirai|se hai|se vuoi)\b/i, "seconda persona"],
  [/\b(?:buio|eco|vento|polvere|freddo|odore|silenzio|profumo|rumore|suono|fumo|ombra|gelo|caldo)\b/i, "dettaglio sensoriale"],
  [/[«"“].{3,}[»"”]/, "discorso riportato"],
];
const FORMULA_SI = /(?<![.!?]\s)\bsi\s+(?:cammina|sale|scende|entra|arriva|percorre|attraversa|raggiunge|vede|sente|trova|incontra)\b/g;

function esamina(testo) {
  const rossi = [], gialli = [];
  const t = testo.replace(/^#.*$/gm, "").replace(/```[\s\S]*?```/g, "").trim(); // via titoli e codice
  const par = t.split(/\n\s*\n/).filter((p) => p.trim());
  const fr = frasi(t);
  const parole = num(t);
  if (t.includes(EMDASH)) rossi.push(["em-dash", "c'è un trattino lungo: usa due punti, punto e virgola o riscrivi"]);
  const nera = t.match(LISTA_NERA);
  if (nera) rossi.push(["lista-nera", `cliché: «${nera[0]}»`]);
  if (parole < MIN_PAROLE || fr.length < 3) return { rossi, gialli, parole, nota: "testo troppo corto per il ritmo" };

  const lun = fr.map(num);
  const media = lun.reduce((a, b) => a + b, 0) / lun.length;
  const min = Math.min(...lun);
  if (media > MEDIA_MAX) rossi.push(["ritmo", `frase media ${media.toFixed(1)} parole (max ${MEDIA_MAX})`]);
  if (min > PIU_CORTA_MAX) rossi.push(["ritmo", `la frase più corta ha ${min} parole: nessun respiro corto`]);
  const lunghe = lun.filter((n) => n > 28).length / lun.length;
  if (lunghe > QUOTA_LUNGHE) rossi.push(["ritmo", `${Math.round(lunghe * 100)}% di frasi oltre 28 parole`]);
  let corsa = 0, inizio = 0;
  for (let i = 0; i <= lun.length; i++) {
    const nella = i < lun.length && lun[i] >= METRO_MIN && lun[i] <= METRO_MAX;
    if (nella) { if (corsa === 0) inizio = i; corsa++; continue; }
    if (corsa >= METRO_CORSA) rossi.push(["metronomo", `${corsa} frasi di fila fra ${METRO_MIN} e ${METRO_MAX} parole: «${corto(fr[inizio])}»`]);
    corsa = 0;
  }
  if (par.length === 1 && parole > PARAGRAFO_UNICO_DA) rossi.push(["paragrafo", `un solo blocco di ${parole} parole: spezzalo`]);
  if (!VOCE.some(([re]) => re.test(t))) rossi.push(["voce", "nessuno dentro: né persona che agisce, né lettore, né dettaglio sensoriale"]);
  const ultima = fr[fr.length - 1];
  if (SERVIZIO.test(ultima)) rossi.push(["chiusura", `l'ultima frase è una riga di servizio: «${corto(ultima)}»`]);
  const ultimoPar = par[par.length - 1];
  const stampo = ultimoPar.match(CHIUSURA_ROSSA);
  if (stampo) rossi.push(["chiusura", `finale a stampino («${stampo[0]}»): togli il paragrafo se riassume, o chiudi su un fatto nuovo`]);
  const stampoGiallo = ultimoPar.match(CHIUSURA_GIALLA);
  if (stampoGiallo) gialli.push(["chiusura", `formula di chiusura consumata: «${stampoGiallo[0]}». Prova della cancellazione: se togli l'ultimo paragrafo, si perde qualcosa?`]);
  if (ULTIMA_A_STAMPO.test(ultima)) gialli.push(["chiusura", `l'ultima frase attacca con «${ultima.match(ULTIMA_A_STAMPO)[0]}»: è la scena finale più usata, varia la mossa`]);
  if (DEFINIZIONE.test(fr[0])) rossi.push(["apertura", `attacco da definizione: «${corto(fr[0])}»`]);

  // gialli
  const segni = [/\?/.test(t), /\(.{2,}\)/.test(t), /[:;]/.test(t), lun.some((n) => n > 28), /\b(forse|nessuno sa|non sappiamo|a me sembra|credo|pare che|sembra che)\b/i.test(t)].filter(Boolean).length;
  if (segni < 2) gialli.push(["varietà", `${segni} segni su 5 (domanda, parentesi, due punti, frase lunga, dubbio): ne servono 2`]);
  const trio = t.match(/\b[\wàèéìòù'-]+, [\wàèéìòù'-]+ e [\wàèéìòù'-]+\b/g) || [];
  if (trio.length / parole * 100 > TRICOLON_PER_100) gialli.push(["tricolon", `${trio.length} elenchi di tre: «${trio[0]}»`]);
  const spia = [...new Set((t.match(SPIA) || []).map((s) => s.toLowerCase()))];
  if (spia.length) gialli.push(["parole-spia", spia.join(", ")]);
  for (const [re, nome] of SEGNALI_AI) { const m = t.match(re); if (m) gialli.push(["segnale-ai", `${nome}: «${m[0]}»`]); }
  const formula = t.match(FORMULA_SI) || [];
  if (formula.length > 2) gialli.push(["formula-si", `${formula.length} volte «si + verbo»: è una firma`]);
  const lettere = (t.match(/[A-Za-zÀ-ÿ]/g) || []).length;
  const gul = 89 + (300 * fr.length - 10 * lettere) / parole;
  if (gul < GULPEASE_MIN) gialli.push(["leggibilità", `Gulpease ${gul.toFixed(0)} (avviso sotto ${GULPEASE_MIN}, obiettivo 60)`]);
  return { rossi, gialli, parole, media, gulpease: gul };
}

function stampa(nome, r) {
  const dettaglio = r.media ? `, media ${r.media.toFixed(1)}, Gulpease ${r.gulpease.toFixed(0)}` : "";
  console.log(`\n== ${nome} (${r.parole} parole${r.nota ? ", " + r.nota : ""}${dettaglio})`);
  for (const [k, m] of r.rossi) console.log(`  ROSSO   ${k}: ${m}`);
  for (const [k, m] of r.gialli) console.log(`  giallo  ${k}: ${m}`);
  if (!r.rossi.length && !r.gialli.length) console.log("  verde");
}

const BUONO = `Nel 1553 la famiglia Mattei comprò qui una vigna per mille scudi d'oro. Poi cominciò a costruire. Il cantiere durò trent'anni, e gli operai (quasi tutti contadini della valle) lavoravano solo tra l'autunno e la primavera, perché d'estate c'era il grano da portare in aia.

Quando entri, il freddo della pietra ti arriva alle caviglie. C'è un'eco che non si spiega: forse la volta, forse il pozzo sotto il pavimento. Nessuno sa chi l'abbia scavato.

Dal terrazzo si vede il fiume che brilla oltre i tetti. Quanti carri ci sono voluti per portare su quelle travi?`;

const argomenti = process.argv.slice(2);

if (argomenti.includes("--prova")) {
  const casi = [
    ["em-dash", BUONO + ` ${EMDASH} fine.`],
    ["lista-nera", BUONO.replace("Poi cominciò", "È un gioiello. Poi cominciò")],
    ["voce", "La villa ha un parco ampio e una facciata regolare. Il corpo centrale ha tre piani e due ali laterali di uguale altezza. Le finestre sono disposte su file ordinate. Il giardino è diviso in aiuole simmetriche con siepi basse. Ci sono due fontane e un viale alberato che conduce al cancello principale. Resta aperta al pubblico."],
    ["chiusura", BUONO + " L'ingresso è libero dall'alba al tramonto."],
    ["apertura", "Villa Mattei è una dimora cinquecentesca. " + BUONO],
    ["chiusura", BUONO + "\n\nLa prossima volta che passi di lì, pensa al cantiere. Pochi luoghi hanno visto tanto."],
    ["metronomo", "Nel 1553 la famiglia comprò una vigna sul colle per mille scudi d'oro e subito iniziò i lavori. Il cantiere durò molti anni e coinvolse gli operai di tutta la valle, che lavoravano con grande fatica e poca paga. Ogni autunno arrivavano le squadre con i carri carichi di pietra presa dalla cava vicina, e ripartivano prima dell'inverno. Il vento portava la polvere fin sul terrazzo."],
  ];
  const base = esamina(BUONO);
  const buonoVerde = base.rossi.length === 0;
  console.log(`testo buono senza rossi: ${buonoVerde ? "sì" : "NO " + JSON.stringify(base.rossi)}`);
  let ok = 0;
  for (const [atteso, testo] of casi) {
    const preso = esamina(testo).rossi.some(([k]) => k === atteso);
    console.log(`${preso ? "ok     " : "MANCATO"} rosso atteso: ${atteso}`);
    if (preso) ok++;
  }
  process.exit(ok === casi.length && buonoVerde ? 0 : 1);
}

const file = argomenti.filter((a) => a === "-" || !a.startsWith("--"));
if (!file.length) { console.error("Uso: controlla-testo.mjs <file...> | - | --prova"); process.exit(2); }
let rosso = false;
for (const f of file) {
  const r = esamina(readFileSync(f === "-" ? 0 : f, "utf8"));
  stampa(f === "-" ? "stdin" : f, r);
  if (r.rossi.length) rosso = true;
}
process.exit(rosso ? 1 : 0);

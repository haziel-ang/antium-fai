/* ============================================================
   LEMMI — il glossario interattivo di Antium.
   Ogni voce alimenta il popup a pergamena agganciato agli
   <span class="lemma" data-lemma="id"> sparsi nelle pagine.
   - "nota": spiegazione in poche parole (termini tecnici).
   - "righe": timeline [periodo, evento] (ville e luoghi che
     hanno cambiato nome e padrone nei secoli).
   Registro centrale: si aggiorna qui, vale ovunque.
   ============================================================ */
window.ANTIUM_LEMMI = {

  /* ---------- Le ville e i loro nomi stratificati ---------- */

  'villa-sarsina': {
    eyebrow: 'Una villa, quattro nomi',
    titolo: 'Villa Corsini · Mencacci · Sarsina · oggi Municipio',
    nota: 'La stessa villa sul colle che fu forse l’acropoli antica: a ogni padrone, un nome nuovo.',
    righe: [
      ['1743', 'Il cardinale Nereo Corsini costruisce villa e palazzo; vi ospita papa Benedetto XIV'],
      ['1820', 'I Corsini vendono ai Mencacci: nelle fonti dell’Ottocento è «villa Mencacci»'],
      ['Novecento', 'Passa ai principi di Sarsina, da cui il nome attuale'],
      ['1930', 'Dagli scavi in giardino emerge il Ninfeo di Ercole'],
      ['Oggi', 'Sede del Municipio di Anzio']
    ]
  },

  'villa-mencacci': {
    eyebrow: 'Stesso luogo, tre nomi',
    titolo: '«Villa Mencacci», cioè Villa Sarsina',
    nota: 'È il nome che usano Lombardi e Lugli: la villa già del cardinale Corsini, comprata dai Mencacci nel 1820, poi dei principi di Sarsina. Oggi è il Municipio di Anzio.',
    righe: [
      ['1743', 'Villa del cardinale Corsini'],
      ['1820', 'Ai Mencacci: è la «villa Mencacci» delle fonti'],
      ['Oggi', 'Villa Sarsina, sede del Municipio']
    ]
  },

  'villa-adele': {
    eyebrow: 'Da villa cardinalizia a museo',
    titolo: 'Villa Adele (già Villa Pia)',
    nota: 'La villa dei grandi scavi seicenteschi, oggi casa del Museo Civico Archeologico.',
    righe: [
      ['XVII sec.', 'Villa Cesi: nell’area, verso il 1609, viene scavato il Gladiatore Borghese'],
      ['poi', 'Pamphilj: il casino, per Lombardi, su «vago disegno del Vignola»'],
      ['poi', 'Borghese, quindi Aldobrandini'],
      ['Novecento', 'Opera pontificia di assistenza, infine il Comune'],
      ['Oggi', 'Sede comunale e Museo Civico; scavi Sapienza 2021–2024']
    ]
  },

  'villa-albani': {
    eyebrow: 'La villa del cardinale collezionista',
    titolo: 'Villa Albani, poi Ospizio Marino',
    nota: 'Il palazzo del 1735 portava sull’ingresso il motto «Amicis et genio»: agli amici e al genio del luogo.',
    righe: [
      ['1711–1712', 'Scavi del cardinale Alessandro Albani: sculture, iscrizioni, marmi'],
      ['1733', 'La raccolta venduta a Clemente XII: un nucleo del futuro Museo Capitolino'],
      ['1735', 'Il palazzo col motto «Amicis et genio»'],
      ['poi', 'Camera Apostolica: diventa l’Ospizio Marino'],
      ['Oggi', 'Struttura sanitaria; probabile area del tempio della Fortuna']
    ]
  },

  'villa-bello-aspetto': {
    eyebrow: 'Verso Nettuno',
    titolo: 'La villa «di bello aspetto»',
    nota: 'Così la chiamavano per i viali, gli agrumi e le statue: è l’odierna Villa Borghese sulla strada per Nettuno.',
    righe: [
      ['XVII sec.', 'I cardinali Vincenzo e Giambattista Costaguti costruiscono palazzo e villa'],
      ['poi', 'Passa ai Torlonia'],
      ['1831', 'Ai Borghese, insieme ad Anzio e Nettuno'],
      ['Oggi', 'Proprietà privata']
    ]
  },

  'villa-spigarelli': {
    eyebrow: 'La villa fotocopia',
    titolo: 'Villa Spigarelli',
    nota: 'Una casa del Novecento disegnata sulla pianta della villa romana: i muri nuovi seguono quelli antichi, stanza per stanza.',
    righe: [
      ['II sec. a.C. – IV sec. d.C.', 'La villa romana, ampliata per secoli, con i mosaici bianco-neri'],
      ['Anni Venti', 'L’avvocato Spigarelli costruisce la casa moderna ricalcando la pianta antica'],
      ['Oggi', 'Proprietà privata, non accessibile; custodisce la statuetta della Fortuna']
    ]
  },

  'semaforo': {
    eyebrow: 'La vedetta scomparsa',
    titolo: 'Il Semaforo della Regia Marina',
    nota: 'Una stazione di vedetta e segnalazione della Marina, costruita nel 1889 sul punto più alto del ciglio costiero, tra il faro e via Fanciulla d’Anzio: comunicava con le navi al largo con segnali ottici ed era collegata al telegrafo. L’edificio non esiste più, ma per gli archeologi resta un punto fermo: scavandone le fondamenta affiorò il vallo, e il suo nome marca ancora il limite ovest della villa imperiale.',
    righe: [
      ['1889', 'Si scavano le fondamenta: i picconi trovano il macco dell’aggere e una statua femminile senza testa'],
      ['1890 ca.', 'La stazione è in servizio nella rete semaforica costiera della Regia Marina'],
      ['1940', 'Per Lugli è il riferimento fisso: «il vallo aveva inizio proprio al di sotto del Semaforo»'],
      ['Oggi', 'Non esiste più: quando e come sia scomparso resta da documentare. Sopravvive nel nome della «villa del Semaforo»']
    ]
  },

  /* ---------- I termini tecnici, spiegati in due righe ---------- */

  'macco': {
    eyebrow: 'La pietra di Anzio',
    titolo: 'Macco',
    nota: 'Un’arenaria calcarea piena di conchiglie fossili: tenera da tagliare appena cavata, dura dopo l’esposizione all’aria. Vallo, tombe e fondazioni di Antium sono fatti così: la città è costruita sul fondo di un mare antico.'
  },

  'agger': {
    eyebrow: 'Difendersi con la terra',
    titolo: 'Aggere (agger)',
    nota: 'Il terrapieno difensivo: la terra scavata dalla fossa esterna veniva rovesciata verso l’interno, fino a formare un muro di terra alto come un palazzo. Ad Antium ne restano quasi quattro chilometri.'
  },

  'opus-reticulatum': {
    eyebrow: 'Tecniche di muratura',
    titolo: 'Opera reticolata',
    nota: 'Cubetti di tufo a punta di diamante disposti in diagonale, come una rete. Di moda tra fine Repubblica e primo Impero; nella villa di Anzio compare soprattutto nelle fondazioni, un dettaglio che ha cambiato la datazione dell’intero complesso.'
  },

  'opus-incertum': {
    eyebrow: 'Tecniche di muratura',
    titolo: 'Opera incerta',
    nota: 'Pietre di forma irregolare annegate nella malta: la tecnica più antica. Quando la incontri ad Anzio, di solito stai guardando un muro di età repubblicana.'
  },

  'opus-mixtum': {
    eyebrow: 'Tecniche di muratura',
    titolo: 'Opera mista',
    nota: 'Reticolato di tufelli incorniciato e rinforzato da fasce di mattoni: il meglio dei due mondi. Ad Anzio data molti edifici tra I e II secolo d.C., teatro compreso.'
  },

  'opus-signinum': {
    eyebrow: 'L’intonaco che non fa passare l’acqua',
    titolo: 'Cocciopesto (opus signinum)',
    nota: 'Frammenti di terracotta pestati nella calce: un rivestimento impermeabile e quasi indistruttibile. Foderava cisterne, vasche e bagni; dove lo trovi, lì c’era acqua.'
  },

  'criptoportico': {
    eyebrow: 'Architettura',
    titolo: 'Criptoportico',
    nota: 'Un corridoio coperto a volta, in parte sotto terra: fresco d’estate, comodo per passeggiare e per il servizio, robusto abbastanza da reggere le terrazze costruite sopra. Le ville romane di mare ne erano piene.'
  },

  'cavea': {
    eyebrow: 'Dentro il teatro',
    titolo: 'Cavea',
    nota: 'La gradinata semicircolare del teatro, divisa in spicchi (i cunei) e in fasce orizzontali: in basso senatori e magistrati, in mezzo i cittadini, in alto donne e popolo. Una mappa sociale scolpita in pietra.'
  },

  'suspensurae': {
    eyebrow: 'Il riscaldamento dei Romani',
    titolo: 'Suspensurae e ipocausto',
    nota: 'Pilastrini di mattoni che reggevano un pavimento sospeso: nell’intercapedine circolava l’aria calda di un forno (l’ipocausto), che scaldava le sale termali da sotto. Il riscaldamento a pavimento, duemila anni fa.'
  },

  'bolli-laterizi': {
    eyebrow: 'Date stampate sui mattoni',
    titolo: 'Bolli laterizi',
    nota: 'Timbri impressi sui mattoni freschi, con il nome della fornace e spesso dei consoli in carica: per gli archeologi sono date di fabbricazione stampate dentro l’edificio. Quelli del Cisternone lo datano al 123 d.C.'
  },

  'basolato': {
    eyebrow: 'Le strade dei Romani',
    titolo: 'Basolato',
    nota: 'Il lastricato delle strade romane: grandi pietre di selce vulcanica incastrate a secco, fatte per durare. La Selciatella, verso Nettuno, ne conserva cinquecento metri ancora percorribili.'
  },

  'fistulae': {
    eyebrow: 'L’acqua firmata',
    titolo: 'Fistulae',
    nota: 'I tubi dell’acqua, in piombo, spesso firmati dal fabbricante o dal proprietario: da un tubo può uscire il nome di chi abitava la villa. Avere l’acqua corrente in casa era una concessione imperiale.'
  }
};

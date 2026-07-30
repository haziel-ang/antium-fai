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

  'amigdala': {
    eyebrow: 'L’attrezzo più antico',
    titolo: 'Amigdala',
    nota: 'Il bifacciale del Paleolitico: una pietra scheggiata su entrambe le facce a forma di mandorla (dal greco amýgdala), usata per tagliare e raschiare. Quella trovata ad Anzio, di tipo neandertaliano, porta la presenza umana sul territorio a circa centocinquantamila anni fa.'
  },

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

  'opus-spicatum': {
    eyebrow: 'Il pavimento a spina di pesce',
    titolo: 'Opus spicatum',
    nota: 'Mattoncini posati di taglio e inclinati a comporre il disegno di una spiga: di qui il nome. Economico e robusto, era il pavimento delle stanze di servizio e dei sotterranei. Nelle terme dello xystus rivestiva le camere minori intorno all’aula a mosaico.'
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

  'frigidarium': {
    eyebrow: 'Le sale delle terme',
    titolo: 'Frigidarium',
    nota: 'La sala fredda delle terme, con la vasca d’acqua non riscaldata: ci si tuffava alla fine del percorso di bagno, per chiudere i pori e tonificare il corpo dopo il caldo.'
  },

  'tepidarium': {
    eyebrow: 'Le sale delle terme',
    titolo: 'Tepidarium',
    nota: 'La sala tiepida, di passaggio tra il freddo e il caldo: serviva a far abituare gradualmente il corpo alla temperatura, senza sbalzi. Spesso era l’ambiente più curato nelle decorazioni.'
  },

  'calidarium': {
    eyebrow: 'Le sale delle terme',
    titolo: 'Calidarium',
    nota: 'La sala calda, la più vicina al forno: aveva una vasca d’acqua bollente e l’aria satura di vapore, scaldata da sotto attraverso il pavimento sospeso (le suspensurae) e dalle pareti cave.'
  },

  'laconicum': {
    eyebrow: 'Le sale delle terme',
    titolo: 'Laconicum',
    nota: 'La saletta del bagno di sudore a calore secco, l’antenata della sauna: piccola e rovente, prendeva nome dalla Laconia (Sparta), patria di questa pratica. Ci si faceva sudare prima di lavarsi.'
  },

  'bolli-laterizi': {
    eyebrow: 'Date stampate sui mattoni',
    titolo: 'Bolli laterizi',
    nota: 'Timbri impressi sui mattoni freschi, con il nome della fornace e spesso dei consoli in carica: per gli archeologi sono date di fabbricazione stampate dentro l’edificio. Quelli del Cisternone lo datano al 123 d.C.'
  },

  'bipedali': {
    eyebrow: 'Mattoni a misura',
    titolo: 'Mattoni bipedali',
    nota: 'I mattoni grandi due piedi romani per lato, circa 59 cm: i più larghi che uscivano dalle fornaci, usati per ripartire i carichi e segnare i piani di posa. Nel Cisternone due file di bipedali affiancati marcano la risega da cui i muri si assottigliano salendo.'
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
  },

  /* ---------- Luoghi, porti e strade ---------- */

  'arco-muto': {
    eyebrow: 'Scomparso nel 1965',
    titolo: 'L’Arco Muto',
    nota: 'La sostruzione ad arco della falesia di levante, sopravvissuta fino al 1965: per secoli il limite orientale della villa imperiale, il punto dove finiva il palazzo e cominciava la città. Oggi è solo un nome sulla cartina.'
  },

  'caenon': {
    eyebrow: 'Il porto dei Volsci',
    titolo: 'Caenon',
    nota: 'Il porto volsco di Antium, citato da Livio e Dionigi: stava fuori dalle mura, separato dalla città per ragioni difensive. Il nome viene dal greco, e significa «nuovo» oppure, secondo altri, dal latino caenum, fango. Dove fosse esattamente, dopo quattro secoli di ipotesi, gli studiosi non si sono ancora messi d’accordo.'
  },

  'satricum': {
    eyebrow: 'Città fondata da Anzio',
    titolo: 'Satricum',
    nota: 'La colonia volsca nell’entroterra, fondata da Antium a una quindicina di chilometri dalla costa, nell’attuale area tra Nettuno, Velletri e Cisterna. Famosa per il tempio della Mater Matuta, la dea dell’aurora e dei porti, che secondo la leggenda resisteva al fuoco dei Latini.'
  },

  'astura': {
    eyebrow: 'Il fiume del tradimento',
    titolo: 'Astura (Torre Astura)',
    nota: 'Il fiume a sud di Anzio dove nel 338 a.C. la flotta anziate fu sconfitta dai Romani: da lì partirono i rostri che diedero il nome alla tribuna del Foro. Sulla foce c’era una grande villa imperiale con porto proprio, e nel 1268 fu qui che Corradino di Svevia fu catturato, poi decapitato a Napoli.'
  },

  'tor-caldara': {
    eyebrow: 'La fonte calda sulla falesia',
    titolo: 'Tor Caldara (il Caldanum)',
    nota: 'La sorgente di acqua calda della villa sulla falesia, oggi nota come villa di Patrizia: la tradizione antiquaria la assegnava a Mecenate, che vi avrebbe dedicato una statua ad Augusto «come al genio tutelare del luogo», ma l’attribuzione resta un’ipotesi. Dal nome latino della sorgente, Caldanum, viene il toponimo moderno. Da qui, sempre secondo gli eruditi, partiva l’acquedotto che riforniva le terme della città.'
  },

  'colle-rotondo': {
    eyebrow: 'L’avamposto di Antium',
    titolo: 'Colle Rotondo',
    nota: 'Un pianoro a 8 km a nord di Anzio, in scavo dal 2009: ha rivelato la struttura difensiva più antica del Lazio, datata all’XI-X secolo a.C., con un aggere di legno e terra bruciata. Era l’avamposto anziate verso Ardea.'
  },

  'porta-aurea': {
    eyebrow: 'L’uscita verso il mare',
    titolo: 'Porta Aurea',
    nota: 'Il nome tramandato dalla tradizione per la porta meridionale di Antium, «quasi a contatto col mare». Per Lugli era la fine del cardine urbano, la porta della città sul Tirreno; Lombardi la leggeva come ingresso principale della villa dei Cesari. Dove oggi si incontra il confine tra la città antica e il porto.'
  },

  'via-severiana': {
    eyebrow: 'La strada di Settimio Severo',
    titolo: 'Via Severiana',
    nota: 'La strada costiera che da Roma scendeva fino a Terracina passando per Anzio. Il nome si riferisce all’imperatore Settimio Severo, che la fece lastricare tra il 198 e il 209 d.C., ma il tracciato era già in uso dai Volsci: i Romani la potenziarono, non la inventarono.'
  },

  'via-antiatina': {
    eyebrow: 'La strada maestra di Antium',
    titolo: 'Via Antiatina',
    nota: 'La diramazione dell’Appia che dai Colli Albani scendeva al mare, entrava in Antium dalla porta settentrionale e diventava il cardine urbano della città. Il tracciato corrisponde all’odierna Via Roma: duemilacinquecento anni dello stesso asse nord-sud.'
  },

  /* ---------- Strutture e monumenti ---------- */

  'xystus': {
    eyebrow: 'La palestra coperta',
    titolo: 'Xystus',
    nota: 'Il corridoio coperto dove gli atleti si allenavano d’inverno, al riparo dal vento. Vitruvio chiama xystus il corpo lungo e rettangolare del ginnasio. Ad Antium il termine identifica il grande edificio della città alta, tra il Municipio (ex Villa Sarsina) e Villa Albani, lungo l’odierna Via Aldobrandini (la via Roma delle descrizioni più antiche, di cui è la prosecuzione): Lugli notò che le rovine proseguivano dritte sotto la villa, con le terme attaccate.'
  },

  'porto-innocenziano': {
    eyebrow: 'Il porto sbagliato',
    titolo: 'Porto Innocenziano',
    nota: 'Il porto costruito nel 1698 da papa Innocenzo XII sul lato est del promontorio, invece di riutilizzare il porto neroniano: una scelta che Lombardi chiamò «mal’augurata», costosa e mai del tutto riuscita contro l’insabbiamento. Le sue banchine poggiano sui resti del porto romano.'
  },

  'porto-neroniano': {
    eyebrow: 'Il porto di Nerone',
    titolo: 'Porto Neroniano',
    nota: 'Il grande porto circolare voluto da Nerone nella seconda metà del I secolo d.C., con una bocca rivolta a sud-est larga circa 60 metri e 34 ettari di specchio d’acqua. Strabone aveva scritto che Anzio era «senza porto»: Nerone cambiò tutto. I moli sono ancora sott’acqua, visibili in giorni di bassa marea.'
  },

  'ipogeo': {
    eyebrow: 'La tomba sotto terra',
    titolo: 'Ipogeo',
    nota: 'Una camera sepolcrale scavata sotto il livello del suolo, dal greco hypó (sotto) e gaîa (terra). La Mulakia è un ipogeo a gallerie ricavato nel banco di arenaria, con i loculi disposti su più file: una soluzione che, secoli dopo, le catacombe cristiane avrebbero ripreso in modo indipendente.'
  },

  'dromos': {
    eyebrow: 'Il corridoio delle tombe',
    titolo: 'Dromos',
    nota: 'Il corridoio di accesso scoperto che precede l’ingresso di una tomba ipogea, ripreso dalle tradizioni funerarie etrusche. Nella tomba Mulakia il dromos introduce le tre porte come nelle necropoli etrusche più antiche.'
  },

  'strigili': {
    eyebrow: 'L’arnese degli atleti',
    titolo: 'Strigile',
    nota: 'Un raschietto ricurvo in bronzo con cui gli atleti antichi si toglievano da pelle olio, sudore e polvere dopo l’esercizio. Trovarli nel corredo di una tomba indica spesso una sepoltura maschile legata al mondo del ginnasio. Nella Mulakia comparivano insieme a vasellame, fusarole, collane e specchi.'
  },

  'gentilizio': {
    eyebrow: 'Il nome della famiglia',
    titolo: 'Nome gentilizio',
    nota: 'Il nome che nell’onomastica romana indicava la gens, cioè la famiglia o il clan di appartenenza, l’equivalente antico del nostro cognome. «Mulakia» è un gentilizio femminile di origine campana: il segno di una famiglia immigrata dall’area campano-sannitica e stabilitasi ad Anzio.'
  },

  'otia': {
    eyebrow: 'Il riposo che vale',
    titolo: 'Otia',
    nota: 'Plurale di otium, il tempo libero dell’aristocrazia romana: non pigrizia, ma riposo nobile dedicato allo studio, alla conversazione e all’arte, l’opposto del negotium, gli affari e la politica. Anzio, quieta e affacciata sul mare a due passi da Roma, era il luogo perfetto per gli otia dell’élite senatoria.'
  },

  'volumen': {
    eyebrow: 'Il libro prima del libro',
    titolo: 'Volumen',
    nota: 'Il libro antico: un lungo foglio di papiro arrotolato attorno a un bastoncino, che si srotolava da un lato e si riavvolgeva dall’altro via via che si leggeva. Da volumen, «rotolo», viene la nostra parola «volume». La Fanciulla d’Anzio ne porta uno semiaperto sul vassoio, tra gli oggetti del rito.'
  },

  'collegium': {
    eyebrow: 'Le confraternite di Roma',
    titolo: 'Collegium',
    nota: 'Un’associazione riconosciuta dell’antica Roma: poteva riunire artigiani dello stesso mestiere, fedeli di un culto o addetti di una casa, con cassa comune, feste e riti propri. Nella villa imperiale di Anzio i Fasti attestano un collegium in onore della famiglia Giulio-Claudia, con festività e giochi dedicati.'
  },

  'caffeaus': {
    eyebrow: 'Il salotto dei giardini nobiliari',
    titolo: 'Caffeaus',
    nota: 'Un edificio privato nei giardini nobiliari, pensato per il riposo e la conversazione lontano dalle formalità del palazzo. Nato in Europa intorno al 1700 come risposta aristocratica ai caffè pubblici borghesi. I più celebri esempi romani sono il Quirinale (1741) e Palazzo Colonna (1731); quello di Anzio (1743) era il terzo in ordine di tempo.'
  },

  /* ---------- Figure storiche ---------- */

  'coriolano': {
    eyebrow: 'Il romano che voleva distruggere Roma',
    titolo: 'Caio Marzio Coriolano',
    nota: 'Nobile romano esiliato che nel 489 a.C. si rifugiò ad Anzio, convinse i Volsci a marciare su Roma e fu fermato dalle lacrime di sua madre. Tornato ad Anzio, fu ucciso nel foro della città dall’uomo che lo aveva accolto. La storiografia moderna discute se sia mai esistito davvero.'
  },

  'rostri': {
    eyebrow: 'Da Anzio al Foro di Roma',
    titolo: 'Rostri (rostra)',
    nota: 'Gli speroni di bronzo montati sulla prua delle navi da guerra. Nel 338 a.C. i rostri delle navi anziati furono staccati e inchiodati alla tribuna degli oratori nel Foro Romano, che da allora si chiamò Rostra. Il nome di ogni tribuna politica del mondo occidentale è partito da una spiaggia di Anzio.'
  },

  /* ---------- Termini tecnici (aggiuntivi) ---------- */

  'facies-laziale': {
    eyebrow: 'La cultura funeraria dei Latini antichi',
    titolo: 'Facies laziale',
    nota: 'Il nome con cui gli archeologi identificano la cultura materiale e funeraria dei Latini dell’età del Bronzo e del Ferro (XII-VIII sec. a.C.): urne biconiche, corredi miniaturistici, incinerazioni. Ad Antium appartiene al «gruppo Roma-Colli Albani»: la stessa tradizione che poi darà origine a Roma.'
  },

  /* ---------- Il teatro romano: parole di scena ---------- */

  'scaenae-frons': {
    eyebrow: 'Il fondale di marmo',
    titolo: 'Scaenae frons',
    nota: 'La parete monumentale alle spalle degli attori: due o tre ordini di colonne, nicchie e statue, alta quanto la gradinata più alta. Non era solo decorazione, ma una cassa acustica che rimbalzava la voce verso il pubblico. Quella di Antium aveva tre porte, secondo la regola di Vitruvio.'
  },

  'orchestra': {
    eyebrow: 'Dal coro ai senatori',
    titolo: 'Orchestra',
    nota: 'Lo spazio semicircolare ai piedi della gradinata. In Grecia era un cerchio intero per il coro; a Roma, dove il coro perse peso, si ridusse a semicerchio, fu pavimentato a marmi colorati e riempito di sedili d’onore per senatori e ospiti illustri.'
  },

  'pulpitum': {
    eyebrow: 'Il palcoscenico',
    titolo: 'Pulpitum',
    nota: 'Il palco vero e proprio, davanti alla scena. Ad Antium non poteva superare il metro e mezzo d’altezza: le autorità sedevano in basso, nell’orchestra, e un palco troppo alto avrebbe tolto loro la visuale. Sotto, stanze sotterranee per attrezzi e camerini.'
  },

  'vomitoria': {
    eyebrow: 'Come svuotare un teatro in pochi minuti',
    titolo: 'Vomitoria',
    nota: 'I corridoi coperti che bucavano la massa della gradinata e sbucavano in mezzo ai sedili. Da lì la struttura «vomitava» gli spettatori nel loro settore: da qui il nome. Percorsi separati per ranghi diversi, così che nobili e popolani non si incrociassero mai.'
  },

  'bisellia': {
    eyebrow: 'I posti d’onore',
    titolo: 'Bisellia',
    nota: 'Sedili doppi, larghi abbastanza per una persona sola: un lusso ostentato. Stavano nell’orchestra, riservati a senatori, patroni della città e ospiti di riguardo. Sedersi su un bisellio era un onore pubblico, concesso dalla città.'
  },

  'porticus-post-scaenam': {
    eyebrow: 'Il foyer del mondo antico',
    titolo: 'Porticus post scaenam',
    nota: 'Il grande colonnato dietro la scena, prescritto da Vitruvio: riparava il pubblico dalla pioggia improvvisa, faceva da spazio di passeggio e di affari tra giardini e fontane, e custodiva le macchine sceniche. Ad Antium aveva diciotto colonne, poi ridotte a quattordici.'
  },

  'auleum': {
    eyebrow: 'Il sipario che scende',
    titolo: 'Auleum',
    nota: 'Il sipario del teatro romano faceva il contrario del nostro: a inizio spettacolo veniva abbassato dentro una fossa, scoprendo la scena di colpo; alla fine veniva risollevato con argani e contrappesi. Si diceva «aulaeum premitur», il sipario viene abbassato, non alzato.'
  },

  'opus-sectile': {
    eyebrow: 'Tecniche di pavimento',
    titolo: 'Opus sectile',
    nota: 'Lastre di marmi colorati tagliate e composte a disegno, come un mosaico di grandi tessere. Più pregiato del mosaico minuto, rivestiva i pavimenti di lusso: ad Antium copriva l’orchestra del teatro, riservata alle autorità.'
  },

  'opus-caementicium': {
    eyebrow: 'Il calcestruzzo dei Romani',
    titolo: 'Opus caementicium',
    nota: 'Il conglomerato di malta e pietrame che i Romani inventarono e che cambiò l’architettura per sempre: si gettava nelle casseforme e induriva in massa, permettendo volte e arcate enormi. Le spesse pareti dei vomitoria del teatro, fatte così, trattenevano tanto calore che in epoca tarda furono riusate come fornaci.'
  },

  'marmi-colorati': {
    eyebrow: 'I colori del lusso imperiale',
    titolo: 'Cipollino, giallo antico, pavonazzetto',
    nota: 'I marmi pregiati che rivestivano il teatro, ciascuno da una cava lontana dell’impero: il cipollino venato di verde dall’Eubea, il giallo antico dorato dalla Numidia, il pavonazzetto bianco-violaceo dalla Frigia. Importarli da mezzo Mediterraneo era una dichiarazione di ricchezza.'
  },

  /* ---------- Tombe, terme, decorazione, materiali ---------- */

  'loculi': {
    eyebrow: 'Le nicchie dei morti',
    titolo: 'Loculi',
    nota: 'Le nicchie rettangolari scavate nelle pareti di una tomba sotterranea, dove si deponevano i corpi o le urne. Nella tomba Mulakia corrono su tre file sovrapposte: si sfruttava l’altezza per moltiplicare i posti senza allargare lo scavo, una soluzione che anticipa di secoli le catacombe cristiane.'
  },

  'commesso-laterizio': {
    eyebrow: 'Pavimenti di cotto',
    titolo: 'Commesso laterizio',
    nota: 'Un pavimento fatto di mattoni e frammenti di cotto tagliati e accostati a disegno: povero di materia ma durissimo all’uso e resistente all’acqua. Michetti lo posò al piano basso del Cisternone quando lo adattò a deposito.'
  },

  'emiciclo': {
    eyebrow: 'La curva di mezzo cerchio',
    titolo: 'Emiciclo',
    nota: 'Una struttura a semicerchio, come l’incavo di una cavea o di un’abside. Ad Antium la parola torna per il «cosiddetto teatro» della città alta: l’edificio curvo che per secoli si scambiò per un teatro e che era invece un settore termale.'
  },

  'stipe-votiva': {
    eyebrow: 'Le offerte sepolte',
    titolo: 'Stipe votiva',
    nota: 'Il deposito di doni che i fedeli lasciavano a un santuario, statuette di terracotta, monete, vasetti, accumulati e poi sepolti nel terreno sacro perché non si potevano buttare. Una stipe affiorata nel 1879 in un orto è l’unico vero indizio del perduto tempio della Fortuna di Anzio.'
  },

  'ninfeo': {
    eyebrow: 'La grotta delle ninfe',
    titolo: 'Ninfeo',
    nota: 'Una finta grotta da giardino, ornata di fontane, statue e mosaici, dove l’acqua scorreva da nicchie e zampilli: un angolo fresco per l’otium nelle ville di lusso. Quello della villa imperiale di Anzio era dipinto «a giardino», con un grande pannello di caccia.'
  },

  'ipocausto': {
    eyebrow: 'Il calore sotto il pavimento',
    titolo: 'Ipocausto',
    nota: 'Il forno e l’intercapedine che scaldavano le terme romane dal basso: l’aria calda di un braciere circolava sotto i pavimenti sospesi e dentro le pareti cave, poi usciva dai comignoli. Riscaldamento a pavimento, duemila anni fa.'
  },

  'diaeta': {
    eyebrow: 'La stanza con vista',
    titolo: 'Diaeta',
    nota: 'Un ambiente di soggiorno della villa romana, in parte coperto e in parte aperto, con portici e fontane, fatto per vivere all’aria godendo il panorama. Per Lugli il «teatro marittimo» di Anzio era proprio una diaeta: non un luogo di spettacolo, ma una terrazza per l’ozio sul mare.'
  },

  'cementizio-pozzolanico': {
    eyebrow: 'Il cemento che indurisce nel mare',
    titolo: 'Cementizio pozzolanico',
    nota: 'Il calcestruzzo romano impastato con la pozzolana, la sabbia vulcanica dei Campi Flegrei: gettato sott’acqua faceva presa e induriva invece di sgretolarsi. Fu il segreto dei moli del porto di Nerone, le cui casseforme di legno portano ancora le sigle punzonate dei costruttori.'
  },

  'marmi-greci': {
    eyebrow: 'Pario e pentelico',
    titolo: 'I marmi greci della Fanciulla',
    nota: 'Due marmi pregiati dall’Egeo: il pario, candido e a grana fine, dall’isola di Paro; il pentelico, dai riflessi appena azzurri, dal monte vicino ad Atene. La Fanciulla d’Anzio li usa entrambi, il pario per la spalla nuda e il pentelico per la veste, per distinguere al tatto la pelle dal tessuto.'
  },

  'pentelico': {
    eyebrow: 'Il marmo dell’Acropoli',
    titolo: 'Pentelico',
    nota: 'Il marmo bianco con cui fu costruito il Partenone, cavato sul monte Pentelico vicino ad Atene. Col tempo prende una calda patina dorata, per il ferro che contiene. Sulla Fanciulla d’Anzio veste le pieghe del panneggio, mentre il pario, più candido, fa la pelle nuda: due marmi diversi per distinguere al tatto la stoffa dalla carne.'
  },

  'volte-cassettoni': {
    eyebrow: 'Il soffitto a riquadri',
    titolo: 'Volte a cassettoni',
    nota: 'Soffitti voltati suddivisi in riquadri incavati, i cassettoni, riempiti di stucchi, rosoni e dorature: alleggerivano la volta e la trasformavano in decorazione. Soffredini, intorno al 1845, vide ancora nella villa imperiale corridoi voltati «con fogliami e rosoni nel centro».'
  },

  'tablino': {
    eyebrow: 'La stanza dello studio',
    titolo: 'Tablino',
    nota: 'La stanza principale della casa romana, aperta sull’atrio, dove il padrone teneva i suoi archivi e riceveva gli ospiti importanti. Il nome viene dalle tabulae, le tavolette di cera dei documenti di famiglia. Spesso decorata con mosaici e affreschi, mostrava il rango della casata.'
  },

  'cubicula': {
    eyebrow: 'Le stanze da letto',
    titolo: 'Cubicula',
    nota: 'Le camere da letto della casa romana, di solito piccole e prive di finestre, ricavate nel corpo della casa per conservare il fresco. Decorate con affreschi e mosaici, arredate con letti ricchi di cuscini: erano gli spazi privati della famiglia, uno per il padrone, gli altri per familiari e ospiti.'
  },

  'triclinio': {
    eyebrow: 'La sala da pranzo',
    titolo: 'Triclinio',
    nota: 'La sala da pranzo della casa romana, arredata con tre lettighe (le klinai) disposte sui tre lati di un tavolo centrale: il padrone e gli ospiti vi mangiavano sdraiati, secondo la tradizione greco-romana. Era il cuore della vita sociale della villa, spesso quello rivolto al panorama migliore.'
  }
};

/* Daten und Helfer des Kontobereichs.
 *
 * Gleiche Bauart wie im Bestand: feste Angaben im Skript, veraenderlicher
 * Zustand in localStorage. Der Warenkorb ist derselbe Speicher, den
 * Produktseite, Warenkorb und Stueckliste lesen (conradCart) - eine
 * Nachbestellung aus dem Konto landet also im echten Wagen.
 *
 * Alle Betraege sind NETTO. Der Shop rechnet fuer Geschaeftskunden netto,
 * der Kontobereich der Produktion rechnet brutto und widerspricht sich dabei
 * (Befund B8). Hier gilt durchgehend eine Grundlage.
 */
(function () {
  'use strict';

  var MWST = 0.19;
  var HEUTE = new Date('2026-09-24T09:00:00');

  // --- Unternehmen ---------------------------------------------------------
  // Einfache Ebene: Stammdaten, wer bestellt, worauf gebucht wird. Keine
  // Rechte, keine Rollenverwaltung, keine Freigaben.
  var firma = {
    name: 'Elektro Brandhuber GmbH',
    zusatz: 'Elektroinstallation und Schaltanlagenbau',
    strasse: 'Wendelsteinstr. 9',
    plz: '85579',
    ort: 'Neubiberg',
    land: 'Deutschland',
    kundennummer: '0016297222',
    ustId: 'DE812345678',
    zahlart: 'Rechnung',
    zahlungsziel: '16 Tage netto'
  };

  var benutzer = [
    { id: 'u1', name: 'Nico Santangelo', mail: 'nico.santangelo@elektro-brandhuber.de',
      funktion: 'Einkauf', seit: '2023-04-11', ichSelbst: true },
    { id: 'u2', name: 'Sabine Weller', mail: 's.weller@elektro-brandhuber.de',
      funktion: 'Technik', seit: '2024-01-08' },
    { id: 'u3', name: 'Thomas Obermeier', mail: 't.obermeier@elektro-brandhuber.de',
      funktion: 'Buchhaltung', seit: '2022-09-01' }
  ];

  var lieferadressen = [
    { id: 'a1', label: 'Firmensitz', name: 'Elektro Brandhuber GmbH',
      zeile: 'Wendelsteinstr. 9', ort: '85579 Neubiberg', standard: true },
    { id: 'a2', label: 'Baustelle Halle 3', name: 'Elektro Brandhuber GmbH / Halle 3',
      zeile: 'Gewerbering 24', ort: '85586 Poing', ansprech: 'S. Weller' }
  ];

  // --- Positionen ----------------------------------------------------------
  // sku und bild passen zum Bestand, damit eine Nachbestellung eine echte
  // Warenkorbzeile ergibt und nicht nur einen Namen.
  function pos(sku, packSize, titel, menge, einzel, bild) {
    return { sku: sku, packSize: packSize, titel: titel, menge: menge, einzel: einzel, bild: bild || null };
  }

  var bestellungen = [
    {
      nr: '2017621738', datum: '2026-09-22', 
      status: 'bearbeitung', lieferung: '2026-09-25',
      versand: 0, referenz: 'Halle 3 / 2. Bauabschnitt',
      adresse: 'a2',
      sendungen: [
        { status: 'bearbeitung', versender: 'Conrad Electronic', termin: '2026-09-25',
          adresse: 'a2', pos: [0, 1, 2] }
      ],
      positionen: [
        pos('221-413', 50, 'WAGO 221-413-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Orange Box', 40, 14.99, 'bilder/klein/wago-221-413-01.webp'),
        pos('221-415', 25, 'WAGO 221-415-25 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 5 Transparent, Orange Box', 24, 13.79, 'bilder/klein/wago-221-415-01.webp'),
        pos('221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 120, 0.87, null)
      ]
    },
    {
      nr: '2017619004', datum: '2026-09-18', 
      status: 'versendet', lieferung: '2026-09-25',
      versand: 5.95, referenz: 'Wartung Umspannstation', adresse: 'a1',
      sendungen: [
        { status: 'versendet', versender: 'Voltus Elektro', termin: '2026-09-25',
          sendung: '00340161386265956229', frachtfuehrer: 'DHL', adresse: 'a1', pos: [0, 1] }
      ],
      positionen: [
        pos('221-423', 50, 'WAGO 221-423-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Grün Box', 20, 17.50, 'bilder/klein/wago-221-423-01.webp'),
        pos('221-412', 100, 'WAGO 221-412-100 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 2 Transparent, Orange Box', 2, 3.45, 'bilder/klein/wago-221-412-01.webp')
      ]
    },
    {
      nr: '2017604117', datum: '2026-09-11', 
      status: 'zugestellt', lieferung: '2026-09-15',
      versand: 0, referenz: 'Halle 3 / Grundausstattung', adresse: 'a2',
      sendungen: [
        { status: 'zugestellt', versender: 'Conrad Electronic', termin: '2026-09-15',
          sendung: '00340161386265739983', frachtfuehrer: 'DHL', adresse: 'a2', pos: [0, 1] }
      ],
      positionen: [
        pos('221-420', 15, 'WAGO 221-420-15 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 10 Transparent, Orange Box', 60, 40.60, 'bilder/klein/wago-221-420-01.webp'),
        pos('221-613', 1, 'WAGO 221-613 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 3 Transparent, Orange', 500, 0.95, 'bilder/klein/wago-221-613-01.webp')
      ]
    },
    {
      nr: '2017588250', datum: '2026-08-28', 
      status: 'zugestellt', lieferung: '2026-09-01',
      versand: 5.95, referenz: '', adresse: 'a1',
      sendungen: [
        { status: 'zugestellt', versender: 'Conrad Electronic', termin: '2026-09-01',
          sendung: '00340161386261190689', frachtfuehrer: 'DHL', adresse: 'a1', pos: [0] }
      ],
      positionen: [
        pos('221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 100, 0.87, null)
      ]
    },
    {
      nr: '2017551903', datum: '2026-08-14', 
      status: 'teilversand', lieferung: '2026-09-29',
      versand: 0, referenz: 'Nachbestellung Lager', adresse: 'a1',
      sendungen: [
        { status: 'versendet', versender: 'Conrad Electronic', termin: '2026-08-18',
          sendung: '00340161386259912044', frachtfuehrer: 'DHL', adresse: 'a1', pos: [0] },
        { status: 'bearbeitung', versender: 'Conrad Electronic', termin: '2026-09-29',
          adresse: 'a1', pos: [1], grund: 'Artikel wird nachproduziert' }
      ],
      positionen: [
        pos('221-413', 100, 'WAGO 221-413-100 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Orange Box', 20, 26.99, 'bilder/klein/wago-221-413-01.webp'),
        pos('221-425', 25, 'WAGO 221-425-25 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 5 Transparent, Grün Box', 5, 14.50, 'bilder/klein/wago-221-425-01.webp')
      ],
      offenePositionen: 1
    },
    {
      nr: '2017498612', datum: '2026-07-30', 
      status: 'zugestellt', lieferung: '2026-08-03',
      versand: 0, referenz: 'Halle 3 / Erstbestellung', adresse: 'a2',
      sendungen: [
        { status: 'zugestellt', versender: 'Conrad Electronic', termin: '2026-08-03',
          sendung: '00340161386255401118', frachtfuehrer: 'DHL', adresse: 'a2', pos: [0, 1] }
      ],
      positionen: [
        pos('221-412', 50, 'WAGO 221-412-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 2 Transparent, Orange Box', 50, 12.49, 'bilder/klein/wago-221-412-01.webp'),
        pos('221-615', 1, 'WAGO 221-615 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 5 Transparent, Orange', 300, 1.60, 'bilder/klein/wago-221-615-01.webp')
      ]
    },
    {
      nr: '2017466085', datum: '2026-07-02', 
      status: 'storniert', lieferung: null,
      versand: 0, referenz: '', adresse: 'a1',
      sendungen: [],
      storniertAm: '2026-07-03',
      stornoGrund: 'Auf Wunsch des Unternehmens vor dem Versand storniert.',
      positionen: [
        pos('221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 50, 0.87, null)
      ]
    }
  ];

  var rechnungen = [
    { nr: '9784752944', datum: '2026-09-19', faellig: '2026-10-05', bestellung: '2017619004',
      art: 'rechnung', status: 'offen', netto: 356.90 },
    { nr: '9784721380', datum: '2026-09-12', faellig: '2026-09-28', bestellung: '2017604117',
      art: 'rechnung', status: 'offen', netto: 2911.00 },
    { nr: '9784698215', datum: '2026-08-29', faellig: '2026-09-14', bestellung: '2017588250',
      art: 'rechnung', status: 'ueberfaellig', netto: 92.95 },
    { nr: '9784612077', datum: '2026-08-15', faellig: '2026-08-31', bestellung: '2017551903',
      art: 'rechnung', status: 'ausgeglichen', netto: 612.30 },
    { nr: '9784421427', datum: '2026-08-03', faellig: null, bestellung: '2017498612',
      art: 'gutschrift', status: 'erstattet', netto: -214.90 },
    { nr: '9784553019', datum: '2026-07-31', faellig: '2026-08-16', bestellung: '2017498612',
      art: 'rechnung', status: 'ausgeglichen', netto: 1104.50 }
  ];

  // Merklisten tragen Namen, die der Einkauf selbst vergibt. Die Produktion
  // nennt sie "Merkliste vom 03.07.2026" (Befund E1).
  // Merklisten haengen am Firmenkonto, nicht an einer Person. Ein Feld
  // "angelegt von" gibt es in den Daten nicht, also steht es auch nicht in
  // der Tabelle. Dasselbe gilt fuer Stuecklisten.
  var merklisten = [
    { id: 'm1', name: 'Halle 3 / Elektroinstallation', angelegt: '2026-07-03', geaendert: '2026-09-20',
      artikel: 14, wert: 1842.60, bild: 'bilder/klein/wago-221-413-01.webp' },
    { id: 'm2', name: 'Standardlager Werkstatt', angelegt: '2026-03-18', geaendert: '2026-08-01',
      artikel: 7, wert: 318.45, bild: 'bilder/klein/wago-221-415-01.webp' },
    { id: 'm3', name: 'Angebot Stadtwerke (Entwurf)', angelegt: '2026-09-12', geaendert: '2026-09-12',
      artikel: 3, wert: 96.30, bild: null }
  ];

  // Gespeicherte Stuecklisten. "ohneTreffer" kommt aus dem Abgleich des
  // Werkzeugs und ist damit echte Angabe, kein erfundenes Feld.
  // Die Zeilen einer gespeicherten Liste. "roh" ist, was in der
  // hochgeladenen Datei stand; ohne Treffer bleibt nur das stehen.
  function zeile(roh, sku, packSize, titel, menge, einzel, bild) {
    return { roh: roh, sku: sku, packSize: packSize, titel: titel,
             menge: menge, einzel: einzel, bild: bild || null };
  }
  var stuecklisten = [
    { id: 's1', name: 'Halle 3 / Schaltschrank A', angelegt: '2026-09-08', geaendert: '2026-09-19',
      zuletztBestellt: '2026-09-11',
      zeilen: [
        zeile('221-413-50;Verbindungsklemme 3-Leiter;20', '221-413', 50, 'WAGO 221-413-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Orange Box', 20, 14.99, 'bilder/klein/wago-221-413-01.webp'),
        zeile('221-415-25;Verbindungsklemme 5-Leiter;40', '221-415', 25, 'WAGO 221-415-25 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 5 Transparent, Orange Box', 40, 13.79, 'bilder/klein/wago-221-415-01.webp'),
        zeile('221-420-15;Verbindungsklemme 10-Leiter;30', '221-420', 15, 'WAGO 221-420-15 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 10 Transparent, Orange Box', 30, 40.60, 'bilder/klein/wago-221-420-01.webp'),
        zeile('221-500;Befestigungsadapter;250', '221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 250, 0.87, null)
      ] },
    { id: 's2', name: 'Wartungspaket Umspannstation', angelegt: '2026-08-12', geaendert: '2026-08-14',
      zuletztBestellt: '2026-08-14',
      zeilen: [
        zeile('221-613;Verbindungsklemme 6 mm²;120', '221-613', 1, 'WAGO 221-613 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 3 Transparent, Orange', 120, 0.95, 'bilder/klein/wago-221-613-01.webp'),
        zeile('221-615;Verbindungsklemme 6 mm² 5-Leiter;80', '221-615', 1, 'WAGO 221-615 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 5 Transparent, Orange', 80, 1.60, 'bilder/klein/wago-221-615-01.webp'),
        zeile('SIE-3RV2011-1JA10;Leistungsschalter;4', null, null, null, 4, 0, null),
        zeile('PHOENIX-3044076;Reihenklemme UT 2,5;60', null, null, null, 60, 0, null)
      ] },
    { id: 's3', name: 'Ausschreibung Stadtwerke 2026', angelegt: '2026-09-21', geaendert: '2026-09-21',
      zuletztBestellt: null,
      zeilen: [
        zeile('221-412-100;Verbindungsklemme 2-Leiter;25', '221-412', 100, 'WAGO 221-412-100 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 2 Transparent, Orange Box', 25, 26.99, 'bilder/klein/wago-221-412-01.webp'),
        zeile('221-423-50;Verbindungsklemme 3-Leiter Green;30', '221-423', 50, 'WAGO 221-423-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Grün Box', 30, 17.50, 'bilder/klein/wago-221-423-01.webp'),
        zeile('WAGO-XYZ-4711;Sonderklemme;12', null, null, null, 12, 0, null),
        zeile('ABB-2CDS251001R0164;Leitungsschutzschalter;18', null, null, null, 18, 0, null),
        zeile('HAGER-VZ321N;Sammelschiene;6', null, null, null, 6, 0, null)
      ] }
  ];
  // Abgeleitet statt doppelt gepflegt: Anzahl, offene Zeilen und Summe
  // ergeben sich aus den Zeilen.
  stuecklisten.forEach(function (l) {
    l.positionen = l.zeilen.length;
    l.ohneTreffer = l.zeilen.filter(function (z) { return !z.sku; }).length;
    l.summe = l.zeilen.reduce(function (s, z) { return s + (z.sku ? z.menge * z.einzel : 0); }, 0);
  });

  var ruecksendungen = [
    { nr: 'RMA-2026-0417', datum: '2026-08-01', bestellung: '2017498612', status: 'erstattet',
      grund: 'Falsche Verpackungseinheit bestellt', betrag: 214.90,
      artikel: 'WAGO 221-412-50 Verbindungsklemme, 10 Sets' },
    { nr: 'RMA-2026-0503', datum: '2026-09-19', bestellung: '2017588250', status: 'pruefung',
      grund: 'Artikel nicht benötigt', betrag: 26.10,
      artikel: 'WAGO 221-500 Befestigungsadapter, 30 Stück' }
  ];

  // --- Helfer --------------------------------------------------------------
  function euro(n) {
    return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
  }
  function datum(iso) {
    if (!iso) return '–';
    var d = new Date(iso + 'T00:00:00');
    return ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear();
  }
  function tageBis(iso) {
    return Math.round((new Date(iso + 'T00:00:00') - HEUTE) / 86400000);
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function netto(b) {
    return b.positionen.reduce(function (s, p) { return s + p.menge * p.einzel; }, 0);
  }
  function person(id) {
    var u = benutzer.filter(function (x) { return x.id === id; })[0];
    return u ? u.name : '–';
  }
  function adresse(id) {
    return lieferadressen.filter(function (x) { return x.id === id; })[0] || lieferadressen[0];
  }

  // Ein Wort und eine Farbe je Zustand. Basis ist .bom-status aus der
  // Stueckliste, damit im Prototyp nur eine Statuspille existiert.
  var STATUS = {
    bearbeitung: { text: 'In Bearbeitung', klasse: 'warn' },
    versendet:   { text: 'Versendet',      klasse: 'ok' },
    teilversand: { text: 'Teilweise versendet', klasse: 'warn' },
    zugestellt:  { text: 'Zugestellt',     klasse: 'ok' },
    storniert:   { text: 'Storniert',      klasse: 'err' },
    offen:        { text: 'Offen',         klasse: 'warn' },
    ueberfaellig: { text: 'Überfällig',    klasse: 'err' },
    ausgeglichen: { text: 'Ausgeglichen',  klasse: 'ok' },
    erstattet:    { text: 'Erstattet',     klasse: 'ok' },
    pruefung:     { text: 'In Prüfung',    klasse: 'warn' }
  };
  function pille(schluessel) {
    var s = STATUS[schluessel] || { text: schluessel, klasse: 'warn' };
    return '<span class="bom-status ' + s.klasse + '">' + esc(s.text) + '</span>';
  }

  // --- Nachbestellen -------------------------------------------------------
  // Schreibt in denselben Speicher wie Produktseite und Warenkorb.
  function warenkorbLesen() {
    try {
      var v = JSON.parse(localStorage.getItem('conradCart'));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function nachbestellen(positionen) {
    var wagen = warenkorbLesen();
    positionen.forEach(function (p) {
      var vorhanden = wagen.filter(function (z) {
        return z.sku === p.sku && z.packSize === p.packSize;
      })[0];
      if (vorhanden) { vorhanden.qty += p.menge; return; }
      var preise = {}; preise[p.packSize] = p.einzel;
      wagen.push({
        sku: p.sku, bestellNr: '', title: p.titel,
        config: p.packSize === 1 ? 'Einzelstück' : p.packSize + 'er-Set',
        packSize: p.packSize, qty: p.menge, packSizes: [p.packSize], packPrices: preise,
        minPieces: 1, img: p.bild, href: 'wago221.html', note: 'Aus dem Konto nachbestellt'
      });
    });
    try { localStorage.setItem('conradCart', JSON.stringify(wagen)); } catch (e) { /* voll */ }
    document.dispatchEvent(new CustomEvent('conrad:cart-changed'));
    return positionen.length;
  }

  // --- Bankverbindung ------------------------------------------------------
  // Liegt im Speicher, weil drei Seiten davon abhaengen: das Profil zeigt sie,
  // die Zahlungsart braucht sie fuer den Bankeinzug, die Belegliste weist auf
  // ihr Fehlen hin. Ohne gemeinsamen Zustand wuerde eine Seite behaupten, die
  // Angabe fehle, waehrend sie auf der anderen schon steht.
  var BANK_KEY = 'conradBankverbindung';
  function bankLesen() {
    try { return JSON.parse(localStorage.getItem(BANK_KEY)) || null; } catch (e) { return null; }
  }
  function bankSchreiben(daten) {
    try {
      if (daten) localStorage.setItem(BANK_KEY, JSON.stringify(daten));
      else localStorage.removeItem(BANK_KEY);
    } catch (e) { /* ohne Speicher */ }
    document.dispatchEvent(new CustomEvent('conrad:bank-changed'));
  }

  // Pruefsumme nach ISO 13616: die ersten vier Zeichen ans Ende, Buchstaben in
  // Zahlen, und der Rest modulo 97 muss 1 sein. Faengt Zahlendreher ab, die
  // eine reine Laengenpruefung durchlaesst.
  var IBAN_LAENGE = { DE: 22, AT: 20, CH: 21, NL: 18, FR: 27, IT: 27, BE: 16, LU: 20, PL: 28, ES: 24 };
  function ibanPruefen(roh) {
    var iban = String(roh || '').toUpperCase().replace(/[\s-]/g, '');
    if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return 'Bitte geben Sie eine IBAN ein, zum Beispiel DE02 1203 0000 0000 2020 51.';
    var land = iban.slice(0, 2);
    if (!IBAN_LAENGE[land]) return 'Für das Länderkürzel ' + land + ' können wir die IBAN nicht prüfen.';
    if (iban.length !== IBAN_LAENGE[land]) {
      return 'Eine IBAN aus ' + land + ' hat ' + IBAN_LAENGE[land] + ' Zeichen, diese hat ' + iban.length + '.';
    }
    var umgestellt = iban.slice(4) + iban.slice(0, 4);
    var zahl = '';
    for (var i = 0; i < umgestellt.length; i++) {
      var z = umgestellt.charAt(i);
      zahl += /[0-9]/.test(z) ? z : String(z.charCodeAt(0) - 55);
    }
    var rest = 0;
    for (var j = 0; j < zahl.length; j++) rest = (rest * 10 + Number(zahl.charAt(j))) % 97;
    if (rest !== 1) return 'Die Prüfziffer stimmt nicht. Bitte vergleichen Sie die IBAN mit Ihrem Kontoauszug.';
    return null;
  }
  function ibanGruppiert(iban) {
    return String(iban).replace(/(.{4})/g, '$1 ').trim();
  }
  // Anzeigen ohne die vollstaendige Nummer: Land, Pruefziffer, letzte vier.
  function ibanVerdeckt(iban) {
    var i = String(iban);
    return i.slice(0, 4) + ' ' + '•••• '.repeat(Math.max(0, Math.ceil((i.length - 8) / 4))).trim() + ' ' + i.slice(-4);
  }

  // --- Kurzmeldung ---------------------------------------------------------
  // Gleicher Baustein wie die Snackbar der Produktseite.
  function melden(text) {
    var alt = document.querySelector('.konto-toast');
    if (alt) alt.remove();
    var el = document.createElement('div');
    el.className = 'toast konto-toast';
    el.setAttribute('role', 'status');
    el.innerHTML = '<span class="toast-msg">' + esc(text) + '</span>';
    document.body.appendChild(el);
    setTimeout(function () {
      el.classList.add('out');
      setTimeout(function () { el.remove(); }, 260);
    }, 3200);
  }

  window.KONTO = {
    MWST: MWST, HEUTE: HEUTE,
    firma: firma, benutzer: benutzer, lieferadressen: lieferadressen,
    bestellungen: bestellungen, rechnungen: rechnungen, ruecksendungen: ruecksendungen,
    merklisten: merklisten, stuecklisten: stuecklisten,
    euro: euro, datum: datum, tageBis: tageBis, esc: esc, netto: netto,
    person: person, adresse: adresse, pille: pille, STATUS: STATUS,
    nachbestellen: nachbestellen, melden: melden,
    bankLesen: bankLesen, bankSchreiben: bankSchreiben,
    ibanPruefen: ibanPruefen, ibanGruppiert: ibanGruppiert, ibanVerdeckt: ibanVerdeckt
  };
})();

/* Zaehler in der Seitennavigation. Stehen im Markup als leere Platzhalter und
   werden hier gefuellt, damit sie nicht in sechs Dateien auseinanderlaufen.
 *
 * Eine Bauart, eine Bedeutung: der Zaehler sagt, wie viele Vorgaenge dort auf
 * etwas warten - unterwegs, offen, in Pruefung. Er zaehlt nicht den Bestand.
 * Deshalb tragen Merklisten, Stuecklisten und Unternehmen keinen: dort wartet
 * nichts. Und deshalb gibt es keine Farbvarianten - dass eine Rechnung
 * ueberfaellig ist, steht in der Liste, nicht in der Navigation. */
(function () {
  function fuellen() {
    var K = window.KONTO;
    if (!K) return;
    var offen = K.rechnungen.filter(function (r) {
      return r.status === 'offen' || r.status === 'ueberfaellig';
    });
    var unterwegs = K.bestellungen.filter(function (b) {
      return b.status === 'versendet' || b.status === 'teilversand' || b.status === 'bearbeitung';
    }).length;
    var laufend = K.ruecksendungen.filter(function (r) { return r.status === 'pruefung'; }).length;
    var werte = {
      bestellungen: unterwegs,
      rechnungen: offen.length,
      ruecksendungen: laufend
    };
    Object.keys(werte).forEach(function (name) {
      var el = document.querySelector('[data-nav-count="' + name + '"]');
      if (!el) return;
      if (!werte[name]) { el.remove(); return; }
      el.textContent = werte[name];
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fuellen);
  else fuellen();
})();

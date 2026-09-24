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
      funktion: 'Einkauf', kostenstelle: 'KST-4200', seit: '2023-04-11', bestellungen: 4, ichSelbst: true },
    { id: 'u2', name: 'Sabine Weller', mail: 's.weller@elektro-brandhuber.de',
      funktion: 'Technik', kostenstelle: 'KST-4100', seit: '2024-01-08', bestellungen: 2 },
    { id: 'u3', name: 'Thomas Obermeier', mail: 't.obermeier@elektro-brandhuber.de',
      funktion: 'Buchhaltung', kostenstelle: 'KST-1000', seit: '2022-09-01', bestellungen: 1 }
  ];

  var kostenstellen = [
    { nr: 'KST-1000', name: 'Verwaltung' },
    { nr: 'KST-4100', name: 'Instandhaltung' },
    { nr: 'KST-4200', name: 'Neubau Halle 3' }
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
      nr: '2017621738', datum: '2026-09-22', besteller: 'u1', kostenstelle: 'KST-4200',
      status: 'bearbeitung', lieferung: '2026-09-25', versender: 'Conrad Electronic',
      versand: 0, referenz: 'Halle 3 / 2. Bauabschnitt',
      adresse: 'a2',
      positionen: [
        pos('221-413', 50, 'WAGO 221-413-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Orange Box', 40, 14.99, 'bilder/klein/wago-221-413-01.webp'),
        pos('221-415', 25, 'WAGO 221-415-25 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 5 Transparent, Orange Box', 24, 13.79, 'bilder/klein/wago-221-415-01.webp'),
        pos('221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 120, 0.87, null)
      ]
    },
    {
      nr: '2017619004', datum: '2026-09-18', besteller: 'u2', kostenstelle: 'KST-4100',
      status: 'versendet', lieferung: '2026-09-25', versender: 'Voltus Elektro',
      versand: 5.95, referenz: 'Wartung Umspannstation',
      sendung: '00340161386265956229', frachtfuehrer: 'DHL', adresse: 'a1',
      positionen: [
        pos('221-423', 50, 'WAGO 221-423-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Grün Box', 20, 17.50, 'bilder/klein/wago-221-423-01.webp'),
        pos('221-412', 100, 'WAGO 221-412-100 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 2 Transparent, Orange Box', 2, 3.45, 'bilder/klein/wago-221-412-01.webp')
      ]
    },
    {
      nr: '2017604117', datum: '2026-09-11', besteller: 'u1', kostenstelle: 'KST-4200',
      status: 'zugestellt', lieferung: '2026-09-15', versender: 'Conrad Electronic',
      versand: 0, referenz: 'Halle 3 / Grundausstattung',
      sendung: '00340161386265739983', frachtfuehrer: 'DHL', adresse: 'a2',
      positionen: [
        pos('221-420', 15, 'WAGO 221-420-15 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 10 Transparent, Orange Box', 60, 40.60, 'bilder/klein/wago-221-420-01.webp'),
        pos('221-613', 1, 'WAGO 221-613 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 3 Transparent, Orange', 500, 0.95, 'bilder/klein/wago-221-613-01.webp')
      ]
    },
    {
      nr: '2017588250', datum: '2026-08-28', besteller: 'u3', kostenstelle: 'KST-1000',
      status: 'zugestellt', lieferung: '2026-09-01', versender: 'Conrad Electronic',
      versand: 5.95, referenz: '',
      sendung: '00340161386261190689', frachtfuehrer: 'DHL', adresse: 'a1',
      positionen: [
        pos('221-500', 1, 'WAGO 221-500 Serie 221 Befestigungsadapter', 100, 0.87, null)
      ]
    },
    {
      nr: '2017551903', datum: '2026-08-14', besteller: 'u2', kostenstelle: 'KST-4100',
      status: 'teilversand', lieferung: '2026-09-29', versender: 'Conrad Electronic',
      versand: 0, referenz: 'Nachbestellung Lager',
      sendung: '00340161386259912044', frachtfuehrer: 'DHL', adresse: 'a1',
      positionen: [
        pos('221-413', 100, 'WAGO 221-413-100 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 3 Transparent, Orange Box', 20, 26.99, 'bilder/klein/wago-221-413-01.webp'),
        pos('221-425', 25, 'WAGO 221-425-25 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 5 Transparent, Grün Box', 5, 14.50, 'bilder/klein/wago-221-425-01.webp')
      ],
      offenePositionen: 1
    },
    {
      nr: '2017498612', datum: '2026-07-30', besteller: 'u1', kostenstelle: 'KST-4200',
      status: 'zugestellt', lieferung: '2026-08-03', versender: 'Conrad Electronic',
      versand: 0, referenz: 'Halle 3 / Erstbestellung',
      sendung: '00340161386255401118', frachtfuehrer: 'DHL', adresse: 'a2',
      positionen: [
        pos('221-412', 50, 'WAGO 221-412-50 221 Verbindungsklemme flexibel: 0.14-4 mm² starr: 0.2-4 mm² Polzahl: 2 Transparent, Orange Box', 50, 12.49, 'bilder/klein/wago-221-412-01.webp'),
        pos('221-615', 1, 'WAGO 221-615 221 Verbindungsklemme flexibel: 0.5-6 mm² starr: 0.5-6 mm² Polzahl: 5 Transparent, Orange', 300, 1.60, 'bilder/klein/wago-221-615-01.webp')
      ]
    },
    {
      nr: '2017466085', datum: '2026-07-02', besteller: 'u1', kostenstelle: 'KST-1000',
      status: 'storniert', lieferung: null, versender: 'Conrad Electronic',
      versand: 0, referenz: '', adresse: 'a1',
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
  var merklisten = [
    { id: 'm1', name: 'Halle 3 / Elektroinstallation', angelegt: '2026-07-03', geaendert: '2026-09-20',
      besitzer: 'u1', artikel: 14, wert: 1842.60, bild: 'bilder/klein/wago-221-413-01.webp' },
    { id: 'm2', name: 'Standardlager Werkstatt', angelegt: '2026-03-18', geaendert: '2026-08-01',
      besitzer: 'u2', artikel: 7, wert: 318.45, bild: 'bilder/klein/wago-221-415-01.webp' },
    { id: 'm3', name: 'Angebot Stadtwerke (Entwurf)', angelegt: '2026-09-12', geaendert: '2026-09-12',
      besitzer: 'u1', artikel: 3, wert: 96.30, bild: null }
  ];

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
    firma: firma, benutzer: benutzer, kostenstellen: kostenstellen, lieferadressen: lieferadressen,
    bestellungen: bestellungen, rechnungen: rechnungen, ruecksendungen: ruecksendungen,
    merklisten: merklisten,
    euro: euro, datum: datum, tageBis: tageBis, esc: esc, netto: netto,
    person: person, adresse: adresse, pille: pille, STATUS: STATUS,
    nachbestellen: nachbestellen, melden: melden
  };
})();

/* Zaehler in der Seitennavigation. Stehen im Markup als leere Platzhalter und
   werden hier gefuellt, damit sie nicht in sechs Dateien auseinanderlaufen. */
(function () {
  function fuellen() {
    var K = window.KONTO;
    if (!K) return;
    var offen = K.rechnungen.filter(function (r) {
      return r.status === 'offen' || r.status === 'ueberfaellig';
    });
    var ueber = offen.filter(function (r) { return r.status === 'ueberfaellig'; }).length;
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
      if (name === 'rechnungen' && ueber) el.classList.add('is-warn');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fuellen);
  else fuellen();
})();

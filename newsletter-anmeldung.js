/* ===========================================================================
   Newsletter-Anmeldung im Seitenfuss.
   Dieselbe Logik und derselbe Wortlaut wie in newsletter-konzept.html, nur
   als gemeinsames Bauteil fuer alle Seiten des Prototyps: ein Band ueber dem
   Fuss, Feld und Knopf als eine Einheit, Einwilligung darunter.

   Eine Datei statt achtzehn Abschriften. Die Stile bringt sie selbst mit,
   weil PDP und Warenkorb kein gemeinsames Stylesheet mit dem Kontobereich
   haben.
   ======================================================================== */
(function () {
  'use strict';


  function E(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function svg(d, w) {
    return '<svg viewBox="0 0 24 24" width="' + (w || 16) + '" height="' + (w || 16) + '" fill="none" ' +
      'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  }
  var ZEICHEN_HAKEN = '<polyline points="20 6 9 17 4 12"/>';
  var ZEICHEN_MAIL  = '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 7 12 13 22 7"/>';
  var ZEICHEN_WARN  = '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';

  /* --- Stile ------------------------------------------------------------- */
  var STIL = [
    '.nl-band{background:#001F42;color:#fff;padding:32px 16px}',
    '.nl-inner{max-width:1180px;margin:0 auto;display:grid;gap:24px}',
    '@media(min-width:900px){.nl-inner{grid-template-columns:minmax(0,1fr) minmax(0,520px);gap:48px;align-items:start}}',
    '.nl-band h2{margin:0;font-size:20px;font-weight:700;line-height:1.3}',
    '.nl-sub{margin:6px 0 0;font-size:15px;color:rgba(255,255,255,.72);max-width:52ch}',
    '.nl-fakten{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}',
    '.nl-fakt{padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.12);font-size:12px;font-weight:600}',
    '.nl-form{min-width:0}',
    '.nl-label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:rgba(255,255,255,.88)}',
    '.nl-reihe{display:flex;flex-wrap:wrap}',
    '.nl-reihe input{flex:1 1 200px;min-width:0;height:48px;padding:0 14px;border:1px solid #b6bcc7;',
    'border-right:0;border-radius:4px 0 0 4px;background:#fff;color:#272C35;font:inherit;font-size:16px}',
    '.nl-reihe input[aria-invalid="true"]{border-color:#d9234c}',
    '.nl-reihe input:disabled{background:#f4f5f7;color:#666c7a}',
    '.nl-knopf{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;',
    'height:48px;padding:0 20px;border:0;border-radius:0 4px 4px 0;background:#376EEF;color:#fff;',
    'font:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:background .15s}',
    '.nl-knopf:hover{background:#2b58bd}',
    '.nl-knopf[disabled]{background:#5a6171;cursor:default}',
    '@media(max-width:559px){',
    '.nl-reihe{gap:8px}',
    '.nl-reihe input{flex:1 1 100%;border-right:1px solid #b6bcc7;border-radius:4px}',
    '.nl-knopf{flex:1 1 100%;border-radius:4px}}',
    /* Fester Platz, damit zwischen Ruhe, Fehler und Vorschlag nichts springt. */
    '.nl-meldung{min-height:46px;padding-top:8px;font-size:13px}',
    '.nl-fehler{display:flex;gap:8px;color:#ffb4c4}',
    '.nl-fehler svg{flex-shrink:0;margin-top:2px}',
    '.nl-tipp{color:rgba(255,255,255,.78)}',
    '.nl-tipp button{border:0;background:none;padding:0;font:inherit;font-weight:600;color:#bcd0ff;text-decoration:underline;cursor:pointer}',
    '.nl-einwilligung{display:flex;gap:10px;align-items:flex-start;font-size:12px;line-height:1.5;color:rgba(255,255,255,.7);cursor:pointer}',
    '.nl-einwilligung input{width:17px;height:17px;margin:1px 0 0;flex-shrink:0;accent-color:#376EEF;cursor:pointer}',
    '.nl-einwilligung input[aria-invalid="true"]{outline:2px solid #ffb4c4;outline-offset:2px}',
    '.nl-einwilligung a{color:#bcd0ff}',
    '.nl-hinweis{min-height:38px;margin:8px 0 0;font-size:12px;line-height:1.5;color:rgba(255,255,255,.6)}',
    '@media(max-width:559px){.nl-hinweis{min-height:56px}}',
    '.nl-hinweis .nl-fehler{font-size:12px}',
    '.nl-bandage{display:flex;gap:10px;margin-top:12px;padding:12px 14px;border-radius:8px;',
    'background:rgba(217,35,76,.16);border:1px solid #d9234c;font-size:13px;color:#ffd7df}',
    '.nl-bandage svg{flex-shrink:0;color:#ffb4c4;margin-top:2px}',
    '.nl-ergebnis{display:flex;gap:14px}',
    '.nl-ergebnis-zeichen{flex-shrink:0;width:38px;height:38px;border-radius:50%;display:flex;',
    'align-items:center;justify-content:center;background:rgba(255,255,255,.14)}',
    '.nl-ergebnis h3{margin:0;font-size:17px;line-height:1.3}',
    '.nl-ergebnis p{margin:6px 0 0;font-size:14px;color:rgba(255,255,255,.75)}',
    '.nl-ergebnis ul{margin:10px 0 0;padding-left:18px;font-size:13px;color:rgba(255,255,255,.7)}',
    '.nl-ergebnis li{margin-bottom:4px}',
    '.nl-aktionen{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}',
    '.nl-zweit{display:inline-flex;align-items:center;min-height:38px;padding:0 14px;border:1px solid rgba(255,255,255,.4);',
    'border-radius:4px;background:transparent;color:#fff;font:inherit;font-size:14px;cursor:pointer;text-decoration:none}',
    '.nl-zweit:hover{background:rgba(255,255,255,.1)}',
    '.nl-spinner{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.45);',
    'border-top-color:#fff;animation:nlDreh .7s linear infinite}',
    '@keyframes nlDreh{to{transform:rotate(360deg)}}',
    '@media(prefers-reduced-motion:reduce){.nl-spinner{animation-duration:2.4s}}'
  ].join('');

  var stil = document.createElement('style');
  stil.textContent = STIL;
  document.head.appendChild(stil);

  /* --- Erfundene Antwort. Im Prototyp gelingt die Anmeldung; die anderen
         Ausgaenge stehen im Konzeptprototyp zum Vorfuehren. ---------------- */
  function anmelden(mail) {
    return new Promise(function (fertig) {
      setTimeout(function () {
        var bekannt = [];
        try { bekannt = JSON.parse(localStorage.getItem('conradNewsletterMails')) || []; } catch (e) { bekannt = []; }
        var schon = bekannt.indexOf(mail.toLowerCase()) !== -1;
        if (!schon) {
          bekannt.push(mail.toLowerCase());
          try { localStorage.setItem('conradNewsletterMails', JSON.stringify(bekannt)); } catch (e) { /* voll */ }
        }
        fertig({ art: schon ? 'bekannt' : 'ok' });
      }, 800);
    });
  }

  /* --- Pruefung mit genauer Meldung -------------------------------------- */
  function pruefen(wert) {
    var w = wert.trim();
    if (!w) return 'Bitte geben Sie Ihre E-Mail-Adresse ein.';
    if (w.indexOf(' ') !== -1) return 'Die Adresse enthält ein Leerzeichen. Bitte entfernen Sie es.';
    var teile = w.split('@');
    if (teile.length !== 2) return 'In der Adresse fehlt das @-Zeichen, zum Beispiel name@firma.de.';
    if (!teile[0]) return 'Vor dem @ fehlt der Name, zum Beispiel einkauf@firma.de.';
    if (!teile[1]) return 'Nach dem @ fehlt die Domain, zum Beispiel firma.de.';
    if (teile[1].indexOf('.') === -1) return 'Nach dem @ fehlt die Endung, zum Beispiel firma.de statt firma.';
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(w)) return 'Diese Adresse sieht unvollständig aus. Bitte prüfen Sie den Teil nach dem @.';
    return null;
  }

  var DOMAINS = ['gmail.com', 'googlemail.com', 'gmx.de', 'gmx.net', 'web.de',
    't-online.de', 'outlook.de', 'outlook.com', 'hotmail.de', 'hotmail.com', 'conrad.de'];
  function abstand(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d[i] = [i];
    for (j = 0; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1,
          d[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
      }
    }
    return d[m][n];
  }
  function vorschlag(wert) {
    var teile = wert.trim().toLowerCase().split('@');
    if (teile.length !== 2 || !teile[1]) return null;
    var domain = teile[1];
    if (DOMAINS.indexOf(domain) !== -1) return null;
    var beste = null, bester = 99;
    DOMAINS.forEach(function (d) {
      var a = abstand(domain, d);
      if (a < bester) { bester = a; beste = d; }
    });
    return (beste && bester > 0 && bester <= 2 && domain.length > 3) ? teile[0] + '@' + beste : null;
  }

  var HINWEIS = 'Wir schicken Ihnen zuerst eine Bestätigungsmail; erst nach Ihrem Klick darin geht es los.';

  /* Pruefung, Vorschlag und Wortlaut stehen auch der Newsletter-Seite im Konto
     zur Verfuegung. Eine Quelle statt zweier: sonst sagen zwei Formulare
     desselben Prototyps bei derselben Eingabe Verschiedenes. */
  window.NEWSLETTER = { pruefen: pruefen, vorschlag: vorschlag, HINWEIS: HINWEIS };

  if (document.querySelector('[data-nl-band]')) return;
  /* Nicht auf der Seite, die das Abo schon verwaltet: dort waere ein
     Anmeldeband unter der Abmeldung ein Widerspruch. */
  if (document.body.hasAttribute('data-ohne-nl-band')) return;

  /* --- Bauteil ------------------------------------------------------------ */
  function Formular(wurzel) {
    var zustand = 'ruhe';   /* ruhe | sendet | ok | bekannt */
    var wert = '';
    var zugestimmt = false;
    var feldfehler = null;
    var consentFehler = null;
    var tipp = null;

    function formularHtml() {
      var knopf = '<button type="submit" class="nl-knopf"' + (zustand === 'sendet' ? ' disabled' : '') + '>' +
        (zustand === 'sendet'
          ? '<span class="nl-spinner" aria-hidden="true"></span>Wird gesendet…'
          : 'Abonnieren') + '</button>';

      return '<form novalidate data-nl-form>' +
        '<label class="nl-label" for="nl-mail">Geschäftliche E-Mail-Adresse</label>' +
        '<div class="nl-reihe">' +
          '<input type="email" id="nl-mail" name="mail" autocomplete="email" inputmode="email" ' +
            'spellcheck="false" placeholder="einkauf@firma.de" value="' + E(wert) + '"' +
            (feldfehler ? ' aria-invalid="true" aria-describedby="nl-feldfehler"' : '') +
            (zustand === 'sendet' ? ' disabled' : '') + '>' +
          knopf +
        '</div>' +
        '<div class="nl-meldung" role="status" aria-live="polite">' +
          (feldfehler
            ? '<p class="nl-fehler" id="nl-feldfehler">' + svg(ZEICHEN_WARN, 15) + '<span>' + E(feldfehler) + '</span></p>'
            : (tipp ? '<p class="nl-tipp">Meinten Sie <button type="button" data-nl-tipp>' + E(tipp) + '</button>?</p>' : '')) +
        '</div>' +
        '<label class="nl-einwilligung">' +
          '<input type="checkbox" name="consent"' + (zugestimmt ? ' checked' : '') +
            (consentFehler ? ' aria-invalid="true" aria-describedby="nl-consent"' : '') +
            (zustand === 'sendet' ? ' disabled' : '') + '>' +
          '<span>Ich bin damit einverstanden, den Conrad Newsletter per E-Mail zu erhalten. ' +
          'Ich kann die Einwilligung jederzeit widerrufen, etwa über den Link in jeder Ausgabe. ' +
          '<a href="#">Datenschutzerklärung</a></span>' +
        '</label>' +
        '<p class="nl-hinweis" role="status" aria-live="polite">' +
          (consentFehler
            ? '<span class="nl-fehler" id="nl-consent">' + svg(ZEICHEN_WARN, 14) + '<span>' + E(consentFehler) + '</span></span>'
            : HINWEIS) +
        '</p>' +
      '</form>';
    }

    function ergebnisHtml() {
      if (zustand === 'ok') {
        return '<div class="nl-ergebnis" tabindex="-1" data-nl-ergebnis>' +
          '<span class="nl-ergebnis-zeichen">' + svg(ZEICHEN_MAIL, 20) + '</span>' +
          '<div style="min-width:0">' +
            '<h3>Fast geschafft: bitte im Postfach bestätigen</h3>' +
            '<p>Wir haben eine E-Mail an <b>' + E(wert) + '</b> geschickt. Erst mit dem Klick ' +
            'darin ist die Anmeldung gültig.</p>' +
            '<ul><li>Absender <b>newsletter@conrad.de</b>, Betreff „Bitte bestätigen Sie Ihre Anmeldung“.</li>' +
            '<li>Nichts angekommen? Sehen Sie im Spam-Ordner nach.</li></ul>' +
            '<div class="nl-aktionen">' +
              '<button type="button" class="nl-zweit" data-nl-neu>Andere Adresse eintragen</button>' +
            '</div>' +
          '</div>' +
        '</div>';
      }
      return '<div class="nl-ergebnis" tabindex="-1" data-nl-ergebnis>' +
        '<span class="nl-ergebnis-zeichen">' + svg(ZEICHEN_HAKEN, 20) + '</span>' +
        '<div style="min-width:0">' +
          '<h3>Diese Adresse ist bereits angemeldet</h3>' +
          '<p><b>' + E(wert) + '</b> erhält den Newsletter schon. Sie müssen nichts weiter tun.</p>' +
          '<div class="nl-aktionen">' +
            '<a class="nl-zweit" href="konto-newsletter.html">Einstellungen ändern</a>' +
            '<button type="button" class="nl-zweit" data-nl-neu>Andere Adresse eintragen</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function zeichne(fokus) {
      wurzel.innerHTML = (zustand === 'ok' || zustand === 'bekannt') ? ergebnisHtml() : formularHtml();
      if (fokus === 'feld') {
        var f = wurzel.querySelector('input[type="email"]');
        if (f) { f.focus(); try { f.setSelectionRange(f.value.length, f.value.length); } catch (e) { /* egal */ } }
      }
      if (fokus === 'consent') {
        var c = wurzel.querySelector('input[name="consent"]');
        if (c) c.focus();
      }
      if (fokus === 'ergebnis') {
        var e2 = wurzel.querySelector('[data-nl-ergebnis]');
        if (e2) e2.focus();
      }
    }

    wurzel.addEventListener('input', function (e) {
      if (e.target.name !== 'mail') return;
      wert = e.target.value;
      /* Ohne Neuaufbau: das Eingabefeld bei jedem Zeichen zu ersetzen bricht
         Cursor, Rueckgaengig und Eingabehilfen. */
      if (feldfehler || tipp) {
        feldfehler = null; tipp = null;
        e.target.removeAttribute('aria-invalid');
        e.target.removeAttribute('aria-describedby');
        var platz = wurzel.querySelector('.nl-meldung');
        if (platz) platz.innerHTML = '';
      }
    });

    wurzel.addEventListener('change', function (e) {
      if (e.target.name !== 'consent') return;
      zugestimmt = e.target.checked;
      if (zugestimmt && consentFehler) {
        consentFehler = null;
        e.target.removeAttribute('aria-invalid');
        e.target.removeAttribute('aria-describedby');
        var h = wurzel.querySelector('.nl-hinweis');
        if (h) h.textContent = HINWEIS;
      }
    });

    /* Geprueft wird beim Verlassen des Feldes: waehrend des Tippens ist jede
       Adresse eine Weile lang unfertig. */
    wurzel.addEventListener('focusout', function (e) {
      if (e.target.name !== 'mail' || zustand === 'sendet') return;
      if (!e.target.value.trim()) { tipp = null; zeichne(); return; }
      feldfehler = pruefen(e.target.value);
      tipp = feldfehler ? null : vorschlag(e.target.value);
      zeichne();
    });

    wurzel.addEventListener('click', function (e) {
      var t = e.target.closest('[data-nl-tipp]');
      if (t) { wert = t.textContent; tipp = null; feldfehler = null; zeichne('feld'); return; }
      if (e.target.closest('[data-nl-neu]')) {
        zustand = 'ruhe'; wert = ''; feldfehler = null; consentFehler = null; tipp = null; zugestimmt = false;
        zeichne('feld');
      }
    });

    wurzel.addEventListener('submit', function (e) {
      e.preventDefault();
      if (zustand === 'sendet') return;
      feldfehler = pruefen(wert);
      if (feldfehler) { tipp = null; consentFehler = null; zeichne('feld'); return; }
      if (!zugestimmt) {
        consentFehler = 'Bitte bestätigen Sie die Einwilligung, damit wir Ihnen den Newsletter schicken dürfen.';
        tipp = null;
        zeichne('consent');
        return;
      }
      consentFehler = null;
      tipp = vorschlag(wert);
      zustand = 'sendet';
      zeichne();
      anmelden(wert).then(function (a) {
        zustand = a.art === 'bekannt' ? 'bekannt' : 'ok';
        zeichne('ergebnis');
      });
    });

    zeichne();
  }

  /* --- Einbau ------------------------------------------------------------ */
  /* Auf der Produktseite gibt es schon einen Newsletter-Block. Er wird
     ersetzt, nicht ergaenzt: zwei Anmeldungen auf einer Seite sind eine zu
     viel, und der Sinn dieses Bauteils ist, dass ueberall dasselbe steht. */
  var alt = document.querySelector('section.newsletter');
  var fuss = document.querySelector('.footer-full, .footer-legalbar-solo');
  if (!alt && !fuss) return;

  var band = document.createElement('section');
  band.className = 'nl-band';
  band.setAttribute('data-nl-band', '');
  band.setAttribute('aria-labelledby', 'nl-titel');
  band.innerHTML =
    '<div class="nl-inner">' +
      '<div>' +
        '<h2 id="nl-titel">Alle zwei Wochen: Nettopreise, Neuheiten, Normen</h2>' +
        '<p class="nl-sub">Der Conrad Newsletter für Geschäftskunden. Was neu lieferbar ist, ' +
        'welche Normen sich ändern und welche Aktionen für Ihr Konto gelten.</p>' +
        '<div class="nl-fakten">' +
          '<span class="nl-fakt">Alle zwei Wochen, dienstags</span>' +
          '<span class="nl-fakt">4 Minuten Lesezeit</span>' +
          '<span class="nl-fakt">Jederzeit abbestellbar</span>' +
        '</div>' +
      '</div>' +
      '<div class="nl-form" data-nl-form-wurzel></div>' +
    '</div>';
  if (alt) alt.parentNode.replaceChild(band, alt);
  else fuss.parentNode.insertBefore(band, fuss);

  Formular(band.querySelector('[data-nl-form-wurzel]'));
})();

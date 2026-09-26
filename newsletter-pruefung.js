/* ===========================================================================
   Pruefung einer E-Mail-Adresse, gemeinsam benutzt.
   Genaue Fehlermeldungen statt "ungueltige E-Mail", dazu ein Vorschlag bei
   Tippfehlern in der Domain. Liegt in einer eigenen Datei, damit zwei
   Formulare desselben Prototyps bei derselben Eingabe nicht Verschiedenes
   sagen.
   ======================================================================== */
(function () {
  'use strict';

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

  var HINWEIS = 'Wir schicken Ihnen zuerst eine Bestätigungsmail; erst nach Ihrem Klick darin geht es los.';

  window.NEWSLETTER = { pruefen: pruefen, vorschlag: vorschlag, HINWEIS: HINWEIS };
})();

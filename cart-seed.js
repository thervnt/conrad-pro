// Der Demo-Artikel, mit dem ein leerer Warenkorb startet.
//
// Produktseite und Warenkorb legen beide an, was sie beim ersten Besuch
// vorfinden sollen. Solange jede Seite ihre eigene Fassung dieser Zeile
// baute, entschied die Reihenfolge des Einstiegs, was im Korb landete:
// die Produktseite setzte das aktuelle Produktbild und href, der Warenkorb
// ein altes, eingebettetes Bild und kein href. Die Zeile steht deshalb nur
// noch hier, und beide Seiten legen sie sofort ab, damit Zaehler,
// Kopfzeilen-Menue und Warenkorbseite denselben Stand lesen.
//
// packPrices spiegelt die 50er-Staffel der 221-413 aus getPricing() in
// wago221.html. Aendert sich die Staffel dort, gehoert sie hier nach.
(function () {
  var CART_KEY = 'conradCart';

  function seedItem() {
    return {
      sku: '221-413',
      bestellNr: '1188440',
      polzahl: 3,
      range: 'flexibel: 0.14-4 mm² starr: 0.2-4 mm²',
      variantTag: '',
      packSize: 50,
      qty: 4,
      packSizes: [1, 25, 50, 100],
      packPrices: { 1: 0.40, 25: 7.99, 50: 14.99, 100: 26.99 },
      img: 'bilder/wago-221-413-01.png',
      href: 'wago221.html',
      note: ''
    };
  }

  // Liefert den gespeicherten Korb. Ist keiner da (oder ist er unlesbar),
  // wird der Demo-Artikel angelegt und sofort abgelegt.
  window.conradCartLoad = function () {
    try {
      var v = JSON.parse(localStorage.getItem(CART_KEY));
      if (Array.isArray(v)) return v;
    } catch (e) { /* unlesbar -> neu anlegen */ }
    var seed = [seedItem()];
    try { localStorage.setItem(CART_KEY, JSON.stringify(seed)); } catch (e) { /* Speicher voll */ }
    return seed;
  };
})();

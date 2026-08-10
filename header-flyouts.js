// Auskappmenues der Kopfzeile: Einkaufswagen und Merkliste zeigen den
// echten Stand aus dem Speicher und aktualisieren sich, sobald sich
// etwas aendert (auch aus anderen Modulen heraus).
//
// Frueher lag dieser Baustein dreimal wortgleich in den Seiten. Das Menue
// des Warenkorbs kannte den Startartikel der Produktseite nicht und meldete
// einen leeren Korb, waehrend am Symbol eine 1 stand. Eine Datei fuer alle
// drei Seiten, damit so etwas nicht wieder auseinanderlaeuft.
(function () {
  var CART_KEY = 'conradCart';
  var listEl  = document.querySelector('[data-fly-cart]');
  var countEl = document.querySelector('[data-fly-count]');
  var sumEl   = document.querySelector('[data-fly-sum]');
  var wishEl  = document.querySelector('[data-fly-wishlist]');
  var TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>' +
    '<line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';

  function fmt(n) { return n.toFixed(2).replace('.', ',') + ' \u20ac'; }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  // Eine Quelle fuer den Startzustand: conradCartLoad() aus cart-seed.js legt
  // den Demo-Artikel beim ersten Besuch an und speichert ihn sofort.
  function read() {
    if (typeof window.conradCartLoad === 'function') return window.conradCartLoad();
    try {
      var v = JSON.parse(localStorage.getItem(CART_KEY));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function titel(it) {
    if (it.title) return it.title;
    return 'WAGO ' + it.sku + (it.packSize === 1 ? '' : '-' + it.packSize) +
      ' 221' + (it.variantTag || '') + ' Verbindungsklemme Polzahl: ' + it.polzahl;
  }
  // Zurueck auf die Produktseite, mit der Konfiguration der Zeile.
  // Zubehoer traegt href: null und bleibt unverlinkt; aeltere
  // Warenkorbstaende ohne das Feld sind immer die 221.
  function ziel(it) {
    if (Object.prototype.hasOwnProperty.call(it, 'href') && !it.href) return null;
    if (!it.polzahl) return it.href || null;
    var stil = (it.range && it.range.indexOf('0.5-6') !== -1) ? '6' : '4';
    var hebel = it.variantTag ? 'green-range' : 'standard';
    return 'wago221.html?polzahl=' + it.polzahl + '&stil=' + stil +
      '&hebel=' + hebel + '&pack=' + it.packSize;
  }
  // Neutraler Platzhalter, wenn zu einer Position kein Foto vorliegt -
  // sonst zeigt der Browser das Symbol fuer ein kaputtes Bild.
  var BILD_LEER = '<svg class="fly-item-img-leer" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';

  function bildZelle(it) {
    var img = it.img ? '<img src="' + esc(it.img) + '" alt="">' : BILD_LEER;
    var url = ziel(it);
    return url
      ? '<a class="fly-item-img" href="' + url + '">' + img + '</a>'
      : '<span class="fly-item-img">' + img + '</span>';
  }
  function nameZelle(it) {
    var url = ziel(it);
    var t = esc(titel(it));
    return '<span class="fly-item-name">' + (url ? '<a href="' + url + '">' + t + '</a>' : t) + '</span>';
  }
  function preis(it) { return ((it.packPrices && it.packPrices[it.packSize]) || 0) * it.qty; }

  // Das Menue zeigt hoechstens fuenf Zeilen, die zuletzt gelegten zuerst.
  // Der Rest steht hinter dem Verweis auf den Warenkorb. Anzahl und
  // Zwischensumme oben zaehlen weiter den ganzen Korb, nicht die Auswahl.
  var FLY_MAX = 5;

  // Der Zaehler am Symbol kommt aus derselben Liste wie das Menue. Vorher
  // setzte ihn auf der Produktseite ein eigenes Modul, auf der Stueckliste
  // gar keines - dort stand dauerhaft die 1 aus dem Markup. classList bleibt
  // unberuehrt, damit die Bump-Animation beim Hinzufuegen weiterlaeuft.
  function setCartBadge(n) {
    var badge = document.querySelector('[data-cart-badge]');
    if (!badge) return;
    badge.textContent = String(n);
    badge.style.display = n > 0 ? '' : 'none';
  }

  function render() {
    if (!listEl) return;
    var items = read();
    var summe = items.reduce(function (s, it) { return s + preis(it); }, 0);
    setCartBadge(items.length);
    if (countEl) countEl.textContent = items.length + ' Artikel';
    if (sumEl) sumEl.textContent = items.length ? 'Zwischensumme: ' + fmt(summe) : '';
    // Der eigene Index wandert mit: der Loeschknopf zeigt auf die echte
    // Zeile im Speicher, nicht auf die Position in der gekuerzten Liste.
    var zeilen = items.map(function (it, i) { return { it: it, i: i }; })
      .reverse()
      .slice(0, FLY_MAX);
    var rest = items.length - zeilen.length;
    listEl.innerHTML = items.length
      ? '<div class="fly-list">' + zeilen.map(function (z) {
          var it = z.it;
          return '<div class="fly-item">' +
            bildZelle(it) +
            '<span>' + nameZelle(it) +
              '<span class="fly-item-qty">' + it.qty + (it.packSize === 1 ? ' St\u00fcck' : ' Sets') + '</span></span>' +
            '<span class="fly-item-right">' +
              '<button type="button" class="fly-item-del" data-fly-del="' + z.i + '" ' +
                'aria-label="Artikel entfernen">' + TRASH + '</button>' +
              '<span class="fly-item-price">' + fmt(preis(it)) + '</span>' +
            '</span>' +
          '</div>';
        }).join('') + '</div>' +
        (rest > 0
          ? '<a class="fly-more" href="cart.html">' +
              (rest === 1 ? 'Noch 1 weiterer Artikel' : 'Noch ' + rest + ' weitere Artikel') +
              ' im Einkaufswagen</a>'
          : '')
      : '<p class="fly-empty">Ihr Einkaufswagen ist leer</p>';
  }

  // --- Merkliste: eigener Speicher, damit das Menue echte Produkte
  //     zeigen kann. Eintraege haben dieselbe Form wie Warenkorbzeilen.
  var WISH_KEY = 'conradWishlist';
  function readWish() {
    try {
      var v = JSON.parse(localStorage.getItem(WISH_KEY));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function writeWish(list) {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(list)); } catch (e) { /* voll */ }
    renderWish();
    setWishBadge();
  }
  function wishKey(it) { return it.sku + '|' + it.packSize; }
  function setWishBadge() {
    var badge = document.querySelector('[data-wishlist-badge]');
    if (!badge) return;
    var n = readWish().length;
    badge.textContent = String(n);
    badge.style.display = n > 0 ? '' : 'none';
  }
  window.conradWish = {
    read: readWish,
    has: function (it) {
      var k = wishKey(it);
      return readWish().some(function (w) { return wishKey(w) === k; });
    },
    toggle: function (it) {
      var list = readWish();
      var k = wishKey(it);
      var i = list.findIndex(function (w) { return wishKey(w) === k; });
      if (i >= 0) list.splice(i, 1);
      else list.push(it);
      writeWish(list);
      return i < 0;
    }
  };

  // Dieselbe Begrenzung wie im Warenkorb-Menue. Eine Merklistenseite gibt es
  // nicht (der Verweis oben zeigt auf #), der Rest bleibt deshalb ein
  // Hinweis statt eines ins Leere fuehrenden Verweises.
  function renderWish() {
    if (!wishEl) return;
    var list = readWish();
    var zeilen = list.map(function (it, i) { return { it: it, i: i }; })
      .reverse()
      .slice(0, FLY_MAX);
    var rest = list.length - zeilen.length;
    wishEl.innerHTML = list.length
      ? '<div class="fly-list">' + zeilen.map(function (z) {
          var it = z.it;
          return '<div class="fly-item">' +
            bildZelle(it) +
            '<span>' + nameZelle(it) +
              '<span class="fly-item-qty">' + (it.packSize === 1 ? 'Einzelst\u00fcck' : it.packSize + 'er-Set') + '</span></span>' +
            '<span class="fly-item-right">' +
              '<button type="button" class="fly-item-del" data-wish-del="' + z.i + '" ' +
                'aria-label="Von der Merkliste entfernen">' + TRASH + '</button>' +
              '<span class="fly-item-price">' + fmt((it.packPrices && it.packPrices[it.packSize]) || 0) + '</span>' +
            '</span>' +
          '</div>';
        }).join('') + '</div>' +
        (rest > 0
          ? '<p class="fly-more as-note">' +
              (rest === 1 ? 'Noch 1 weiterer Artikel' : 'Noch ' + rest + ' weitere Artikel') +
              ' auf der Merkliste</p>'
          : '')
      : '<p class="fly-empty">Sie haben noch keine Merkliste erstellt</p>';
  }

  if (wishEl) {
    wishEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-wish-del]');
      if (!btn) return;
      var list = readWish();
      list.splice(Number(btn.dataset.wishDel), 1);
      writeWish(list);
      document.dispatchEvent(new CustomEvent('conrad:wishlist-changed'));
    });
  }
  document.addEventListener('conrad:wishlist-changed', function () { renderWish(); setWishBadge(); });

  if (listEl) {
    listEl.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-fly-del]');
      if (!btn) return;
      var items = read();
      items.splice(Number(btn.dataset.flyDel), 1);
      try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (err) { /* voll */ }
      document.dispatchEvent(new CustomEvent('conrad:cart-changed'));
    });
  }
  document.addEventListener('conrad:cart-changed', function () { render(); renderWish(); });
  render();
  renderWish();
  setWishBadge();
  // Der Speicher steht erst hier bereit - das Herz der Buybox wurde
  // beim ersten Aufbau der Seite noch ohne ihn gezeichnet.
  if (typeof window.syncWishlistButton === 'function') window.syncWishlistButton();
  window.refreshHeaderFlyouts = function () { render(); renderWish(); };
})();

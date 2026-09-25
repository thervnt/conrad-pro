#!/usr/bin/env python3
"""Stempelt die gemeinsamen Dateien mit einem Inhaltskuerzel.

Ohne das laden HTML und CSS/JS unabhaengig voneinander aus dem Cache. Auf
GitHub Pages gilt max-age=600: wer konto-daten.js im Cache hat und danach eine
frische konto-bestellungen.html bekommt, sieht eine Seite, die Felder liest,
die es in seiner Fassung der Daten noch nicht gibt - "undefined" in der Zelle
und Verweise auf Bilder, die es nicht mehr gibt.

Aufruf vor jedem Commit, der eine der gemeinsamen Dateien anfasst:

    python3 stempel.py
"""
import glob, hashlib, io, os, re, sys

GEMEINSAM = ['konto.css', 'konto-huelle.css', 'konto-daten.js',
             'cart-seed.js', 'header-flyouts.js']

def kuerzel(pfad):
    with open(pfad, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()[:8]

def main():
    staempel = {d: kuerzel(d) for d in GEMEINSAM if os.path.exists(d)}
    geaendert = []
    for seite in sorted(glob.glob('*.html')):
        text = io.open(seite, encoding='utf-8').read()
        neu = text
        for datei, stempel in staempel.items():
            # href="konto.css" oder href="konto.css?v=abc12345" -> neuer Stempel
            muster = r'((?:href|src)=")' + re.escape(datei) + r'(?:\?v=[0-9a-f]{8})?(")'
            neu = re.sub(muster, r'\g<1>' + datei + '?v=' + stempel + r'\g<2>', neu)
        if neu != text:
            io.open(seite, 'w', encoding='utf-8').write(neu)
            geaendert.append(seite)
    for datei, stempel in sorted(staempel.items()):
        print('%-18s ?v=%s' % (datei, stempel))
    print('%d Seiten gestempelt%s' % (len(geaendert), ': ' + ', '.join(geaendert) if geaendert else ''))
    return 0

if __name__ == '__main__':
    sys.exit(main())

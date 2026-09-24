# 00 Prototype baseline

Reference document for the account area concept. Describes the prototype in this
repository as it exists today. Nothing in the repository was modified to produce
this document.

Commit at time of writing: `b3b4261`. Live at https://thervnt.github.io/conrad-pro/

---

## 1. Tech stack

| Aspect | Reality in this repository |
|---|---|
| Framework | none |
| Build step | none |
| Package manager | none (no `package.json`) |
| Markup | hand written HTML5, one file per page |
| CSS | inline `<style>` blocks inside each page, plain CSS with custom properties |
| JS | inline `<script>` blocks plus two shared files, vanilla ES5/ES6, no modules |
| Fonts | Inter via Google Fonts (`400, 500, 600, 700`) |
| Icons | inline SVG, no icon library |
| Hosting | GitHub Pages, static, no server |

### Correction to the brief

The task description names the design system as "Fuse, based on shadcn-vue +
Tailwind". **That does not apply to this repository.** There is no Vue, no
Tailwind, no shadcn, no npm dependency of any kind. The prototype is three
self contained HTML files. Any account page built here has to follow the same
pattern, which means hand written CSS against the token set in section 4.

This is the single largest difference between the brief and the artefact, and it
has to be resolved before Phase 2 produces code. Two options:

1. Build the account pages the way the prototype is built (static HTML, inline
   CSS, tokens below). Consistent with PDP and cart, zero setup, no reuse of Fuse.
2. Introduce a build step and port the shell to shadcn-vue + Tailwind. Consistent
   with Fuse, but then PDP and cart become the odd ones out, and the brief
   forbids changing them.

Recommendation: option 1 for the concept prototype, with the token table below
handed to the Fuse team as the mapping document.

---

## 2. Files

| File | Lines | Role |
|---|---|---|
| `wago221.html` | 7287 | Product detail page (PDP). Carries the richest component inventory. |
| `cart.html` | 3087 | Cart page. Carries the summary box, line item cards and empty state. |
| `stueckliste.html` | 3315 | Bill of materials upload and match tool. Carries the only real data table. |
| `cart-seed.js` | 45 | Seeds one demo line into `localStorage` on first visit, shared by all pages. |
| `header-flyouts.js` | 224 | Header flyouts for cart and wishlist, wishlist store, cart badge, shared by all pages. |
| `bilder/`, `bilder/klein/` | 48 + 48 WebP | Product photography at 800 px and 160 px. |
| `datenblatt/`, `dokumente/` | 13 PDF | Datasheets and document card targets. |
| `recht/` | 3 | Legal pages. |

There is no router. Navigation is plain `href` between files, with configuration
carried in query parameters (`wago221.html?polzahl=3&stil=4&hebel=standard&pack=50`).

---

## 3. Page shell

Every page repeats the same shell inline. There is no include mechanism, so the
shell exists three times and drifts when it is edited in only one place.

```
<div class="promo-strip">          USP bar, 4 claims, navy
<header class="header">            logo, Kategorien, Conrad PRO, Geschäftskunde
                                   switch, Hilfe & Support, Merkliste, Einkaufswagen,
                                   Konto, then the search row
<nav class="breadcrumb">           text breadcrumb with chevron separators
<main class="...-main">            page content, max-width 1680px
<footer>                           PDP: full marketing footer
                                   cart, stueckliste: .footer-legalbar-solo only
<aside class="hdr-drawer left">    Kategorien drawer
<aside class="hdr-drawer right">   Konto drawer
<button class="to-top">            back to top, appears past one viewport height
```

### The account IA already exists in the prototype

`cart.html` lines 2954 to 2976, the Konto drawer, already defines an account
navigation. This is the starting point for Phase 2, not the production sitemap:

```
Konto
Conrad PRO
Bestellungen
Merklisten
Stücklisten          <- not in production
Angebotsanforderung  <- not in production
Rechnungen & Gutschriften
Adressen
Zahlungsart
Rücksendungen
Newsletter
--
Geschäftskunde (price mode switch)
Kundenservice
```

Every entry except `Stücklisten` points at `#`. The drawer is the only account
surface that exists today.

---

## 4. Design tokens

Defined once per page in `:root`. Identical across the three pages.

### Colour

| Token | Value | Use |
|---|---|---|
| `--c-blue` | `#376EEF` | primary action, selection, links |
| `--c-blue-hover` | `#2856c9` | primary action hover |
| `--c-navy` | `#001F42` | header, promo strip, footer |
| `--c-page-bg` | `#F4F5F7` | page background |
| `--c-bg-white` | `#ffffff` | card surface |
| `--c-bg-tint` | `#f8f9fb` | hover tint, quiet blocks |
| `--c-text` | `#272C35` | body text |
| `--c-text-secondary` | `#5a6171` | labels, 4.5:1 on white |
| `--c-text-tertiary` | `#666c7a` | fine print, 4.5:1 on white |
| `--c-text-on-dark` | `#FEFEFF` | text on navy and blue |
| `--c-border` | `#cfd4dd` | dividers, card edges |
| `--c-border-control` | `#b6bcc7` | resting outline of operable surfaces |
| `--c-border-strong` | `#6f7787` | hover strengthening |
| `--c-success` | `#218972` | free shipping, positive |
| `--c-success-bg` | `#E0F4EE` | status pill background |
| `--c-success-text` | `#0F3D2E` | status pill text |
| `--c-success-on-dark` | `#6FE0B4` | ticks on navy |
| `--c-danger` | `#d9234c` | destructive, PDF glyph |
| `--c-warning` | `#b45309` | caution status |
| `--c-blue-tint` | `#eaf0fe` | selected tile |
| `--c-blue-tint-soft` | `#F4F5FE` | quiet blue block |
| `--c-blue-soft` | `#E2E5FA` | secondary button fill |
| `--c-blue-soft-hover` | `#d6dcf8` | secondary button hover |
| `--c-disabled-bg` | `#d6d8de` | disabled fill |
| `--c-disabled-text` | `#6e7588` | disabled label |
| `--c-green` | `#0e8c42` | WAGO brand green |
| `--c-purple-bg`, `--c-purple-icon` | `#ecebfb`, `#5d52c2` | one accent block |

### Radius

`--radius-xs 4px`, `--radius-sm 6px`, `--radius 8px`, `--radius-lg 12px`,
`--radius-pill 999px`.

`--radius-pill` is reserved for status pills and progress bars. Buttons were
deliberately moved off pill radius to 4 to 6 px.

### Type scale

No token set. Sizes are literal and cluster on: 11, 12, 13, 14, 15, 16, 18, 20,
22 px. Body is 14 px. Weights used: 400, 500, 600, 700. Uppercase labels with
`letter-spacing: 0.04em` to `0.5px` appear on table headers and section labels.

### Spacing

No token set. Literal values cluster on a 2 px grid: 2, 4, 6, 8, 10, 12, 14, 16,
18, 20, 24 px. Card padding is 14 to 20 px. Grid gaps are 8 to 16 px.

### Layout

| Value | Where |
|---|---|
| `max-width: 1680px` | promo strip inner, header inner, main, footer inner |
| `1fr 360px` | `.pdp` (content plus buy box) |
| `1fr 400px` | `.cart-layout` (line items plus summary) |
| `400px minmax(380px, 1fr)` | `.product-main` (gallery plus detail) |

### Breakpoints

There is no scale. Fourteen distinct `max-width` queries are in use, most often
640, 767, 900, 1023, 1279, 1366. Plus `max-height: 900px` for the compact buy
box and `prefers-reduced-motion: reduce` in 13 places.

For Phase 2 the account pages should use only 640, 900 and 1279 and the
difference should be recorded, rather than adding two more values to the pile.

---

## 5. Component inventory

Everything is a CSS class. Nothing is a component in a technical sense, so
"reuse" in Phase 2 means copying the class plus its rules into the new page.

### Directly reusable for the account area

| Class | File | What it is |
|---|---|---|
| `.cart-card`, `.summary-card` | cart | white card, `--radius`, 1 px `--c-border` |
| `.bom-table` + `.bom-table-wrap` | stueckliste | the only data table. Horizontal scroll via `overflow-x: auto` on the wrapper, `width: max-content` on the table, uppercase 11 px headers, 12 px cell padding |
| `.bom-status` `.ok` `.warn` `.err` | stueckliste | status pill, pill radius, 12 px, 600 weight, background plus dark text |
| `.delivery-pill` | PDP, cart | delivery promise with bolt icon |
| `.cart-empty` block | cart | empty state: title, subtitle, primary and secondary button, divider |
| `.toast` | PDP | snackbar, inverted colours |
| `.icon-btn`, `.icon-btn-danger` | cart, stueckliste | 32 px icon button with tooltip via `data-tooltip` |
| `.cta` | all | primary button, blue fill |
| `.summary-cta` | cart | primary button, full width |
| `.cart-empty-btn.secondary` | cart | secondary button, `--c-blue-soft` fill |
| `.bom-btn-ghost` | stueckliste | tertiary button |
| `.id-chip`, `.id-chip-value` | PDP | label plus copyable value with copy glyph and "kopiert" feedback |
| `.bom-chip` | stueckliste | filter chip with `.is-active` |
| `.summary-acc` | cart | `<details>` accordion, centred toggle |
| `.faq-item` | PDP | `<details>` accordion in a bordered card |
| `.hdr-drawer` | all | right or left side drawer with backdrop |
| `.summary-info` | cart, stueckliste | info glyph with CSS tooltip |
| `.doc-item`, `.doc-open` | PDP | document row: icon, title, filename, open button |
| `.delivery-pill`, `.stock-text` | PDP, cart | availability line |
| `.to-top` | all | floating back to top button |

### Not reusable, PDP specific

`.vtile` variant tiles, `.pack-pill`, `.discount-popover`, `.probanner`,
`.newsletter-*`, `.image-thumb` gallery, `.compare-*` series comparison.

### Missing for the account area

No pagination, no bulk selection, no checkbox, no date range picker, no tabs
other than the PDP content tabs, no breadcrumb variant for deep pages, no
two column settings form, no avatar, no role or permission chip, no side
navigation. These have to be created in Phase 2 and are listed as new
components there.

---

## 6. Recurring patterns

**Page header.** No shared pattern. The cart uses `.cart-title-row` with an H1
plus a count and a toolbar on the right. The stueckliste uses a plain H1 plus
lead paragraph. The account area needs one pattern for all pages.

**Buttons.** Three levels, consistently applied: primary blue fill, secondary
`--c-blue-soft` fill, tertiary ghost. Icon buttons are a fourth, always 32 px
with a tooltip.

**Hover.** As of commit `63c8d40` hover is bound to function, not to component:
selection gets a blue border, an outlined operable surface gets
`--c-border-strong`, a surface that opens a route gets tint plus
`--c-border-strong`, a card containing its own controls gets a shadow, a filled
button darkens its own fill, text and borderless toggles underline. The account
pages must follow this.

**Empty states.** Only one exists (`cart.html`, empty cart): title, one sentence,
primary plus secondary action, then a divider and a secondary offer. Good model
for the account area.

**Loading states.** None exist anywhere in the prototype. Everything renders
synchronously from in file data.

**Error states.** One pattern, in the stueckliste: a status pill plus an inline
`<select>` with a `--c-warning` border to resolve the row. No page level error
state exists.

**Mobile.** Cards stack, grids collapse to `1fr`, the cart summary moves below
the line items, the PDP grows a fixed bottom buy bar. Tables scroll
horizontally rather than reflowing.

**Price mode.** The header carries a `Geschäftskunde` / `Privatkunde` switch,
persisted in `localStorage`. Business is the default and shows net prices with
`zzgl. MwSt.`. This is central for the account area: order totals and invoices
have to follow the same switch.

---

## 7. Mock data

Two mechanisms, both without a backend.

**In file constants.** Each page declares its data as JS objects near the top of
its main script: `polzahlOptions`, `skuByCombo`, `pricingByCombo`, `stockBySku`,
`DOKUMENTE`, `SERIES_PRODUCTS`, `SHEETS`, `MARKTPLATZ`, and on the stueckliste a
`KATALOG` array of eight articles with `bestellNr`, `mpn`, `ean`, `name`,
`packSize`, `preis`, `bestand`, optional `versender` and `lieferTage`.

**`localStorage` for cross page state.**

| Key | Written by | Shape |
|---|---|---|
| `conradCart` | all three pages | array of line objects: `sku`, `bestellNr`, `polzahl`, `range`, `variantTag`, `packSize`, `qty`, `packSizes`, `packPrices`, `verpackung`, `minPieces`, `img`, `href`, `note` |
| `conradWishlist` | `header-flyouts.js` | same line shape |
| `conradNewsletterMails` | PDP | array of strings |
| `conradProTrial` | cart | flag |
| price mode key | all | `'private'` or absent |

For Phase 2 the account pages should follow the same approach: a
`konto-daten.js` with realistic German B2B fixtures (company, cost centres,
order numbers, invoice numbers, users), plus `localStorage` for anything the
user changes, so that a reorder from the account lands in the same `conradCart`
the cart page reads.

---

## 8. What the account area inherits

A concrete checklist for Phase 2.

1. Same shell: promo strip, header with both drawers, breadcrumb, main at
   1680 px, legal bar footer (not the full marketing footer, following
   `cart.html`), to top button.
2. Same tokens, no new colours without adding them to `:root` in all files.
3. Same button hierarchy and the function based hover system.
4. Net prices by default, following the `Geschäftskunde` switch.
5. `.bom-table` as the basis for every list view, including its horizontal
   scroll behaviour on narrow screens.
6. `.bom-status` as the basis for every status pill.
7. `.id-chip-value` for every number the user has to quote: order number,
   invoice number, tracking number, customer number.
8. `conradCart` as the target of every reorder action.

---

## 9. Known weaknesses of the baseline itself

Recorded so that Phase 2 does not copy them.

1. The shell is duplicated three times. A fourth to eighth copy for the account
   pages makes drift certain. Phase 2 should extract the shell into a shared JS
   file the way `header-flyouts.js` already works, or accept the duplication
   explicitly and list it as debt.
2. No spacing or type tokens. Literal px values everywhere.
3. Fourteen breakpoints.
4. No loading and no page level error pattern.
5. `cart.html` and `stueckliste.html` carry a full copy of the PDP stylesheet
   including rules for components they do not use.

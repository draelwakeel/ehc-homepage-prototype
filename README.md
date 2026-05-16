# Egypt Heart Clinic (EHC) — Homepage Prototype

Arabic-first (RTL) static homepage prototype. Pure HTML/CSS/JS — no build tools required.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
cd ehc-homepage-prototype
python3 -m http.server 8080
# then visit http://localhost:8080
```

## File map

| File | Purpose |
|---|---|
| `index.html` | All page markup, in Arabic with `dir="rtl"`. Sections are clearly commented (utility banner, nav, hero, trust strip, pathway, second opinion, services, letter, glossary, articles, contact, footer, floating WhatsApp). |
| `styles.css` | All visual styling. **All color tokens and type are defined in `:root` at the top of the file.** |
| `script.js` | Sticky-header shadow, mobile nav toggle, counter count-up, reveal-on-scroll, FAQ accordion behavior, smooth-scroll. Respects `prefers-reduced-motion`. |
| `favicon.svg` | Inline EKG mark in brand navy + gold. |

## Editing copy

All copy lives in `index.html`. Sections are commented with HTML comment banners (e.g. `<!-- ============== Hero ============== -->`) — locate the section, edit the Arabic text directly. Numerals in the trust strip are Arabic-Indic (٠١٢٣٤٥٦٧٨٩). The JS counter animation reads the integer target from `data-count` on each `.trust-num` — update both the visible text and `data-count` together.

## Editing colors

Open `styles.css` and edit the variables in `:root` (top of the file):

```css
:root {
  --c-primary-navy: #0F203C;
  --c-secondary-navy: #003E79;
  --c-medical-teal: #007B8C;
  --c-bright-blue: #009AD8;
  --c-accent-teal: #00D5A8;
  --c-white: #FFFFFF;
  --c-gold: #D4AF37;
  --c-matte-gold: #C0A060;
  --c-red: #D72638; /* emergency-only — never used on CTAs */
  ...
}
```

All sections reference these tokens — change once, propagates everywhere.

### Font

Loaded from Google Fonts in `<head>`:

```html
<link href="https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
```

Weights 300–800 are available. The CSS variable `--font-sans` controls the stack.

## Design constraints honored

- **Arabic-first RTL.** `<html lang="ar" dir="rtl">`. All layouts use logical properties (`inset-inline-end`, `padding-inline-start`) so RTL/LTR mirror correctly.
- **No stock imagery.** The hero visual is a layered CSS+SVG EHC brand card in a polished frame. Service section visuals are custom SVGs.
- **Subtle EKG animation.** Inline SVG behind the hero, stroke-dash drawing on a 6s loop. Stops when `prefers-reduced-motion: reduce`.
- **No auto popups, no sliders, no video backgrounds, no red CTAs, no generic AI blobs.** Geometric SVG art with brand palette only.
- **Red used only for emergency text** (`.emergency-note` in the contact section).
- **Floating WhatsApp** pinned to the right edge of the viewport (RTL-safe via `inset-inline-end`).
- **Accessibility:** semantic landmarks (`header`, `nav`, `main`, `footer`), labelled regions, `aria-expanded` on the mobile toggle, visible focus ring (`:focus-visible`), `prefers-reduced-motion` disables all animations and the WA pulse.
- **Responsive:** breakpoints at 1024 / 768 / 480. Mobile nav becomes a drawer; service rows stack with image-first order on small screens.

## Sections (in document order)

1. Utility banner — location, hours, phone, EN/AR toggle
2. Sticky header with brand mark, primary nav, primary CTA
3. Hero — eyebrow, title with gold underline, subtitle, two CTAs, three trust badges, professional CSS portrait card, animated EKG line
4. Trust counters — 4-up strip on dark navy with gold separators
5. Patient pathway — 4 numbered cards
6. Second opinion band — dark navy gradient with check list and stat asides
7. Services — 3 alternating rows (Congenital / Adult cardiac / Thoracic), each with custom SVG art
8. Letter to patients — editorial layout on cream background
9. Glossary / FAQ preview — 2-column `<details>` accordions
10. Articles + video preview — feature card with play button + 2 supporting cards
11. Contact — methods (WhatsApp / Call / Map) + emergency note + decorative CSS map preview with pulsing pin
12. Footer — 4-column with brand, links, contact

## Notes for next iteration

- Replace the CSS brand card with a real photograph when approved assets are ready — keep the gold frame (`.portrait-card::before`).
- The map preview is decorative; swap for an embedded Google Maps / Mapbox iframe when needed (keep `.map-card` dimensions).
- Add real WhatsApp number to `https://wa.me/<number>` and replace `tel:16234`.
- Trust counters avoid outcome/success claims. Confirm any experience years, clinic branches, and service categories before publishing.

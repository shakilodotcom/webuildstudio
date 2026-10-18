# Heist homepage — Shopify rebuild

A rebuild of the heist.co homepage as a **separate page template**. It uses its own
layout, so it doesn't replace or change the store's current homepage, header,
footer or theme settings.

Reference: the live https://www.heist.co/ homepage (desktop at 1440px, mobile at 390px).

## Files

```
layout/heist.liquid                 Own layout: loads heist.css/js, static header + footer
templates/page.heist-home.json      Page template with all section content and copy
sections/heist-header.liquid        Fonts, announcement, nav (top / scrolled-up), sticky CTA, mobile drawer
sections/heist-hero.liquid          Scroll-captured hero + mobile story panel
sections/heist-product-showcase.liquid
sections/heist-video-feature.liquid
sections/heist-quality.liquid
sections/heist-comparison.liquid
sections/heist-reviews.liquid
sections/heist-late-night.liquid
sections/heist-brewing-guide.liquid
sections/heist-social-gallery.liquid
sections/heist-footer.liquid
snippets/heist-image|media|icon|wordmark.liquid
assets/heist.css, assets/heist.js   No dependencies
```

## Section outline (in page order)

| # | Section | Live equivalent | Notes |
|---|---------|-----------------|-------|
| — | Header | `header_section` | Announcement bar. Transparent nav over the hero; cream bar with centred logo when scrolling up; "Coffee Without a Curfew. / SHOP NOW" bar when scrolling down. Mobile has a menu drawer. |
| 1 | Hero | `heist_scroll_capture` | Pins on desktop while the title and wordmark lift away, the glass rises, 4 hand frames build the grip, then "Steal Back / The Night." fades in. Mobile and reduced motion get a static stack plus a story panel. |
| 2 | Products | `product_variant_showcase` | Heading, proof badges, product cards. The Decaf / 1/4 Caf toggle updates the price and link from real variants. Hover shows the description or video. |
| 3 | Video feature | `viewport_video` | "The Heist, in full". 16:9 desktop and 9:16 mobile films. Plays only while in view; has a sound toggle. |
| 4 | Quality points | `quality_showcase` | Six proof points either side of a red-framed video, with a rolling batch-code tag. |
| 5 | Comparison | `coffee_heist` (top) | Tabs: blind cupping-score bar chart / evidence table. Bars animate in. |
| 6 | Reviews | `coffee_heist` (receipts) | "The receipts don't lie." Draggable row of written reviews and customer videos. |
| 7 | Late-night collage | `late_night_gallery` (top) | Statement copy plus a staggered 5-column collage (2 columns on mobile). |
| 8 | Brewing guide | `late_night_gallery` (guide) | 8 recipe cards, each opening a side drawer. The Espresso Martini has a serving-size scaler. |
| 9 | Social gallery | `gallery_showcase` | "For those who are serious about coffee." with a Follow button and a looping marquee. |
| — | Footer | `footer` | Wordmark, link row, "Join the Heist." newsletter (Shopify customer form), legal strip. |

## Install

1. Duplicate the live theme (Online Store → Themes → … → Duplicate) and work on the copy.
2. Copy these folders into the duplicate, e.g. `shopify theme push --theme <id> --only layout/heist.liquid --only 'sections/heist-*' --only 'snippets/heist-*' --only 'assets/heist.*' --only templates/page.heist-home.json`.
3. Create a page (Online Store → Pages) and pick the template **heist-home**.
4. In the theme editor:
   - **Header:** set the menu, logo, and Adobe Fonts kit ID. Turn off "Load open-licence fallback fonts" once the font question below is settled.
   - **Footer:** set the wordmark (`heist-logo-footer.svg`), the main and legal menus, and the Instagram/TikTok links.
   - **Videos:** pick them for the film, quality, product hover, reviews, collage and brewing cards. Template JSON can't reference videos by file name.
5. To make it the homepage later, copy the sections into `templates/index.json` (or point the theme's index at this layout). Nothing here needs changing.

Images in the template point at the store's own Files by name (`shopify://shop_images/…`).
If a file has been renamed or removed, that slot shows a labelled placeholder rather than
breaking the layout.

## Assets that need the client's sign-off

Everything below currently shows a **placeholder** or **fallback**, so the page works
without them. Swap each one in once it's confirmed.

| Asset | Status in build | What to confirm |
|-------|-----------------|-----------------|
| **Feature Display Condensed** (display serif), **Aro Narrow** (UI sans) | Loaded from the store's Files by name. Open-licence fallbacks (Instrument Serif, Archivo) are also on. | The web licences cover this theme, the domain(s) and the expected page views. Both are commercial faces, and a self-hosting licence is usually per domain/traffic tier. |
| **forma-djr-mono** (Adobe Fonts) | Kit ID left blank; IBM Plex Mono fallback. | The client's Adobe kit (`jmu4nzm` on the live site) lists this store/preview domain. Adobe kits are tied to an account and its domains. |
| Customer review videos (3) | Placeholders | Each customer agreed to their clip being reused. Check the review platform's terms, or get written consent. |
| Lifestyle portrait in the collage (`LNC_1.jpg`, an identifiable model) and the collage clips | Placeholder | The model release covers this use and has no expired usage term. |
| Social-gallery images (`Marquee_*.jpg`) | Pulled from Files | These were shot by or for Heist, not reposted creator or customer content. If any are reposts, they need the creator's permission. |
| Campaign film, roasting film, product hover clips | Not set (placeholders) | No action if they're Heist-commissioned. Check any licensed music in clips that play with sound. |
| Proof badges (`badge-*.svg`, `Isolation_Mode.svg`) | Pulled from Files | No action if Heist designed them. If the water-process badge represents a third-party decaf process brand, check its trademark-use terms. |

The product photography, hand/glass cut-outs, backgrounds, logos and brewing photos look
like Heist's own brand assets. They're used as-is from the store's Files.

## Copy notes (carried over from the live page)

- **Espresso Martini:** the live footnote ends "Three ingredients, 45 seconds, no alcohol.", which contradicts a recipe with vodka and liqueur. Only the first sentence is kept here.
- **Espresso Martini:** the live demerara syrup line has no amount (the name repeats in its place). Left blank here; the client needs to supply the amount.
- **Espresso:** the live page repeats the first step. De-duplicated here.
- **French press:** the live "Best served" value repeats the grind text. The row is omitted until the client supplies the real value.
- **Cupping chart:** on the live page the bars don't line up with the axis (e.g. 86 draws at about 82). Here the bars line up with the axis. The client should confirm the scores and keep the method note and supporting data on file, since the chart makes comparative claims.

# PF listicle page for Shopify

Two files, no theme dependencies:

- `sections/pf-listicle.liquid` holds the whole page: markup, CSS and JavaScript inline.
- `templates/product.pf-listicle.json` is a product template that shows only that section.

## Install

1. Online Store → Themes → ⋯ → **Edit code**.
2. **Sections → Add a new section**, name it `pf-listicle`, and replace its contents with `sections/pf-listicle.liquid`.
3. **Templates → Add a new template**, choose **product**, type JSON, name it `pf-listicle`, and replace its contents with `templates/product.pf-listicle.json`.
4. Open the product → **Theme template** → `pf-listicle` → Save.

The page hides the theme's header and footer, like the original.

## What comes from the product

Gallery and thumbnails (product media), variants, price, cart form and the sticky-bar image. Everything else (headlines, the 10 reasons, comments, footer, videos, review images) is static HTML in the section file.

## Size / side picker

The page has no built-in variant picker. Add to Cart sends the selected variant (by default the first available one). To let shoppers choose, add a bundle or variant-picker app block (e.g. Kaching Bundles) to the section in the theme editor; it renders above the Add to Cart button.

## Media

Static images and videos load from PeakFlex's Shopify CDN (`www.trypeakflex.com/cdn/...`). Replace those URLs in the section file when you swap in another product's content.

# PF listicle section for Shopify

`sections/pf-listicle.liquid` is the whole page as one section: markup, CSS and JavaScript inline, no theme dependencies.

## Install

1. Online Store → Themes → ⋯ → **Edit code** → **Sections → Add a new section**, name it `pf-listicle`, and replace its contents with the file.
2. **Customize** → open the page template you want → **Add section → PF listicle page**.
3. In the section settings, pick the **Product**, then Save.

The section hides the theme's header and footer on any page it is on, like the original. Cart drawers that live inside the header stay usable.

## Add to cart

Add to Cart posts to `/cart/add.js` and opens the cart drawer instead of going to `/cart`. It tries, in order: a Dawn-style `<cart-drawer>`, cart app APIs (Rebuy Smart Cart, UpCart, Slide Cart and similar), the theme's cart icon, then common `cart:open` events.

## What comes from the picked product

Gallery and thumbnails (product media), variants, price, cart form and the sticky-bar image. On a product template with no product picked, it uses that page's product. Everything else (headlines, the 10 reasons, comments, footer, videos, review images) is static HTML in the file.

## Size / side picker

The section has no built-in variant picker. Add to Cart sends the first available variant. To let shoppers choose, add a bundle or variant-picker app block (e.g. Kaching Bundles) to the section in the theme editor; it renders above the Add to Cart button.

## Media

Static images and videos load from PeakFlex's Shopify CDN (`www.trypeakflex.com/cdn/...`). Replace those URLs in the file when you swap in another product's content.

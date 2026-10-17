# PF listicle section for Shopify

`sections/pf-listicle.liquid` is the whole page as one section: markup, CSS and JavaScript inline, no theme dependencies.

## Install

1. Online Store → Themes → ⋯ → **Edit code** → **Sections → Add a new section**, name it `pf-listicle`, and replace its contents with the file.
2. **Customize** → open the page template you want → **Add section → PF listicle page**.
3. In the section settings, pick the **Product**, then Save.

The section hides the theme's header and footer on any page it is on, like the original. Cart drawers that live in the header or footer section groups (theme drawers, DropMagic's cart sheet) stay usable: only everything around them is hidden.

## Add to cart

Add to Cart posts to `/cart/add.js` and opens the cart drawer instead of going to `/cart`. It tries, in order: DropMagic's cart sheet (opens itself), a Dawn-style `<cart-drawer>`, Horizon's `<theme-drawer id="cart-drawer">`, cart app APIs (Rebuy Smart Cart, UpCart, Slide Cart and similar), the theme's cart icon, then common `cart:open` events.

## What comes from the picked product

Gallery and thumbnails (product media), variants, price, cart form and the sticky-bar image. On a product template with no product picked, it uses that page's product. Everything else (headlines, the 10 reasons, comments, footer, videos, review images) is static HTML in the file.

## Bundle picker

With **Show bundle picker** on (the default), the section shows the same bundle as the store's DropMagic product page: *Buy 1, get 1 Free* and *Buy 2, get 2 Free*, a size and side picker per unit, and the free-gift rows. Prices are computed from the picked product (tier price = paid units × price, compare-at = all units × compare-at price).

Add to Cart sends one line per unit tagged `_bundle_type` (`buy`/`get`) and `_bar_id`, exactly like DropMagic, so the store's **Quantity Breaks** automatic discount makes the free units $0.

It uses the DropMagic theme files `dm-theme.css` and `dm-theme-vars.css` for styling. Turn the setting off on stores without DropMagic; Add to Cart then sends the selected variant only, and an app block (for example Kaching Bundles) can be added instead.

## Media

Static images and videos load from PeakFlex's Shopify CDN (`www.trypeakflex.com/cdn/...`). Replace those URLs in the file when you swap in another product's content.

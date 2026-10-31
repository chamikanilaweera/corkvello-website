# CORKVELLO: Official Shopify Integration & Bundle Setup Guide

This document provides a comprehensive, production-grade guide for connecting the **CORKVELLO** e-commerce website to your actual Shopify store. It explains variant mapping, the Shopify Ajax Cart API, cart drawers, **Shopify Markets multi-currency configuration**, **Free Worldwide Shipping admin configuration**, and **genuine checkout-enforced bundle discounts**.

---

## 1. Overview & Architecture

The CORKVELLO website is built with vanilla HTML5, CSS3, and modern JavaScript, designed to operate in two flexible configurations:

1. **Option A: Standalone / Headless / External Landing Page**
   - Hosted on your domain (e.g., Netlify, Vercel, Cloudflare, or AWS).
   - Syncs with Shopify via **Cart Permalinks** and the **Storefront API / Ajax API**.
   - "Add to Cart" and "Buy Now" pass the customer directly to your Shopify checkout with the exact variant, currency, and bundle discount applied.

2. **Option B: Embedded Directly Inside a Shopify 2.0 Theme (Dawn, Prestige, Impulse, Horizon)**
   - Uploaded as an alternate product template (`product.corkvello.json`) or custom Liquid sections (`sections/corkvello-hero.liquid`, `sections/corkvello-how-it-works.liquid`, `sections/corkvello-reviews.liquid`).
   - Uses native Shopify theme Ajax Cart API endpoints (`/cart/add.js`, `/cart.js`, `/cart/change.js`).
   - Uses native Shopify Liquid tags for real-time inventory, pricing, and currency localization (`localization.country.currency`).

---

## 2. Product Page Layout Architecture

The CORKVELLO product page features an architectural layout designed for maximum brand luxury and high conversion:

- **Top Row (Two-Column Split on Desktop)**:
  - **Left Column**: Product Gallery with main high-resolution image (`images/main product image.png`) and four interactive thumbnails directly underneath in a single horizontal row (`main product image.png`, `product image 2.png`, `product image 3.png`, `product image 4.png`).
  - **Right Column**: Luxury editorial headline (*"Every bottle deserves a better opening."*), product title, sommelier description, four sparkle feature pills, and sommelier ritual highlights.
- **Bottom Section (Full Width Below Both Columns)**:
  - Spanning 100% of the container width directly beneath both the gallery and the right-hand content.
  - Three wide, spacious bundle cards (Set 1, Set 2, Set 3) with horizontal structure.
  - Full-width forest green **ADD TO CART** button with live price updates and shopping bag SVG.
  - Full-width **BUY NOW** button and three sommelier trust guarantees.

---

## 3. Product & Variant Configuration

In `js/script.js`, locate the `SHOPIFY_CONFIG` configuration block at the top of the file:

```javascript
const SHOPIFY_CONFIG = {
  myshopifyDomain: "corkvello.myshopify.com",
  variantId: "48291049281920", // Replace with your actual Variant ID
  discountCodes: {
    bundle2: "BUNDLE10", // 10% Off 2 items
    bundle3: "BUNDLE15"  // 15% Off 3 items
  },
  // Automatically detects if running on Shopify
  isShopifyEnvironment: typeof window.Shopify !== 'undefined',
  endpoints: {
    add: "/cart/add.js",
    change: "/cart/change.js",
    get: "/cart.js",
    clear: "/cart/clear.js"
  }
};
```

### How to Find Your Shopify Product Variant ID:
1. Go to your **Shopify Admin** (`admin.shopify.com`).
2. Navigate to **Products** and click on your **CORKVELLO Electric Wine Opener**.
3. Scroll down to the **Variants** section and click on the variant.
4. Inspect the browser URL in your address bar:
   `https://admin.shopify.com/store/YOUR-STORE/products/1234567890/variants/48291049281920`
5. Copy the number after `/variants/` (e.g., `48291049281920`) and paste it as `variantId` in `js/script.js`.

---

## 4. Bundle Pricing & Display Specification

The bundle cards are configured with the following pricing model:

- **Bundle 1 (Set 1)**: Displayed cleanly as **$69.99 only** without an original price strikethrough or discount percentage badge.
- **Bundle 2 (Set 2)**: 10% Discount = **$125.98 total** ($62.99/unit), Original: $139.98, *Save $14.00*.
- **Bundle 3 (Set 3)**: 15% Discount = **$178.47 total** ($59.49/unit), Original: $209.97, *Save $31.50* (Best Value).

### Method 1: Native Shopify Automatic Volume Discounts (Recommended)
1. In Shopify Admin, navigate to **Discounts** > **Create discount**.
2. Select **Amount off order** or **Automatic discount** (or use an app like *Shopify Bundles* or *Fast Bundle*).
3. Set **Minimum quantity of items**:
   - Buy 2 items -> Get 10% off entire order.
   - Buy 3 items -> Get 15% off entire order.
4. Set eligibility to **Specific products** and select **CORKVELLO Electric Wine Opener**.
5. Save the discount. Shopify will now automatically enforce the discount at checkout when customers add 2 or 3 openers to their bag.

### Method 2: Checkout Cart Permalinks with Discount Parameter (for Standalone Sites)
When running standalone outside of Shopify, the script dispatches checkout using Shopify's official Cart Permalinks:
- **Set 1**: `https://corkvello.myshopify.com/cart/48291049281920:1`
- **Set 2**: `https://corkvello.myshopify.com/cart/48291049281920:2?discount=BUNDLE10`
- **Set 3**: `https://corkvello.myshopify.com/cart/48291049281920:3?discount=BUNDLE15`

---

## 5. Free Worldwide Shipping Configuration in Shopify Admin

CORKVELLO offers **Complimentary Worldwide Shipping** on all orders with zero minimum spend threshold. To ensure checkout genuinely charges $0.00 for shipping across all countries, complete the following steps in your Shopify Admin:

### Step 1: Open Shipping Settings
1. Go to **Shopify Admin** (`admin.shopify.com`).
2. Click **Settings** (bottom left gear icon) > **Shipping and delivery**.

### Step 2: Configure General Shipping Profile
1. Under **Shipping**, find your **General shipping rates** profile and click **Manage**.
2. Review your active shipping zones (e.g., Domestic, European Union, Rest of World).

### Step 3: Add Free Shipping Rates to All Zones
1. For each shipping zone:
   - Click the three dots `...` next to the existing rate or click **Add rate**.
   - Choose **Set up your own rate**.
   - Set **Rate name**: `Complimentary Worldwide Express Shipping` (or `Standard Tracked Delivery`).
   - Set **Price**: **`0.00`** (Free).
   - Under **Conditions**: Select **No conditions** (ensures no minimum order value or weight requirement is required).
   - Click **Done**.
2. If you ship internationally, ensure an international or "Rest of World" zone exists with the same `$0.00` rate.
3. Click **Save** in the top right corner.

Now, whenever customers proceed from the cart drawer or Buy Now button, Shopify Checkout will display **FREE** for all destinations worldwide.

---

## 6. Multi-Currency & Shopify Markets Setup

The website includes a 7-currency dropdown (USD, GBP, EUR, CAD, AUD, NZD, SGD) with `localStorage` persistence.

To ensure Shopify checkout charges the customer in their chosen currency:
1. Go to **Shopify Admin** > **Settings** > **Markets**.
2. Ensure your primary and international markets are active:
   - United States (USD)
   - United Kingdom (GBP)
   - European Union (EUR)
   - Canada (CAD)
   - Australia (AUD)
   - New Zealand (NZD)
   - Singapore (SGD)
3. Under **Products and pricing**, ensure **Show prices to customers in their local currency** is enabled (requires Shopify Payments).

---

## 7. "How It Works" Video Asset Hosting

The website references the demonstration video:
`videos/How It Wroks Video.mp4` with poster `images/how-it-works-poster.jpg`.

When hosting directly on Shopify:
1. Go to **Shopify Admin** > **Content** > **Files**.
2. Click **Upload files** and select `How It Wroks Video.mp4`.
3. Copy the CDN URL generated by Shopify (e.g. `https://cdn.shopify.com/s/files/.../How_It_Wroks_Video.mp4`).
4. Paste this URL into the `<video src="...">` attribute in your section or theme setting.

---

## 8. Customer Reviews Integration

The website includes the "Loved by Wine Lovers" customer reviews section (4.9/5 rating, 5 review cards with verified buyer tags).

To connect with a real customer reviews app in Shopify:
1. Install an approved review app (e.g., **Judge.me**, **Loox**, or **Yotpo**).
2. The HTML/Liquid structure contains dedicated hooks for review widgets:
   - Aggregate badge: `#reviews-score-display`
   - Carousel track: `#reviews-track`
3. If using theme settings, make each review quote and author editable through schema blocks in Shopify Theme Customizer.

---

## 9. Verification Checklist

- [x] **Product Page Layout**: Gallery on left with horizontal thumbnails directly underneath; brand headline and content on right; full-width bundle selector below both.
- [x] **Set 1 Pricing Display**: Displays only `$69.99` with no discount badge and no original price.
- [x] **Set 2 Pricing**: Preserved at `$125.98` with 10% OFF discount badge and $14.00 savings.
- [x] **Set 3 Pricing**: Preserved at `$178.47` with 15% OFF, $31.50 savings, $59.49/set, and `BEST VALUE` badge.
- [x] **Full-Width Add to Cart**: Underneath bundle cards with live price updates and shopping bag icon.
- [x] **Free Worldwide Shipping**: $100 threshold and progress bar completely removed; complimentary worldwide shipping notice displayed.
- [x] **Double-Dash Removal**: All unnecessary decorative `--` and em-dashes removed from visible copy.
- [x] **Multi-Currency**: Switcher updates all prices across the site and persists in localStorage.

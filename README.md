# CORKVELLO: Ultimate Premium E-Commerce Website

An award-winning, editorial luxury e-commerce website built for **CORKVELLO**, makers of the premium Electric Wine Bottle Opener.

Recreated with precision from the provided reference specifications, typography, whitespace, and updated with a high-converting **Two-Column Top Product Hero (Gallery Left, Brand Headline Right)** and a **Full-Width Bundle Selector** spanning 100% of the content container below.

---

## Brand Identity & Color Palette

- **Dominant Background**: Clean Crisp White (`#FFFFFF`)
- **Secondary Background**: Warm Editorial Ivory (`#F4F0E8`)
- **Primary Brand Green**: Forest Green (`#234F3B`)
- **Secondary Green**: Muted Sage Green (`#668675`)
- **Luxury Highlight**: Champagne Gold (`#C6A15B` / `#F9F5EE`)
- **Soft Highlight Background**: Cellar Mint (`#EFF5EF`)
- **Border & Dividers**: Subtle Warm Grey (`#E5E8E2`)
- **Headlines**: High-contrast Editorial Serif with striking calligraphic italics (`Playfair Display` + `@font-face` support for local `Fitgree`).
- **Body & Navigation**: Refined, modern sans-serif (`Plus Jakarta Sans`).

---

## Project File Structure

```text
corkvello-website/
├── index.html                  # Semantic, fully accessible HTML5 landing page
├── css/
│   └── style.css               # Modern CSS3 stylesheet (variables, responsive, luxury styling)
├── js/
│   └── script.js               # Vanilla JavaScript ES6+ engine (bundle selector, currency, video, reviews, cart)
├── images/                     # Extracted high-res product & bundle photography
│   ├── main product image.png  # Gallery Image 1 (Main default)
│   ├── product image 2.png     # Gallery Image 2
│   ├── product image 3.png     # Gallery Image 3
│   ├── product image 4.png     # Gallery Image 4
│   ├── our story section image.png # Our Story editorial photo
│   ├── why choose section image.png # Why Choose comparison photo
│   ├── set 1.jpg               # Bundle 1 thumbnail
│   ├── set 2.jpg               # Bundle 2 thumbnail
│   ├── set 3.jpg               # Bundle 3 thumbnail
│   ├── corkvello-logo.png      # Primary forest-green logo
│   ├── corkvello-logo-white.png# White logo for dark top accent bar
│   └── how-it-works-poster.jpg # Autoplay video poster frame
├── videos/
│   └── How It Wroks Video.mp4  # Single supplied demonstration video
├── fonts/
│   └── README.txt              # Instructions for adding optional local Fitgree brand font files
├── README.md                   # This project guide & documentation
└── SHOPIFY-INTEGRATION.md      # Comprehensive Shopify store & bundle checkout setup guide
```

---

## Key Features & Architecture

1. **Two-Column Top Product Hero**:
   - **Left Side**: Large interactive main product image with four thumbnails in a horizontal row directly underneath (`main product image.png`, `product image 2.png`, `product image 3.png`, `product image 4.png`).
   - **Right Side**: Prominent luxury brand headline (*"Every bottle deserves a better opening."*), category ritual eyebrow, product title, sommelier description, four sparkle feature pills, and sommelier ritual highlight callouts.

2. **Full-Width Bundle Selector (Directly Below Top Section)**:
   - Occupies 100% of the available content container width underneath both columns.
   - Clean horizontal internal card layout: `[Radio Control] → [Thumbnail Photo (68px)] → [Bundle Title & Subtitle] → [Discount Badges] → [Pricing & Savings]`.
   - **Bundle 1 (Set 1)**: Displayed cleanly as **$69.99 only** without any strikethrough price or discount badge.
   - **Bundle 2 (Set 2)**: 2 Sets @ $125.98 (Save 10% / Save $14.00, $62.99/unit).
   - **Bundle 3 (Set 3)**: 3 Sets @ $178.47 (Save 15% / Save $31.50, $59.49/unit, highlighted with `BEST VALUE` champagne gold badge).
   - Full-width forest green **ADD TO CART** button with live price updates and shopping bag icon.
   - Full-width **BUY NOW** direct checkout button and three sommelier guarantees.

3. **Free Worldwide Shipping (No Threshold / No Progress Bar)**:
   - The obsolete $100 spending threshold and shipping progress bar have been completely removed.
   - All customers receive complimentary tracked worldwide shipping on all orders.
   - Clean luxury shipping notice in cart drawer and across trust badges.

4. **Clean Typography**:
   - All unnecessary decorative double-dash marks have been eliminated from visible website copy, section headings, and product descriptions in favor of refined editorial typography.

5. **Multi-Currency Header Selector**:
   - Clean dropdown supporting USD ($), GBP (£), EUR (€), CAD (C$), AUD (A$), NZD (NZ$), and SGD (S$).
   - Dynamically recalculates all prices across the site and cart drawer.
   - Persists selected currency in `localStorage` and integrates with Shopify Markets.

6. **"HOW IT WORKS" Demonstration Video Section**:
   - Two-column layout immediately after "Why Choose CORKVELLO".
   - Left: Heading, description, and three simple steps (01. Position, 02. Press, 03. Pour & Enjoy).
   - Right: Single supplied `How It Wroks Video.mp4` with `IntersectionObserver` autoplay on scroll into view, pause on exit, and manual play/pause control.

7. **"Loved by Wine Lovers" Customer Reviews**:
   - Positioned immediately before FAQ.
   - 4.9/5 overall rating with gold stars.
   - Touch gesture horizontal scroll on mobile and desktop navigation arrows.
   - Ready for direct integration with Shopify review apps (Judge.me, Loox, Yotpo).

8. **Our Story & Why Choose Sections**:
   - Updated with supplied `our story section image.png` and `why choose section image.png`.

9. **Interactive Slide-Out Cart Drawer**:
   - Live bag badge counter.
   - Complimentary worldwide shipping indicator.
   - Dynamic item listing, quantity counters, subtotal, and genuine checkout dispatcher.

---

## How to Run Locally

You can run this website instantly using any local web server or directly in your browser:

### Method 1: Using Python (Built-in)
Open PowerShell or Terminal in the `corkvello-website` directory and run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

### Method 2: Direct Browser File
Simply double-click `index.html` to open it directly in Google Chrome, Safari, Microsoft Edge, or Firefox.

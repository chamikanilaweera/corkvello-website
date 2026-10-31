CORKVELLO Brand Typography Instructions
=======================================

This website is pre-configured to automatically use the "Fitgree" font family if provided.

To add the Fitgree font:
1. Place your font files in this `fonts/` directory with the following filenames:
   - `Fitgree.woff2` (or `Fitgree.woff` / `Fitgree.ttf`) for the Regular weight
   - `Fitgree-Italic.woff2` (or `Fitgree-Italic.woff` / `Fitgree-Italic.ttf`) for the Italic weight
   - `Fitgree-Bold.woff2` (or `Fitgree-Bold.woff` / `Fitgree-Bold.ttf`) for the Bold weight

2. The CSS in `css/style.css` already contains the corresponding `@font-face` declarations:
   ```css
   @font-face {
     font-family: 'Fitgree';
     src: url('../fonts/Fitgree.woff2') format('woff2'),
          url('../fonts/Fitgree.woff') format('woff'),
          url('../fonts/Fitgree.ttf') format('truetype');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   ```

3. If the Fitgree font files are not present, the website seamlessly falls back to high-contrast editorial serif typography ("Playfair Display", "Didot", "Bodoni MT", serif), ensuring the exact luxury look and feel of the reference design.

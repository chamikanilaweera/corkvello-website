/**
 * CORKVELLO — ULTIMATE PREMIUM E-COMMERCE ENGINE
 * Vanilla JavaScript (ES6+)
 * Updated for:
 * - Multi-Currency Selector (USD, GBP, EUR, CAD, AUD, NZD, SGD) with persistence
 * - Supplied Product Gallery Image Order (main product image, product image 2, 3, 4)
 * - Bundle Selection System with set images & updated Bundle 3 (15% OFF / $178.47 / $31.50 savings / $59.49/set)
 * - Autoplaying on scroll "How It Works" video via IntersectionObserver
 * - "Loved by Wine Lovers" Customer Reviews Slider
 * - Slide-out Cart Drawer, Free Shipping meter, and genuine Shopify Cart sync
 */

'use strict';

// ==========================================================================
// 1. CURRENCIES & SHOPIFY CONFIGURATION
// ==========================================================================
const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.00, name: 'US Dollar', flag: '🇺🇸' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound', flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro', flag: '🇪🇺' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.39, name: 'Canadian Dollar', flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.53, name: 'Australian Dollar', flag: '🇦🇺' },
  NZD: { code: 'NZD', symbol: 'NZ$', rate: 1.68, name: 'New Zealand Dollar', flag: '🇳🇿' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.32, name: 'Singapore Dollar', flag: '🇸🇬' }
};

const SHOPIFY_CONFIG = {
  myshopifyDomain: "corkvello.myshopify.com",
  variantId: "48291049281920",
  discountCodes: {
    bundle2: "BUNDLE10", // 10% Off 2 items
    bundle3: "BUNDLE15"  // 15% Off 3 items (Updated)
  },
  isShopifyEnvironment: typeof window.Shopify !== 'undefined',
  endpoints: {
    add: "/cart/add.js",
    change: "/cart/change.js",
    get: "/cart.js",
    clear: "/cart/clear.js"
  }
};

// ==========================================================================
// 2. PRODUCT DATA & BUNDLE TIERS (EXACT USER SPECIFICATION)
// ==========================================================================
const CORKVELLO_PRODUCT = {
  id: "corkvello-electric-opener",
  title: "CORKVELLO Electric Wine Opener",
  singleOriginalPrice: 79.99,
  singleBasePrice: 69.99,
  image: "images/main product image.png",
  bundles: {
    1: {
      id: "bundle-1",
      quantity: 1,
      title: "1 Set (Single Opener)",
      subtitle: "Your personal wine ritual",
      originalTotal: 69.99,
      discountedTotal: 69.99,
      unitPrice: 69.99,
      savings: 0,
      discountPercent: 0,
      discountCode: null,
      badge: null,
      image: "images/set 1.jpg"
    },
    2: {
      id: "bundle-2",
      quantity: 2,
      title: "2 Sets (Save 10%)",
      subtitle: "Perfect for hosting & gifting",
      originalTotal: 139.98,
      discountedTotal: 125.98,
      unitPrice: 62.99,
      savings: 14.00,
      discountPercent: 10,
      discountCode: SHOPIFY_CONFIG.discountCodes.bundle2, // BUNDLE10
      badge: "POPULAR",
      image: "images/set 2.jpg"
    },
    3: {
      id: "bundle-3",
      quantity: 3,
      title: "3 Sets (Save 15%)",
      subtitle: "The ultimate connoisseur bundle",
      originalTotal: 209.97,
      discountedTotal: 178.47,
      unitPrice: 59.49,
      savings: 31.50,
      discountPercent: 15,
      discountCode: SHOPIFY_CONFIG.discountCodes.bundle3, // BUNDLE15
      badge: "BEST VALUE",
      image: "images/set 3.jpg"
    }
  }
};

// ==========================================================================
// 3. APPLICATION STATE
// ==========================================================================
const AppState = {
  selectedBundleQty: 1,
  currency: 'USD',
  cart: {
    items: [],
    itemCount: 0,
    subtotalUSD: 0,
    totalSavingsUSD: 0
  },
  tickerPaused: false,
  announcementIndex: 0
};

// ==========================================================================
// 4. DOM ELEMENTS CACHE
// ==========================================================================
const DOM = {};

function initDOMCache() {
  DOM.siteHeader = document.querySelector('.site-header');
  DOM.announcementMsgs = document.querySelectorAll('.announcement-msg');
  DOM.btnPrevAnnouncement = document.querySelector('.announcement-arrow.prev');
  DOM.btnNextAnnouncement = document.querySelector('.announcement-arrow.next');
  
  // Currency Dropdown
  DOM.currencyDropdownWrap = document.getElementById('currency-dropdown-wrap');
  DOM.currencySelectBtn = document.getElementById('currency-select-btn');
  DOM.currencyMenu = document.getElementById('currency-menu');
  DOM.currencyCodeDisplay = document.getElementById('current-currency-code');
  DOM.currencySymbolDisplay = document.getElementById('current-currency-symbol');
  DOM.currencyItems = document.querySelectorAll('.currency-item');
  
  // Gallery
  DOM.galleryMain = document.getElementById('gallery-main');
  DOM.thumbBtns = document.querySelectorAll('.thumb-btn');
  
  // Hero Pricing
  DOM.heroPriceCurrent = document.getElementById('hero-price-current');
  DOM.heroPriceOrig = document.getElementById('hero-price-orig');
  DOM.heroSavingsBadge = document.getElementById('hero-savings-badge');
  
  // Bundle Cards
  DOM.bundleCards = document.querySelectorAll('.bundle-card');
  DOM.btnAddToCart = document.getElementById('btn-add-to-cart');
  DOM.btnBuyNow = document.getElementById('btn-buy-now');
  
  // Cart Drawer
  DOM.cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  DOM.cartDrawer = document.getElementById('cart-drawer');
  DOM.cartDrawerClose = document.getElementById('cart-drawer-close');
  DOM.btnCartTrigger = document.getElementById('cart-trigger-btn');
  DOM.cartCountBadge = document.getElementById('cart-count-badge');
  DOM.cartDrawerBody = document.getElementById('cart-drawer-body');
  DOM.cartSubtotal = document.getElementById('cart-subtotal');
  DOM.cartSavings = document.getElementById('cart-savings');
  DOM.btnCheckout = document.getElementById('btn-checkout');

  
  // Ticker
  DOM.btnPauseMovement = document.getElementById('btn-pause-movement');
  DOM.tickerTrack = document.getElementById('ticker-track');
  
  // Video
  DOM.howItWorksVideo = document.getElementById('how-it-works-video');
  DOM.videoToggleBtn = document.getElementById('video-toggle-btn');
  DOM.videoBtnText = document.getElementById('video-btn-text');
  DOM.videoBtnIcon = document.getElementById('video-btn-icon');
  
  // Reviews
  DOM.reviewsTrackWrap = document.getElementById('reviews-track-wrap');
  DOM.reviewsPrevBtn = document.getElementById('reviews-prev-btn');
  DOM.reviewsNextBtn = document.getElementById('reviews-next-btn');
  
  // FAQ
  DOM.faqItems = document.querySelectorAll('.faq-item');
  
  // Mobile Nav & Search
  DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
  DOM.mobileNavDrawer = document.getElementById('mobile-nav-drawer');
  DOM.mobileNavClose = document.getElementById('mobile-nav-close');
  DOM.searchTriggerBtn = document.getElementById('search-trigger-btn');
  DOM.searchModal = document.getElementById('search-modal');
  DOM.searchModalClose = document.getElementById('search-modal-close');
}

// ==========================================================================
// 5. CURRENCY CONVERSION & FORMATTING
// ==========================================================================
function formatCurrency(usdAmount) {
  const curr = CURRENCIES[AppState.currency] || CURRENCIES.USD;
  const converted = Number(usdAmount) * curr.rate;
  return `${curr.symbol}${converted.toFixed(2)}`;
}

function setCurrency(currencyCode) {
  if (!CURRENCIES[currencyCode]) return;
  
  AppState.currency = currencyCode;
  try {
    localStorage.setItem('corkvello_currency', currencyCode);
  } catch (e) {}
  
  // Update Header Button
  const curr = CURRENCIES[currencyCode];
  if (DOM.currencyCodeDisplay) DOM.currencyCodeDisplay.textContent = curr.code;
  if (DOM.currencySymbolDisplay) DOM.currencySymbolDisplay.textContent = `(${curr.symbol})`;
  
  // Update Dropdown Active Class
  DOM.currencyItems.forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-code') === currencyCode);
  });
  
  // Close menu
  if (DOM.currencyMenu) {
    DOM.currencyMenu.classList.remove('open');
    if (DOM.currencySelectBtn) DOM.currencySelectBtn.setAttribute('aria-expanded', 'false');
  }
  
  // Refresh Bundle Cards text
  updateAllPricesUI();
  
  // If running in real Shopify store with Shopify Markets, inform theme
  if (SHOPIFY_CONFIG.isShopifyEnvironment && window.Shopify && window.Shopify.currency) {
    console.log(`[Shopify Markets Sync]: Active currency set to ${currencyCode}`);
  }
}

function updateAllPricesUI() {
  // Update Bundle 1 (Display ONLY selling price, no discount badge or original price)
  const b1 = CORKVELLO_PRODUCT.bundles[1];
  const elB1Price = document.getElementById('bundle-1-price');
  if (elB1Price) elB1Price.textContent = formatCurrency(b1.discountedTotal);
  
  // Update Bundle 2
  const b2 = CORKVELLO_PRODUCT.bundles[2];
  const elB2Price = document.getElementById('bundle-2-price');
  const elB2Orig = document.getElementById('bundle-2-orig');
  const elB2Unit = document.getElementById('bundle-2-unit');
  const elB2Savings = document.getElementById('bundle-2-savings');
  if (elB2Price) elB2Price.textContent = formatCurrency(b2.discountedTotal);
  if (elB2Orig) elB2Orig.textContent = formatCurrency(b2.originalTotal);
  if (elB2Unit) elB2Unit.textContent = `${formatCurrency(b2.unitPrice)} each`;
  if (elB2Savings) elB2Savings.textContent = `Save ${formatCurrency(b2.savings)}`;
  
  // Update Bundle 3
  const b3 = CORKVELLO_PRODUCT.bundles[3];
  const elB3Price = document.getElementById('bundle-3-price');
  const elB3Orig = document.getElementById('bundle-3-orig');
  const elB3Unit = document.getElementById('bundle-3-unit');
  const elB3Savings = document.getElementById('bundle-3-savings');
  if (elB3Price) elB3Price.textContent = formatCurrency(b3.discountedTotal);
  if (elB3Orig) elB3Orig.textContent = formatCurrency(b3.originalTotal);
  if (elB3Unit) elB3Unit.textContent = `${formatCurrency(b3.unitPrice)} each`;
  if (elB3Savings) elB3Savings.textContent = `Save ${formatCurrency(b3.savings)}`;
  
  // Refresh selected bundle hero display
  selectBundle(AppState.selectedBundleQty);
  
  // Refresh cart drawer
  updateCartUI();
}

function initCurrencySelector() {
  // Load saved currency from localStorage if available
  try {
    const saved = localStorage.getItem('corkvello_currency');
    if (saved && CURRENCIES[saved]) {
      AppState.currency = saved;
    }
  } catch (e) {}
  
  if (DOM.currencySelectBtn && DOM.currencyMenu) {
    DOM.currencySelectBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = DOM.currencyMenu.classList.contains('open');
      DOM.currencyMenu.classList.toggle('open', !isOpen);
      DOM.currencySelectBtn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
    
    DOM.currencyItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const code = item.getAttribute('data-code');
        setCurrency(code);
      });
    });
    
    // Close on click outside
    document.addEventListener('click', () => {
      if (DOM.currencyMenu.classList.contains('open')) {
        DOM.currencyMenu.classList.remove('open');
        DOM.currencySelectBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// ==========================================================================
// 6. BUNDLE SELECTOR LOGIC
// ==========================================================================
function selectBundle(qty) {
  const bundle = CORKVELLO_PRODUCT.bundles[qty];
  if (!bundle) return;
  
  AppState.selectedBundleQty = qty;
  
  // Update Bundle Cards UI
  DOM.bundleCards.forEach(card => {
    const cardQty = parseInt(card.getAttribute('data-qty'), 10);
    if (cardQty === qty) {
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    } else {
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
    }
  });
  
  // Update Pricing Display in Hero
  if (DOM.heroPriceCurrent) DOM.heroPriceCurrent.textContent = formatCurrency(bundle.discountedTotal);
  if (DOM.heroPriceOrig) DOM.heroPriceOrig.textContent = formatCurrency(bundle.originalTotal);
  if (DOM.heroSavingsBadge) DOM.heroSavingsBadge.textContent = `SAVE ${formatCurrency(bundle.savings)}`;
  
  // Update Add to Cart Button Text
  if (DOM.btnAddToCart) {
    DOM.btnAddToCart.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      ADD TO CART &bull; ${formatCurrency(bundle.discountedTotal)}
    `;
  }
}

// ==========================================================================
// 7. GALLERY CONTROLLER
// ==========================================================================
function initGallery() {
  DOM.thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSrc = btn.getAttribute('data-img');
      const targetAlt = btn.getAttribute('data-alt') || "CORKVELLO Electric Wine Opener";
      
      // Update Main Image with smooth fade
      DOM.galleryMain.style.opacity = '0.35';
      setTimeout(() => {
        DOM.galleryMain.src = targetSrc;
        DOM.galleryMain.alt = targetAlt;
        DOM.galleryMain.style.opacity = '1';
      }, 140);
      
      // Update Active Thumbnail State
      DOM.thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

// ==========================================================================
// 8. CART SYSTEM & SHOPIFY SYNC
// ==========================================================================
function addToCart(qty) {
  const bundle = CORKVELLO_PRODUCT.bundles[qty];
  if (!bundle) return;
  
  // Check if item bundle already exists in local cart
  const existingIndex = AppState.cart.items.findIndex(item => item.bundleId === bundle.id);
  
  if (existingIndex > -1) {
    AppState.cart.items[existingIndex].count += 1;
  } else {
    AppState.cart.items.push({
      bundleId: bundle.id,
      qty: bundle.quantity,
      title: bundle.title,
      unitPriceUSD: bundle.unitPrice,
      totalPriceUSD: bundle.discountedTotal,
      savingsUSD: bundle.savings,
      image: bundle.image || CORKVELLO_PRODUCT.image,
      discountCode: bundle.discountCode,
      count: 1
    });
  }
  
  // If running inside live Shopify environment, execute Shopify Ajax Cart API call
  if (SHOPIFY_CONFIG.isShopifyEnvironment) {
    syncWithShopifyAjax(bundle);
  }
  
  updateCartUI();
  openCartDrawer();
}

function updateCartItemCount(bundleId, delta) {
  const index = AppState.cart.items.findIndex(item => item.bundleId === bundleId);
  if (index === -1) return;
  
  AppState.cart.items[index].count += delta;
  if (AppState.cart.items[index].count <= 0) {
    AppState.cart.items.splice(index, 1);
  }
  
  updateCartUI();
}

function removeCartItem(bundleId) {
  AppState.cart.items = AppState.cart.items.filter(item => item.bundleId !== bundleId);
  updateCartUI();
}

function updateCartUI() {
  let totalCount = 0;
  let subtotalUSD = 0;
  let totalSavingsUSD = 0;
  
  DOM.cartDrawerBody.innerHTML = '';
  
  if (AppState.cart.items.length === 0) {
    DOM.cartDrawerBody.innerHTML = `
      <div class="cart-empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin: 0 auto 12px; color: var(--color-green-secondary);">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your wine collection bag is empty.</p>
        <button class="btn-buy-now" onclick="closeCartDrawer(); window.location.href='#product-hero';" style="width: auto; margin: 0 auto; padding: 10px 24px;">Explore Bundles</button>
      </div>
    `;
  } else {
    AppState.cart.items.forEach(item => {
      const itemTotalUSD = item.totalPriceUSD * item.count;
      totalCount += item.qty * item.count;
      subtotalUSD += itemTotalUSD;
      totalSavingsUSD += item.savingsUSD * item.count;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-variant">${item.qty}x Electric Opener Set</div>
          <div class="cart-item-price">${formatCurrency(itemTotalUSD)}</div>
          <div class="cart-qty-control">
            <button class="cart-qty-btn" onclick="updateCartItemCount('${item.bundleId}', -1)" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${item.count}</span>
            <button class="cart-qty-btn" onclick="updateCartItemCount('${item.bundleId}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeCartItem('${item.bundleId}')" title="Remove item" aria-label="Remove item">×</button>
      `;
      DOM.cartDrawerBody.appendChild(itemEl);
    });
  }
  
  // Update Badges & Totals
  AppState.cart.itemCount = totalCount;
  AppState.cart.subtotalUSD = subtotalUSD;
  AppState.cart.totalSavingsUSD = totalSavingsUSD;
  
  if (DOM.cartCountBadge) {
    DOM.cartCountBadge.textContent = totalCount;
    DOM.cartCountBadge.classList.add('bump');
    setTimeout(() => DOM.cartCountBadge.classList.remove('bump'), 300);
  }
  
  if (DOM.cartSubtotal) DOM.cartSubtotal.textContent = formatCurrency(subtotalUSD);
  if (DOM.cartSavings) DOM.cartSavings.textContent = formatCurrency(totalSavingsUSD);
  
  // Complimentary Worldwide Express Shipping on all orders (No threshold)
}

function openCartDrawer() {
  DOM.cartDrawerOverlay.classList.add('open');
  DOM.cartDrawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  DOM.cartDrawerOverlay.classList.remove('open');
  DOM.cartDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

// ==========================================================================
// 9. REAL SHOPIFY CHECKOUT DISPATCHER
// ==========================================================================
function proceedToShopifyCheckout() {
  if (AppState.cart.items.length === 0) {
    alert("Please select a CORKVELLO bundle before proceeding to checkout.");
    return;
  }
  
  // Determine if a bundle discount code applies (BUNDLE10 or BUNDLE15)
  let activeDiscountCode = null;
  const bestBundle = AppState.cart.items.find(i => i.discountCode);
  if (bestBundle) {
    activeDiscountCode = bestBundle.discountCode;
  }
  
  const totalUnits = AppState.cart.items.reduce((sum, item) => sum + (item.qty * item.count), 0);
  
  if (SHOPIFY_CONFIG.isShopifyEnvironment) {
    let checkoutUrl = '/checkout';
    const params = [];
    if (activeDiscountCode) params.push(`discount=${activeDiscountCode}`);
    if (AppState.currency !== 'USD') params.push(`currency=${AppState.currency}`);
    if (params.length > 0) checkoutUrl += `?${params.join('&')}`;
    window.location.href = checkoutUrl;
  } else {
    // Standalone Headless / Direct Shopify Cart Permalink
    // Format: https://{store}.myshopify.com/cart/{variant_id}:{quantity}?discount={code}&currency={curr}
    let permalink = `https://${SHOPIFY_CONFIG.myshopifyDomain}/cart/${SHOPIFY_CONFIG.variantId}:${totalUnits}`;
    const params = [];
    if (activeDiscountCode) params.push(`discount=${activeDiscountCode}`);
    if (AppState.currency !== 'USD') params.push(`currency=${AppState.currency}`);
    if (params.length > 0) permalink += `?${params.join('&')}`;
    
    console.log(`[Shopify Checkout Dispatch] Redirecting to: ${permalink}`);
    window.open(permalink, '_blank');
  }
}

function buyNowDirect(qty) {
  const bundle = CORKVELLO_PRODUCT.bundles[qty];
  if (!bundle) return;
  
  let permalink = `https://${SHOPIFY_CONFIG.myshopifyDomain}/cart/${SHOPIFY_CONFIG.variantId}:${bundle.quantity}`;
  const params = [];
  if (bundle.discountCode) params.push(`discount=${bundle.discountCode}`);
  if (AppState.currency !== 'USD') params.push(`currency=${AppState.currency}`);
  if (params.length > 0) permalink += `?${params.join('&')}`;
  
  console.log(`[Shopify Buy Now] Redirecting directly to checkout: ${permalink}`);
  window.open(permalink, '_blank');
}

function syncWithShopifyAjax(bundle) {
  const postData = {
    items: [{
      id: SHOPIFY_CONFIG.variantId,
      quantity: bundle.quantity,
      properties: {
        'Bundle Tier': bundle.title,
        'Applied Discount': `${bundle.discountPercent}%`
      }
    }]
  };
  
  fetch(SHOPIFY_CONFIG.endpoints.add, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  .then(res => res.json())
  .then(data => console.log('[Shopify Cart Synced]:', data))
  .catch(err => console.warn('[Shopify Sync Info] Standalone preview mode active.'));
}

// ==========================================================================
// 10. "HOW IT WORKS" VIDEO CONTROLLER (AUTOPLAY ON SCROLL VIA INTERSECTIONOBSERVER)
// ==========================================================================
function initHowItWorksVideo() {
  if (!DOM.howItWorksVideo) return;
  
  const video = DOM.howItWorksVideo;
  
  function updateBtn(isPlaying) {
    if (!DOM.videoBtnText || !DOM.videoBtnIcon) return;
    if (isPlaying) {
      DOM.videoBtnText.textContent = "Pause";
      DOM.videoBtnIcon.innerHTML = `
        <rect x="6" y="4" width="4" height="16"></rect>
        <rect x="14" y="4" width="4" height="16"></rect>
      `;
    } else {
      DOM.videoBtnText.textContent = "Play";
      DOM.videoBtnIcon.innerHTML = `
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      `;
    }
  }
  
  // IntersectionObserver: Play when scrolling into view, pause when out of view
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          video.play()
            .then(() => updateBtn(true))
            .catch(() => {
              // Browser autoplay policy might require first user interaction
              updateBtn(false);
            });
        } else {
          if (!video.paused) {
            video.pause();
            updateBtn(false);
          }
        }
      });
    }, { threshold: [0, 0.35, 0.7] });
    
    observer.observe(video);
  }
  
  // Manual play/pause button toggle
  if (DOM.videoToggleBtn) {
    DOM.videoToggleBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play();
        updateBtn(true);
      } else {
        video.pause();
        updateBtn(false);
      }
    });
  }
  
  video.addEventListener('play', () => updateBtn(true));
  video.addEventListener('pause', () => updateBtn(false));
}

// ==========================================================================
// 11. CUSTOMER REVIEWS HORIZONTAL SLIDER
// ==========================================================================
function initReviewsSlider() {
  if (!DOM.reviewsTrackWrap) return;
  
  const scrollAmount = 340;
  
  if (DOM.reviewsPrevBtn) {
    DOM.reviewsPrevBtn.addEventListener('click', () => {
      DOM.reviewsTrackWrap.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }
  
  if (DOM.reviewsNextBtn) {
    DOM.reviewsNextBtn.addEventListener('click', () => {
      DOM.reviewsTrackWrap.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }
}

// ==========================================================================
// 12. FAQ ACCORDION
// ==========================================================================
function initFaqAccordion() {
  DOM.faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      
      DOM.faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
          other.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
        }
      });
      
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        btn.setAttribute('aria-expanded', 'true');
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ==========================================================================
// 13. TICKER / CAROUSEL CONTROLLER ("PAUSE MOVEMENT")
// ==========================================================================
function initTickerController() {
  if (!DOM.btnPauseMovement || !DOM.tickerTrack) return;
  
  DOM.btnPauseMovement.addEventListener('click', () => {
    AppState.tickerPaused = !AppState.tickerPaused;
    
    if (AppState.tickerPaused) {
      DOM.tickerTrack.classList.add('paused');
      DOM.btnPauseMovement.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Play movement
      `;
    } else {
      DOM.tickerTrack.classList.remove('paused');
      DOM.btnPauseMovement.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pause movement
      `;
    }
  });
}

// ==========================================================================
// 14. ANNOUNCEMENT BAR ROTATOR
// ==========================================================================
function initAnnouncementRotator() {
  if (DOM.announcementMsgs.length <= 1) return;
  
  function showAnnouncement(index) {
    DOM.announcementMsgs.forEach((msg, idx) => {
      msg.classList.toggle('active', idx === index);
    });
    AppState.announcementIndex = index;
  }
  
  if (DOM.btnPrevAnnouncement) {
    DOM.btnPrevAnnouncement.addEventListener('click', () => {
      let nextIdx = (AppState.announcementIndex - 1 + DOM.announcementMsgs.length) % DOM.announcementMsgs.length;
      showAnnouncement(nextIdx);
    });
  }
  
  if (DOM.btnNextAnnouncement) {
    DOM.btnNextAnnouncement.addEventListener('click', () => {
      let nextIdx = (AppState.announcementIndex + 1) % DOM.announcementMsgs.length;
      showAnnouncement(nextIdx);
    });
  }
  
  setInterval(() => {
    let nextIdx = (AppState.announcementIndex + 1) % DOM.announcementMsgs.length;
    showAnnouncement(nextIdx);
  }, 5000);
}

// ==========================================================================
// 15. NAVIGATION & MODALS
// ==========================================================================
function initNavigationAndModals() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      DOM.siteHeader.classList.add('scrolled');
    } else {
      DOM.siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });
  
  DOM.btnCartTrigger.addEventListener('click', openCartDrawer);
  DOM.cartDrawerClose.addEventListener('click', closeCartDrawer);
  DOM.cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  
  if (DOM.mobileMenuBtn && DOM.mobileNavDrawer) {
    DOM.mobileMenuBtn.addEventListener('click', () => {
      DOM.mobileNavDrawer.classList.add('open');
      DOM.cartDrawerOverlay.classList.add('open');
    });
    
    if (DOM.mobileNavClose) {
      DOM.mobileNavClose.addEventListener('click', () => {
        DOM.mobileNavDrawer.classList.remove('open');
        DOM.cartDrawerOverlay.classList.remove('open');
      });
    }
  }
  
  if (DOM.searchTriggerBtn && DOM.searchModal) {
    DOM.searchTriggerBtn.addEventListener('click', () => {
      DOM.searchModal.classList.add('open');
      const input = DOM.searchModal.querySelector('input');
      if (input) input.focus();
    });
    
    if (DOM.searchModalClose) {
      DOM.searchModalClose.addEventListener('click', () => {
        DOM.searchModal.classList.remove('open');
      });
    }
    
    DOM.searchModal.addEventListener('click', (e) => {
      if (e.target === DOM.searchModal) {
        DOM.searchModal.classList.remove('open');
      }
    });
  }
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      if (DOM.mobileNavDrawer) DOM.mobileNavDrawer.classList.remove('open');
      if (DOM.searchModal) DOM.searchModal.classList.remove('open');
      if (DOM.currencyMenu) DOM.currencyMenu.classList.remove('open');
    }
  });
}

// ==========================================================================
// 16. INITIALIZATION
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDOMCache();
  initCurrencySelector();
  initGallery();
  initHowItWorksVideo();
  initReviewsSlider();
  initFaqAccordion();
  initTickerController();
  initAnnouncementRotator();
  initNavigationAndModals();
  
  // Attach Bundle Card Click Listeners
  DOM.bundleCards.forEach(card => {
    card.addEventListener('click', () => {
      const qty = parseInt(card.getAttribute('data-qty'), 10);
      selectBundle(qty);
    });
  });
  
  // Add to Cart Button Listener
  DOM.btnAddToCart.addEventListener('click', () => {
    addToCart(AppState.selectedBundleQty);
  });
  
  // Buy Now Button Listener
  DOM.btnBuyNow.addEventListener('click', () => {
    buyNowDirect(AppState.selectedBundleQty);
  });
  
  // Checkout Button in Cart Drawer
  DOM.btnCheckout.addEventListener('click', () => {
    proceedToShopifyCheckout();
  });
  
  // Load saved currency and render initial pricing
  setCurrency(AppState.currency);
  selectBundle(1);
  updateCartUI();
  
  // Global exposures for event handlers
  window.updateCartItemCount = updateCartItemCount;
  window.removeCartItem = removeCartItem;
  window.closeCartDrawer = closeCartDrawer;
  window.openCartDrawer = openCartDrawer;
  window.selectBundle = selectBundle;
  window.addToCart = addToCart;
  window.setCurrency = setCurrency;
  window.proceedToShopifyCheckout = proceedToShopifyCheckout;
  window.buyNowDirect = buyNowDirect;
  
  console.log("CORKVELLO Premium E-Commerce Website Engine Updated Successfully.");
});

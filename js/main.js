/* =========================================================
   WoodCraft Interiors — Main JS
   ========================================================= */

/* --- Sticky header shadow --- */
(function () {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });
})();

/* --- Hamburger / Mobile Nav --- */
(function () {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* --- Set active nav link --- */
(function () {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || href === page) {
      link.classList.add('active');
    }
  });
})();

/* --- Toast Notification --- */
function showToast(msg, icon = '✓') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast__icon">${icon}</span> ${msg}`;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* --- Cart --- */
function getCart() {
  try { return JSON.parse(localStorage.getItem('wc_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('wc_cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id && i.variant === product.variant);
  if (existing) {
    existing.qty = (existing.qty || 1) + 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart(cart);
  showToast(`<strong>${product.name}</strong> added to cart!`, '🛒');
}

/* --- "Add to Cart" buttons --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.add-cart-btn, [data-add-cart]');
  if (!btn) return;
  const card = btn.closest('[data-product]');
  if (!card) return;
  const product = {
    id: card.dataset.productId || Date.now().toString(),
    name: card.dataset.productName || 'Product',
    price: parseFloat(card.dataset.productPrice || 0),
    image: card.dataset.productImg || '',
    variant: card.dataset.productVariant || '',
  };
  addToCart(product);
});

/* --- Wishlist toggle --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.product-card__wish');
  if (!btn) return;
  btn.classList.toggle('active');
  const isActive = btn.classList.contains('active');
  btn.innerHTML = isActive ? '❤️' : '🤍';
  showToast(isActive ? 'Added to wishlist' : 'Removed from wishlist', isActive ? '❤️' : '🤍');
});

/* --- Filter chips --- */
document.addEventListener('click', function (e) {
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  const bar = chip.closest('.filter-bar');
  bar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');

  const filter = chip.dataset.filter;
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  grid.querySelectorAll('[data-category]').forEach(card => {
    card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
  });
});

/* --- Accordion --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.accordion__btn');
  if (!btn) return;
  const item = btn.closest('.accordion__item');
  const content = item.querySelector('.accordion__content');
  const isOpen = item.classList.contains('open');

  // Close others in same accordion
  item.closest('.accordion').querySelectorAll('.accordion__item').forEach(i => {
    i.classList.remove('open');
    i.querySelector('.accordion__content').style.maxHeight = null;
  });

  if (!isOpen) {
    item.classList.add('open');
    content.style.maxHeight = content.scrollHeight + 'px';
  }
});

/* --- Tabs --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.tab-btn');
  if (!btn) return;
  const container = btn.closest('[data-tabs]');
  if (!container) return;
  const target = btn.dataset.tab;
  container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = container.querySelector(`[data-panel="${target}"]`);
  if (panel) panel.classList.add('active');
});

/* --- Gallery lightbox --- */
(function () {
  document.addEventListener('click', function (e) {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;

    const lb = document.createElement('div');
    lb.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9998;
      display:flex;align-items:center;justify-content:center;cursor:pointer;padding:20px;
    `;
    const image = document.createElement('img');
    image.src = img.src;
    image.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:8px;object-fit:contain;';
    lb.appendChild(image);
    lb.addEventListener('click', () => lb.remove());
    document.body.appendChild(lb);
  });
})();

/* --- Variant selector --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.variant-btn');
  if (!btn) return;
  const group = btn.closest('.variant-options');
  group.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
});

/* --- Product gallery thumbs --- */
document.addEventListener('click', function (e) {
  const thumb = e.target.closest('.product-gallery__thumb');
  if (!thumb) return;
  const gallery = thumb.closest('.product-gallery');
  gallery.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
  const mainImg = gallery.querySelector('.product-gallery__main img');
  if (mainImg) mainImg.src = thumb.querySelector('img').src;
});

/* --- Qty controls (detail page) --- */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.qty-btn');
  if (!btn) return;
  const container = btn.closest('.qty-lg, .qty-control');
  if (!container) return;
  const valEl = container.querySelector('.qty-val');
  let val = parseInt(valEl.textContent) || 1;
  if (btn.dataset.action === 'dec') val = Math.max(1, val - 1);
  if (btn.dataset.action === 'inc') val += 1;
  valEl.textContent = val;
});

/* --- Animate on scroll (simple) --- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .feature-card, .blog-card, .team-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    obs.observe(el);
  });

  // Inject 'in-view' class
  const style = document.createElement('style');
  style.textContent = '.in-view { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
})();

/* --- Contact form --- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = form.querySelector('[type=submit]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      showToast('Your message has been sent. We\'ll be in touch soon!', '📩');
      form.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; btn.disabled = false; }, 2000);
    }, 1200);
  });
})();

/* --- Newsletter form --- */
(function () {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Subscribed!';
      btn.disabled = true;
      showToast('You\'re subscribed! Welcome to WoodCraft family 🌿', '✉️');
      form.reset();
      setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
    });
  });
})();

/* Init */
updateCartCount();

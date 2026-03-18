/* =========================================================
   UrbanNest Interior — Cart Page JS
   ========================================================= */

function getCart() {
  try { return JSON.parse(localStorage.getItem('wc_cart') || '[]'); } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('wc_cart', JSON.stringify(cart));
}

function formatPrice(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function renderCart() {
  const cart = getCart();
  const tbody = document.getElementById('cart-tbody');
  const emptyMsg = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  if (!tbody) return;

  if (cart.length === 0) {
    if (emptyMsg) emptyMsg.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  tbody.innerHTML = cart.map((item, idx) => `
    <tr>
      <td data-label="Product">
        <div class="cart-item__info">
          <div class="cart-item__img" style="width:80px;height:60px;border-radius:8px;overflow:hidden;background:var(--cream);flex-shrink:0;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🪑</div>`}
          </div>
          <div>
            <div class="cart-item__name">${item.name}</div>
            ${item.variant ? `<div class="cart-item__variant">${item.variant}</div>` : ''}
          </div>
        </div>
      </td>
      <td data-label="Price">${formatPrice(item.price)}</td>
      <td data-label="Quantity">
        <div class="qty-control">
          <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="qty-val">${item.qty || 1}</span>
          <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </td>
      <td data-label="Total">${formatPrice((item.price || 0) * (item.qty || 1))}</td>
      <td data-label="Remove">
        <button class="remove-btn" onclick="removeItem(${idx})" title="Remove">✕</button>
      </td>
    </tr>
  `).join('');

  updateSummary(cart);
}

function changeQty(idx, delta) {
  const cart = getCart();
  if (!cart[idx]) return;
  cart[idx].qty = Math.max(1, (cart[idx].qty || 1) + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

function updateSummary(cart) {
  const subtotal = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const shipping = subtotal > 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', formatPrice(subtotal));
  set('summary-shipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
  set('summary-tax', formatPrice(tax));
  set('summary-total', formatPrice(total));
}

// Coupon
(function () {
  const form = document.getElementById('coupon-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const input = form.querySelector('input');
    const code = input.value.trim().toUpperCase();
    const msg = document.getElementById('coupon-msg');
    if (code === 'WOOD20' || code === 'CRAFT10') {
      if (msg) { msg.textContent = '✓ Coupon applied!'; msg.style.color = '#2E7D32'; }
      showToast('Coupon applied! 20% discount added.', '🎉');
    } else {
      if (msg) { msg.textContent = '✗ Invalid coupon code.'; msg.style.color = '#C62828'; }
    }
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  updateCartBadge();
});

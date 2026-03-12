const STORAGE = {
  view: "viewPrefs",
  greenCalc: "greenCalc",
  greenEarned: "greenPointsEarned",
  greenPurchased: "greenPointsPurchased",
  greenTotal: "greenPointsTotal",
  cart: "greenCart"
};

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function applyViewPrefs() {
  const prefs = readJSON(STORAGE.view, {
    fontSize: "normal",
    fontFamily: "serif",
    layout: "standard"
  });

  document.body.classList.remove("font-small", "font-large", "font-sans", "font-mono", "layout-compact", "layout-wide");

  if (prefs.fontSize === "small") document.body.classList.add("font-small");
  if (prefs.fontSize === "large") document.body.classList.add("font-large");

  if (prefs.fontFamily === "sans") document.body.classList.add("font-sans");
  if (prefs.fontFamily === "mono") document.body.classList.add("font-mono");

  if (prefs.layout === "compact") document.body.classList.add("layout-compact");
  if (prefs.layout === "wide") document.body.classList.add("layout-wide");

  const sizeSelect = document.getElementById("font-size");
  const familySelect = document.getElementById("font-family");
  const layoutSelect = document.getElementById("layout-mode");

  if (sizeSelect) sizeSelect.value = prefs.fontSize;
  if (familySelect) familySelect.value = prefs.fontFamily;
  if (layoutSelect) layoutSelect.value = prefs.layout;
}

function bindViewControls() {
  const sizeSelect = document.getElementById("font-size");
  const familySelect = document.getElementById("font-family");
  const layoutSelect = document.getElementById("layout-mode");

  if (!sizeSelect || !familySelect || !layoutSelect) return;

  function updatePrefs() {
    const prefs = {
      fontSize: sizeSelect.value,
      fontFamily: familySelect.value,
      layout: layoutSelect.value
    };
    writeJSON(STORAGE.view, prefs);
    applyViewPrefs();
  }

  sizeSelect.addEventListener("change", updatePrefs);
  familySelect.addEventListener("change", updatePrefs);
  layoutSelect.addEventListener("change", updatePrefs);
}

function initGreenCalculator() {
  const form = document.getElementById("green-form");
  if (!form) return;

  const totalEl = document.getElementById("green-total");
  const lastUpdatedEl = document.getElementById("green-last-updated");
  const selects = Array.from(form.querySelectorAll("select[data-points]"));

  function calculateTotal() {
    let total = 0;
    selects.forEach((select) => {
      const option = select.selectedOptions[0];
      const points = parseInt(option.dataset.points || "0", 10);
      total += points;
    });
    if (totalEl) totalEl.textContent = total.toString();
    return total;
  }

  function saveCurrent() {
    const selections = selects.map((select) => ({
      id: select.id,
      value: select.value,
      points: parseInt(select.selectedOptions[0].dataset.points || "0", 10)
    }));
    const earned = calculateTotal();
    writeJSON(STORAGE.greenCalc, { selections, earned, updated: new Date().toISOString() });
    localStorage.setItem(STORAGE.greenEarned, earned.toString());
    const purchased = parseInt(localStorage.getItem(STORAGE.greenPurchased) || "0", 10);
    const total = earned + purchased;
    localStorage.setItem(STORAGE.greenTotal, total.toString());
    if (lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleDateString("en-GB");
  }

  function loadSaved() {
    const saved = readJSON(STORAGE.greenCalc, null);
    if (!saved) return;
    saved.selections.forEach((item) => {
      const select = document.getElementById(item.id);
      if (select) select.value = item.value;
    });
    calculateTotal();
    if (saved.updated && lastUpdatedEl) {
      lastUpdatedEl.textContent = new Date(saved.updated).toLocaleDateString("en-GB");
    }
  }

  function clearForm() {
    selects.forEach((select) => {
      select.selectedIndex = 0;
    });
    calculateTotal();
  }

  function deleteSaved() {
    localStorage.removeItem(STORAGE.greenCalc);
    localStorage.removeItem(STORAGE.greenEarned);
    localStorage.removeItem(STORAGE.greenTotal);
    if (lastUpdatedEl) lastUpdatedEl.textContent = "Not saved";
    calculateTotal();
  }

  selects.forEach((select) => select.addEventListener("change", calculateTotal));

  const btnUpdate = document.getElementById("btn-update");
  const btnClear = document.getElementById("btn-clear");
  const btnReset = document.getElementById("btn-reset");
  const btnDelete = document.getElementById("btn-delete");

  if (btnUpdate) btnUpdate.addEventListener("click", (event) => {
    event.preventDefault();
    saveCurrent();
  });

  if (btnClear) btnClear.addEventListener("click", (event) => {
    event.preventDefault();
    clearForm();
  });

  if (btnReset) btnReset.addEventListener("click", (event) => {
    event.preventDefault();
    loadSaved();
  });

  if (btnDelete) btnDelete.addEventListener("click", (event) => {
    event.preventDefault();
    deleteSaved();
  });

  loadSaved();
  calculateTotal();
}

function initDashboard() {
  const earnedEl = document.getElementById("dashboard-earned");
  const purchasedEl = document.getElementById("dashboard-purchased");
  const totalEl = document.getElementById("dashboard-total");

  if (!earnedEl || !purchasedEl || !totalEl) return;

  const earned = parseInt(localStorage.getItem(STORAGE.greenEarned) || "0", 10);
  const purchased = parseInt(localStorage.getItem(STORAGE.greenPurchased) || "0", 10);
  const total = parseInt(localStorage.getItem(STORAGE.greenTotal) || "0", 10);

  earnedEl.textContent = earned.toString();
  purchasedEl.textContent = purchased.toString();
  totalEl.textContent = total.toString();
}

function initShop() {
  const shopRoot = document.getElementById("shop-root");
  if (!shopRoot) return;

  const cartList = document.getElementById("cart-list");
  const cartTotalPoints = document.getElementById("cart-total-points");
  const cartTotalCost = document.getElementById("cart-total-cost");
  const checkoutBtn = document.getElementById("btn-checkout");

  function renderCart() {
    const cart = readJSON(STORAGE.cart, []);
    if (cartList) {
      cartList.innerHTML = "";
      cart.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.points} pts - £${item.price}`;
        cartList.appendChild(li);
      });
    }
    const totalPoints = cart.reduce((sum, item) => sum + item.points, 0);
    const totalCost = cart.reduce((sum, item) => sum + item.price, 0);
    if (cartTotalPoints) cartTotalPoints.textContent = totalPoints.toString();
    if (cartTotalCost) cartTotalCost.textContent = totalCost.toFixed(2);
  }

  function addToCart(button) {
    const name = button.dataset.name;
    const points = parseInt(button.dataset.points || "0", 10);
    const price = parseFloat(button.dataset.price || "0");
    const cart = readJSON(STORAGE.cart, []);
    cart.push({ name, points, price });
    writeJSON(STORAGE.cart, cart);
    renderCart();
  }

  shopRoot.querySelectorAll("button[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn));
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = readJSON(STORAGE.cart, []);
      const totalPoints = cart.reduce((sum, item) => sum + item.points, 0);
      if (totalPoints > 0) {
        const currentPurchased = parseInt(localStorage.getItem(STORAGE.greenPurchased) || "0", 10);
        const currentEarned = parseInt(localStorage.getItem(STORAGE.greenEarned) || "0", 10);
        const newPurchased = currentPurchased + totalPoints;
        const newTotal = currentEarned + newPurchased;
        localStorage.setItem(STORAGE.greenPurchased, newPurchased.toString());
        localStorage.setItem(STORAGE.greenTotal, newTotal.toString());
        writeJSON(STORAGE.cart, []);
        renderCart();
        alert("Checkout complete. Points added to your balance.");
      }
    });
  }

  renderCart();
}

function updateFooterYear() {
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
}

document.addEventListener("DOMContentLoaded", () => {
  applyViewPrefs();
  bindViewControls();
  initGreenCalculator();
  initDashboard();
  initShop();
  updateFooterYear();
});

// ---------------------- DISPLAY LOGGED-IN USER ----------------------
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const username = localStorage.getItem("username");

if (!isLoggedIn) {
    window.location.href = "login1.html";
} else {
    const welcomeText = document.getElementById("welcomeText");
    if (welcomeText && username) {
        welcomeText.textContent = `Welcome, ${username.split(" ")[0]} ✨`;
    }
}

// ---------------------- SET CURRENT YEAR ----------------------
const yearEl = document.getElementById("current-year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------------------- CART STATE ----------------------
let cart = [];
let appliedDiscount = 0;

// ---------------------- ADD ITEM (FROM CARD) ----------------------
function addItem(btn) {
    const card = btn.closest(".card, .special-card");
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    let item = cart.find(i => i.name === name);

    if (!item) {
        cart.push({ name, price, qty: 1 });
    } else {
        item.qty++;
    }

    btn.classList.add("hidden");
    const qtyBox = card.querySelector(".qty-box");
    qtyBox.classList.remove("hidden");
    qtyBox.querySelector(".qty").innerText = item.qty;

    updateCart();
}

// ---------------------- UPDATE QTY (CARD +/-) ----------------------
function updateQty(btn, change) {
    const card = btn.closest(".card, .special-card");
    const name = card.dataset.name;

    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.qty += change;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
        card.querySelector(".qty-box").classList.add("hidden");
        card.querySelector(".add-btn").classList.remove("hidden");
    } else {
        card.querySelector(".qty").innerText = item.qty;
    }

    updateCart();
}

// ---------------------- CART TOTAL ----------------------
function getCartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

// ---------------------- APPLY DISCOUNT ----------------------
function applyDiscount() {
    const codeEl = document.getElementById("discount-code");
    if (!codeEl) return;

    const code = codeEl.value.trim().toUpperCase();
    const total = getCartTotal();
    let discount = 0;

    if (code === "SWEET10") discount = 10;
    else if (code === "SCOOPS20") discount = 20;
    else if (code === "FLAT10") discount = Math.floor(total * 0.1);
    else if (code === "ICE50") discount = Math.floor(total * 0.5);
    else {
        alert("Invalid discount code ❌");
        return;
    }

    appliedDiscount = discount;
    updateCart();
    alert("🎉 Discount Applied!");
}

// ---------------------- UPDATE CART UI ----------------------
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotalEl = document.getElementById("cart-total");
    const discountEl = document.getElementById("discount-amount");
    const finalTotalEl = document.getElementById("final-total");

    if (!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            `<li style="text-align:center;color:#999;">Your cart is empty.</li>`;
        appliedDiscount = 0;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        const safeName = item.name.replace(/'/g, "\\'");

        cartItems.innerHTML += `
            <li class="cart-row">
                <span>${item.name}</span>
                <div class="qty-controls">
                    <button onclick="updateCartQty('${safeName}', -1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="updateCartQty('${safeName}', 1)">+</button>
                </div>
                <span>₹${item.price * item.qty}</span>
                <button onclick="removeItem('${safeName}')">🗑️</button>
            </li>
        `;
    });

    if (cartCount) cartCount.innerText = count;
    if (cartTotalEl) cartTotalEl.innerText = total;
    if (discountEl) discountEl.innerText = appliedDiscount;
    if (finalTotalEl) finalTotalEl.innerText = Math.max(0, total - appliedDiscount);
}

// ---------------------- SIDEBAR +/- ----------------------
function updateCartQty(name, change) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    item.qty += change;

    const card = document.querySelector(`[data-name="${CSS.escape(name)}"]`);

    if (item.qty <= 0) {
        removeItem(name);
        return;
    }

    if (card) {
        card.querySelector(".qty").innerText = item.qty;
    }

    updateCart();
}

// ---------------------- REMOVE ITEM ----------------------
function removeItem(name) {
    cart = cart.filter(i => i.name !== name);

    const card = document.querySelector(`[data-name="${CSS.escape(name)}"]`);
    if (card) {
        card.querySelector(".qty-box").classList.add("hidden");
        card.querySelector(".add-btn").classList.remove("hidden");
    }

    updateCart();
}

// ---------------------- TOGGLE CART ----------------------
function toggleCart() {
    document.getElementById("cart")?.classList.toggle("open");
}

// ---------------------- CHECKOUT (STEP 6 INTEGRATED) ----------------------
// ---------------------- CHECKOUT (FIXED LOGIN ISSUE) ----------------------
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const username = localStorage.getItem("username");

    if (!isLoggedIn || !username) {
        alert("Please login to place order");
        window.location.href = "login1.html";
        return;
    }

    const items = cart.map(item => `${item.name} x${item.qty}`).join(", ");
    const total = getCartTotal();
    const finalTotal = Math.max(0, total - appliedDiscount);

    fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,   // 🔑 use username instead of user_id
            items: items,
            total: finalTotal
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Thank you for your order 🍦");

        cart = [];
        appliedDiscount = 0;

        document.querySelectorAll(".qty-box").forEach(q => q.classList.add("hidden"));
        document.querySelectorAll(".add-btn").forEach(b => b.classList.remove("hidden"));

        updateCart();
       
    })
    .catch(() => {
        alert("Failed to place order ❌");
    });
}


// ---------------------- SCROLL TO TOP ----------------------
window.onscroll = () => {
    const btn = document.getElementById("scrollToTopBtn");
    if (btn) btn.style.display = window.scrollY > 20 ? "block" : "none";
};

// ---------------------- LOGIN / LOGOUT ----------------------
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

if (loginLink && logoutLink) {
    loginLink.style.display = isLoggedIn ? "none" : "inline";
    logoutLink.style.display = isLoggedIn ? "inline" : "none";

    logoutLink.onclick = () => {
        localStorage.clear();
        window.location.href = "login1.html";
    };
}

// Set current year
document.getElementById('current-year').textContent = new Date().getFullYear();

let cart = [];
let appliedDiscount = 0; // Stores the currently applied discount

/* ---------------------- ADD TO CART ---------------------- */
function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
}

/* ---------------------- REMOVE FROM CART ---------------------- */
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

/* ---------------------- INCREASE QTY ---------------------- */
function increaseQty(name) {
    const item = cart.find(i => i.name === name);
    if (item) item.qty++;
    updateCart();
}

/* ---------------------- DECREASE QTY ---------------------- */
function decreaseQty(name) {
    const item = cart.find(i => i.name === name);
    if (item) {
        if (item.qty > 1) {
            item.qty--;
        } else {
            removeFromCart(name);
            return;
        }
    }
    updateCart();
}

/* ---------------------- GET CART TOTAL ---------------------- */
function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/* ---------------------- APPLY DISCOUNT ---------------------- */
function applyDiscount() {
    const code = document.getElementById("discount-code").value.trim().toUpperCase();
    const total = getCartTotal();
    let discount = 0;

    switch(code) {
        case "SWEET10":
            discount = 10;
            break;
        case "SCOOPS20":
            discount = 20;
            break;
        case "FLAT10":
            discount = Math.floor(total * 0.10);
            break;
        case "ICE50":
            discount = Math.floor(total * 0.50);
            break;
        default:
            alert("Invalid discount code ❌");
            return;
    }

    appliedDiscount = discount;
    document.getElementById("discount-amount").textContent = appliedDiscount;
    updateCart();
    alert("🎉 Discount Applied!");
}

/* ---------------------- UPDATE CART ---------------------- */
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const finalTotalEl = document.getElementById('final-total');

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `<li style="text-align:center; color:#999;">Your cart is empty.</li>`;
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        const safeName = item.name.replace(/'/g, "\\'");
        cartItems.innerHTML += `
            <li class="cart-row">
                <span>${item.name}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="decreaseQty('${safeName}')">−</button>
                    <span class="qty-number">${item.qty}</span>
                    <button class="qty-btn" onclick="increaseQty('${safeName}')">+</button>
                </div>
                <span>₹${item.price * item.qty}</span>
                <button class="delete-btn" onclick="removeFromCart('${safeName}')">🗑️</button>
            </li>`;
    });

    const finalTotal = Math.max(0, total - appliedDiscount);

    cartCount.textContent = count;
    cartTotal.textContent = finalTotal;

    if (finalTotalEl) finalTotalEl.textContent = finalTotal;
}

/* ---------------------- TOGGLE CART ---------------------- */
function toggleCart() {
    document.getElementById('cart').classList.toggle('open');
}

/* ---------------------- CHECKOUT ---------------------- */
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Thank you for your order! 🍦");

    cart = [];
    appliedDiscount = 0;
    document.getElementById("discount-amount").textContent = 0;
    updateCart();
    toggleCart();
}

/* ---------------------- SCROLL TO TOP ---------------------- */
function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

window.onscroll = function () {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
};

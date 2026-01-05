// Set current year
document.getElementById('current-year').textContent = new Date().getFullYear();

let cart = [];
let discount = 0; // stores the discount amount

// Add item to cart
function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if(item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    updateCart();
}
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
    if (item) {
        item.qty++;
    }
    updateCart();
}

/* ---------------------- DECREASE QTY ---------------------- */
function decreaseQty(name) {
    const item = cart.find(i => i.name === name);

    if (item) {
        if (item.qty > 1) {
            item.qty--;
        } else {
            cart = cart.filter(i => i.name !== name);
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
    let discount = 0;
    let total = getCartTotal();

    if (code === "SWEET10") {
        discount = 10;
    }
    else if (code === "SCOOPS20") {
        discount = 20;
    }
    else if (code === "FLAT10") {
        discount = Math.floor(total * 0.10);
    }
    else if (code === "ICE50") {
        discount = Math.floor(total * 0.50);
    }
    else {
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

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        cartItems.innerHTML += `
        <li class="cart-row">
            <span>${item.name}</span>

            <div class="qty-controls">
                <button class="qty-btn" onclick="decreaseQty('${item.name}')">−</button>
                <span class="qty-number">${item.qty}</span>
                <button class="qty-btn" onclick="increaseQty('${item.name}')">+</button>
            </div>

            <span>₹${item.price * item.qty}</span>

            <button class="delete-btn" onclick="removeFromCart('${item.name}')">🗑️</button>
        </li>`;
    });

    const finalTotal = Math.max(0, total - appliedDiscount);

    cartCount.textContent = count;
    cartTotal.textContent = finalTotal;

    if (document.getElementById("final-total")) {
        document.getElementById("final-total").textContent = finalTotal;
    }
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


// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const finalTotalEl = document.getElementById('final-total');

    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
        cartItems.innerHTML += `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty} <button onclick="removeFromCart('${item.name}')">🗑️</button></li>`;
    });

    if(cart.length === 0) {
        cartItems.innerHTML = `<li class="cart-empty" style="text-align:center; color:#999;">Your cart is empty.</li>`;
        document.getElementById('qr-container').style.display = 'none';
    }

    cartCount.textContent = count;
    cartTotal.textContent = total;

    // Apply discount and update final total
    const finalTotal = total - discount;
    finalTotalEl.textContent = finalTotal >= 0 ? finalTotal : 0;
}

// Remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

// Toggle cart visibility
function toggleCart() {
    document.getElementById('cart').classList.toggle('open');
}

// Apply discount code
function applyDiscount() {
    const code = document.getElementById('discount-code').value.trim().toUpperCase();
    
    switch(code) {
        case "SWEET10":
            discount = 10;
            break;
        case "SCOOPS20":
            discount = 20;
            break;
        case "FLAT10":
            discount = 10;
            break;
        case "ICE50":
            discount = 50;
            break;
        default:
            discount = 0;
            alert("Invalid discount code!");
            break;
    }

    // Update discount display
    document.getElementById('discount-amount').textContent = discount;

    // Update final total
    updateCart();
}

// Checkout function with QR code
function checkout() {
    if(cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const finalTotal = document.getElementById('final-total').textContent;

    // Generate QR code for payment
    const qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Pay%20₹" + finalTotal;
    document.getElementById('qr-code').src = qrCodeUrl;
    document.getElementById('qr-container').style.display = "block";

    alert("Thank you for your order! 🍦 Scan the QR code to pay.");
}

// Scroll-to-top functionality
function scrollToTop() {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0;
}

window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("scrollToTopBtn").style.display = "block";
    } else {
        document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

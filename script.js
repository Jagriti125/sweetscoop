document.getElementById('current-year').textContent = new Date().getFullYear();
 let cart = [];

    function addToCart(name, price) {
      const item = cart.find(i => i.name === name);
      if(item) {
        item.qty++;
      } else {
        cart.push({ name, price, qty: 1 });
      }
      updateCart();
    }

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
        cartItems.innerHTML += `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty} <button onclick=\"removeFromCart('${item.name}')\">🗑️</button></li>`;
      });
      cartCount.textContent = count;
      cartTotal.textContent = total;
    }

    function removeFromCart(name) {
      cart = cart.filter(item => item.name !== name);
      updateCart();
    }

    function toggleCart() {
      document.getElementById('cart').classList.toggle('open');
    }

    function checkout() {
      if(cart.length === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Thank you for your order! 🍦");
        cart = [];
        updateCart();
        toggleCart();
      }
    }
  


        // Scroll-to-Top functionality
        function scrollToTop() {
            document.body.scrollTop = 0; // For Safari
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }

        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                document.getElementById("scrollToTopBtn").style.display = "block";
            } else {
                document.getElementById("scrollToTopBtn").style.display = "none";
            }
        }
        
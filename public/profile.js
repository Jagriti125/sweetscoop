// ---------------------- AUTH CHECK ----------------------
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const username = localStorage.getItem("username");

if (!isLoggedIn || !username) {
    window.location.href = "login1.html";
}

// ---------------------- DISPLAY USER INFO ----------------------
document.getElementById("username").textContent = `Welcome, ${username}`;
document.getElementById("userEmail").textContent = "";

// ---------------------- FETCH ORDER HISTORY ----------------------
fetch(`http://localhost:5000/api/orders/${username}`)
    .then(res => res.json())
    .then(data => {
        const table = document.getElementById("orderHistory");

        if (!data || data.length === 0) {
            table.innerHTML = `<tr><td colspan="5">No orders yet 🍦</td></tr>`;
            return;
        }

        data.forEach(order => {
            table.innerHTML += `
                <tr>
                
                    <td>${new Date(order.created_at).toLocaleDateString()}</td>
                    <td>${order.items}</td>
                    <td>₹${order.total}</td>
                    <td>${order.status || "Placed"}</td>
                </tr>
            `;
        });
    });

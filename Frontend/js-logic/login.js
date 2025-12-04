const API_URL = "https://wallet-flow-backend.onrender.com/api/v1/users/login";

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (res.ok) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || "Invalid credentials");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Server connection failed.");
            }
        });
    }
});
const API_URL = "https://wallet-flow-backend.onrender.com/api/v1/users";

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Get values by ID
            const firstName = document.getElementById("firstName").value;
            const lastName = document.getElementById("lastName").value;
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Important: Saves the cookie!
                    credentials: 'include', 
                    body: JSON.stringify({ firstName, lastName, username, email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Account created! Redirecting...");
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || "Signup failed");
                }

            } catch (error) {
                console.error("Error:", error);
                alert("Server connection failed.");
            }
        });
    }
});
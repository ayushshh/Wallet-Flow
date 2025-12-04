// Base URL for your Backend API
// Ensure this matches your backend port (e.g., 5000 or 8000)
const API_BASE = "https://wallet-flow-backend.onrender.com/api/v1";

// --- DOM Elements ---
const expenseForm = document.getElementById("expenseForm");
const expenseTableBody = document.querySelector("#expenseTable tbody");
const goalForm = document.getElementById("goalForm");
const goalTableBody = document.querySelector("#goalTable tbody");
const filterType = document.getElementById("filterType");
const logoutBtn = document.getElementById("logoutBtn");
const userGreeting = document.getElementById("userGreeting");

// Summary Elements
const todayEl = document.getElementById("today");
const weekEl = document.getElementById("week");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");

// --- State ---
let expenses = [];
let goals = [];

// --- Chart Initialization ---
// We check if the elements exist before initializing to avoid errors
const pieCanvas = document.getElementById("pieChart");
const barCanvas = document.getElementById("barChart");

let pieChart, barChart;

if (pieCanvas && barCanvas) {
    const pieCtx = pieCanvas.getContext("2d");
    const barCtx = barCanvas.getContext("2d");

    pieChart = new Chart(pieCtx, {
        type: "doughnut", // Modern doughnut style
        data: { 
            labels: [], 
            datasets: [{ 
                data: [], 
                backgroundColor: ["#0284c7", "#38bdf8", "#f472b6", "#a78bfa", "#34d399", "#fbbf24"],
                borderWidth: 0
            }] 
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
    });

    barChart = new Chart(barCtx, {
        type: "bar",
        data: { 
            labels: [], 
            datasets: [{ 
                label: "Spending", 
                data: [], 
                backgroundColor: "#0284c7",
                borderRadius: 5 
            }] 
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } 
        },
    });
}

// ==========================================
// 1. AUTHENTICATION & INITIALIZATION
// ==========================================

async function initDashboard() {
    try {
        // Check if user is logged in (Get Me)
        // credentials: 'include' ensures the HttpOnly cookie is sent
        const res = await fetch(`${API_BASE}/users/me`, { credentials: 'include' });
        
        if (!res.ok) {
            // If auth fails (401), redirect to login
            window.location.href = 'login.html';
            return;
        }

        const user = await res.json();
        if(userGreeting) userGreeting.textContent = `Hi, ${user.firstName}`;

        // If auth passed, fetch data
        await fetchExpenses();
        await fetchGoals();
        
    } catch (error) {
        console.error("Auth Error:", error);
        // Fallback redirect if fetch fails entirely
        window.location.href = 'login.html';
    }
}

// ==========================================
// 2. API ACTIONS (FETCH, ADD, DELETE)
// ==========================================

// --- Fetch Data ---
async function fetchExpenses() {
    try {
        const res = await fetch(`${API_BASE}/expense`, { credentials: 'include' });
        if(res.ok) {
            expenses = await res.json();
            renderExpenses();
            updateSummary();
            updateCharts();
        }
    } catch (err) { console.error("Error fetching expenses:", err); }
}

async function fetchGoals() {
    try {
        const res = await fetch(`${API_BASE}/goals`, { credentials: 'include' });
        if(res.ok) {
            goals = await res.json();
            renderGoals();
        }
    } catch (err) { console.error("Error fetching goals:", err); }
}

// --- Add Data ---
if (expenseForm) {
    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amount = document.getElementById("amount").value;
        const category = document.getElementById("category").value;
        const note = document.getElementById("note").value;
        const date = document.getElementById("date").value;

        try {
            const res = await fetch(`${API_BASE}/expense`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ amount, category, note, date })
            });

            if (res.ok) {
                expenseForm.reset();
                fetchExpenses(); // Reload data to update UI
            } else {
                const data = await res.json();
                alert(data.message || "Failed to add expense");
            }
        } catch (err) { alert("Server error"); }
    });
}

if (goalForm) {
    goalForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amount = document.getElementById("goalAmount").value;
        const description = document.getElementById("goalNote").value;
        const date = document.getElementById("goalDate").value;

        try {
            const res = await fetch(`${API_BASE}/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ amount, description, date })
            });

            if (res.ok) {
                goalForm.reset();
                fetchGoals();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to add goal");
            }
        } catch (err) { alert("Server error"); }
    });
}

// --- Global Delete Function ---
// This function is attached to the window object so it can be called from onclick attributes in HTML
window.deleteItem = async (id, type) => {
    if(!confirm("Are you sure you want to delete this?")) return;

    const endpoint = type === 'expense' ? 'expense' : 'goals';
    try {
        const res = await fetch(`${API_BASE}/${endpoint}/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if(res.ok) {
            if(type === 'expense') fetchExpenses();
            else fetchGoals();
        } else {
            alert("Failed to delete");
        }
    } catch (err) { alert("Error deleting item"); }
};

// --- Logout ---
if(logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
        try {
            await fetch(`${API_BASE}/users/logout`, { method: 'POST', credentials: 'include' });
            window.location.href = 'login.html';
        } catch(err) { console.error("Logout failed", err); }
    });
}

// ==========================================
// 3. RENDERING & CALCULATIONS
// ==========================================

function renderExpenses() {
    if (!expenseTableBody) return;
    
    expenseTableBody.innerHTML = "";
    // Sort expenses (Newest date first)
    const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        expenseTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No expenses yet</td></tr>`;
        return;
    }

    sorted.forEach(exp => {
        const row = document.createElement("tr");
        // Format date nicely
        const dateObj = new Date(exp.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        
        row.innerHTML = `
            <td>${dateObj}</td>
            <td><span style="font-weight:500;">${exp.category}</span></td>
            <td>${exp.note || '-'}</td>
            <td style="font-weight:600; color: #0284c7;">₹${exp.amount}</td>
            <td><button class="delete-btn" onclick="deleteItem('${exp._id}', 'expense')">Delete</button></td>
        `;
        expenseTableBody.appendChild(row);
    });
}

function renderGoals() {
    if (!goalTableBody) return;

    goalTableBody.innerHTML = "";
    const sorted = goals.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        goalTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No goals set</td></tr>`;
        return;
    }

    sorted.forEach(goal => {
        const row = document.createElement("tr");
        const dateObj = new Date(goal.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        row.innerHTML = `
            <td>${dateObj}</td>
            <td>${goal.description}</td>
            <td style="font-weight:600; color: #059669;">₹${goal.amount}</td>
            <td><button class="delete-btn" onclick="deleteItem('${goal._id}', 'goal')">Delete</button></td>
        `;
        goalTableBody.appendChild(row);
    });
}

function updateSummary() {
    if (!todayEl || !weekEl || !monthEl || !yearEl) return;

    const now = new Date();
    // Fix timezone issue for "Today" comparison
    const todayStr = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    
    let todayTotal = 0, weekTotal = 0, monthTotal = 0, yearTotal = 0;

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    expenses.forEach(e => {
        const d = new Date(e.date);
        const dateStr = d.toISOString().split("T")[0];
        const amt = parseFloat(e.amount);

        if (dateStr === todayStr) todayTotal += amt;
        if (d >= startOfWeek) weekTotal += amt;
        if (d >= startOfMonth) monthTotal += amt;
        if (d >= startOfYear) yearTotal += amt;
    });

    todayEl.textContent = `₹${todayTotal.toLocaleString('en-IN')}`;
    weekEl.textContent = `₹${weekTotal.toLocaleString('en-IN')}`;
    monthEl.textContent = `₹${monthTotal.toLocaleString('en-IN')}`;
    yearEl.textContent = `₹${yearTotal.toLocaleString('en-IN')}`;
}

function updateCharts() {
    if (!pieChart || !barChart || !filterType) return;

    const period = filterType.value;
    const now = new Date();
    const start = new Date(now);

    if (period === "weekly") start.setDate(now.getDate() - 7);
    else if (period === "monthly") start.setMonth(now.getMonth() - 1);
    else if (period === "yearly") start.setFullYear(now.getFullYear() - 1);

    // 1. Filter expenses by date
    const filtered = expenses.filter(e => new Date(e.date) >= start);

    // 2. Group Data
    const catTotals = {};
    const dateTotals = {};

    filtered.forEach(e => {
        // Pie Chart: Group by Category
        catTotals[e.category] = (catTotals[e.category] || 0) + e.amount;
        
        // Bar Chart: Group by Date (simple MM/DD format)
        const d = new Date(e.date);
        const dKey = `${d.getDate()}/${d.getMonth()+1}`; // DD/MM format
        dateTotals[dKey] = (dateTotals[dKey] || 0) + e.amount;
    });

    // 3. Update Charts
    pieChart.data.labels = Object.keys(catTotals);
    pieChart.data.datasets[0].data = Object.values(catTotals);
    pieChart.update();

    barChart.data.labels = Object.keys(dateTotals);
    barChart.data.datasets[0].data = Object.values(dateTotals);
    barChart.update();
}

if (filterType) {
    filterType.addEventListener("change", updateCharts);
}

// Start the App
initDashboard();
const API = "http://localhost:5000/api/expenses";

let expenses = [];
let chart;
let darkMode = false;

// FETCH EXPENSES
async function fetchExpenses() {
  const res = await fetch(API);
  expenses = await res.json();

  localStorage.setItem("expenses", JSON.stringify(expenses));

  renderExpenses();
  updateSummary();
  updateChart();
}

// ADD EXPENSE
async function addExpense() {
  const title = document.getElementById("title").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!title || !amount || !category || !date) {
    alert("Please fill all fields");
    return;
  }

  const expense = { title, amount, category, date };

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });

  fetchExpenses();

  document.getElementById("title").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";
}

// DELETE EXPENSE
async function deleteExpense(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  fetchExpenses();
}

// RENDER EXPENSES
function renderExpenses(data = expenses) {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";

  data.forEach((expense) => {
    expenseList.innerHTML += `
      <div class="flex justify-between items-center border-b py-3">
        <div>
          <h3 class="font-bold text-lg">${expense.title}</h3>
          <p>₹${expense.amount} - ${expense.category}</p>
          <p class="text-sm text-gray-500">${expense.date}</p>
        </div>

        <button
          onclick="deleteExpense('${expense._id}')"
          class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    `;
  });
}

// SUMMARY
function updateSummary() {
  const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const budget = localStorage.getItem("budget") || 0;

  document.getElementById("expenseDisplay").innerText = `₹${total}`;
  document.getElementById("budgetDisplay").innerText = `₹${budget}`;
  document.getElementById("remainingDisplay").innerText = `₹${budget - total}`;
}

// SET BUDGET
function setBudget() {
  const budget = document.getElementById("budgetInput").value;
  localStorage.setItem("budget", budget);

  updateSummary();
  document.getElementById("budgetInput").value = "";
}

// FILTER + SEARCH
function filterExpenses() {
  const category = document.getElementById("filterCategory").value;
  const search = document.getElementById("searchInput").value.toLowerCase();

  let filtered = expenses;

  if (category !== "All") {
    filtered = filtered.filter(e => e.category === category);
  }

  filtered = filtered.filter(
    e =>
      e.title.toLowerCase().includes(search) ||
      e.category.toLowerCase().includes(search)
  );

  renderExpenses(filtered);
}

// CHART
function updateChart() {
  const categories = {};

  expenses.forEach((e) => {
    categories[e.category] =
      (categories[e.category] || 0) + Number(e.amount);
  });

  const ctx = document.getElementById("expenseChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
      }],
    },
  });
}

// DARK MODE
document.getElementById("themeToggle").addEventListener("click", () => {
  darkMode = !darkMode;

  document.body.classList.toggle("bg-gray-900");
  document.body.classList.toggle("text-white");

  const cards = document.querySelectorAll(".summary-card, .main-card");

  cards.forEach(card => {
    card.classList.toggle("bg-white");
    card.classList.toggle("bg-gray-800");
    card.classList.toggle("text-black");
    card.classList.toggle("text-white");
  });

  document.getElementById("themeToggle").innerText =
    darkMode ? "Light Mode" : "Dark Mode";
});

// EXPORT CSV
function exportCSV() {
  let csv = "Title,Amount,Category,Date\n";

  expenses.forEach(e => {
    csv += `${e.title},${e.amount},${e.category},${e.date}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "expenses.csv";
  link.click();
}

// INIT
fetchExpenses();
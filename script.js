let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const list = document.getElementById("transaction-list");
const incomeEl = document.getElementById("income");
const expensesEl = document.getElementById("expenses");
const balanceEl = document.getElementById("balance");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const transaction = {
    id: Date.now(),
    description: description.value,
    amount: +amount.value,
    category: category.value,
    date: new Date().toISOString()
  };
  transactions.push(transaction);
  updateUI();
  form.reset();
});

function updateUI() {
  list.innerHTML = "";
  let income = 0, expense = 0;

  transactions.forEach(tx => {
    const sign = tx.amount > 0 ? "+" : "-";
    const li = document.createElement("li");
    li.classList.add(tx.amount > 0 ? "income" : "expense");
    li.innerHTML = `
      ${tx.description} [${tx.category}] 
      <span>${sign}₹${Math.abs(tx.amount)}</span>
      <button onclick="removeTransaction(${tx.id})">❌</button>
    `;
    list.appendChild(li);
    tx.amount > 0 ? income += tx.amount : expense += tx.amount;
  });

  incomeEl.innerText = income;
  expensesEl.innerText = Math.abs(expense);
  balanceEl.innerText = income + expense;

  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateChart();
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateUI();
}

let chart;
function updateChart() {
  const grouped = transactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});

  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  if (chart) chart.destroy();
  chart = new Chart(document.getElementById("chart").getContext("2d"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "Spending by Category",
        data,
        backgroundColor: ["green", "orange", "blue", "grey"]
      }]
    }
  });
}

updateUI();


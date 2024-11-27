// Elements
const budgetInput = document.querySelector('#budget');
const setBudgetBtn = document.querySelector('.set-budget-btn');
const expenseDescriptionInput = document.querySelector('#expense-description');
const expenseInput = document.querySelector('#expense');
const addExpenseBtn = document.querySelector('.add-expense-btn');
const budgetOverview = document.querySelector('.budget-overview h3');
const expensesOverview = document.querySelector('.expenses-overview h3');
const balanceOverview = document.querySelector('.balance-overview h3');
const expensesTableBody = document.querySelector('.expenses-details tbody');
const notification = document.querySelector('.notification');

// State variables
let budget = 0;
let totalExpenses = 0;
let expenses = [];
let editIndex = null; 

// Show a notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Setting the budget
setBudgetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const newBudget = parseFloat(budgetInput.value);

    if (isNaN(newBudget) || newBudget <= 0) {
        showNotification('Please enter a valid budget amount!');
        return;
    }

    budget = newBudget;
    updateOverview();
    budgetInput.value = '';
});

// Adding or updating an expense
addExpenseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const description = expenseDescriptionInput.value;
    const amount = parseFloat(expenseInput.value);

    if (!description || isNaN(amount) || amount <= 0) {
        showNotification('Please enter valid expense details!');
        return;
    }

    if (editIndex !== null) {
        // Update the existing expense
        const expense = expenses[editIndex];
        totalExpenses = totalExpenses - expense.amount + amount;
        expenses[editIndex] = { description, amount };
        editIndex = null; // Clear the edit index
        addExpenseBtn.textContent = "Add Expense"; // Reset button text
    } else {
        // Add a new expense
        expenses.push({ description, amount });
        totalExpenses += amount;
    }

    updateOverview();
    renderExpenses();
    expenseDescriptionInput.value = '';
    expenseInput.value = '';
});

// Updating the overview
function updateOverview() {
    budgetOverview.textContent = `$${budget}`;
    expensesOverview.textContent = `$${totalExpenses}`;
    balanceOverview.textContent = `$${budget - totalExpenses}`;
}

// Rendering Expenses
function renderExpenses() {
    expensesTableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${index + 1}</td>
        <td>${expense.description}</td>
        <td>$${expense.amount}</td>
        <td>
            <button class="btn edit-btn" data-index="${index}">Edit</button>
            <button class="btn delete-btn" data-index="${index}">Delete</button>
        </td>
        `;
        expensesTableBody.appendChild(row);
    });

    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');

    editBtns.forEach((btn) =>
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            editExpense(index);
        })
    );
    
    deleteBtns.forEach((btn) =>
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            deleteExpense(index);
        })
    );
}

// Edit an expense
function editExpense(index) {
    const expense = expenses[index];
    expenseDescriptionInput.value = expense.description;
    expenseInput.value = expense.amount;
    editIndex = index; // Set the edit index
    addExpenseBtn.textContent = "Update Expense"; // Change button text
}

// Function to delete an expense
function deleteExpense(index) {
    const expense = expenses[index];
    totalExpenses -= expense.amount;
    expenses.splice(index, 1);
    updateOverview();
    renderExpenses();
}
document.addEventListener('DOMContentLoaded', function () {
    const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
    if (userId) {
        fetchTransactions(userId); // Fetch transactions to build charts
    } else {
        console.error('User ID not found in local storage.');
        alert('Please log in to view your visuals.');
    }

    function fetchTransactions(userId) {
        fetch(`http://localhost:3000/api/transactions?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const transactions = data.transactions;
                    createCategoryPieChart(transactions);
                    createCreditByCategory(transactions);
                    createExpenseByCategory(transactions);
                    createTransactionPieChart(transactions);
                } else {
                    console.error('Failed to load transactions: ' + data.message);
                }
            })
            .catch(error => console.error('Error fetching transactions:', error));
    }

    function createCategoryPieChart(transactions) {
        // Group transactions by category for the pie chart, excluding 'credit' transactions
        const categoryData = {};
        transactions.forEach(transaction => {
            if (transaction.transaction_type !== 'credit') {  // Exclude credit transactions
                const category = transaction.category;
                categoryData[category] = (categoryData[category] || 0) + parseFloat(transaction.amount);
            }
        });
    
        const ctx = document.getElementById('categoryPieChart').getContext('2d');
        if (Object.keys(categoryData).length > 0) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(categoryData),
                    datasets: [{
                        label: 'Expenses by Category',
                        data: Object.values(categoryData),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 'pink', 'red', 'brown', 'blue'],
                    }]
                }
            });
        } else {
            console.warn('No data available for category pie chart.');
        }
    }
    

    // Updated createCreditByCategory function
    function createCreditByCategory(transactions) {
        const creditData = {};
        let totalCredits = 0;
        
        transactions.forEach(transaction => {
            if (transaction.transaction_type === 'credit') {
                const category = transaction.category;
                creditData[category] = (creditData[category] || 0) + parseFloat(transaction.amount);
                totalCredits += parseFloat(transaction.amount); // Calculate total credits
            }
        });

        const creditContainer = document.getElementById('creditByCategory');
        creditContainer.innerHTML = ''; // Clear previous content
        
        if (totalCredits > 0) {
            for (const [category, amount] of Object.entries(creditData)) {
                const percentage = ((amount / totalCredits) * 100).toFixed(2);
                creditContainer.innerHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong>${category}</strong>: ${amount} (${percentage}%)
                        <div style="background-color: #f3f3f3; border-radius: 10px;">
                            <div style="width: ${percentage}%; background-color: #FFCE56; height: 25px; border-radius: 10px;"></div>
                        </div>
                    </div>
                `;
            }
        } else {
            creditContainer.innerHTML = 'No credits available.';
        }
    }

    // Updated createExpenseByCategory function
    function createExpenseByCategory(transactions) {
        const expenseData = {};
        let totalExpenses = 0;
        
        transactions.forEach(transaction => {
            if (transaction.transaction_type === 'expense') {
                const category = transaction.category;
                expenseData[category] = (expenseData[category] || 0) + parseFloat(transaction.amount);
                totalExpenses += parseFloat(transaction.amount); // Calculate total expenses
            }
        });

        const expenseContainer = document.getElementById('expenseByCategory');
        expenseContainer.innerHTML = ''; // Clear previous content

        if (totalExpenses > 0) {
            for (const [category, amount] of Object.entries(expenseData)) {
                const percentage = ((amount / totalExpenses) * 100).toFixed(2);
                expenseContainer.innerHTML += `
                    <div style="margin-bottom: 10px;">
                        <strong>${category}</strong>: ${amount} (${percentage}%)
                        <div style="background-color: #f3f3f3; border-radius: 10px;">
                            <div style="width: ${percentage}%; background-color: #36A2EB; height: 25px; border-radius: 10px;"></div>
                        </div>
                    </div>
                `;
            }
        } else {
            expenseContainer.innerHTML = 'No expenses available.';
        }
    }

    function createTransactionPieChart(transactions) {
        const transactionCountData = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            transactionCountData[category] = (transactionCountData[category] || 0) + 1;
        });

        const ctx = document.getElementById('transactionPieChart').getContext('2d');
        if (Object.keys(transactionCountData).length > 0) {
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(transactionCountData),
                    datasets: [{
                        label: 'Number of Transactions by Category',
                        data: Object.values(transactionCountData),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 'pink', 'red', 'brown', 'blue'],
                    }]
                }
            });
        } else {
            console.warn('No data available for transaction pie chart.');
        }
    }
});


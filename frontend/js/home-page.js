// delete functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById("myModal");
    const addNewBtn = document.querySelector(".add");
    const closeModalBtn = document.querySelector(".close");
    const closeBtn = document.getElementById("closeModal");
    const form = document.querySelector(".add-expense-form");
    const transactionTableBody = document.getElementById('transactionTableBody'); // Get the table body

    // Retrieve user ID from local storage (assuming you've stored it during login)
    const userId = localStorage.getItem('userId'); 

    // Fetch transactions for the logged-in user
    fetchTransactions(userId);

    // Function to open the modal
    function openModal() {
        modal.style.display = "block";
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = "none";
        form.reset(); // Reset form fields when closing
    }

    // Open modal when clicking "Add new" button
    addNewBtn.addEventListener('click', openModal);

    // Close modal when clicking the "X" button or close button in the form
    closeModalBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from refreshing the page

        // Gather form data
        const formData = {
            title: document.getElementById('title').value,
            amount: document.getElementById('amount').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            transactionType: document.getElementById('transactionType').value,
            date: document.getElementById('date').value
        };

        // Send data to the backend
        fetch('http://localhost:3000/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...formData, userId }) // Include userId in the request
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Transaction added successfully!');
                addTransactionToTable({ ...formData, id: data.transactionId }); // Add transaction to the table with transactionId
                closeModal(); // Close the modal on success
            } else {
                alert('Failed to add transaction: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again: ' + error.message);
        });
    });

    // Function to add a transaction to the table
    function addTransactionToTable(transaction) {
        const formattedDate = new Date(transaction.date).toISOString().split('T')[0];
        const row = document.createElement('tr');
        row.dataset.transactionId = transaction.id; // Store transaction ID in the row for deletion
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${transaction.title}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.transactionType}</td>
            <td>${transaction.category}</td>
            <td><button class="delete">Delete</button></td>
        `;
        transactionTableBody.appendChild(row);

        // Attach delete event to the new row's delete button
        row.querySelector('.delete').addEventListener('click', function () {
            const transactionId = row.dataset.transactionId;
            const confirmed = confirm('Are you sure you want to delete this transaction?');
            if (confirmed) {
                deleteTransaction(transactionId, row);
            }
        });
    }

    // Function to fetch transactions for the logged-in user
    function fetchTransactions(userId) {
        fetch(`http://localhost:3000/api/transactions?userId=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); // Get the response as JSON
            })
            .then(data => {
                console.log('Fetched transactions:', data); // Log the data fetched from the backend
                if (data.success) {
                    data.transactions.forEach(transaction => {
                        addTransactionToTable(transaction); // Add each transaction to the table
                    });
                } else {
                    alert('Failed to load transactions: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching transactions:', error);
                alert('An error occurred while fetching transactions: ' + error.message);
            });
    }

    // Function to delete a transaction
    function deleteTransaction(transactionId, row) {
        fetch(`http://localhost:3000/api/transactions/${transactionId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Transaction deleted successfully!');
                transactionTableBody.removeChild(row); // Remove the row from the table
            } else {
                alert('Failed to delete transaction: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting transaction:', error);
            alert('An error occurred while deleting the transaction: ' + error.message);
        });
    }
});


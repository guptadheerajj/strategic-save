// delete functionality
// url issue solved 
// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'dheeraj', // Change this to your MySQL user
    password: 'dheerajroot79', // Change this to your MySQL password
    database: 'expense_management_system'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Route to register a new user
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'User registered successfully!' });
    });
});

// Route to log in
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (result.length > 0) {
            const userId = result[0].id; // Get the user ID
            res.status(200).json({ success: true, message: 'Login successful!', userId: userId });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Route to add a new transaction
app.post('/api/transactions', (req, res) => {
    const { userId, title, amount, category, description, transactionType, date } = req.body;

    console.log(req.body); // Check what is being sent to the server

    // Ensure all necessary fields are provided
    if (!userId || !title || !amount || !category || !transactionType || !date) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const sql = 'INSERT INTO transactions (user_id, title, amount, category, description, transaction_type, date) VALUES (?, ?, ?, ?, ?, ?, ?)';

    // Insert the transaction into the database
    db.query(sql, [userId, title, amount, category, description, transactionType, date], (err, result) => {
        if (err) {
            console.error('Error inserting transaction:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Transaction added successfully!', transactionId: result.insertId });
    });
});

// Route to get all transactions for a specific user
app.get('/api/transactions', (req, res) => {
    const userId = req.query.userId; // Get userId from query parameters
    const sql = 'SELECT * FROM transactions WHERE user_id = ?'; // Fetch transactions for the specific user
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        // Return results with consistent naming
        const transactionsWithCorrectNaming = results.map(transaction => ({
            ...transaction,
            transactionType: transaction.transaction_type // Map to transactionType for frontend usage
        }));
        res.status(200).json({ success: true, transactions: transactionsWithCorrectNaming });
    });
});

// Route to delete a transaction by ID
app.delete('/api/transactions/:transactionId', (req, res) => {
    const { transactionId } = req.params; // Extract transactionId from the URL

    const sql = 'DELETE FROM transactions WHERE id = ?'; // Query to delete the transaction by ID
    db.query(sql, [transactionId], (err, result) => {
        if (err) {
            console.error('Error deleting transaction:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Transaction not found' });
        }
        res.status(200).json({ success: true, message: 'Transaction deleted successfully!' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

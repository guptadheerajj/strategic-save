document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const username = document.querySelector('#username').value;
    const email = document.querySelector('#email-address').value;
    const password = document.querySelector('#password').value;

    // Perform basic validation (you can add more here)
    if (!username || !email || !password) {
        alert('Please fill out all fields.');
        return;
    }

    // Send data to the backend (we will create this later)
    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Registration successful!');
            window.location.href = 'login-page.html';
        } else {
            alert('Registration failed. Try again.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
});

document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get form data
    const email = document.querySelector('#email-address').value;
    const password = document.querySelector('#password').value;

    // Perform basic validation
    if (!email || !password) {
        alert('Please enter email and password.');
        return;
    }

    // Send data to backend
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Login successful!');
            // Store userId in localStorage
            localStorage.setItem('userId', data.userId);
            window.location.href = 'home-page.html';
        } else {
            alert('Invalid credentials.');
        }
    } catch (error) {
        alert('Error connecting to the server.');
    }
});

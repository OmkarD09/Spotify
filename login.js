document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {

        e.preventDefault(); 

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;


        if (username && password) {
            console.log("Login successful!");
            

            sessionStorage.setItem('loggedIn', 'true');
            

            window.location.href = 'index.html';

        } else {
            errorMessage.textContent = 'Please enter both username and password.';
        }
    });
});
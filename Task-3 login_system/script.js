// DEMO DATABASE
let users = [
    { email: "admin@gmail.com", password: "admin123" },
    { email: "user@gmail.com", password: "user123" }
];

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); // stop form refresh

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    let emailError = document.getElementById("emailError");
    let passwordError = document.getElementById("passwordError");
    let loginMessage = document.getElementById("loginMessage");

    emailError.textContent = "";
    passwordError.textContent = "";
    loginMessage.textContent = "";

    let isValid = true;

    // Email validation
    if (email === "") {
        emailError.textContent = "Email is required";
        isValid = false;
    } else if (!validateEmail(email)) {
        emailError.textContent = "Invalid email format";
        isValid = false;
    }

    // Password validation
    if (password === "") {
        passwordError.textContent = "Password is required";
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters";
        isValid = false;
    }

    if (!isValid) return;

    // Check credentials
    let userFound = users.find(user => user.email === email && user.password === password);

    if (userFound) {
        loginMessage.style.color = "green";
        loginMessage.textContent = "Login Successful!";
    } else {
        loginMessage.style.color = "red";
        loginMessage.textContent = "Invalid Email or Password";
    }
});

// Email format check function
function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
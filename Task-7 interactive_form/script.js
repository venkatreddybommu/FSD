// Reusable validation function
function isEmpty(value) {
    return value.trim() === "";
}

// Email validation function
function isValidEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Real-time validation on keypress
document.getElementById("name").addEventListener("keyup", function() {
    let name = this.value;
    let error = document.getElementById("nameError");

    if (isEmpty(name)) {
        error.textContent = "Name cannot be empty";
    } else {
        error.textContent = "";
    }
});

document.getElementById("email").addEventListener("keyup", function() {
    let email = this.value;
    let error = document.getElementById("emailError");

    if (!isValidEmail(email)) {
        error.textContent = "Invalid Email";
    } else {
        error.textContent = "";
    }
});

document.getElementById("message").addEventListener("keyup", function() {
    let message = this.value;
    let error = document.getElementById("messageError");

    if (isEmpty(message)) {
        error.textContent = "Feedback cannot be empty";
    } else {
        error.textContent = "";
    }
});

// Double-click submit event
document.getElementById("submitBtn").addEventListener("dblclick", function() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;
    let success = document.getElementById("successMessage");

    if (!isEmpty(name) && isValidEmail(email) && !isEmpty(message)) {
        success.textContent = "Feedback Submitted Successfully!";
    } else {
        success.textContent = "Please fix errors before submitting.";
        success.style.color = "red";
    }
});
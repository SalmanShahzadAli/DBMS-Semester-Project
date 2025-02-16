function validatePassword() {
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirm_password").value;

    if (password != confirmPassword) {
        alert("Passwords Do Not Match! Please Re Enter");
        return false;
    }
    return true;
}
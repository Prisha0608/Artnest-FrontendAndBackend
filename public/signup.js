const API_URL = "http://localhost:3000/users/signup";

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous errors
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  const username = document.getElementById("username").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  const role = document.querySelector('input[name="role"]:checked');

  let isValid = true;

  // Username validation
  if (!username) {
    document.getElementById("usernameError").textContent = "Username is required.";
    isValid = false;
  }

  // Email or phone validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  if (!emailPattern.test(contact) && !phonePattern.test(contact)) {
    document.getElementById("contactError").textContent =
      "Enter a valid email or 10 digit phone number.";
    isValid = false;
  }

  // Role validation
  if (!role) {
    document.getElementById("roleError").textContent = "Please select Artist or Customer.";
    isValid = false;
  }

  // Password validation
  const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passPattern.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must have 8+ chars, uppercase, lowercase, number & special symbol.";
    isValid = false;
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    document.getElementById("confirmError").textContent = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  // Check if username already exists
  const response = await fetch(`http://localhost:3000/users/userDetails?username=${username}`);
  const existingUsers = await response.json();

  if (existingUsers.length > 0) {
    document.getElementById("usernameError").textContent = "Username already exists!";
    return;
  }

  // Register user
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      contact,
      password,
      role: role.value
    }),
  });

  document.getElementById("confirmError").style.color = "green";
  document.getElementById("confirmError").textContent =
    "Signup successful! Redirecting to login...";

  setTimeout(() => (window.location.href = "login.html"), 2000);
});

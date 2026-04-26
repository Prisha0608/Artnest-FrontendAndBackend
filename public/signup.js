const API_URL = "http://localhost:3000/users/signup";

const form = document.getElementById("signupForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Clear previous errors
  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  const username = document.getElementById("username").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const role = document.querySelector('input[name="role"]:checked');

  let isValid = true;

  // Validation
  if (!username) {
    document.getElementById("usernameError").textContent = "Username is required.";
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9]{10}$/;

  if (!emailPattern.test(contact) && !phonePattern.test(contact)) {
    document.getElementById("contactError").textContent =
      "Enter a valid email or 10 digit phone number.";
    isValid = false;
  }

  if (!role) {
    document.getElementById("roleError").textContent =
      "Please select Artist or Customer.";
    isValid = false;
  }

  const passPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!passPattern.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must have 8+ chars, uppercase, lowercase, number & special symbol.";
    isValid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("confirmError").textContent =
      "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  try {
    // 1. Check if user already exists
    const checkRes = await fetch(
      `http://localhost:3000/users/userDetails?username=${encodeURIComponent(username)}`
    );

    const existingUsers = await checkRes.json();

    if (!checkRes.ok) {
      throw new Error("Failed to check existing user");
    }

    if (existingUsers.length > 0) {
      document.getElementById("usernameError").textContent =
        "Username already exists!";
      return;
    }

    // 2. Register user
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        contact,
        password,
        role: role.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      document.getElementById("confirmError").textContent =
        data.message || "Signup failed!";
      return;
    }

    // Success message
    document.getElementById("confirmError").style.color = "green";
    document.getElementById("confirmError").textContent =
      "Signup successful! Redirecting...";

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);

  } catch (error) {
    console.error("Signup error:", error);
    document.getElementById("confirmError").textContent =
      "Server connection error";
  }
});

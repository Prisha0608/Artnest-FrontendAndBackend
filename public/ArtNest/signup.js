const API_URL = "http://localhost:3000/users";

document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();

  let isValid = true;

  // ✅ Username validation
  if (!username) {
    document.getElementById("usernameError").textContent = "Username is required.";
    isValid = false;
  }

  // ✅ Password format validation
  const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passPattern.test(password)) {
    document.getElementById("passwordError").textContent =
      "Password must have 8+ chars, 1 uppercase, 1 lowercase, 1 number & 1 special symbol.";
    isValid = false;
  }

  // ✅ Confirm password validation
  if (password !== confirmPassword) {
    document.getElementById("confirmError").textContent = "Passwords do not match.";
    isValid = false;
  }

  if (!isValid) return;

  // ✅ Check if username already exists
  const response = await fetch(`${API_URL}?username=${username}`);
  const existingUsers = await response.json();

  if (existingUsers.length > 0) {
    document.getElementById("usernameError").textContent = "Username already exists!";
    return;
  }

  // ✅ Register user
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  document.getElementById("confirmError").style.color = "green";
  document.getElementById("confirmError").textContent =
    "Signup successful! Redirecting to login...";

  setTimeout(() => (window.location.href = "login.html"), 2000);
});

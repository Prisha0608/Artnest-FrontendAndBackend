const API_URL = "http://localhost:3000/users/login";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password!");
    return;
  }

  const response = await fetch(`${API_URL}?username=${username}&password=${password}`);
  const users = await response.json();

  if (users.length > 0) {
    alert("Login successful!");
    // You could also store the user info in localStorage
    window.location.href = "artist.html"; // redirect to homepage
  } else {
    alert("Invalid username or password!");
  }
});

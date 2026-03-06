const API_URL = "http://localhost:3000/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async function(e) {
  e.preventDefault();   // stop page reload

  const loginInput = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = "";

  try {

    const response = await fetch(
      `${API_URL}?login=${loginInput}&password=${password}`
    );

    if (!response.ok) {
      errorMessage.textContent = "Invalid username/contact or password";
      return;
    }

    const user = await response.json();

    if (user.role === "artist") {
      window.location.href = "artist.html";
    } else {
      window.location.href = "gallery.html";
    }

  } catch (err) {
    errorMessage.textContent = "Server connection error";
  }

});
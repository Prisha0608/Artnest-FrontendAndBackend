const API_URL = "http://localhost:3000/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async function(e) {
  e.preventDefault();   // page reload stop

  const loginInput = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error");

  errorMessage.textContent = "";

  try {

    const response = await fetch(
      `${API_URL}?login=${encodeURIComponent(loginInput)}&password=${encodeURIComponent(password)}`
    );

    const data = await response.json();

    // ❌ if credentials wrong
    if (!response.ok) {
      errorMessage.textContent = data.message;
      return;
    }

    // ✅ correct login → redirect
    if (data.role === "artist") {
      window.location.href = "artist.html";
    } 
    else if (data.role === "customer") {
      window.location.href = "Gallery.html";
    }

  } catch (error) {
    errorMessage.textContent = "Server connection error";
  }

});
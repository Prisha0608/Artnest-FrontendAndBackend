const API_URL = "http://localhost:3000/users/login";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const loginInput = document.getElementById("login").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("error");

  errorMessage.textContent = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // ⭐ MOST IMPORTANT
      body: JSON.stringify({
        login: loginInput,
        password: password
      })
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      errorMessage.textContent = data.message || "Invalid credentials";
      return;
    }

    console.log("Login success:", data);

    // ✅ redirect (session already active)
    if (data.user.role === "artist") {
      window.location.href = "artist.html";
    } else {
      window.location.href = "Gallery.html";
    }

  } catch (error) {
    console.error(error);
    errorMessage.textContent = "Server connection error";
  }
});
const API_URL = "http://localhost:3000/users/login";

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

    const users = await response.json();
    
    //  if credentials wrong
    if (!response.ok) {
      errorMessage.textContent = users.message;
      return;
    }
  
     localStorage.setItem("loggedInUser", users.username);
    // correct login → redirect
    if (users.role === "artist") {
      window.location.href = "artist.html";
    } 
    else if (users.role === "customer") {
      window.location.href = "Gallery.html";
    }

  } catch (error) {
    errorMessage.textContent = "Server connection error";
  }


});

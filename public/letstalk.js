document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");
  const API_URL = "http://localhost:3000/contacts";

  form.addEventListener("submit", async function(e) {

    e.preventDefault();

    // remove previous messages
    document.querySelectorAll(".error, .success").forEach(el => el.remove());

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    let valid = true;

    function showError(input, msg) {
      const span = document.createElement("span");
      span.className = "error";
      span.style.color = "red";
      span.style.fontSize = "0.9rem";
      span.textContent = msg;
      input.insertAdjacentElement("afterend", span);
    }

    // validations

    if (firstName === "") {
      showError(document.getElementById("firstName"), "First name required");
      valid = false;
    }

    if (lastName === "") {
      showError(document.getElementById("lastName"), "Last name required");
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showError(document.getElementById("email"), "Enter valid email");
      valid = false;
    }

    if (phone && !/^[0-9]{10}$/.test(phone)) {
      showError(document.getElementById("phone"), "Enter valid 10 digit phone");
      valid = false;
    }

    if (message === "") {
      showError(document.getElementById("message"), "Message required");
      valid = false;
    }

    if (!valid) return;

    const newMessage = {
      firstName,
      lastName,
      email,
      phone,
      message
    };

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newMessage)
      });

      if (response.ok) {

        const success = document.createElement("p");
        success.className = "success";
        success.style.color = "green";
        success.style.textAlign = "center";
        success.textContent = "Message sent successfully!";

        form.appendChild(success);

        form.reset();

        setTimeout(() => {
          success.remove();
        }, 4000);

      } else {

        alert("Failed to send message");

      }

    } catch (error) {

      alert("Server connection error");

    }

  });

});
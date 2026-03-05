document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const API_URL = "http://localhost:3000/contacts";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Remove previous messages
    document.querySelectorAll(".error, .success").forEach((el) => el.remove());

    const firstName = form.querySelector('input[placeholder="First Name *"]').value.trim();
    const lastName = form.querySelector('input[placeholder="Last Name *"]').value.trim();
    const email = form.querySelector('input[type="email"]').value.trim();
    const phone = form.querySelector('input[type="tel"]').value.trim();
    const message = form.querySelector("textarea").value.trim();

    let valid = true;

    // Helper function for errors
    function showError(input, msg) {
      const span = document.createElement("span");
      span.className = "error";
      span.style.color = "red";
      span.style.fontSize = "0.9rem";
      span.textContent = msg;
      input.insertAdjacentElement("afterend", span);
    }

    // Validations
    if (firstName === "") {
      showError(form.querySelector('input[placeholder="First Name *"]'), "First name is required");
      valid = false;
    }
    if (lastName === "") {
      showError(form.querySelector('input[placeholder="Last Name *"]'), "Last name is required");
      valid = false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError(form.querySelector('input[type="email"]'), "Enter a valid email");
      valid = false;
    }
    if (phone && !/^[0-9]{10}$/.test(phone)) {
      showError(form.querySelector('input[type="tel"]'), "Enter a valid 10-digit phone number");
      valid = false;
    }
    if (message === "") {
      showError(form.querySelector("textarea"), "Message is required");
      valid = false;
    }

    if (!valid) return;

    // Prepare data
    const newMessage = { firstName, lastName, email, phone, message };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (res.ok) {
        const success = document.createElement("p");
        success.className = "success";
        success.style.color = "green";
        success.style.textAlign = "center";
        success.textContent = "✅ Message sent successfully!";
        form.appendChild(success);
        form.reset();

        // Remove success message after 3 seconds
        setTimeout(() => success.remove(), 5000);
      } else {
        alert("Failed to send message!");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  });
});

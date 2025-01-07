import { ApiKey, baseUrl } from "../services/services.js";
import { setTokenToLocalstorage } from "../utils/utils.js";

// Event Listener for "Back" button to navigate to the previous page
document.getElementById("back-button").addEventListener("click", () => {
  window.location.href = "../Onboarding/Onboarding-swiper/index.html";
});

// Event Listener for the "Sign in" button to handle login process
document.getElementById("sign-in-btn").addEventListener("click", handleLogin);

// Event Listeners for input fields to enable/disable the "Sign in" button based on input
document
  .getElementById("email-input")
  .addEventListener("input", toggleSignInButton);
document
  .getElementById("password-input")
  .addEventListener("input", toggleSignInButton);

// Function to handle the login process
function handleLogin(e) {
  e.preventDefault(); // Prevent default form submission

  // Get email and password values from input fields
  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value.trim();

  // Get references to error and remember sections
  const errorSection = document.getElementById("error-section");
  const rememberSection = document.getElementById("remember-section");

  errorSection.classList.add("hidden");
  rememberSection.classList.remove("hidden");

  login(email, password, errorSection, rememberSection);
}

// Function to toggle the "Sign in" button state based on input values
function toggleSignInButton() {
  const email = document.getElementById("email-input").value.trim();
  const password = document.getElementById("password-input").value.trim();
  const signInButton = document.getElementById("sign-in-btn");

  if (email && password) {
    // Enable the button if both fields are filled
    signInButton.disabled = false;
    signInButton.classList.remove(
      "bg-gray-400",
      "opacity-50",
      "cursor-not-allowed"
    );
    signInButton.classList.add("bg-[#212529]", "opacity-100", "cursor-pointer");
  } else {
    // Disable the button if any field is empty
    signInButton.disabled = true;
    signInButton.classList.remove(
      "bg-[#212529]",
      "opacity-100",
      "cursor-pointer"
    );
    signInButton.classList.add(
      "bg-gray-400",
      "opacity-50",
      "cursor-not-allowed"
    );
  }
}

//Event listener for handle "Enter" Key for login
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const email = document.getElementById("email-input").value.trim();
    const password = document.getElementById("password-input").value.trim();

    if (email && password) {
      handleLogin(e);
    } else {
      // Alert user if fields are empty
      e.preventDefault;
      alert("Please fill in both email and password.");
    }
  }
});

// Function to handle login API request
function login(email, password, errorSection, rememberSection) {
  fetch(`${baseUrl}/api/users/login`, {
    method: "POST",
    headers: {
      api_key: ApiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Login failed.");
      }
      return response.json();
    })
    .then((result) => {
      if (result.accessToken) {
        setTokenToLocalstorage(result.accessToken); // Store token in localStorage

        showToastMessage("Login successful!"); // Display success message

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          window.location.href = "../Home/home-index.html";
        }, 2000);
      } else {
        showError(errorSection, rememberSection); // Handle cases with no access token
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      showError(errorSection, rememberSection); // Show error message
    });
}

// Event Listener for toggling password visibility
const passwordInput = document.getElementById("password-input");
const togglePasswordButton = document
  .getElementById("toggle-password-btn")
  .querySelector("img");

togglePasswordButton.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    // Change to text to show the password
    passwordInput.type = "text";
    togglePasswordButton.src = "../assets/images/visible-eye-svgrepo-com.svg"; // Update icon to "show" icon
  } else {
    // Change to password to hide the password
    passwordInput.type = "password";
    togglePasswordButton.src = "../../assets/images/input-suffix.svg"; // Update icon to "hide" icon
  }
});

// Function to show error section and hide remember section
function showError(errorSection, rememberSection) {
  errorSection.classList.remove("hidden");
  rememberSection.classList.add("hidden");
}

// Function to display a t oast message
function showToastMessage(message) {
  const messageSection = document.getElementById("message-section");
  const messageText = document.getElementById("message-text");

  messageText.textContent = message; // Set message text
  messageSection.classList.remove("hidden"); // Show message section

  // Hide the message section after 3 seconds
  setTimeout(() => {
    messageSection.classList.add("hidden");
  }, 2000);
}

// Get the "Apply" button from the DOM
const applyBtn = document.getElementById("applyBtn");

// Add a click event listener to the "Apply" button
applyBtn.addEventListener("click", () => {
  // Find the selected shipping option from the radio buttons
  const selectedShippingOption = document.querySelector(
    'input[name="address"]:checked'
  );

  if (selectedShippingOption) {
    // Find the closest container element for the selected shipping option
    const selectedOption = selectedShippingOption.closest(".shipping-box");

    // Extract the name of the selected shipping option
    const optionName =
      selectedOption.querySelector(".shipping-name").textContent;

    // Extract the price of the selected shipping option
    const optionPrice =
      selectedOption.querySelector(".shipping-price").textContent;

    // Extract the estimated arrival date of the selected shipping option
    const optionEstimatedArrival =
      selectedOption.querySelector(".shipping-arrival").textContent;

    // Extract the image source for the selected shipping option
    const optionImage = selectedOption.querySelector("img").src;

    // Create an object to store the shipping option details
    const shippingData = {
      name: optionName,
      price: optionPrice,
      estimatedArrival: optionEstimatedArrival,
      image: optionImage,
    };

    localStorage.setItem("shippingOption", JSON.stringify(shippingData));

    // Redirect the user to the Checkout page
    window.location.href = "../../Checkout/index.html";
  } else {
    showToast("Please select a shipping option.", "error");
  }
});

// On page load, set the previously selected shipping option (if any)
window.onload = () => {
  const savedShippingData = JSON.parse(localStorage.getItem("shippingOption"));
  if (savedShippingData) {
    // Find all the shipping options
    const shippingOptions = document.querySelectorAll(".shipping-box");
    shippingOptions.forEach((option) => {
      const optionName = option.querySelector(".shipping-name").textContent;

      // Check if the option matches the saved selection
      if (optionName === savedShippingData.name) {
        const radioInput = option.querySelector('input[name="address"]');
        if (radioInput) {
          radioInput.checked = true;
        }
      }
    });
  }
};

// Displays a toast notification with a given message and type.
function showToast(message, type) {
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toast-message");

  toastMessage.textContent = message;

  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.className = "toast";
  }, 3000);
}

// Footer button functionality to highlight the active button
const footerBtn = document.querySelectorAll(".footer-btn");
footerBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(btn); // Pass the clicked button to setActive
  });
});

// Function to set active state for footer buttons
function setActive(selectedButton) {
  // Get all buttons with the class 'footer-btn'
  const buttons = document.querySelectorAll(".footer-btn");

  // Loop through buttons and reset their state
  buttons.forEach((button) => {
    const images = button.querySelectorAll(".icon-img");
    images[0].classList.remove("hidden"); // Show default image
    images[1].classList.add("hidden"); // Hide selected image
  });

  // Set the selected button's state
  const selectedImages = selectedButton.querySelectorAll(".icon-img");
  selectedImages[0].classList.add("hidden"); // Hide default image
  selectedImages[1].classList.remove("hidden"); // Show selected image
}

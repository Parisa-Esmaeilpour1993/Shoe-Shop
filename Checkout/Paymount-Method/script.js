// Get DOM elements for actions and inputs
const addMethod = document.getElementById("add-method");
const overlayModal = document.getElementById("overlay-modal");
const methodInput = document.getElementById("method-input");
const closeModal = document.getElementById("closeModal");
const addBtn = document.getElementById("addBtn");

// Load saved payment methods from localStorage and render them on page load
window.addEventListener("load", () => {
  const savedMethods = JSON.parse(localStorage.getItem("paymentMethods"));
  if (savedMethods && Array.isArray(savedMethods)) {
    savedMethods.forEach((method) => {
      addMethodToPage(method);
    });
  }
});

// Show the modal when the "Add Method" button is clicked
addMethod.addEventListener("click", () => {
  overlayModal.classList.remove("hidden");
});

// Hide the modal when the "Close" button is clicked
closeModal.addEventListener("click", () => {
  overlayModal.classList.add("hidden");
});

// Add a new payment method when the "Add" button is clicked
addBtn.addEventListener("click", () => {
  const newMethod = methodInput.value.trim();

  if (newMethod) {
    const savedMethods =
      JSON.parse(localStorage.getItem("paymentMethods")) || [];
    savedMethods.push(newMethod); // Add the new method to the array
    localStorage.setItem("paymentMethods", JSON.stringify(savedMethods));

    addMethodToPage(newMethod); // Render the new method on the page

    overlayModal.classList.add("hidden"); // Hide the modal
    methodInput.value = ""; // Clear the input field
  } else {
    showToast("Please enter a payment method.", "error");
  }
});

// Function to render a payment method on the page
function addMethodToPage(newMethod) {
  const methodContainer = document.querySelector(".method-container");
  const newMethodDiv = document.createElement("div");
  newMethodDiv.classList.add("flex", "flex-col", "gap-6", "px-6", "mb-6");
  newMethodDiv.innerHTML = `
      <div class="bg-white rounded-2xl py-4 px-5 flex justify-between items-center shadow-md">
        <div class="flex gap-4 items-center">
          <img src="../../assets/images/wallet-fill.svg" alt="New method icon" class="h-8" />
          <div class="text-lg font-semibold">${newMethod}</div>
        </div>
        <div class="flex gap-2 items-center">
          <button class="delete-method size-5 mt-2">
            <img src="../../assets/images/trash-bin-svgrepo-com.svg" alt="bin" />
          </button>
          <input type="radio" name="address" class="mt-2" />
        </div>
      </div>
    `;

  methodContainer.appendChild(newMethodDiv);

  // Add event listener to the delete button
  const deleteButton = newMethodDiv.querySelector(".delete-method");
  deleteButton.addEventListener("click", () => {
    deletePaymentMethod(newMethod); // Remove the method from localStorage
    newMethodDiv.remove(); // Remove the method from the UI
  });
}

// Function to delete a payment method from localStorage
function deletePaymentMethod(method) {
  const savedMethods = JSON.parse(localStorage.getItem("paymentMethods")) || [];
  const updatedMethods = savedMethods.filter(
    (savedMethod) => savedMethod !== method
  );
  localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
}

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

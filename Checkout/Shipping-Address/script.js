// Get DOM elements for various actions and components
const addAddress = document.getElementById("add-address");
const overlayModal = document.getElementById("overlay-modal");
const saveAddress = document.getElementById("save-address");
const closeModal = document.getElementById("close-modal");
const applyBtn = document.getElementById("apply-btn");
const returnBack = document.getElementById("return-back");

// Load stored addresses from localStorage on page load
window.onload = function () {
  const storedData = JSON.parse(localStorage.getItem("addressData")) || {
    addresses: [],
  };
  storedData.addresses.forEach((address) => {
    addAddressToLocalStorage(address.title, address.detail);
  });

  if (storedData.selectedAddress) {
    const selectedAddressName = storedData.selectedAddress.name;

    // Find the matching radio input and set it as checked
    const addressInputs = document.querySelectorAll('input[name="address"]');
    addressInputs.forEach((input) => {
      const parent = input.closest(".shipping-box");
      const shippingName = parent.querySelector(".shipping-name").textContent;

      if (shippingName === selectedAddressName) {
        input.checked = true;
      }
    });
  }
};

// Show the modal for adding a new address
addAddress.addEventListener("click", () => {
  overlayModal.classList.remove("hidden");
});

// Save the new address when the save button is clicked
saveAddress.addEventListener("click", () => {
  const titleInput = overlayModal.querySelector(".title-input");
  const detailInput = overlayModal.querySelector("textarea");

  const titleValue = titleInput.value.trim();
  const detailValue = detailInput.value.trim();

  if (titleValue && detailValue) {
    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };

    // Add the new address to localStorage
    storedData.addresses.push({ title: titleValue, detail: detailValue });
    localStorage.setItem("addressData", JSON.stringify(storedData));

    // Render the new address in the UI
    addAddressToLocalStorage(titleValue, detailValue);

    // Clear the input fields
    titleInput.value = "";
    detailInput.value = "";

    overlayModal.classList.add("hidden"); //Hide the modal
  } else {
    showToast("Add new address or Cancel the operation", "error");
  }
});

// Function to render an address in the UI
function addAddressToLocalStorage(title, detail) {
  const addressesContainer = document.querySelector(".shipping-address");

  const newAddressBox = document.createElement("div");
  newAddressBox.classList.add("flex", "flex-col", "gap-6", "px-6", "mb-6");
  newAddressBox.innerHTML = `
    <div class="shipping-box bg-white rounded-3xl px-6 py-4 flex justify-between items-center shadow-md">
      <div class="flex gap-4 items-center">
        <img
          src="../../assets/images/location-filled-svgrepo-com.svg"
          alt="Location"
          class="h-16 border-8 border-gray-300 rounded-full"
        />
        <div>
          <div class="shipping-name text-lg font-semibold">${title}</div>
          <div class="shipping-address text-gray-300">${detail}</div>
        </div>
      </div>
      <div class="flex gap-2 justify-center items-center">
        <button class="delete-address size-5">
          <img src="../../assets/images/trash-bin-svgrepo-com.svg" alt="bin" />
        </button>
        <input type="radio" name="address" />
      </div>
    </div>
  `;

  addressesContainer.appendChild(newAddressBox);

  // Add event listener to the delete button
  const deleteButton = newAddressBox.querySelector(".delete-address");
  deleteButton.addEventListener("click", () => {
    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };

    // Remove the deleted address from localStorage
    const updatedAddresses = storedData.addresses.filter(
      (address) => address.title !== title || address.detail !== detail
    );
    storedData.addresses = updatedAddresses;
    localStorage.setItem("addressData", JSON.stringify(storedData));

    // Remove the address from the UI
    addressesContainer.removeChild(newAddressBox);
  });
}

// Close the modal when the close button is clicked
closeModal.addEventListener("click", () => {
  overlayModal.classList.add("hidden");
});

// Apply the selected shipping address and redirect to the main page
applyBtn.addEventListener("click", () => {
  const selectedShippingOption = document.querySelector(
    'input[name="address"]:checked'
  );

  if (selectedShippingOption) {
    const selectedOption = selectedShippingOption.closest(".shipping-box");

    // Extract details of the selected shipping address
    const optionName =
      selectedOption.querySelector(".shipping-name").textContent;

    const optionAddress =
      selectedOption.querySelector(".shipping-address").textContent;

    const optionImage = selectedOption.querySelector("img").src;

    const shippingDataType = {
      name: optionName,
      estimatedAddress: optionAddress,
      image: optionImage,
    };

    // Save the selected address to localStorage
    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };
    storedData.selectedAddress = shippingDataType;
    localStorage.setItem("addressData", JSON.stringify(storedData));

    // Redirect to the main page
    window.location.href = "../index.html";
  } else {
    showToast("Please select a shipping Type.", "error");
  }
});

// Redirect back to the main page when the "Return Back" button is clicked
returnBack.addEventListener("click", () => {
  window.location.href = "../index.html";
});

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

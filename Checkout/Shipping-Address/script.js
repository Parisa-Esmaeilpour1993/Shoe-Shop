const addAddress = document.getElementById("add-address");
const overlayModal = document.getElementById("overlay-modal");
const saveAddress = document.getElementById("save-address");
const closeModal = document.getElementById("close-modal");
const applyBtn = document.getElementById("apply-btn");
const returnBack = document.getElementById("return-back");

window.onload = function () {
  const storedData = JSON.parse(localStorage.getItem("addressData")) || {
    addresses: [],
  };
  storedData.addresses.forEach((address) => {
    addAddressToLocalStorage(address.title, address.detail);
  });
};

addAddress.addEventListener("click", () => {
  overlayModal.classList.remove("hidden");
});

saveAddress.addEventListener("click", () => {
  const titleInput = overlayModal.querySelector(".title-input");
  const detailInput = overlayModal.querySelector("textarea");

  const titleValue = titleInput.value.trim();
  const detailValue = detailInput.value.trim();

  if (titleValue && detailValue) {
    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };
    storedData.addresses.push({ title: titleValue, detail: detailValue });
    localStorage.setItem("addressData", JSON.stringify(storedData));

    addAddressToLocalStorage(titleValue, detailValue);

    titleInput.value = "";
    detailInput.value = "";
    overlayModal.classList.add("hidden");
  } else {
    alert("Add new address or Cancel the operation");
  }
});

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

  const deleteButton = newAddressBox.querySelector(".delete-address");
  deleteButton.addEventListener("click", () => {
    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };
    const updatedAddresses = storedData.addresses.filter(
      (address) => address.title !== title || address.detail !== detail
    );
    storedData.addresses = updatedAddresses;
    localStorage.setItem("addressData", JSON.stringify(storedData));

    addressesContainer.removeChild(newAddressBox);
  });
}

closeModal.addEventListener("click", () => {
  overlayModal.classList.add("hidden");
});

applyBtn.addEventListener("click", () => {
  const selectedShippingOption = document.querySelector(
    'input[name="address"]:checked'
  );

  if (selectedShippingOption) {
    const selectedOption = selectedShippingOption.closest(".shipping-box");

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

    const storedData = JSON.parse(localStorage.getItem("addressData")) || {
      addresses: [],
    };
    storedData.selectedAddress = shippingDataType;
    localStorage.setItem("addressData", JSON.stringify(storedData));

    window.location.href = "../index.html";
  } else {
    alert("Please select a shipping Type.");
  }
});

returnBack.addEventListener("click", () => {
  window.location.href = "../index.html";
});

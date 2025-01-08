//DOM Elements
const orderList = document.getElementById("orderList");
const discountInput = document.getElementById("discount-input");
const discountBtn = document.getElementById("discountBtn");
const shippingPrice = document.getElementById("shipping-price");
const totalPrice = document.getElementById("total-price");
const finalPrice = document.getElementById("final-price");
let total = 0; // Variable to store total price
let orderData = []; // Array to store order data

// Function to load order data from localStorage
function loadOrderDataFromLocalStorage() {
  const storedOrderData = JSON.parse(localStorage.getItem("order"));
  if (storedOrderData) {
    orderData = storedOrderData;
    renderOrderList(orderData);

    if (storedOrderData && Array.isArray(storedOrderData)) {
      const total = storedOrderData.reduce((sum, item) => {
        return sum + item.price; // Sum up the prices of all items
      }, 0);

      totalPrice.innerHTML = total;
    } else {
      console.log("No items found in order.");
      totalPrice.innerHTML = "0";
    }
  } else {
    orderList.innerHTML = "<p>No items in your order.</p>";
  }
}

// Function to render the order list on the page
function renderOrderList(orderData) {
  orderList.innerHTML = ""; // Clear the existing order list

  if (orderData.length === 0) {
    orderList.innerHTML = "<p>No items in your order.</p>";
    orderList.classList.add("text-xl");
    return;
  }

  // Loop through the order data and create HTML elements for each item
  orderData.forEach((item) => {
    const orderItemDiv = document.createElement("div");
    orderItemDiv.classList.add(
      "bg-white",
      "rounded-3xl",
      "p-5",
      "flex",
      "gap-4",
      "items-center",
      "shadow-md"
    );
    orderItemDiv.innerHTML = `
         <div class="rounded-2xl bg-gray-100 p-4 mix-blend-multiply w-44">
            <img src="${item.image}" alt="shoe" />
          </div>

          <div class="flex flex-col gap-2 w-full">
            <div class="font-semibold text-xl max-w-32 overflow-x-auto whitespace-nowrap overflow-hidden">${item.name}</div>
            <div class="flex gap-2 items-center text-gray-500">
              <div class="flex gap-2 items-center">
                <div class="w-4 h-4 rounded-full" style="background-color: ${item.color}"></div>
                <div class="text-[16px]">${item.color}</div>
              </div>
              <div>|</div>
              <div class="text-[16px]">Size = <span>${item.size}</span></div>
            </div>
            <div class="flex justify-between items-center font-semibold">
              <div>$<span>${item.price}</span></div>
              <div
                class="flex gap-3 bg-gray-200 rounded-3xl px-4 py-2 items-center"
              >
                ${item.quantity}
              </div>
            </div>
          </div>
      `;
    orderList.appendChild(orderItemDiv);
  });
}

window.addEventListener("load", () => {
  loadOrderDataFromLocalStorage();

  const total = orderData.reduce((sum, item) => sum + item.price, 0); // Calculate the total price
  totalPrice.innerHTML = total; // Update the total price displayed

  // Extract and calculate shipping price from the shipping price element
  const shippingValue = shippingPrice.innerHTML.replace("$", "").trim();
  let shipping =
    shippingPrice.innerHTML === "Free" || "-"
      ? 0
      : parseFloat(shippingPrice.innerHTML) || 0;
  shipping = parseFloat(shippingValue) || 0;

  const final = total + shipping;
  finalPrice.innerHTML = final;
});

// Event listener for loading shipping info from localStorage and updating the shipping details
document.addEventListener("DOMContentLoaded", () => {
  const shippingData = JSON.parse(localStorage.getItem("shippingOption")); // Get shipping option data from localStorage

  if (shippingData) {
    const shippingInfoDiv = document.getElementById("shippingInfo");

    shippingInfoDiv.innerHTML = `
              <div class="flex gap-4 items-center">
              <img
                src="${shippingData.image}"
                alt="Location"
                class="h-16 border-8 border-gray-300 rounded-full"
              />
              <div>
                <div class="text-lg font-semibold">${shippingData.name}</div>
                <div class="text-gray-500">${shippingData.estimatedArrival}</div>
              </div>
            </div>
            <div>
              <img
                src="../assets/images/edit.png"
                alt="edit-icon"
                class="h-6"
              />
            </div>
      `;
    if (shippingData.price) {
      shippingPrice.innerHTML = `${shippingData.price}`;
    } else {
      shippingPrice.innerHTML = "Free";
    }
  } else {
    console.log("No shipping data found.");
  }
});

// Event listener for loading shipping address from localStorage and updating the address details
document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("addressData")); // Get address data from localStorage

  if (storedData && storedData.selectedAddress) {
    const shippingDataAddress = storedData.selectedAddress; // Get selected address data

    const shippingInfoAddress = document.getElementById("shippingAddress");

    shippingInfoAddress.innerHTML = `
        <div class="flex gap-4 items-center">
          <img
            src="${shippingDataAddress.image}"
            alt="Location"
            class="h-16 border-8 border-gray-300 rounded-full"
          />
          <div>
            <div class="text-lg font-semibold">${shippingDataAddress.name}</div>
            <div class="text-gray-500">${shippingDataAddress.estimatedAddress}</div>
          </div>
        </div>
      `;
  } else {
    console.log("No shipping data found.");
  }
});

// Event listener for applying a discount code when the discount button is clicked
discountBtn.addEventListener("click", () => {
  const discountCode = discountInput.value.trim(); // Get the discount code entered by the user

  const total = parseFloat(totalPrice.innerHTML); // Get the total price
  const shippingValue = shippingPrice.innerHTML.replace("$", "").trim();
  let shipping =
    shippingPrice.innerHTML === "Free" || "-"
      ? 0
      : parseFloat(shippingPrice.innerHTML) || 0;
  shipping = parseFloat(shippingValue) || 0;

  let discountedPrice;

  // Apply discount based on the entered discount code
  if (discountCode.toLowerCase() === "gold") {
    discountedPrice = total * 0.8;
    showToast("Discount applied successfully", "success");
  } else if (discountCode.toLowerCase() === "silver") {
    discountedPrice = total * 0.85;
  } else if (discountCode.toLowerCase() === "bronze") {
    discountedPrice = total * 0.9;
  } else {
    showToast("Invalid discount code. Please try again.", "error");
    return;
  }

  const final = discountedPrice + shipping; // Calculate the final price after applying the discount
  finalPrice.innerHTML = final.toFixed(2); // Update the final price displayed
});

// Event listener for the payment button to ensure both shipping option and address are selected
document.getElementById("paymentBtn").addEventListener("click", () => {
  const shippingOption = JSON.parse(localStorage.getItem("shippingOption"));
  const addressData = JSON.parse(localStorage.getItem("addressData"));

  // Check if shipping option and address data are available in localStorage
  if (!shippingOption) {
    showToast("Please select a shipping option before continuing.", "error");
    return; // Stop further execution if shipping option is missing
  }

  if (!addressData) {
    showToast("Please select a shipping address before continuing.", "error");
    return; // Stop further execution if address is missing
  }

  // Continue to the next page if both are present
  window.location.href = "../Checkout/Paymount-Method/index.html";
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

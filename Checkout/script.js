const orderList = document.getElementById("orderList");
const discountInput = document.getElementById("discount-input");
const discountBtn = document.getElementById("discountBtn");
const shippingPrice = document.getElementById("shipping-price");
const totalPrice = document.getElementById("total-price");
const finalPrice = document.getElementById("final-price");
let total = 0;
let orderData = [];

function loadOrderDataFromLocalStorage() {
  const storedOrderData = JSON.parse(localStorage.getItem("order"));
  if (storedOrderData) {
    orderData = storedOrderData;
    renderOrderList(orderData);

    if (storedOrderData && Array.isArray(storedOrderData)) {
      const total = storedOrderData.reduce((sum, item) => {
        return sum + item.price;
      }, 0);

      totalPrice.innerHTML = total.toFixed(2);
    } else {
      console.log("No items found in order.");
      totalPrice.innerHTML = "0.00";
    }
  } else {
    orderList.innerHTML = "<p>No items in your order.</p>";
  }
}

function renderOrderList(orderData) {
  orderList.innerHTML = "";
  if (orderData.length === 0) {
    orderList.innerHTML = "<p>No items in your order.</p>";
    orderList.classList.add("text-xl");
    return;
  }

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
            <div class="font-semibold text-xl">${item.name}</div>
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

  const total = orderData.reduce((sum, item) => sum + item.price, 0);
  totalPrice.innerHTML = total.toFixed(2);

  const shippingValue = shippingPrice.innerHTML.replace("$", "").trim();
  let shipping =
    shippingPrice.innerHTML === "Free" || "-"
      ? 0
      : parseFloat(shippingPrice.innerHTML) || 0;
  shipping = parseFloat(shippingValue) || 0;

  const final = total + shipping;
  finalPrice.innerHTML = final.toFixed(2);
});

document.addEventListener("DOMContentLoaded", () => {
  const shippingData = JSON.parse(localStorage.getItem("shippingOption"));

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

document.addEventListener("DOMContentLoaded", () => {
  const storedData = JSON.parse(localStorage.getItem("addressData"));

  if (storedData && storedData.selectedAddress) {
    const shippingDataAddress = storedData.selectedAddress;

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

discountBtn.addEventListener("click", () => {
  const discountCode = discountInput.value.trim();

  const total = parseFloat(totalPrice.innerHTML);
  const shippingValue = shippingPrice.innerHTML.replace("$", "").trim();
  let shipping =
    shippingPrice.innerHTML === "Free" || "-"
      ? 0
      : parseFloat(shippingPrice.innerHTML) || 0;
  shipping = parseFloat(shippingValue) || 0;

  let discountedPrice;

  if (discountCode.toLowerCase() === "gold") {
    discountedPrice = total * 0.8;
  } else if (discountCode.toLowerCase() === "silver") {
    discountedPrice = total * 0.85;
  } else if (discountCode.toLowerCase() === "bronze") {
    discountedPrice = total * 0.9;
  } else {
    alert("Invalid discount code. Please try again.");
    return;
  }

  const final = discountedPrice + shipping;
  finalPrice.innerHTML = final.toFixed(2);
});

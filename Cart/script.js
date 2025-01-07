const mainContainer = document.querySelector("main");
const overlay = document.getElementById("overlay");
const totalPrice = document.getElementById("totalPrice");
let selectedProductId = null;
let cartData = [];
let updatedProducts = [];
let initialQuantity = 0;

const baseUrl = "http://api.alikooshesh.ir:3000";

function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

async function getCartData() {
  try {
    const response = await fetch(`${baseUrl}/api/records/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        api_key:
          "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
        authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cart data.");
    }

    const data = await response.json();
    cartData = data.records;

    // Correct price calculation based on quantity
    cartData.forEach((item) => {
      item.price = (item.price / item.quantity) * item.quantity;
    });

    renderCart(cartData);
    calculateTotalPrice();
  } catch (error) {
    console.error("Error fetching cart data:", error);
    mainContainer.innerHTML = "<p>No products found</p>";
    mainContainer.classList.add("ml-6");
  }
}

function renderCart(cartData) {
  mainContainer.innerHTML = "";
  if (cartData.length === 0) {
    mainContainer.innerHTML = "<p>No items in your cart.</p>";
    mainContainer.classList.add("m-6");
    mainContainer.classList.add("text-xl");
    return;
  }

  cartData.forEach((item) => {
    const unitPrice = item.price / item.quantity;
    const totalPrice = unitPrice * item.quantity;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add(
      "flex",
      "m-6",
      "justify-between",
      "py-6",
      "px-8",
      "bg-gray-50",
      "rounded-2xl"
    );
    cartItemDiv.innerHTML = `
      <div class="rounded-2xl w-32 bg-gray-100 p-4 mix-blend-multiply">
        <img src="${item.image}" alt="shoe" />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-4 items-center">
          <div class="font-semibold text-xl max-w-[132px] h-6 overflow-x-auto whitespace-nowrap scrollbar-hide">${item.name}</div>
          <div>
            <img
              src="../assets/images/trash-bin-svgrepo-com.svg"
              alt="bin"
              class="size-5"
              id = "deleteProductBtn-${item.id}"
            />
          </div>
        </div>
        <div class="flex gap-2 items-center text-gray-500">
          <div class="flex gap-2 items-center">
            <div class="w-4 h-4 rounded-full" style="background-color: ${item.color}"></div>
            <div>${item.color}</div>
          </div>
          <div>|</div>
          <div>Size = <span>${item.size}</span></div>
        </div>
        <div class="flex justify-between items-center">
          <div id="price-${item.id}">$<span>${totalPrice}</span></div>
          <div class="flex gap-3 bg-gray-200 rounded-3xl px-4 py-2 items-center">
            <div id="decrease-${item.id}" class="quantity-btn">-</div>
            <div id="quantity-${item.id}">${item.quantity}</div>
            <div id="increase-${item.id}" class="quantity-btn">+</div>
          </div>
        </div>
      </div>
    `;
    mainContainer.appendChild(cartItemDiv);

    const deleteProductBtn = document.getElementById(
      `deleteProductBtn-${item.id}`
    );
    if (deleteProductBtn) {
      deleteProductBtn.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        selectedProductId = item.id;
        renderModal(item);
      });
    }

    const decreaseBtn = document.getElementById(`decrease-${item.id}`);
    const increaseBtn = document.getElementById(`increase-${item.id}`);

    decreaseBtn.addEventListener("click", () => {
      updateQuantity(item.id, -1, unitPrice);
    });

    increaseBtn.addEventListener("click", () => {
      updateQuantity(item.id, 1, unitPrice);
    });
  });
}

function updateQuantity(productId, change, unitPrice) {
  console.log(change);
  console.log(unitPrice);

  const product = cartData.find((item) => item.id === productId);
  if (!product) return;
  console.log(product.quantity);
  const newQuantity = product.quantity + change;
  console.log(newQuantity);

  if (newQuantity < 1 || newQuantity > product.maxQuantity) return;
  product.quantity = newQuantity;
  product.price = unitPrice * newQuantity;

  const quantityElement = document.getElementById(`quantity-${productId}`);
  const priceElement = document.getElementById(`price-${productId}`);

  if (quantityElement) {
    quantityElement.textContent = newQuantity;
  }

  if (priceElement) {
    priceElement.innerHTML = `$<span>${unitPrice * newQuantity}</span>`;
  }

  // Update the total price
  calculateTotalPrice();

  // Save updated cartData to localStorage and sync with server
  saveCartData();
}

function renderModal(product) {
  initialQuantity = product.quantity;

  const modalContent = document.getElementById("content-modal");

  modalContent.innerHTML = `
    <div class="text-center font-bold text-lg">Remove From Cart?</div>
    <div class="mx-6 my-2 bg-gray-300 text-[2px]">
      <hr />
    </div>

    <div class="flex m-6 justify-between bg-gray-50 rounded-2xl">
      <div class="rounded-2xl size-32 bg-gray-100 p-4 mix-blend-multiply">
        <img src="${product.image}" alt="${product.name}" />
      </div>

      <div class="flex flex-col gap-3">
        <div class="font-semibold text-xl max-w-44 ">${product.name}</div>

        <div class="flex gap-2 items-center text-gray-500">
          <div class="flex gap-2 items-center">
            <div class="w-4 h-4 rounded-full" style="background-color: ${product.color}"></div>
            <div>${product.color}</div>
          </div>
          <div>|</div>
          <div>Size = <span>${product.size}</span></div>
        </div>
        <div class="flex justify-between items-center font-semibold">
          <div id="modal-price-${product.id}">$<span>${product.price}</span></div>
          <div
            class="flex gap-3 bg-gray-200 rounded-3xl px-4 py-2 items-center"
          >
            <div id="modal-decrease-${product.id}" class="quantity-btn">-</div>
            <div id="modal-quantity-${product.id}">${product.quantity}</div>
            <div id="modal-increase-${product.id}" class="quantity-btn">+</div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between text-lg">
      <div
        class="m-4 px-10 py-3 bg-gray-400 rounded-3xl shadow-lg cancelDelete"
      >
        Cancel
      </div>
      <div
        class="m-4 px-10 py-3 bg-gray-400 rounded-3xl shadow-lg removeFromCart"
      >
        Yes, Remove
      </div>
    </div>
  `;

  document.querySelector(".cancelDelete").addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  document
    .querySelector(".removeFromCart")
    .addEventListener("click", async () => {
      if (product.quantity === initialQuantity) {
        try {
          const updatedCartData = cartData.filter(
            (item) => item.id !== product.id
          );
          localStorage.setItem("cartItems", JSON.stringify(updatedCartData));

          const response = await fetch(
            `${baseUrl}/api/records/cart/${product.id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                api_key:
                  "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
                authorization: `Bearer ${getToken()}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to delete the product from cart.");
          }

          getCartData();
          overlay.classList.add("hidden");
        } catch (error) {
          console.error("Error deleting product:", error);
          toast("Failed to remove the product. Please try again.");
        }
      } else {
        console.log(product.quantity);
        console.log(initialQuantity);
        console.log(product.price);
        updateQuantity(
          product.id,
          product.quantity - initialQuantity,
          product.price / product.quantity,
          product.quantity
        );
        getCartData();
        overlay.classList.add("hidden");
      }
    });
  const modalDecreaseBtn = document.getElementById(
    `modal-decrease-${product.id}`
  );
  const modalIncreaseBtn = document.getElementById(
    `modal-increase-${product.id}`
  );

  const unitPrice = product.price / product.quantity;

  modalDecreaseBtn.addEventListener("click", () => {
    updateModalQuantity(product.id, -1, unitPrice);
  });

  modalIncreaseBtn.addEventListener("click", () => {
    updateModalQuantity(product.id, 1, unitPrice);
  });
}

function updateModalQuantity(productId, change, unitPrice) {
  const product = cartData.find((item) => item.id === productId);
  if (!product) return;

  const newQuantity = product.quantity + change;

  if (newQuantity < 1 || newQuantity > product.maxQuantity) return;

  product.quantity = newQuantity;
  product.price = unitPrice * newQuantity;

  const modalQuantityElement = document.getElementById(
    `modal-quantity-${productId}`
  );
  const modalPriceElement = document.getElementById(`modal-price-${productId}`);

  if (modalQuantityElement) {
    modalQuantityElement.textContent = newQuantity;
  }

  if (modalPriceElement) {
    modalPriceElement.innerHTML = `$<span>${product.price}</span>`;
  }

  // Update the total price
  calculateTotalPrice();

  // Save updated cartData to localStorage and sync with server
  saveCartData();
}

function saveCartData() {
  localStorage.setItem("cartItems", JSON.stringify(cartData));

  cartData.forEach(async (item) => {
    try {
      const response = await fetch(`${baseUrl}/api/records/cart/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          api_key:
            "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
          authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          quantity: item.quantity,
          price: item.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart data on the server.");
      }
    } catch (error) {
      console.error("Error updating cart on server:", error);
    }
  });
}

function calculateTotalPrice() {
  let total = 0;
  cartData.forEach((item) => {
    total += item.price;
  });
  totalPrice.textContent = total;
  localStorage.setItem("cartItems", JSON.stringify(cartData));
}

getCartData();

console.log(cartData);

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

const homeBtn = document.getElementById("homeBtn");
homeBtn.addEventListener("click", () => {
  window.location.href = "../Home/home-index.html";
});
const orderBtn = document.getElementById("orderBtn");
orderBtn.addEventListener("click", () => {
  window.location.href = "../Order/index.html";
});

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", async () => {
  if (cartData.length === 0) {
    toast("Your cart is empty!");
    return;
  }
  await submitOrder();
});

async function submitOrder() {
  try {
    const orderData = cartData.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image: item.image,
      price: item.price,
    }));

    const response = await fetch(`${baseUrl}/api/records/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        api_key:
          "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
        authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ items: orderData, status: "active" }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit the order.");
    }

    const result = await response.json();
    console.log("Cart send to checkout successfully:", result);

    localStorage.setItem("order", JSON.stringify(orderData));

    renderCart(cartData);
    calculateTotalPrice();

    window.location.href = "../Checkout/index.html";
  } catch (error) {
    console.error("Error submitting order:", error);
    toast("Failed to submit the order. Please try again.");
  }
}

function toast(message) {
  const toastMessage = document.createElement("div");
  toastMessage.classList.add("toast");
  toastMessage.textContent = message;

  document.body.appendChild(toastMessage);

  setTimeout(() => {
    toastMessage.classList.add("show");
  }, 100);

  setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 3000);

  setTimeout(() => {
    toastMessage.remove();
  }, 3500);
}

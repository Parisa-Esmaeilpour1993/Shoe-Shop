// Import necessary variables and functions from other modules
import { ApiKey, baseUrl } from "../services/services.js";
import { getToken } from "../utils/utils.js";

// DOM elements for tabs and their content containers
const activeTab = document.getElementById("activeTab");
const completedTab = document.getElementById("completedTab");
const activeContent = document.getElementById("activeContent");
const completedContent = document.getElementById("completedContent");

// Arrays to store active and completed orders
let activeOrders = [];
let completedOrders = [];

// Event listener for "Active Orders" tab
activeTab.addEventListener("click", () => {
  toggleTab(activeTab, completedTab, activeContent, completedContent);
  renderActiveData(activeOrders);
});

// Event listener for "Completed Orders" tab
completedTab.addEventListener("click", () => {
  toggleTab(completedTab, activeTab, completedContent, activeContent);
  renderCompletedData(completedOrders);
});

// Function to handle tab switching
function toggleTab(activeTab, inactiveTab, activeContent, inactiveContent) {
  activeTab.classList.add("active-tab", "border-b-4", "border-black");
  activeTab.classList.remove("border-gray-300", "text-gray-500");
  inactiveTab.classList.remove("active-tab", "border-b-4", "border-black");
  inactiveTab.classList.add("border-gray-300", "text-gray-500");
  activeContent.classList.remove("hidden");
  inactiveContent.classList.add("hidden");
}

// Function to fetch orders data from the API
async function getOrdersData() {
  try {
    const response = await fetch(`${baseUrl}/api/records/order`, {
      method: "Get",
      headers: {
        api_key: ApiKey,
        "content-type": "application/json",
        authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cards.");
    }

    const data = await response.json();

    return data.records;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Function to separate orders into active and completed categories
async function separateOrders() {
  const ordersList = await getOrdersData();

  ordersList.forEach((order) => {
    if (order.status === "active") {
      activeOrders.push(order);
    } else {
      completedOrders.push(order);
    }
  });
  renderActiveData(activeOrders);
  renderCompletedData(completedOrders);
}
separateOrders();

// Function to render active orders
function renderActiveData(activeOrders) {
  const container = activeContent;
  container.innerHTML = ""; // Clear previous content

  if (activeOrders.length === 0) {
    renderEmptyActiveState();
    return;
  }

  activeOrders.forEach((order) => {
    const card = document.createElement("div");
    card.className = "card p-6";
    card.innerHTML = `
        <div class="flex flex-col gap-4 py-4 px-4 rounded-3xl shadow-2xl">
          <div class="font-bold text-xl">Order ID: ${order.id}</div>
          <div class="text-gray-500 text-lg">Created At: ${new Date(
            order.createdAt
          ).toLocaleString()}</div>
          <div class="bg-gray-300 p-1 rounded-lg text-gray-600 w-24 text-lg text-center">
            ${order.status}
          </div>
        </div>
      `;

    // Add "View Items" button
    const viewItemsBtn = document.createElement("button");
    viewItemsBtn.className =
      "bg-blue-500 text-white rounded-xl px-4 py-2 my-4 mr-1 text-lg";
    viewItemsBtn.innerText = "View Items";
    viewItemsBtn.addEventListener("click", () => showOrderItems(order.id));
    card.appendChild(viewItemsBtn);

    // Add "Track Order" button
    const trackOrderBtn = document.createElement("button");
    trackOrderBtn.className =
      "bg-green-500 text-white rounded-xl px-4 py-2 my-4 ml-1 text-lg";
    trackOrderBtn.innerText = "Track Order";
    trackOrderBtn.addEventListener("click", () => markAsCompleted(order.id));
    card.appendChild(trackOrderBtn);

    container.appendChild(card);
  });
}

// Function to display items of a specific order
function showOrderItems(orderId) {
  const order = activeOrders.find((order) => order.id === orderId);
  if (!order) return;

  const container = activeContent;
  container.innerHTML = ""; // Clear previous content

  // Back button to return to active orders list
  const backButton = document.createElement("button");
  backButton.className =
    "bg-gray-500 text-white rounded-xl px-4 py-2 mt-4 ml-4";
  backButton.innerText = "Back to Orders";
  backButton.onclick = () => renderActiveData(activeOrders);
  container.appendChild(backButton);

  order.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card p-4";
    card.innerHTML = `
      <div class="flex gap-4 py-4 px-4 rounded-3xl shadow-lg">
        <img src="${item.image}" alt="${item.name}" class="h-28" />
        <div class= "flex flex-col gap-2">
          <div class="font-bold text-lg">${item.name}</div>
          <div class="flex gap-1 text-sm">
            <div class="text-gray-500">Color: ${item.color} | </div>
            <div class="text-gray-500"> Size: ${item.size} | </div>
            <div class="text-gray-500"> Quantity: ${item.quantity} </div>
        </div>
        <div class="font-bold text-lg">$${item.price.toFixed(2)}</div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// Function to mark an order as completed
async function markAsCompleted(orderId) {
  const orderIndex = activeOrders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return;

  const success = await updateOrderStatus(orderId, "completed");
  if (!success) {
    alert("Failed to update order status. Please try again.");
    return;
  }

  const [completedOrder] = activeOrders.splice(orderIndex, 1); // Remove from active orders
  completedOrder.status = "completed"; // Update status
  completedOrders.push(completedOrder); // Add to completed orders

  renderActiveData(activeOrders); // Update active orders view

  console.log(completedOrders);

  renderCompletedData(completedOrders); // Update completed orders view
}

// Function to render completed orders
function renderCompletedData(completedOrders) {
  const container = completedContent;
  container.innerHTML = ""; // Clear previous content

  if (completedOrders.length === 0) {
    renderEmptyCompletedState();
    return;
  }

  completedOrders.forEach((order) => {
    // Create a container for each order
    const orderCard = document.createElement("div");
    orderCard.className =
      "order-card bg-white p-4 rounded-xl shadow-2xl mx-6 my-16";

    // Add order title or header
    const orderHeader = document.createElement("div");
    orderHeader.className = "font-bold text-lg mb-3";
    orderHeader.innerText = `Order ID: ${order.id}`;
    orderCard.appendChild(orderHeader);

    // Add each item in the order
    order.items.forEach((item) => {
      const itemCard = document.createElement("div");
      itemCard.className =
        "item-card flex gap-4 p-2 rounded-3xl shadow-sm mb-2";

      itemCard.innerHTML = `
        <div class="rounded-2xl h-32 bg-gray-100 p-2 mix-blend-multiply flex self-center">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="flex flex-col gap-3">
          <div class="font-bold max-w-44 whitespace-nowrap overflow-x-auto scrollbar-hide text-lg">
            ${item.name}
          </div>
          <div class="flex gap-1 items-center text-gray-500">
            <div class="flex gap-2 items-center">
              <div class="w-4 h-4 bg-gray-900 rounded-full"></div>
              <div>${item.color}</div>
            </div>
            <div>|</div>
            <div>Size = <span>${item.size}</span></div>
            <div>|</div>
            <div>Qty = <span>${item.quantity}</span></div>
          </div>
          <div class="bg-gray-300 p-1 rounded-lg text-gray-600 w-28 text-center">
            Completed
          </div>
          <div class="flex justify-between items-center font-bold gap-6 text-lg">
            <div>$<span>${item.price.toFixed(2)}</span></div>
            <div class="p-1 w-32 bg-black text-gray-100 rounded-3xl text-center">
              Buy Again
            </div>
          </div>
        </div>
      `;
      orderCard.appendChild(itemCard);
    });

    container.appendChild(orderCard);
  });
}

// Render empty state for Active tab
function renderEmptyActiveState() {
  activeContent.innerHTML = `
     <img src="../assets/images/NoSearch.png" alt="It's empty" class="pt-16" />
            <div class="flex flex-col gap-4 px-6 text-center mb-2">
              <p class="font-bold text-lg">You don't have an order yet</p>
              <p class="text-gray-500">
                You don't have a completed order at this time
              </p>
            </div>
  `;
}

// Render empty state for Completed tab
function renderEmptyCompletedState() {
  completedContent.innerHTML = `
     <img src="../assets/images/NoSearch.png" alt="It's empty" class="pt-16" />
            <div class="flex flex-col gap-4 px-6 text-center mb-2">
              <p class="font-bold text-lg">You don't have an order yet</p>
              <p class="text-gray-500">
                You don't have an active order at this time
              </p>
            </div>
  `;
}

// Updates the status of an order on the server.
async function updateOrderStatus(orderId, newStatus) {
  try {
    const response = await fetch(`${baseUrl}/api/records/order/${orderId}`, {
      method: "PUT",
      headers: {
        api_key: ApiKey,
        "content-type": "application/json",
        authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status.");
    }

    const data = await response.json();
    console.log("Order status updated:", data);
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

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

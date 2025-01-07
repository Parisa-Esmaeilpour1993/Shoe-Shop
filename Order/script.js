import { ApiKey, baseUrl } from "../services/services.js";
import { getToken } from "../utils/utils.js";

const activeTab = document.getElementById("activeTab");
const completedTab = document.getElementById("completedTab");
const activeContent = document.getElementById("activeContent");
const completedContent = document.getElementById("completedContent");
let activeOrders = [];
let completedOrders = [];

activeTab.addEventListener("click", () => {
  toggleTab(activeTab, completedTab, activeContent, completedContent);
  getActiveData();
});

completedTab.addEventListener("click", () => {
  toggleTab(completedTab, activeTab, completedContent, activeContent);
  getCompletedData("completed");
});

function toggleTab(activeTab, inactiveTab, activeContent, inactiveContent) {
  activeTab.classList.add("active-tab", "border-b-4", "border-black");
  activeTab.classList.remove("border-gray-300", "text-gray-500");
  inactiveTab.classList.remove("active-tab", "border-b-4", "border-black");
  inactiveTab.classList.add("border-gray-300", "text-gray-500");
  activeContent.classList.remove("hidden");
  inactiveContent.classList.add("hidden");
}

// Fetch data
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
  }
}

async function separateOrders() {
  const ordersList = await getOrdersData();
  ordersList.map((order) => {
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

// Render Active data
function renderActiveData(activeOrders) {
  console.log(activeOrders);
  const container = activeContent;
  container.innerHTML = ""; // Clear previous content

  if (activeOrders.length === 0) {
    renderEmptyActiveState();
    return;
  }

  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card p-4";
      card.innerHTML = `
          <div class="flex mx-3 gap-4 py-4 px-4 rounded-3xl shadow-md">
            <div class="rounded-2xl size-32 bg-gray-100 p-2 mix-blend-multiply flex self-center">
              <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="flex flex-col gap-3">
              <div class="flex gap-6 items-center">
                <div class="font-bold max-w-44 whitespace-nowrap overflow-x-auto scrollbar-hide">${item.name}</div>
              </div>
              <div class="flex gap-1 items-center text-gray-500 text-sm">
                <div class="flex gap-2 items-center">
                  <div class="w-4 h-4 bg-gray-900 rounded-full"></div>
                  <div>${item.color}</div>
                </div>
                <div>|</div>
                <div>Size = <span>${item.size}</span></div>
                <div>|</div>
                <div>Qty = <span>${item.quantity}</span></div>
              </div>
              <div class="bg-gray-300 p-1 rounded-lg text-gray-600 w-24 text-sm text-center">
                In Delivery
              </div>
              <div class="flex justify-between items-center font-bold gap-6">
                <div>$<span>${item.price}</span></div>
                <div class="flex gap-4 w-28 bg-black text-gray-100 rounded-3xl py-1 items-center justify-center">
                  Track Order
                </div>
              </div>
            </div>
          </div>
        `;
      container.appendChild(card);
    });
  });
}

// Render Completed data
function renderCompletedData(completedOrders) {
  const container = completedContent;
  container.innerHTML = ""; // Clear previous content

  if (completedOrders.length === 0) {
    renderEmptyCompletedState();
    return;
  }

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card p-4";
      card.innerHTML = `
      <div class="flex mx-3 gap-4 py-4 px-4 rounded-3xl shadow-md">
        <div class="rounded-2xl size-32 bg-gray-100 p-2 mix-blend-multiply flex self-center">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="flex flex-col gap-3">
          <div class="flex gap-6 items-center">
            <div class="font-bold max-w-44 whitespace-nowrap overflow-x-auto scrollbar-hide">${
              item.name
            }</div>
          </div>
          <div class="flex gap-1 items-center text-gray-500 text-sm">
            <div class="flex gap-2 items-center">
              <div class="w-4 h-4 bg-gray-900 rounded-full"></div>
              <div>${item.color}</div>
            </div>
            <div>|</div>
            <div>Size = <span>${item.size}</span></div>
            <div>|</div>
            <div>Qty = <span>${item.quantity}</span></div>
          </div>
          <div class="bg-gray-300 p-1 rounded-lg text-gray-600 w-24 text-sm text-center">
            Completed
          </div>
          <div class="flex justify-between items-center font-bold gap-6">
            <div>$<span>${item.price.toFixed(2)}</span></div>
            <div class="flex gap-4 w-28 bg-black text-gray-100 rounded-3xl py-1 items-center justify-center">
              Buy Again
            </div>
          </div>
        </div>
      </div>
    `;
      container.appendChild(card);
    });
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

const footerBtn = document.querySelectorAll(".footer-btn");
footerBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    setActive(btn); // Pass the clicked button to setActive
  });
});

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

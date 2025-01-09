// Base URL for API requests
const baseUrl = "http://api.alikooshesh.ir:3000";

//API Key
const ApiKey =
  "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI";

const userName = document.getElementById("username");
const productsContainer = document.getElementById("productsBody");

//Function to get token from local storage
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

// Function to fetch user data from API
async function getUserData() {
  try {
    const response = await fetch(`${baseUrl}/api/users/me`, {
      method: "GET",
      headers: {
        api_key: ApiKey,
        authorization: `Bearer ${getToken()}`,
      },
    });
    const result = await response.json();
    return result.name; // Return the name
  } catch (err) {
    console.log(err);
    return "Error fetching user data"; // Return a fallback message on error
  }
}

// Function to display user name
async function displayUserName() {
  const name = await getUserData(); // Wait for the user data
  userName.innerHTML = name; // Set the user name
}

// Call the function to display the user name
displayUserName();

// Function to get products data from API
async function getProducts() {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";
  try {
    const response = await fetch(`${baseUrl}/api/records/products`, {
      method: "GET",
      headers: {
        api_key:
          "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
        authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();

    renderProducts(products.records);
    return products;
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML = "<p>Failed to load products</p>";
    return [];
  }
}

// Function to render products in the DOM
function renderProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML =
      "<p class='text-center'>No products available</p>";
    return;
  }

  productsContainer.innerHTML = ""; // Clear the container before adding products

  // Loop through each product and dynamically create elements
  products.forEach((product) => {
    productsContainer.innerHTML += `
          <a href="../Home/Single-Product/index.html?id=${product.id}">
            <div class="w-[182px] mb-6">
            <div class="w-[182px] h-[182px] rounded-3xl bg-[#F6F6F6] p-5">
              <img src="${product.imageURL[0]}" alt="${product.name}" class="w-full h-full object-contain" />
            </div>
            <div class="max-w-44 h-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-[#152536] font-bold mt-3 text-xl">
              ${product.name}
            </div>
            <div class="font-semibold text-[#152536] mt-2">
              $ <span>${product.price}</span>
            </div>
          </div>
          </a>
        `;
  });
}
// Call the function to get products
getProducts();

async function getBrandProducts(brandName) {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";
  try {
    const response = await fetch(
      `${baseUrl}/api/records/products?filterKey=brand&filterValue=${brandName}`,
      {
        method: "GET",
        headers: {
          api_key:
            "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI",
          authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    renderProducts(products.records);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Handles the filter button click event to fetch and display products for a specific brand
function handleFilterButtons(btnId, brandName) {
  const btnElement = document.getElementById(btnId);
  btnElement.addEventListener("click", () => {
    const allBtn = document.getElementById("allBtn");
    allBtn.classList.remove("bg-black", "text-white");
    allBtn.classList.add("bg-white", "text-[#343A40]");
    getBrandProducts(brandName);
  });
}

// Sets the active state for the selected button in the footer.
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

// Redirects user to the appropriate page when a button is clicked
const cartBtn = document.getElementById("cartBtn");
cartBtn.addEventListener("click", () => {
  window.location.href = "../Cart/index.html";
});

// Redirects user to the appropriate page when a button is clicked
const orderBtn = document.getElementById("orderBtn");
orderBtn.addEventListener("click", () => {
  window.location.href = "../Order/index.html";
});

// Redirects user to the appropriate page when a button is clicked
const walletBtn = document.getElementById("walletBtn");
walletBtn.addEventListener("click", () => {
  window.location.href = "../Checkout/Paymount-Method/index.html";
});

// Redirects user to the appropriate page when a button is clicked
const profileBtn = document.getElementById("profileBtn");
profileBtn.addEventListener("click", () => {
  window.location.href = "../Login/profile/index.html";
});

// Toggles the favorite button's state.
function setInProcess(selectedButton) {
  const favoriteBtn = document.getElementById("favoriteBtn");

  const images = favoriteBtn.querySelectorAll(".icon-img");
  images[0].classList.remove("hidden"); // Show default image
  images[1].classList.add("hidden"); // Hide selected image

  // Set the selected button's state
  const selectedImages = selectedButton.querySelectorAll(".icon-img");
  selectedImages[0].classList.add("hidden"); // Hide default image
  selectedImages[1].classList.remove("hidden"); // Show selected image
}

// Checks if the user session has expired based on the last login time.
function checkSessionExpiry() {
  const loginTime = localStorage.getItem("loginTime");
  const currentTime = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;

  // Check if the session has expired
  if (!loginTime || currentTime - loginTime > twentyFourHours) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginTime");

    showToast("Session expired. Redirecting to login page.", "error");
    window.location.href = "../Login/index.html"; // Redirect to login page
  }
}

// Call the session expiry check function when the page loads
checkSessionExpiry();

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

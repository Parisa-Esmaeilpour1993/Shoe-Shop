// Base URL for API requests
const baseUrl = "http://api.alikooshesh.ir:3000";

//Function to get token from local storage
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

// DOM elements for products container and search functionality
const productsContainer = document.getElementById("productsBody");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const closeInput = document.getElementById("closeInput");
const searchDiv = document.querySelector(".searchDiv");

// Function to fetch all products from the API
async function getProducts() {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";
  const allBtn = document.getElementById("allBtn");
  allBtn.classList.add("bg-black", "text-white"); // Highlight the "All" button

  try {
    const response = await fetch(`${baseUrl}/api/records/favorite`, {
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
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML = "<p>Failed to load products</p>";
    return [];
  }
}

// Function to get favorite items from localStorage
function getFavoriteItems() {
  const favorites = localStorage.getItem("favoriteItems");
  return favorites ? JSON.parse(favorites) : []; // Parse favorites or return an empty array
}

// Function to render the products on the page
function renderProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML =
      "<p class='text-center'>No products available</p>";
    return;
  }

  const favoriteItems = getFavoriteItems();
  productsContainer.innerHTML = ""; // Clear the container before adding products

  // Loop through each product and dynamically create elements
  products.forEach((product) => {
    // Check if the product exists in favoriteItems
    const favoriteItem = favoriteItems.find(
      (item) => item.someUniqueKey === product.someUniqueKey // Replace with actual key for matching
    );

    const productId = favoriteItem ? favoriteItem.id : product.id; // Use the favorite id if it exists
    productsContainer.innerHTML += `
            <a href="../Single-Product/index.html?id=${productId}">
              <div class="w-[182px] mb-4 flex flex-col gap-2">
                <div class="w-[182px] h-[182px] rounded-3xl bg-[#F3F3F3] p-5 relative mix-blend-multiply">
                  <img src="${product.image}" alt="shoe"/>
                  <img
                    src="../../assets/images/favorite.png"
                    alt="favorite"
                    class="absolute top-4 right-4 w-8"
                  />
                </div>
                <div class="flex flex-col gap-2 p-2">
                    <div class="max-w-[182px] h-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-xl text-[#152536] font-bold mt-3">
                  ${product.name}
                </div>
                <div class="flex justify-between w-36 items-center text-lg">
                  <img
                    src="../../assets/images/star.png"
                    alt="star"
                    class="w-6 h-6"
                  />
                  <span class="text-sm">${product.star}</span>
                  <span>|</span>
                  <div class="bg-gray-200 p-2 text-sm rounded">${product.soldAmount}</div>
                </div>
                <div class="font-semibold text-[#152536] text-xl">$ <span>${product.price}</span></div>
              </div>
                </div>
            </a>
          `;
  });
}

getProducts();

// Function to handle filter buttons for specific brands
function handleFilterButtons(btnId, brandName) {
  const btnElement = document.getElementById(btnId);
  btnElement.addEventListener("click", () => {
    getBrandProducts(brandName);
  });
}

// Function to fetch products for a specific brand
async function getBrandProducts(brandName) {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";
  const allBtn = document.getElementById("allBtn");
  allBtn.classList.remove("bg-black", "text-white"); // Remove highlight from "All" button

  try {
    const response = await fetch(
      `${baseUrl}/api/records/favorite?filterKey=brand&filterValue=${brandName}`,
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

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  searchDiv.classList.remove("hidden");
  const searchTerm = searchInput.value.trim();
  getSearchedProducts(searchTerm);
});

// Function to fetch products based on search term
async function getSearchedProducts(searchTerm) {
  try {
    const response = await fetch(
      `${baseUrl}/api/records/favorite?searchKey=name&searchValue=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_key: ApiKey,
          authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    renderSearchedProducts(products.records);
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Function to render searched products
function renderSearchedProducts(products) {
  productsContainer.innerHTML = ""; // Clear the container before adding products

  if (products.length === 0) {
    productsContainer.innerHTML = `
        <div>There is no product in your search</div>
      `;
    return;
  }

  // Loop through each product and dynamically create elements
  products.forEach((product) => {
    productsContainer.innerHTML += `
       
        <div class="w-[182px] mb-4 flex flex-col gap-2">
          <div
            class="w-[182px] h-[182px] rounded-3xl bg-[#F3F3F3] p-5 relative"
          >
            <img src="${product.image}" alt="shoe" />
            <img
              src="../../assets/images/favorite.png"
              alt="favorite"
              class="absolute top-4 right-4 w-8"
            />
          </div>
          <div class="max-w-[182px] h-6 overflow-x-auto whitespace-nowrap scrollbar-hide text-xl text-[#152536] font-bold mt-3">
            ${product.name}
          </div>
          <div class="flex justify-between w-36 items-center">
            <img
              src="../../assets/images/star.png"
              alt="star"
              class="w-6 h-6"
            />
            <span class="text-sm">${product.star}</span>
            <span>|</span>
            <div class="bg-gray-200 p-2 text-sm rounded">${product.soldAmount}</div>
          </div>
          <div class="font-semibold text-[#152536]">$ <span>${product.price}</span></div>
        </div>
            `;
  });
}

// Event listener for closing the search input
closeInput.addEventListener("click", () => {
  searchDiv.classList.add("hidden");
  getProducts(); // Reset to show all products
});

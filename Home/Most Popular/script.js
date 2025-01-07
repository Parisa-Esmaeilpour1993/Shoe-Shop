// Base URL for API requests
const baseUrl = "http://api.alikooshesh.ir:3000";

//API Key
const ApiKey =
  "Esmaeilpour-124z6tKqZZyk0TgRXbrhW39BqvkAMdHfjzUMUUD3aPsSw3SbVAdgA0F1WAkMiDm8WpjWcR93dq0JPZDTbFhbHjOn6locjojMTz3v6lCS7OiuRJUW5IFI";

// Reference to the container where products will be displayed
const productsContainer = document.getElementById("productsBody");

// Function to retrieve the stored token from localStorage
function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

// Async function to get all products
async function getProducts() {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";

  // Highlight the "All" filter button
  const allBtn = document.getElementById("allBtn");
  allBtn.classList.add("bg-black", "text-white");

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

    renderProducts(products.records); // Call function to render the fetched products
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
            <a href="../Single-Product/index.html?id=${product.id}">
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

// Async function to fetch and display products for a specific brand
async function getBrandProducts(brandName) {
  // Show loading message while render products
  productsContainer.innerHTML = "<p>Loading products...</p>";

  // Remove the active state from the "All" filter button
  const allBtn = document.getElementById("allBtn");
  allBtn.classList.remove("bg-black", "text-white");

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

// Function to handle filter button clicks for specific brands
function handleFilterButtons(btnId, brandName) {
  const btnElement = document.getElementById(btnId);
  btnElement.addEventListener("click", () => {
    // Fetch and display products for the selected brand
    getBrandProducts(brandName);
  });
}

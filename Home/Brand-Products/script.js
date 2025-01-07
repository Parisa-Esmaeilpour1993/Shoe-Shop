// Import necessary modules and functions
import { ApiKey, baseUrl } from "../../services/services.js";
import { getToken } from "../../utils/utils.js";

// Get the DOM elements to interact with
const filteredProductsSection = document.getElementById(
  "filteredProductsSection"
);
const returnBtn = document.getElementById("returnBtn");
const brandNameSection = document.getElementById("brandNameSection");

const params = new URLSearchParams(document.location.search); // Get URL search parameters
const brand = params.get("brand"); // Extract the brand name from URL query parameter

brandNameSection.innerHTML = brand; // Display the selected brand in the UI

// Async function to fetch products based on the brand name
async function getBrandProducts(brandName) {
  // Set the inner HTML of the filtered products section to show a loading message
  filteredProductsSection.innerHTML = "<p>Loading products...</p>"; // Inform the user that products are being loaded
  try {
    const response = await fetch(
      `${baseUrl}/api/records/products?filterKey=brand&filterValue=${brandName}`,
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
    renderProducts(products.records);
  } catch (err) {
    console.error(err);
    filteredProductsSection.innerHTML = "<p>No products found</p>";
    return [];
  }
}

// Function to render products in the DOM
function renderProducts(products) {
  filteredProductsSection.innerHTML = ""; // Clear the container before adding products

  if (products.length === 0) {
    filteredProductsSection.innerHTML =
      "<p>No products available for this brand.</p>";
    return;
  }

  // Loop through each product and dynamically create elements
  products.forEach((product) => {
    filteredProductsSection.innerHTML += `
    <a href="../../Home/Single-Product/index.html?id=${product.id}">
      <div class="w-[182px] mb-6">
     <div class="w-44 h-44 rounded-3xl bg-[#F3F3F3] p-5">
          <img src="${product.imageURL[0]}" alt="${product.name}"/>
        </div>
        <div class="max-w-44 h-6 overflow-x-auto whitespace-nowrap overflow-ellipsis scrollbar-hide text-[#152536] font-bold mt-3 text-xl"">
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
// Call the function to get products of brand
getBrandProducts(brand);

// Add event listener to the return button to navigate back to the home page
returnBtn.addEventListener("click", () => {
  window.location.href = "../home-index.html";
});

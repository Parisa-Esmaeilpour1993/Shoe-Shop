// Import necessary dependencies and utility functions
import { ApiKey, baseUrl } from "../../services/services.js";
import { getToken } from "../../utils/utils.js";

// Get references to DOM elements
const searchedProducts = document.getElementById("searchedProducts");
const productsContainer = document.getElementById("productsContainer");
const foundedText = document.getElementById("foundedText");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const returnBtn = document.getElementById("returnBtn");
const historyBtn = document.getElementById("history-btn");

// Get products based on the search term
async function getSearchedProducts(searchTerm) {
  productsContainer.innerHTML = ""; // Clear the container
  searchedProducts.classList.add("hidden");
  productsContainer.classList.remove("hidden");
  try {
    const response = await fetch(
      `${baseUrl}/api/records/products?searchKey=name&searchValue=${searchTerm}`,
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
    renderProducts(products.records, searchTerm);
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML = `
      <div class="text-center text-gray-700 mt-6">
        An error occurred while fetching products. Please try again later.
      </div>`;
    foundedText.innerHTML = `
      <div>Results for "${searchTerm}"</div>
      <div>0 found</div>
    `;
    return [];
  }
}
// Function to render products in the DOM
function renderProducts(products, searchTerm) {
  productsContainer.innerHTML = ""; // Clear the container before adding products

  if (products.length === 0) {
    foundedText.innerHTML = `
     <div>Results for "${searchTerm}"</div>
      <div>0 found</div>
    `;
    productsContainer.innerHTML = `
    
      <img
        src="../assets/images/NoSearch.png"
        alt="No results found for Search"
        class="mt-10"
      />
      <div>
        <div class="text-center font-bold text-2xl">Not Found</div>
        <div class="text-center px-6 mt-4 text-xl text-gray-700">
          Sorry, the keyword you entered cannot be found, please check again or
          search with another keyword.
        </div>
      </div>
   
    `;
    return;
  }

  // Display the search results count
  foundedText.innerHTML = `
  <div>Results for "${searchTerm}"</div>
  <div>${products.length} found</div>
`;

  const productContainer = document.createElement("div");
  productContainer.classList.add("grid", "grid-cols-2", "gap-4");

  // Loop through each product and dynamically create elements
  products.forEach((product) => {
    productContainer.innerHTML += `
     
      <div class="w-[182px] mb-4 flex flex-col gap-2">
        <div class="w-[182px] h-[182px] rounded-3xl bg-[#F3F3F3] p-5 relative">
          <img src="${product.imageURL}" alt="${product.name}" />
          <img
            src="../../assets/images/favorite.png"
            alt="favorite"
            class="absolute top-4 right-4 w-8"
          />
        </div>
        <div class="w-[182px] h-6 text-xl text-[#152536] font-bold mt-3">
          ${product.name}
        </div>
        <div class="flex justify-between w-36 items-center">
          <img src="../../assets/images/star.png" alt="star" class="w-6 h-6" />
          <span class="text-sm">${product.star}</span>
          <span>|</span>
          <div class="bg-gray-200 p-2 text-sm rounded">${product.soldAmount} sold</div>
        </div>
        <div class="font-semibold text-[#152536]">$ <span>${product.price}</span></div>
      </div>
          `;
  });
  // Append the products to the container
  productsContainer.appendChild(productContainer);
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  productsContainer.innerHTML = "";
  foundedText.innerHTML = "";
  productsContainer.classList.remove("hidden");
  searchedProducts.classList.add("hidden");
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    saveSearchHistoryToLocalStorage(searchTerm);
    getSearchedProducts(searchTerm);
  } else {
    showToast("Please enter a search term.", "error");
  }
});

// Save search term to localStorage
function saveSearchHistoryToLocalStorage(searchTerm) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  if (!searchHistory.includes(searchTerm)) {
    searchHistory.push(searchTerm);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}

// Event listener for the history button
historyBtn.addEventListener("click", () => {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  foundedText.innerHTML = "";
  searchInput.value = "";

  renderSearchHistory(searchHistory);
});

// Render the search history in the DOM
function renderSearchHistory(history) {
  searchedProducts.classList.remove("hidden");
  productsContainer.classList.add("hidden");
  searchedProducts.innerHTML = ""; // Clear previous history

  if (history.length === 0) {
    searchedProducts.innerHTML = `
        <div class="text-center font-bold text-2xl">No search history</div>
      `;
    return;
  }

  searchedProducts.innerHTML += `
    <div class="flex justify-between mx-6 font-bold text-xl">
      <div>Recent</div>
      <div><button id="deleteAll-btn">Clear all</button></div>
    </div>
    <div class="w-[380px] mx-6 bg-gray-200 h-[2px] my-3"></div>
  `;

  searchedProducts.innerHTML += `<div class="grid grid-cols-1 gap-4">`;
  history.forEach((term, index) => {
    searchedProducts.innerHTML += `
        <div class="flex justify-between items-center my-4 mx-6">
            <span class="text-lg search-history-term" data-term="${term}">${term}</span>
            <button 
             class="delete-btn border-2 w-8 h-8 border-gray-400 text-xs text-center rounded-xl" data-index="${index}"
            >
            ✖
            </button>
        </div>
      `;
  });
  searchedProducts.innerHTML += `</div>`;

  // Event listeners for delete buttons
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.getAttribute("data-index");
      deleteSearchTerm(index);
    });
  });

  // Event listener for clicking on a search term
  const searchHistoryTerms = document.querySelectorAll(".search-history-term");
  searchHistoryTerms.forEach((termElement) => {
    termElement.addEventListener("click", () => {
      const searchTerm = termElement.getAttribute("data-term");
      // Perform search again with the clicked term

      // Set the input field value to the clicked search term
      searchInput.value = searchTerm;

      saveSearchHistoryToLocalStorage(searchTerm); // Optionally save it again to history
      getSearchedProducts(searchTerm); // Perform the search
    });
  });

  // Clear all button functionality
  const clearAllBtn = document.getElementById("deleteAll-btn");
  clearAllBtn.addEventListener("click", clearAllHistory);
}

// Function to delete a specific search term from localStorage and the DOM
function deleteSearchTerm(index) {
  let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.splice(index, 1); // Remove the specific term by index
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  renderSearchHistory(searchHistory); // Re-render the updated history
}

// Function to clear all search history
function clearAllHistory() {
  localStorage.removeItem("searchHistory");
  renderSearchHistory([]); // Re-render the empty history
}

// Handle "Return" button click
returnBtn.addEventListener("click", () => {
  window.location.href = "../Home/home-index.html";
});

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    saveSearchHistoryToLocalStorage(searchTerm);
    getSearchedProducts(searchTerm);
  } else {
    showToast("Please enter a search term.", "error");
  }
});

// Add event listener for Enter key on the search input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // Check if the pressed key is "Enter"
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      saveSearchHistoryToLocalStorage(searchTerm);
      getSearchedProducts(searchTerm);
    } else {
      showToast("Please enter a search term.", "error");
    }
  }
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

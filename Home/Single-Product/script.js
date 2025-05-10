// Importing API Key, Base URL, and utility functions from external files
import { ApiKey, baseUrl } from "../../services/services.js";
import { getToken } from "../../utils/utils.js";

// DOM element selections
const returnBackBtn = document.getElementById("return-back");
const swiperWrapper = document.getElementById("swiper-wrapper");
const size = document.getElementById("size");
const color = document.getElementById("color");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
const shoeCount = document.getElementById("shoe-count");
const addCartBtn = document.getElementById("add-cart-btn");

// Variable declarations
let count = 0;
let maxQuantity = 0;
let unitPrice = 0;
let brand;

// Event listener for DOM content loaded, to handle text expansion
document.addEventListener("DOMContentLoaded", function () {
  const description = document.getElementById("description-text");
  const readMoreBtn = document.getElementById("read-more-btn");
  const maxWords = 50;
  const fullText = description.textContent;
  const words = fullText.split(" ");

  // If the description text is long, show 'View More...' button
  if (words.length > maxWords) {
    const visibleText = words.slice(0, maxWords).join(" ");
    description.textContent = visibleText;

    readMoreBtn.style.display = "inline-block";
  } else {
    readMoreBtn.style.display = "none";
  }

  // Toggle between showing more or less description text
  window.toggleReadMore = function () {
    if (description.textContent === fullText) {
      description.textContent = words.slice(0, maxWords).join(" ");
      readMoreBtn.textContent = "View More...";
    } else {
      description.textContent = fullText;
      readMoreBtn.textContent = "View Less";
    }
  };
});

// Fetch the details of a single product by ID
async function getSingleProduct(id) {
  try {
    const response = await fetch(`${baseUrl}/api/records/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        api_key: ApiKey,
        authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Error in finding singleProduct");
    }
    const data = await response.json();
    console.log(data);
    renderSingleProduct(data);
  } catch (error) {
    console.log(error);
  }
}

// Render the product details on the page
function renderSingleProduct(product) {
  // Map through product images to add them to the slider
  product.imageURL.map((image) => {
    const slider = document.createElement("div");
    slider.classList.add("swiper-slide");
    slider.innerHTML = `<div>
              <img
                src="${image}"
                alt="swiper1-shoe"
                class="mix-blend-darken"
              />
            </div>`;
    swiperWrapper.appendChild(slider);
  });

  // Initialize Swiper slider for images
  new Swiper(".mySwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  // Update the product name and other details on the page
  const nameProduct = document.getElementById("name-product");
  nameProduct.innerHTML = product.name;
  const soldAmount = document.getElementById("soldAmount");
  soldAmount.innerHTML = product.soldAmount + " sold";
  const star = document.getElementById("star");
  star.innerHTML = product.star;
  const reviews = document.getElementById("reviews");
  reviews.innerHTML = product.reviews;
  const details = document.getElementById("description-text");
  details.innerHTML = product.details;
  const price = document.getElementById("price");
  price.innerHTML = product.price;

  maxQuantity = product.quantity;
  unitPrice = product.price;
  brand = product.brand;

  const priceElement = document.getElementById("price");
  priceElement.innerHTML = unitPrice;

  // Render sizes available for the product
  product.sizes.forEach((shoeSize) => {
    const sizeOfShoe = document.createElement("div");
    sizeOfShoe.classList.add(
      "w-10",
      "h-10",
      "rounded-full",
      "border-2",
      "border-gray-400",
      "text-gray-600",
      "flex",
      "items-center",
      "justify-center",
      "option",
      "relative"
    );
    sizeOfShoe.textContent = shoeSize;

    sizeOfShoe.addEventListener("click", () => {
      selectSize(sizeOfShoe);
    });

    size.appendChild(sizeOfShoe);
  });

  // Render colors available for the product
  product.colors.forEach((shoeColor) => {
    const colorOfShoe = document.createElement("div");
    colorOfShoe.classList.add(
      "min-w-9",
      "h-9",
      "rounded-full",
      "border-2",
      "option",
      "relative"
    );
    colorOfShoe.style.backgroundColor = shoeColor;

    colorOfShoe.setAttribute("data-color", shoeColor);

    colorOfShoe.addEventListener("click", () => {
      selectColor(shoeColor, colorOfShoe);
    });

    color.appendChild(colorOfShoe);
  });
}

// Decrease the product quantity on click
decreaseBtn.addEventListener("click", () => {
  if (count > 0) {
    count--;
    updateCountAndPrice();
    updateButtonStates();
  }
});

// Increase the product quantity on click
increaseBtn.addEventListener("click", () => {
  if (count < maxQuantity) {
    count++;
    updateCountAndPrice();
    updateButtonStates();
  }
});

// Update the displayed quantity and price
function updateCountAndPrice() {
  shoeCount.textContent = count;
  const totalPriceElement = document.getElementById("price");
  totalPriceElement.innerHTML = unitPrice * count;
}
// Update button states based on quantity selected
function updateButtonStates() {
  if (count === 0) {
    decreaseBtn.disabled = true;
    decreaseBtn.classList.add("btn-disabled");
  } else {
    decreaseBtn.disabled = false;
    decreaseBtn.classList.remove("btn-disabled");
  }

  if (count === maxQuantity) {
    increaseBtn.disabled = true;
    increaseBtn.classList.add("btn-disabled");
  } else {
    increaseBtn.disabled = false;
    increaseBtn.classList.remove("btn-disabled");
  }

  if (count === 0) {
    addCartBtn.disabled = true;
    addCartBtn.classList.add("btn-disabled");
  } else {
    addCartBtn.disabled = false;
    addCartBtn.classList.remove("btn-disabled");
  }
}

// Select a size for the product
function selectSize(sizeElement) {
  const allSizes = document.querySelectorAll(".option");
  allSizes.forEach((size) => {
    size.classList.remove("selected-size");
  });

  sizeElement.classList.add("selected-size");
}

// Select a color for the product
function selectColor(shoeColor, colorElement) {
  const allColors = document.querySelectorAll(".option");
  allColors.forEach((color) => {
    color.classList.remove("selected-color");
    color.classList.remove("white-color");
  });

  if (shoeColor === "white") {
    colorElement.classList.add("selected-color", "white-color");
  } else {
    colorElement.classList.add("selected-color");
  }
}

// Fetch and render the product when the page loads
let productId;
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(document.location.search);
  productId = urlParams.get("id");
  getSingleProduct(productId);
});

// Go back to the previous page when the back button is clicked
returnBackBtn.addEventListener("click", () => {
  window.location.href = "../home-index.html";
});

// Handle adding the product to the cart
addCartBtn.addEventListener("click", async () => {
  if (!productId) {
    console.log("Product ID is not available");
    return;
  }

  const selectedSize = document.querySelector(".selected-size")?.textContent;
  const selectedColor =
    document.querySelector(".selected-color")?.style.backgroundColor;

  // Ensure that size, color, and quantity are selected before adding to cart
  if (!selectedSize || !selectedColor || count === 0) {
    toast("Please select size, color, and quantity before adding to the cart.");
    return;
  }
  const productInfo = {
    id: productId,
    name: document.getElementById("name-product").innerHTML,
    price: unitPrice * count,
    size:
      document.querySelector(".selected-size")?.textContent ||
      "No size selected",
    color:
      document.querySelector(".selected-color")?.style.backgroundColor ||
      "No color selected",
    quantity: count,
    maxQuantity: maxQuantity,
    brand: brand,
    image: document.querySelector(".swiper-slide img")?.src || "",
  };

  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  const isDuplicate = cartItems.some(
    (item) =>
      item.id === productInfo.id &&
      item.size === productInfo.size &&
      item.color === productInfo.color
  );

  if (isDuplicate) {
    toast("This product with the same size and color is already in the cart.");
    return;
  }

  cartItems.push(productInfo);

  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  try {
    const response = await fetch(`${baseUrl}/api/records/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        api_key: ApiKey,
      },
      body: JSON.stringify(productInfo),
    });

    if (!response.ok) {
      throw new Error("Failed to add product to cart");
    }

    const data = await response.json();
    console.log("Product added to cart:", data);

    const priceElement = document.getElementById("price");
    priceElement.innerHTML = unitPrice;

    count = 0;
    shoeCount.textContent = count;

    const allColors = document.querySelectorAll(".option");
    allColors.forEach((color) => {
      color.classList.remove("selected-color");
      color.classList.remove("white-color");
    });

    const allSizes = document.querySelectorAll(".option");
    allSizes.forEach((size) => {
      size.classList.remove("selected-size");
    });

    updateButtonStates();

    toast("Product added to cart successfully!");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    toast("There was an error adding the product to the cart.");
  }
});

// Display toast notifications
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

// Handle the favorite button's toggle behavior
document.getElementById("favoriteBtn").addEventListener("click", (event) => {
  setActive(event.currentTarget);
});

// Check if the product is already in favorites
window.addEventListener("DOMContentLoaded", () => {
  checkFavoriteStatus();
});

// Add/remove product to/from favorites
let newId;

async function setActive(selectedButton) {
  const button = selectedButton;
  const images = button.querySelectorAll(".icon-img");

  // Toggle the visibility of the images
  images[0].classList.toggle("hidden"); // Toggle default image
  images[1].classList.toggle("hidden"); // Toggle selected image

  // Check if the selected image (red heart) is visible
  const isFavorite = !images[0].classList.contains("hidden");

  const productInfo = {
    id: productId,
    name: document.getElementById("name-product").innerHTML,
    price: document.getElementById("price").innerText,
    image: document.querySelector(".swiper-slide img")?.src || "",
    soldAmount: document.getElementById("soldAmount").innerText || "0",
    star: document.getElementById("star").innerText || "0",
    brand: brand,
  };
  let favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];
  if (!isFavorite) {
    favoriteItems.push(productInfo);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    console.log(productId);
    try {
      const response = await fetch(`${baseUrl}/api/records/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          api_key: ApiKey,
        },
        body: JSON.stringify(productInfo),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to favorites");
      }

      const data = await response.json();
      console.log(data);
      newId = data.id;
      console.log(newId);

      console.log("Product added to favorites:", data);
      toast("Product added to favorites!");
    } catch (error) {
      console.error("Error adding product to favorites:", error);
      toast("There was an error adding the product to favorites.");
    }
  } else {
    favoriteItems = favoriteItems.filter((item) => item.id !== productId);
    localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));

    try {
      const response = await fetch(`${baseUrl}/api/records/favorite/${newId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
          api_key: ApiKey,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to remove product from favorites");
      }

      const data = await response.json();
      console.log("Product removed from favorites:", data);
      toast("Product removed from favorites!");
    } catch (error) {
      console.error("Error removing product from favorites:", error);
      toast("There was an error removing the product from favorites.");
    }
  }
}

// Check if the product is already in the user's favorites list
function checkFavoriteStatus() {
  const favoriteItems = JSON.parse(localStorage.getItem("favoriteItems")) || [];

  const isFavorite = favoriteItems.some((item) => item.id === productId);

  const button = document.getElementById("favoriteBtn");
  const images = button.querySelectorAll(".icon-img");

  if (isFavorite) {
    images[0].classList.add("hidden");
    images[1].classList.remove("hidden");
  } else {
    images[0].classList.remove("hidden");
    images[1].classList.add("hidden");
  }
}

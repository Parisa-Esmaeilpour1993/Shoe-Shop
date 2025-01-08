import { ApiKey, baseUrl } from "../../services/services.js";
import { getToken } from "../../utils/utils.js";

// Select the "View Order" button
const viewOrderButton = document.getElementById("view-order");

// Add a click event listener
viewOrderButton.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default navigation behavior

  // Clear cart data from localStorage
  localStorage.removeItem("cartItems");

  clearCart();
});

// Send a request to the server to clear the cart
async function clearCart() {
  try {
    const response = await fetch(`${baseUrl}/api/records/cart/delete-all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        api_key: ApiKey,
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to clear cart on the server.");
    }

    console.log("Cart cleared successfully on the server.");

    // Ensure page redirect happens after the operation is complete
    setTimeout(() => {
      window.location.href = "../../Order/index.html";
    }, 1000); // Delay to ensure response is handled
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
}

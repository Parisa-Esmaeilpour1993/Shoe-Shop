const applyBtn = document.getElementById("applyBtn");

applyBtn.addEventListener("click", () => {
  const selectedShippingOption = document.querySelector(
    'input[name="address"]:checked'
  );

  if (selectedShippingOption) {
    const selectedOption = selectedShippingOption.closest(".shipping-box");

    const optionName =
      selectedOption.querySelector(".shipping-name").textContent;

    const optionPrice =
      selectedOption.querySelector(".shipping-price").textContent;

    const optionEstimatedArrival =
      selectedOption.querySelector(".shipping-arrival").textContent;

    const optionImage = selectedOption.querySelector("img").src;

    const shippingData = {
      name: optionName,
      price: optionPrice,
      estimatedArrival: optionEstimatedArrival,
      image: optionImage,
    };

    localStorage.setItem("shippingOption", JSON.stringify(shippingData));

    window.location.href = "../../Checkout/index.html";
  } else {
    alert("Please select a shipping option.");
  }
});

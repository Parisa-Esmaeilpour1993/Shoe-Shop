const addMethod = document.getElementById("add-method");
const overlayModal = document.getElementById("overlay-modal");
const methodInput = document.getElementById("method-input");
const closeModal = document.getElementById("closeModal");
const addBtn = document.getElementById("addBtn");

window.addEventListener("load", () => {
  const savedMethods = JSON.parse(localStorage.getItem("paymentMethods"));
  if (savedMethods && Array.isArray(savedMethods)) {
    savedMethods.forEach((method) => {
      addMethodToPage(method);
    });
  }
});

addMethod.addEventListener("click", () => {
  overlayModal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  overlayModal.classList.add("hidden");
});

addBtn.addEventListener("click", () => {
  const newMethod = methodInput.value.trim();

  if (newMethod) {
    const savedMethods =
      JSON.parse(localStorage.getItem("paymentMethods")) || [];
    savedMethods.push(newMethod);
    localStorage.setItem("paymentMethods", JSON.stringify(savedMethods));

    addMethodToPage(newMethod);

    overlayModal.classList.add("hidden");
    methodInput.value = "";
  } else {
    alert("Please enter a payment method.");
  }
});

function addMethodToPage(newMethod) {
  const methodContainer = document.querySelector(".method-container");
  const newMethodDiv = document.createElement("div");
  newMethodDiv.classList.add("flex", "flex-col", "gap-6", "px-6", "mb-6");
  newMethodDiv.innerHTML = `
      <div class="bg-white rounded-2xl py-4 px-5 flex justify-between items-center shadow-md">
        <div class="flex gap-4 items-center">
          <img src="../../assets/images/wallet-fill.svg" alt="New method icon" class="h-8" />
          <div class="text-lg font-semibold">${newMethod}</div>
        </div>
        <div class="flex gap-2 items-center">
          <button class="delete-method size-5 mt-2">
            <img src="../../assets/images/trash-bin-svgrepo-com.svg" alt="bin" />
          </button>
          <input type="radio" name="address" class="mt-2" />
        </div>
      </div>
    `;

  methodContainer.appendChild(newMethodDiv);

  const deleteButton = newMethodDiv.querySelector(".delete-method");
  deleteButton.addEventListener("click", () => {
    deletePaymentMethod(newMethod);
    newMethodDiv.remove();
  });
}

function deletePaymentMethod(method) {
  const savedMethods = JSON.parse(localStorage.getItem("paymentMethods")) || [];
  const updatedMethods = savedMethods.filter(
    (savedMethod) => savedMethod !== method
  );
  localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
}

const swiper = new Swiper(".mySwiper", {
  loop: false,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

document.addEventListener("DOMContentLoaded", function () {
  const description = document.getElementById("description-text");
  const readMoreBtn = document.getElementById("read-more-btn");
  const maxWords = 50;
  const fullText = description.textContent;
  const words = fullText.split(" ");

  if (words.length > maxWords) {
    const visibleText = words.slice(0, maxWords).join(" ");
    description.textContent = visibleText;

    readMoreBtn.style.display = "inline-block";
  } else {
    readMoreBtn.style.display = "none";
  }

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

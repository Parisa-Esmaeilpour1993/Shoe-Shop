const swiper = new Swiper(".mySwiper", {
  loop: false, // Disable loop (no continuous sliding)
  pagination: {
    el: ".swiper-pagination", // Pagination element
    clickable: true, // Enable pagination click to navigate to slides
  },
});

const nextButton = document.querySelector(".next-button");

nextButton.addEventListener("click", () => {
  if (!swiper.isEnd) {
    swiper.slideNext();
  } else {
    window.location.href = "../../Login/index.html";
  }
});
// SlideChange event, which occurs when the slide changes
swiper.on("slideChange", () => {
  if (swiper.isEnd) {
    nextButton.textContent = "Get Started";
  } else {
    nextButton.textContent = "Next";
  }
});

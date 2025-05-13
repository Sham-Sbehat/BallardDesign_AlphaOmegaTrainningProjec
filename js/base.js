/////////////////////////////////////////////// For Navbar responsive ///////////////////////////////////////////////
function toggleMenu() {
  document.querySelector(".icons.menu-icons").classList.toggle("show");
}

/////////////////////////////////////////////// button backToTop ///////////////////////////////////////////////
const backToTopBtn = document.getElementById("backToTopBtn");
let scrollTimeout;
window.addEventListener("scroll", () => {
  backToTopBtn.style.display = "none";
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (window.scrollY > 100) {
      backToTopBtn.style.display = "block";
    }
  }, 300);
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/////////////////////////////////////////////// for position sticky scroll ///////////////////////////////////////////////
window.addEventListener("scroll", function () {
  const topHeader = document.querySelector(".topHeader");
  const subtitles = document.querySelectorAll(".span-title");

  if (window.scrollY > 100) {
    if (topHeader) topHeader.style.display = "none";

    subtitles.forEach((subtitle) => {
      subtitle.style.opacity = "0";
    });
  } else {
    if (topHeader) topHeader.style.display = "flex";

    subtitles.forEach((subtitle) => {
      subtitle.style.opacity = "1";
    });
  }
});

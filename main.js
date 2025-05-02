// For Navbar responsive
function toggleMenu() {
  document.querySelector(".icons.menu-icons").classList.toggle("show");
}

// For wall-art-section data fetching
fetch("./data/categoriesData.json")
  .then((response) => response.json())
  .then((data) => {
    const container = document.getElementById("wall-art-section");
    const content = data
      .map((item) => {
        return `
        <div class="art-item">
          <img src="${item.image}" alt="${item.title}" class="image">
          <a href="#" class="imageTitle">${item.title}</a>
        </div>
      `;
      })
      .join("");
    container.innerHTML = content;
  })
  .catch((error) => {
    console.error("Error loading JSON:", error);
  });

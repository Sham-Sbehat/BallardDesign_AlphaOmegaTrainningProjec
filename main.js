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

// for fillter Section data fetching
fetch("./data/filters.json")
  .then((response) => response.json())
  .then((filters) => {
    const container = document.getElementById("filter-container");

    filters.forEach((filter) => {
      const dropdown = document.createElement("div");
      dropdown.className = "dropdown";

      const button = document.createElement("div");
      button.className = "dropdown-button";
      button.textContent = filter.title;
      dropdown.appendChild(button);

      const content = document.createElement("div");
      content.className = "dropdown-content";

      filter.options.forEach((opt) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(" " + opt));
        content.appendChild(label);
      });

      dropdown.appendChild(content);
      container.appendChild(dropdown);

      button.addEventListener("click", () => {
        dropdown.classList.toggle("open");
      });
    });
  })
  .catch((error) => {
    console.error("Error loading filters:", error);
  });

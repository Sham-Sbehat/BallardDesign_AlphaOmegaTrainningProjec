/////////////////////////////////////////////// For Navbar responsive ///////////////////////////////////////////////
function toggleMenu() {
  document.querySelector(".icons.menu-icons").classList.toggle("show");
}

/////////////////////////////////////////////// For wall-art-section data fetching ///////////////////////////////////////////////
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

/////////////////////////////////////////////// gallery section ///////////////////////////////////////////////
const itemsPerPage = 8;
let currentPage = 1;
let allData = [];
let selectedPriceRanges = [];

function parseRange(text) {
  const match = text.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
  if (!match) return null;
  return [
    parseFloat(match[1].replace(/,/g, "")),
    parseFloat(match[2].replace(/,/g, "")),
  ];
}

function getPriceRangeFromItem(item) {
  const match = item.salePrice.match(/\$([\d,]+(\.\d+)?)/g);
  if (!match || match.length < 1) return null;

  const prices = match.map((p) => parseFloat(p.replace(/[^0-9.]/g, "")));
  return [Math.min(...prices), Math.max(...prices)];
}

function filterDataByPriceRange(data, selectedRanges) {
  if (selectedRanges.length === 0) return data;

  return data.filter((item) => {
    const itemRange = getPriceRangeFromItem(item);
    if (!itemRange) return false;

    return selectedRanges.some((range) => {
      return itemRange[0] <= range[1] && itemRange[1] >= range[0];
    });
  });
}

function getFilteredData() {
  return filterDataByPriceRange(allData, selectedPriceRanges);
}

function renderGallery(data) {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = data.slice(start, end);

  pageItems.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";

    const mainImgId = `main-img-${Math.random().toString(36).substr(2, 9)}`;

    card.innerHTML = `
  <img class="main-img" id="${mainImgId}" src="${item.mainImage}" alt="${
      item.title
    }" />
  ${item.isNew ? '<div class="new-badge">NEW</div>' : ""}
  <div class="imgTitle">${item.title}</div>
  <div class="old-price">${item.originalPrice}</div>
  <div class="price">${item.salePrice}</div>
  <div class="thumbnail-row">
  ${item.thumbnails
    .map((img, index) => {
      const highRes = item.thumbnailsHighRes?.[index] || img;
      return `<img class="thumb-img" src="${img}" data-highres="${highRes}" data-target="${mainImgId}" />`;
    })
    .join("")}
  ${item.hasMoreOptions ? '<button class="more-btn">More</button>' : ""}
</div>
`;
    const mainImage = card.querySelector(".main-img");
    const originalSrc = mainImage.src;

    const thumbnails = card.querySelectorAll(".thumb-img");
    thumbnails.forEach((thumb) => {
      thumb.addEventListener("mouseenter", () => {
        mainImage.src = thumb.dataset.highres || thumb.src;
      });

      thumb.addEventListener("mouseleave", () => {
        mainImage.src = originalSrc;
      });
    });

    gallery.appendChild(card);
  });
  document.getElementById("pageIndicator").textContent = `Page ${currentPage}`;
  // button disapled
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage >= Math.ceil(data.length / itemsPerPage);
}

function setupPagination() {
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderGallery(getFilteredData());
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    if (currentPage < Math.ceil(getFilteredData().length / itemsPerPage)) {
      currentPage++;
      renderGallery(getFilteredData());
    }
  });

  document.getElementById("loadMoreBtn").addEventListener("click", () => {
    if (currentPage < Math.ceil(getFilteredData().length / itemsPerPage)) {
      currentPage++;
      renderGallery(getFilteredData());
    }
  });
}

fetch("./data/products.json")
  .then((response) => response.json())
  .then((data) => {
    allData = data;
    renderGallery(allData);
    setupPagination();
  })
  .catch((error) => {
    console.error("error", error);
  });

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

        //  fillter by price
        if (filter.title === "Price Range") {
          checkbox.addEventListener("change", () => {
            const range = parseRange(opt);
            if (!range) return;

            if (checkbox.checked) {
              selectedPriceRanges.push(range);
            } else {
              selectedPriceRanges = selectedPriceRanges.filter(
                (r) => !(r[0] === range[0] && r[1] === range[1])
              );
            }

            currentPage = 1;
            renderGallery(getFilteredData());
          });
        }

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

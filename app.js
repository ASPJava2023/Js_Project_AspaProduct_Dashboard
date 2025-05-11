const API_URL = "https://dummyjson.com/products";
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 6;

// Fetch and load everything on page load
window.onload = async () => {
  await loadCarousel();
  await getAllProducts();
};

// Load Bootstrap carousel with top 5 products
async function loadCarousel() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const carouselContainer = document.getElementById("carouselContainer");
  carouselContainer.innerHTML = "";

  const topProducts = data.products.slice(0, 5);
  topProducts.forEach((product, index) => {
    const item = document.createElement("div");
    item.className = `carousel-item ${index === 0 ? "active" : ""}`;
    item.innerHTML = `
      <img src="${product.thumbnail}" class="d-block w-100" style="height:300px; object-fit:cover;">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 p-2 rounded">
        <h5>${product.title}</h5>
        <p>₹${product.price}</p>
      </div>
    `;
    carouselContainer.appendChild(item);
  });
}

// Fetch all products
async function getAllProducts() {
  const res = await fetch(API_URL);
  const data = await res.json();
  allProducts = data.products;
  filteredProducts = [...allProducts];
  currentPage = 1;
  renderProducts();
}

// Filter by category
function filterByCategory(category) {
  if (!category) return getAllProducts();
  filteredProducts = allProducts.filter(p => p.category === category);
  currentPage = 1;
  renderProducts();
}

// Filter by price
function filterByPrice(maxPrice) {
  filteredProducts = allProducts.filter(p => p.price <= maxPrice);
  currentPage = 1;
  renderProducts();
}

// Search by title or description
function searchProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  filteredProducts = allProducts.filter(
    p =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
  );
  currentPage = 1;
  renderProducts();
}

// Render product cards and pagination
function renderProducts() {
  const grid = document.getElementById("productGrid");
  const pagination = document.getElementById("pagination");
  grid.innerHTML = "";
  pagination.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredProducts.slice(start, end);

  // Render cards
  if (pageItems.length === 0) {
    grid.innerHTML = `<p class="text-center text-muted">No products found.</p>`;
    return;
  }

  pageItems.forEach(product => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.thumbnail}" class="card-img-top" style="height:200px; object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted">${product.description.slice(0, 60)}...</p>
          <p class="fw-bold text-primary">₹${product.price}</p>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  // Render pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(li);
  }
}

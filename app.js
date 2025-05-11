const API_URL = "https://dummyjson.com/products";
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 6;

// Load everything on startup
window.onload = async () => {
  await loadCarousel();
  await getAllData();
};

// Load Carousel with top 5 products
async function loadCarousel() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const carousel = document.getElementById('carouselContainer');
  carousel.innerHTML = '';

  data.products.slice(0, 5).forEach((product, index) => {
    const div = document.createElement('div');
    div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `
      <img src="${product.thumbnail}" class="d-block w-100" style="height:300px; object-fit:cover;" alt="${product.title}">
      <div class="carousel-caption bg-dark bg-opacity-50 p-2 rounded">
        <h5>${product.title}</h5>
        <p>₹${product.price}</p>
      </div>
    `;
    carousel.appendChild(div);
  });
}

// Fetch all product data
async function getAllData() {
  const res = await fetch(API_URL);
  const data = await res.json();
  allProducts = data.products;
  filteredProducts = [...allProducts];
  currentPage = 1;
  renderProducts();
}

// Filter by category
async function getDataByCategory(category) {
  if (!category) return getAllData();
  const res = await fetch(`${API_URL}/category/${category}`);
  const data = await res.json();
  filteredProducts = data.products;
  currentPage = 1;
  renderProducts();
}

// Filter by max price
async function getDataByPrice(maxPrice) {
  const res = await fetch(API_URL);
  const data = await res.json();
  filteredProducts = data.products.filter(p => p.price <= maxPrice);
  currentPage = 1;
  renderProducts();
}

// Search by product name or description
function searchProducts() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  filteredProducts = allProducts.filter(p =>
    p.title.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderProducts();
}

// Render products into cards
function renderProducts() {
  const container = document.getElementById('productContainer');
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filteredProducts.slice(start, end);

  if (paginated.length === 0) {
    container.innerHTML = `<p class="text-center text-muted">No products found.</p>`;
    renderPagination();
    return;
  }

  paginated.forEach(product => {
    const col = document.createElement('div');
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.thumbnail}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description.slice(0, 60)}...</p>
          <p class="text-muted">${product.category}</p>
          <p><strong>₹${product.price}</strong></p>
        </div>
      </div>
    `;
    container.appendChild(col);
  });

  renderPagination();
}

// Render pagination buttons
function renderPagination() {
  const pagination = document.getElementById('paginationContainer');
  pagination.innerHTML = "";
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a href="#" class="page-link">${i}</a>`;
    li.addEventListener('click', e => {
      e.preventDefault();
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(li);
  }
}

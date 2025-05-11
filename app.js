const baseUrl = 'https://dummyjson.com/products';
let products = [];
let currentPage = 1;
const itemsPerPage = 6;

// Fetch all product data and display cards with pagination
async function getAllData() {
  const res = await fetch(baseUrl);
  const data = await res.json();
  products = data.products;
  currentPage = 1;
  renderProducts();
}

// Fetch products by category (e.g., 'smartphones' or 'laptops')
async function getDataByCategory(category) {
  const res = await fetch(`${baseUrl}/category/${category}`);
  const data = await res.json();
  products = data.products;
  currentPage = 1;
  renderProducts();
}

// Fetch products with price <= given maxPrice
async function getDataByPrice(maxPrice) {
  const res = await fetch(baseUrl);
  const data = await res.json();
  products = data.products.filter(p => p.price <= maxPrice);
  currentPage = 1;
  renderProducts();
}

// Render product cards with Bootstrap
function renderProducts() {
  const container = document.getElementById('product-container');
  container.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedItems = products.slice(start, end);

  paginatedItems.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-4';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" style="height:200px; object-fit:cover;">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text text-muted">${product.category}</p>
          <p><strong>₹${product.price}</strong></p>
        </div>
      </div>
    `;

    container.appendChild(col);
  });

  renderPagination();
}

// Create pagination buttons
function renderPagination() {
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(li);
  }
}

// Load dynamic carousel from first 6 products on page load
async function loadCarousel() {
  const res = await fetch(baseUrl);
  const data = await res.json();
  const carouselContainer = document.getElementById('carousel-inner');

  const firstSix = data.products.slice(0, 6);
  carouselContainer.innerHTML = "";

  firstSix.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = `carousel-item ${index === 0 ? 'active' : ''}`;
    div.innerHTML = `
      <img src="${product.thumbnail}" class="d-block w-100" alt="${product.title}" style="height:300px; object-fit:cover;">
      <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded p-2">
        <h5>${product.title}</h5>
        <p>₹${product.price}</p>
      </div>
    `;
    carouselContainer.appendChild(div);
  });
}

// Run this on first load
window.onload = function () {
  loadCarousel(); // Show dynamic carousel
};

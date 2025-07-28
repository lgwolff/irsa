// public/product.js

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    document.getElementById('product-container').innerHTML = `<p>Product not found.</p>`;
    return;
  }

  try {
    const res = await fetch(`/api/products/slug/${slug}`);
    const product = await res.json();

    if (!product || product.error) {
      document.getElementById('product-container').innerHTML = `<p>Product not found.</p>`;
      return;
    }

    renderProduct(product);
  } catch (err) {
    console.error(err);
    document.getElementById('product-container').innerHTML = `<p>Something went wrong.</p>`;
  }
});

function renderProduct(product) {
  const container = document.getElementById('product-container');

  const imageSlides = product.images.map((img, idx) => `
    <div class="flex-shrink-0 w-full">
      <img src="${img}" alt="${product.name}" class="w-full h-96 object-cover rounded-2xl shadow-lg">
    </div>
  `).join('');

  container.innerHTML = `
    <div class="grid md:grid-cols-2 gap-10">
      <!-- Image slider -->
      <div class="relative overflow-hidden">
        <div class="flex transition-all duration-300" id="image-slider">
          ${imageSlides}
        </div>
        <button id="prev-btn" class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full">&#8592;</button>
        <button id="next-btn" class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow p-2 rounded-full">&#8594;</button>
      </div>

      <!-- Product info -->
      <div>
        <h1 class="text-3xl font-bold mb-4">${product.name}</h1>
        <p class="text-lg mb-4">${product.description}</p>
        <p class="text-2xl font-semibold text-green-600 mb-6">Rs. ${product.price}</p>
        <p class="mb-4"><strong>Category:</strong> ${product.category}</p>
        <p class="mb-4"><strong>In Stock:</strong> ${product.stock}</p>
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition">Add to Cart</button>
      </div>
    </div>
  `;

  initSlider(product.images.length);
}

function initSlider(slideCount) {
  let currentIndex = 0;
  const slider = document.getElementById('image-slider');

  document.getElementById('prev-btn').onclick = () => {
    if (currentIndex > 0) currentIndex--;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  };

  document.getElementById('next-btn').onclick = () => {
    if (currentIndex < slideCount - 1) currentIndex++;
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  };
}

let allProducts = window.PRODUCTS_DATA || [];

document.addEventListener("DOMContentLoaded", () => {
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.btn-filter');

    if (productsGrid) {
        renderProductsGrid(allProducts);
    }

    // Filter Kategori Realtime
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            filterAndSearchData();
        });
    });

    // Realtime Search Input OnKeyUp Event
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterAndSearchData();
        });
    }
});

// Pipeline gabungan filter kategori dan search pencarian kata
function filterAndSearchData() {
    const activeCategory = document.querySelector('.btn-filter.active').getAttribute('data-category');
    const keyword = document.getElementById('search-input').value.toLowerCase().trim();

    let filtered = allProducts;

    if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.kategori === activeCategory);
    }

    if (keyword !== '') {
        filtered = filtered.filter(p => p.nama.toLowerCase().includes(keyword));
    }

    renderProductsGrid(filtered);
}

// Render Engine UI Card Produk
function renderProductsGrid(productsArray) {
    const container = document.getElementById('products-grid');
    container.innerHTML = '';

    if (productsArray.length === 0) {
        container.innerHTML = `<div style='grid-column: 1/-1; padding: 40px;' class='text-center'><p style='color:#777;'>Produk kuliner tidak ditemukan.</p></div>`;
        return;
    }

    productsArray.forEach(product => {
        container.innerHTML += `
            <div class="card product-card">
                <div class="product-img">
                    <img src="${product.gambar}" alt="${product.nama}" loading="lazy">
                </div>
                <div class="product-info">
                    <span class="product-cat">${product.kategori}</span>
                    <h3 class="product-title">${product.nama}</h3>
                    <div class="product-rating">⭐ ${product.rating.toFixed(1)}</div>
                    <div class="product-price">Rp ${product.harga.toLocaleString('id-ID')}</div>
                    <div class="product-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline btn-sm">Detail</a>
                        <button onclick="addProductToCart(${product.id})" class="btn btn-primary btn-sm">Beli</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Handler Pembelian dari halaman katalog luar
function addProductToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemExist = cart.find(item => item.id === id);

    if (itemExist) {
        itemExist.qty += 1;
    } else {
        cart.push({
            id: product.id,
            nama: product.nama,
            harga: product.harga,
            gambar: product.gambar,
            qty: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    alert(`Sukses menambahkan 1 ${product.nama} ke keranjang belanja.`);
}
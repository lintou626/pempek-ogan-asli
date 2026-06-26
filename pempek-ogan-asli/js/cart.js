document.addEventListener("DOMContentLoaded", () => {
    renderCart();
    
    const checkoutBtn = document.getElementById('btn-proceed-checkout');
    if(checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const listContainer = document.getElementById('cart-items-list');
    const layoutGrid = document.getElementById('cart-grid-layout');
    const emptyMsg = document.getElementById('empty-cart-msg');

    if (cart.length === 0) {
        if(layoutGrid) layoutGrid.style.display = 'none';
        if(emptyMsg) emptyMsg.style.display = 'block';
        return;
    }

    if(layoutGrid) layoutGrid.style.display = 'grid';
    if(emptyMsg) emptyMsg.style.display = 'none';
    
    if(listContainer) {
        listContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemCost = item.harga * item.qty;
            subtotal += itemCost;

            listContainer.innerHTML += `
                <div class="card cart-item-row">
                    <img src="${item.gambar}" alt="${item.nama}" class="cart-item-img">
                    <div>
                        <h4 style="font-size:1.1rem; font-weight:600;">${item.nama}</h4>
                        <p style="color:#aaa; font-size:0.9rem; margin:4px 0;">Rp ${item.harga.toLocaleString('id-ID')}</p>
                        <button onclick="removeCartItem(${item.id})" class="btn-delete">Hapus Item</button>
                    </div>
                    <div class="flex flex-column items-center gap-2">
                        <div class="quantity-selector">
                            <button onclick="updateQty(${item.id}, -1)">-</button>
                            <input type="number" value="${item.qty}" readonly>
                            <button onclick="updateQty(${item.id}, 1)">+</button>
                        </div>
                        <strong style="font-size:1rem;">Rp ${itemCost.toLocaleString('id-ID')}</strong>
                    </div>
                </div>
            `;
        });

        // Hitung Struktur Biaya Otomatis
        const flatOngkir = 15000;
        const totalPayment = subtotal + flatOngkir;

        document.getElementById('summary-subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('summary-total').textContent = `Rp ${totalPayment.toLocaleString('id-ID')}`;
    }
}

function updateQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let item = cart.find(i => i.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartBadge();
    }
}

function removeCartItem(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartBadge();
}
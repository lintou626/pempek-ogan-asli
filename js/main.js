// Global Shared Script
document.addEventListener("DOMContentLoaded", () => {
    initMobileNavbar();
    updateCartBadge();
});

// Fitur Hamburger Mobile Menu
function initMobileNavbar() {
    const toggleBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-links-menu');
    
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Dynamic Sticky Navbar adjustment on scrolling
    const navbar = document.getElementById('main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.backgroundColor = 'rgba(17, 17, 17, 0.98)';
        } else {
            navbar.style.padding = '0';
            navbar.style.backgroundColor = 'rgba(17, 17, 17, 0.95)';
        }
    });
}

// Update kuantitas item keranjang di navbar badge secara real-time
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);
        badge.textContent = totalItems;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initTabSwitcher();
    loadUserProfile();
    renderDashboard();
});

// 1. TAB NAVIGASI SWITCHER
function initTabSwitcher() {
    const menuLinks = document.querySelectorAll('.sidebar-menu a[data-target]');
    const headerTitle = document.getElementById('panel-title-header');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Hapus kelas aktif dari link lain, lalu tambahkan ke link yang diklik
            menuLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');

            // Sembunyikan semua panel
            const panels = document.querySelectorAll('.dashboard-panel');
            panels.forEach(panel => {
                panel.classList.remove('active-panel');
            });

            // Tampilkan panel tujuan
            const targetId = link.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active-panel');
            }

            // Ubah header title secara dinamis
            if (headerTitle) {
                switch(targetId) {
                    case 'panel-ringkasan':
                        headerTitle.textContent = "Selamat Datang Kembali";
                        break;
                    case 'panel-pesanan':
                        headerTitle.textContent = "Kelola Pesanan Saya";
                        break;
                    case 'panel-riwayat':
                        headerTitle.textContent = "Riwayat Transaksi";
                        break;
                    case 'panel-profil':
                        headerTitle.textContent = "Ubah Profil Pengguna";
                        break;
                    default:
                        headerTitle.textContent = "Panel Pengguna";
                }
            }
        });
    });
}

// 2. RENDER METRIK & TABEL
function renderDashboard() {
    const orders = JSON.parse(localStorage.getItem('orders_history')) || [];
    
    // Nodes Widget Metrics
    const totalNode = document.getElementById('stat-total');
    const prosesNode = document.getElementById('stat-proses');
    const selesaiNode = document.getElementById('stat-selesai');

    let countProses = 0;
    let countSelesai = 0;

    orders.forEach(order => {
        if (order.status === 'Diproses') countProses++;
        if (order.status === 'Selesai') countSelesai++;
    });

    // Masukkan data kalkulasi ke widget metrik visual
    if (totalNode) totalNode.textContent = orders.length;
    if (prosesNode) prosesNode.textContent = countProses;
    if (selesaiNode) selesaiNode.textContent = countSelesai;

    // Render Tabel
    renderSummaryTable(orders);
    renderManageTable(orders);
    renderHistoryTable(orders);
}

// Render Tabel di Panel Ringkasan (Maksimal 5 Transaksi Terbaru)
function renderSummaryTable(orders) {
    const tableBody = document.getElementById('orders-table-body-summary');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const recentOrders = orders.slice(0, 5);

    if (recentOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:#666; padding:30px;">Belum ada riwayat transaksi.</td></tr>`;
        return;
    }

    recentOrders.forEach(order => {
        const badgeClass = order.status === 'Diproses' ? 'badge-proses' : 'badge-selesai';
        tableBody.innerHTML += `
            <tr>
                <td style="font-weight:600; color:#fff;">${order.invoice}</td>
                <td>${order.tanggal}</td>
                <td>${order.metode}</td>
                <td style="font-weight:600;">Rp ${parseInt(order.total).toLocaleString('id-ID')}</td>
                <td><span class="badge ${badgeClass}">${order.status}</span></td>
            </tr>
        `;
    });
}

// Render Tabel di Panel Pesanan Saya (Bisa Edit & Hapus)
function renderManageTable(orders) {
    const tableBody = document.getElementById('orders-table-body-manage');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center" style="color:#666; padding:30px;">Belum ada pesanan. Silakan berbelanja terlebih dahulu.</td></tr>`;
        return;
    }

    orders.forEach(order => {
        const badgeClass = order.status === 'Diproses' ? 'badge-proses' : 'badge-selesai';
        tableBody.innerHTML += `
            <tr>
                <td style="font-weight:600; color:#fff;">${order.invoice}</td>
                <td>${order.tanggal}</td>
                <td>${order.metode}</td>
                <td style="font-weight:600;">Rp ${parseInt(order.total).toLocaleString('id-ID')}</td>
                <td><span class="badge ${badgeClass}">${order.status}</span></td>
                <td>
                    <div class="btn-action-group">
                        <button class="btn-table btn-table-edit" onclick="openEditModal('${order.invoice}')">Edit</button>
                        <button class="btn-table btn-table-delete" onclick="deleteOrder('${order.invoice}')">Hapus</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

// Render Tabel di Panel Riwayat (Hanya Status Selesai)
function renderHistoryTable(orders) {
    const tableBody = document.getElementById('orders-table-body-history');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    const finishedOrders = orders.filter(order => order.status === 'Selesai');

    if (finishedOrders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center" style="color:#666; padding:30px;">Belum ada riwayat transaksi selesai.</td></tr>`;
        return;
    }

    finishedOrders.forEach(order => {
        const badgeClass = 'badge-selesai';
        tableBody.innerHTML += `
            <tr>
                <td style="font-weight:600; color:#fff;">${order.invoice}</td>
                <td>${order.tanggal}</td>
                <td>${order.metode}</td>
                <td style="font-weight:600;">Rp ${parseInt(order.total).toLocaleString('id-ID')}</td>
                <td><span class="badge ${badgeClass}">${order.status}</span></td>
            </tr>
        `;
    });
}

// 3. FITUR EDIT PESANAN (MODAL)
window.openEditModal = function(invoice) {
    const orders = JSON.parse(localStorage.getItem('orders_history')) || [];
    const order = orders.find(o => o.invoice === invoice);
    
    if (!order) return;

    // Isi formulir modal
    document.getElementById('edit-invoice').value = order.invoice;
    document.getElementById('edit-tanggal').value = order.tanggal;
    document.getElementById('edit-metode').value = order.metode;
    document.getElementById('edit-total').value = order.total;
    document.getElementById('edit-status').value = order.status;

    // Tampilkan modal
    const modal = document.getElementById('edit-order-modal');
    if (modal) modal.classList.add('show');
}

window.closeEditModal = function() {
    const modal = document.getElementById('edit-order-modal');
    if (modal) modal.classList.remove('show');
}

window.saveOrderChange = function(event) {
    if (event) event.preventDefault();

    const invoice = document.getElementById('edit-invoice').value;
    const metode = document.getElementById('edit-metode').value;
    const total = parseFloat(document.getElementById('edit-total').value);
    const status = document.getElementById('edit-status').value;

    const orders = JSON.parse(localStorage.getItem('orders_history')) || [];
    const index = orders.findIndex(o => o.invoice === invoice);

    if (index !== -1) {
        orders[index].metode = metode;
        orders[index].total = total;
        orders[index].status = status;

        localStorage.setItem('orders_history', JSON.stringify(orders));
        renderDashboard();
        closeEditModal();
        alert(`Pesanan ${invoice} berhasil diperbarui.`);
    }
}

// 4. FITUR HAPUS PESANAN
window.deleteOrder = function(invoice) {
    const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus pesanan dengan No. Invoice ${invoice}?`);
    if (!konfirmasi) return;

    let orders = JSON.parse(localStorage.getItem('orders_history')) || [];
    orders = orders.filter(o => o.invoice !== invoice);

    localStorage.setItem('orders_history', JSON.stringify(orders));
    renderDashboard();
    alert(`Pesanan ${invoice} telah dihapus.`);
}

// 5. MANAJEMEN PROFIL USER
window.loadUserProfile = function() {
    // Inisialisasi profil default jika belum ada di localStorage
    let profile = JSON.parse(localStorage.getItem('user_profile'));
    if (!profile) {
        profile = {
            name: "Nazrieltou",
            email: "nazriel.wingky@example.com"
        };
        localStorage.setItem('user_profile', JSON.stringify(profile));
    }

    // Set nilai di form
    const formNameInput = document.getElementById('profile-name');
    const formEmailInput = document.getElementById('profile-email');
    if (formNameInput) formNameInput.value = profile.name;
    if (formEmailInput) formEmailInput.value = profile.email;

    // Update tampilan text profil di dashboard
    const displayNames = document.querySelectorAll('.user-display-name');
    const displayEmails = document.querySelectorAll('.user-display-email');
    displayNames.forEach(node => node.textContent = profile.name);
    displayEmails.forEach(node => node.textContent = profile.email);

    // Hitung inisial & perbarui avatar
    const initials = getInitials(profile.name);
    const avatarSummary = document.getElementById('avatar-summary');
    const avatarLarge = document.getElementById('avatar-large');
    if (avatarSummary) avatarSummary.textContent = initials;
    if (avatarLarge) avatarLarge.textContent = initials;
}

window.saveUserProfile = function(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('profile-name').value;
    const email = document.getElementById('profile-email').value;

    const profile = { name, email };
    localStorage.setItem('user_profile', JSON.stringify(profile));

    loadUserProfile();
    alert("Profil berhasil disimpan.");
}

function getInitials(name) {
    if (!name) return "NW";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
}
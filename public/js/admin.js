let authToken = localStorage.getItem('authToken');
let currentData = {};

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const productModal = document.getElementById('productModal');
const productForm = document.getElementById('productForm');
const addProductBtn = document.getElementById('addProductBtn');
const cancelProductBtn = document.getElementById('cancelProductBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (authToken) {
        verifyToken();
    } else {
        showLogin();
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    // Login
    loginForm.addEventListener('submit', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.getAttribute('data-tab');
            switchTab(tab);
        });
    });
    
    // Product modal
    addProductBtn.addEventListener('click', () => {
        productModal.classList.remove('hidden');
        productModal.classList.add('flex');
    });
    
    cancelProductBtn.addEventListener('click', () => {
        productModal.classList.add('hidden');
        productModal.classList.remove('flex');
    });
    
    productForm.addEventListener('submit', handleAddProduct);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            showDashboard();
            loadDashboardData();
        } else {
            alert('Credenciais inválidas');
        }
    } catch (error) {
        console.error('Erro no login:', error);
        alert('Erro interno. Tente novamente.');
    }
}

function handleLogout() {
    authToken = null;
    localStorage.removeItem('authToken');
    showLogin();
}

async function verifyToken() {
    try {
        const response = await fetch('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            showDashboard();
            loadDashboardData();
        } else {
            throw new Error('Token inválido');
        }
    } catch (error) {
        handleLogout();
    }
}

function showLogin() {
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
}

function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    switchTab('overview');
}

function switchTab(tabName) {
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('bg-blue-600');
        }
    });
    
    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    document.getElementById(`${tabName}Tab`).classList.remove('hidden');
    
    // Load data if needed
    if (tabName === 'users') loadUsers();
    else if (tabName === 'products') loadProducts();
    else if (tabName === 'orders') loadOrders();
    else if (tabName === 'notifications') loadNotifications();
}

async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalUsers').textContent = data.data.totalUsers || 0;
            document.getElementById('totalOrders').textContent = data.data.totalOrders || 0;
            document.getElementById('totalRevenue').textContent = `R$ ${(data.data.totalRevenue || 0).toFixed(2)}`;
            document.getElementById('pendingOrders').textContent = data.data.pendingOrders || 0;
        }
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

async function loadUsers() {
    try {
        const response = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('usersTable');
            tbody.innerHTML = '';
            
            data.data.forEach(user => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700 hover:bg-gray-700 transition-colors';
                row.innerHTML = `
                    <td class="p-4">${user.telegram_id}</td>
                    <td class="p-4">${user.first_name} ${user.last_name || ''}</td>
                    <td class="p-4">${user.username ? '@' + user.username : 'N/A'}</td>
                    <td class="p-4">R$ ${user.balance.toFixed(2)}</td>
                    <td class="p-4">${user.points}</td>
                    <td class="p-4">${new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('productsTable');
            tbody.innerHTML = '';
            
            data.data.forEach(product => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700 hover:bg-gray-700 transition-colors';
                row.innerHTML = `
                    <td class="p-4">${product.id}</td>
                    <td class="p-4">${product.name}</td>
                    <td class="p-4">R$ ${product.price.toFixed(2)}</td>
                    <td class="p-4">${product.category}</td>
                    <td class="p-4">${product.stock}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded text-xs ${product.is_active ? 'bg-green-600' : 'bg-red-600'}">
                            ${product.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <td class="p-4">
                        <button onclick="editProduct(${product.id})" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs mr-2">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
            
            currentData.products = data.data;
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function loadOrders() {
    try {
        const response = await fetch('/api/orders', {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            const tbody = document.getElementById('ordersTable');
            tbody.innerHTML = '';
            
            data.data.forEach(order => {
                const row = document.createElement('tr');
                row.className = 'border-b border-gray-700 hover:bg-gray-700 transition-colors';
                
                const statusColor = order.payment_status === 'paid' ? 'bg-green-600' : 
                                   order.payment_status === 'pending' ? 'bg-yellow-600' : 'bg-red-600';
                const statusText = order.payment_status === 'paid' ? 'Pago' : 
                                  order.payment_status === 'pending' ? 'Pendente' : 'Cancelado';
                
                row.innerHTML = `
                    <td class="p-4">${order.id}</td>
                    <td class="p-4">${order.first_name} ${order.username ? '(@' + order.username + ')' : ''}</td>
                    <td class="p-4">${order.product_name}</td>
                    <td class="p-4">R$ ${order.total_amount.toFixed(2)}</td>
                    <td class="p-4">
                        <span class="px-2 py-1 rounded text-xs ${statusColor}">
                            ${statusText}
                        </span>
                    </td>
                    <td class="p-4">${new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        category: document.getElementById('productCategory').value
    };
    
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(productData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Produto adicionado com sucesso!');
            productModal.classList.add('hidden');
            productModal.classList.remove('flex');
            productForm.reset();
            loadProducts();
        } else {
            alert('Erro ao adicionar produto: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro interno. Tente novamente.');
    }
}

async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Produto deletado com sucesso!');
            loadProducts();
        } else {
            alert('Erro ao deletar produto: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        alert('Erro interno. Tente novamente.');
    }
}

function editProduct(id) {
    // Implementar edição de produto
    alert('Funcionalidade de edição em desenvolvimento');
}

// Auto-refresh dashboard
setInterval(() => {
    if (authToken && !loginScreen.classList.contains('hidden')) {
        loadDashboardData();
    }
}, 30000);
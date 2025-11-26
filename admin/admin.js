// === ADMIN.JS (Full Futuristic Black-Red Themed Admin Logic) ===
// Handles: Login • Products • Blog • Reviews • Orders • LocalStorage DB

console.log("Sharshi Science Heritage Admin Loaded ✔");

/******************************
 *  UTILITY FUNCTIONS
 ******************************/
const $ = (id) => document.getElementById(id);
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const load = (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def));

// Local storage database
let DB = {
    products: load("ssh_products", []),
    posts: load("ssh_posts", []),
    reviews: load("ssh_reviews", []),
    orders: load("ssh_orders", [])
};

function refreshDB() {
    save("ssh_products", DB.products);
    save("ssh_posts", DB.posts);
    save("ssh_reviews", DB.reviews);
    save("ssh_orders", DB.orders);
}

/******************************
 *  ADMIN LOGIN SYSTEM
 ******************************/
const ADMIN_USER = "admin";
const ADMIN_PASS = "password"; // You can change

function adminLogin() {
    const u = $("loginUser").value.trim();
    const p = $("loginPass").value;

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        localStorage.setItem("ssh_admin_logged", "yes");
        window.location.href = "admin-dashboard.html";
    } else {
        alert("❌ Invalid Login — Try Again");
    }
}

function checkAuth() {
    if (localStorage.getItem("ssh_admin_logged") !== "yes") {
        window.location.href = "admin-login.html";
    }
}

function logoutAdmin() {
    localStorage.removeItem("ssh_admin_logged");
    window.location.href = "admin-login.html";
}

/******************************
 *  PRODUCT MANAGEMENT
 ******************************/
function renderProducts() {
    const box = $("productList");
    if (!box) return;

    box.innerHTML = "";

    if (DB.products.length === 0) {
        box.innerHTML = `<div class='admin-card'>No products added yet.</div>`;
        return;
    }

    DB.products.forEach((p, i) => {
        box.innerHTML += `
        <div class="admin-card">
            <h3>${p.name}</h3>
            <img src="${p.image}" style="width:150px;border-radius:12px;margin-top:10px;">
            <p style='opacity:.85;margin-top:10px;'>₹${p.price}</p>
            <p style='margin-top:10px;'>${p.desc}</p>
            <button class='btn' onclick="editProduct(${i})">Edit</button>
            <button class='btn' style='background:#800000' onclick="deleteProduct(${i})">Delete</button>
        </div>`;
    });
}

function addProduct() {
    const obj = {
        name: $("prodName").value.trim(),
        price: parseFloat($("prodPrice").value.trim()),
        image: $("prodImage").value.trim(),
        desc: $("prodDesc").value.trim()
    };

    if (!obj.name || !obj.price) return alert("Name & Price required");

    DB.products.push(obj);
    refreshDB();
    alert("Product Added ✔");
    renderProducts();
}

let editProductIndex = -1;

function editProduct(i) {
    const p = DB.products[i];
    editProductIndex = i;

    $("prodName").value = p.name;
    $("prodPrice").value = p.price;
    $("prodImage").value = p.image;
    $("prodDesc").value = p.desc;
}

function updateProduct() {
    if (editProductIndex < 0) return alert("No product selected");

    DB.products[editProductIndex] = {
        name: $("prodName").value.trim(),
        price: parseFloat($("prodPrice").value.trim()),
        image: $("prodImage").value.trim(),
        desc: $("prodDesc").value.trim()
    };

    refreshDB();
    alert("Product Updated ✔");
    renderProducts();
}

function deleteProduct(i) {
    if (!confirm("Delete this product?")) return;
    DB.products.splice(i, 1);
    refreshDB();
    renderProducts();
}

/******************************
 *  BLOG SYSTEM
 ******************************/
function renderPosts() {
    const box = $("postList");
    if (!box) return;

    box.innerHTML = "";
    if (DB.posts.length === 0) {
        box.innerHTML = `<div class='admin-card'>No blog posts found.</div>`;
        return;
    }

    DB.posts.forEach((p, i) => {
        box.innerHTML += `
        <div class='admin-card'>
            <h3>${p.title}</h3>
            <img src='${p.image}' style='width:150px;border-radius:12px;margin-top:10px;'>
            <p style="margin-top:10px;opacity:.85">${p.date}</p>
            <p>${p.body.substring(0,120)}...</p>
            <button class="btn" onclick="editPost(${i})">Edit</button>
            <button class="btn" style="background:#800000" onclick="deletePost(${i})">Delete</button>
        </div>`;
    });
}

function addPost() {
    const obj = {
        title: $("postTitle").value.trim(),
        image: $("postImage").value.trim(),
        body: $("postBody").value.trim(),
        date: new Date().toLocaleString()
    };

    if (!obj.title || !obj.body) return alert("Title and Body required");

    DB.posts.push(obj);
    refreshDB();
    alert("Blog Published ✔");
    renderPosts();
}

let editPostIndex = -1;

function editPost(i) {
    const p = DB.posts[i];
    editPostIndex = i;

    $("postTitle").value = p.title;
    $("postImage").value = p.image;
    $("postBody").value = p.body;
}

function updatePost() {
    if (editPostIndex < 0) return alert("No post selected");

    DB.posts[editPostIndex] = {
        title: $("postTitle").value.trim(),
        image: $("postImage").value.trim(),
        body: $("postBody").value.trim(),
        date: new Date().toLocaleString()
    };

    refreshDB();
    alert("Post Updated ✔");
    renderPosts();
}

function deletePost(i) {
    if (!confirm("Delete this post?")) return;
    DB.posts.splice(i, 1);
    refreshDB();
    renderPosts();
}

/******************************
 *  REVIEWS MANAGEMENT
 ******************************/
function renderReviews() {
    const box = $("reviewList");
    if (!box) return;

    box.innerHTML = "";

    if (DB.reviews.length === 0) {
        box.innerHTML = `<div class='admin-card'>No reviews yet.</div>`;
        return;
    }

    DB.reviews.forEach((r, i) => {
        box.innerHTML += `
        <div class='admin-card'>
            <h3>${r.name}</h3>
            <p style='opacity:.7'>${r.date}</p>
            <p>${r.text}</p>
            <button class="btn" onclick="approveReview(${i})">Approve</button>
            <button class="btn" style='background:#800000' onclick="deleteReview(${i})">Delete</button>
        </div>`;
    });
}

function approveReview(i) {
    DB.reviews[i].status = "approved";
    refreshDB();
    renderReviews();
}

function deleteReview(i) {
    if (!confirm("Delete review?")) return;
    DB.reviews.splice(i, 1);
    refreshDB();
    renderReviews();
}

/******************************
 *  ORDERS
 ******************************/
function renderOrders() {
    const box = $("orderList");
    if (!box) return;

    box.innerHTML = "";

    if (DB.orders.length === 0) {
        box.innerHTML = `<div class='admin-card'>No orders received.</div>`;
        return;
    }

    DB.orders.forEach((o, i) => {
        box.innerHTML += `
        <div class='admin-card'>
            <h3>Order #${o.id}</h3>
            <p><strong>Items:</strong> ${o.items.map(x=>x.name).join(", ")}</p>
            <p><strong>Total:</strong> ₹${o.total}</p>
        </div>`;
    });
}

/******************************
 *  EXPORT DEBUG FUNCTIONS
 ******************************/
window.sshAdmin = {
    DB,
    refreshDB,
    addProduct, updateProduct, deleteProduct,
    addPost, updatePost, deletePost,
    approveReview, deleteReview,
    logoutAdmin
};
// admin.js - Futuristic Admin Logic for Sharshi Science Heritage
// This script powers the Admin Panel with localStorage persistence

(function(){
    // Helper functions
    function $(id){ return document.getElementById(id); }
    function save(key,val){ localStorage.setItem(key, JSON.stringify(val)); }
    function load(key,def){ const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }

    // Data stores
    let products = load('ssh_products', []);
    let posts    = load('ssh_posts', []);
    let reviews  = load('ssh_reviews', []);
    let orders   = load('ssh_orders', []);

    // DOM Elements
    const reviewListEl   = $('reviewList');
    const productsListEl = $('productsList');
    const postsListEl    = $('postsList');
    const ordersListEl   = $('ordersList');

    // Refresh dashboard KPIs
    function refreshKpis(){
        $('k-orders').innerText   = orders.length;
        $('k-reviews').innerText = reviews.filter(r => r.status === 'pending').length;
        $('k-messages').innerText = 0;
    }

    /* ----------------------------- REVIEWS ------------------------------ */
    function renderReviews(){
        reviewListEl.innerHTML = '';

        const filterReviewer = $('filterReviewer').value.toLowerCase();
        const filterStatus   = $('filterStatus').value;

        const list = reviews.filter(r => {
            if(filterStatus !== 'all' && r.status !== filterStatus) return false;
            if(filterReviewer && !r.name.toLowerCase().includes(filterReviewer)) return false;
            return true;
        });

        if(list.length === 0){
            reviewListEl.innerHTML = '<div class="empty">No reviews</div>';
            return;
        }

        list.forEach((r, idx) => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <div class="review-meta">
                    <strong>${r.name}</strong>
                    <div style="opacity:.9">${r.date}</div>
                </div>
                <div class="review-body">${r.text}</div>
                <div class="review-status">
                    <button class="btn btn-approve" data-idx="${idx}">Approve</button>
                    <button class="btn btn-delete" data-del="${idx}">Delete</button>
                </div>
            `;
            reviewListEl.appendChild(div);
        });

        reviewListEl.querySelectorAll('[data-idx]').forEach(btn => btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.dataset.idx);
            reviews[i].status = 'approved';
            save('ssh_reviews', reviews);
            renderReviews();
            refreshKpis();
        }));

        reviewListEl.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.dataset.del);
            if(confirm('Delete this review?')){
                reviews.splice(i,1);
                save('ssh_reviews', reviews);
                renderReviews();
                refreshKpis();
            }
        }));
    }

    /* ----------------------------- PRODUCTS ------------------------------ */
    function renderProducts(){
        productsListEl.innerHTML = '';
        if(products.length === 0){ productsListEl.innerHTML = '<div class="empty">No products yet</div>'; }

        products.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'panel';
            card.style.marginBottom = '10px';
            card.innerHTML = `
            <div style="display:flex;gap:12px;align-items:center">
                <img src="${p.image || 'https://via.placeholder.com/120'}" style="width:120px;border-radius:8px;object-fit:cover" />
                <div style="flex:1">
                    <strong>${p.name}</strong>
                    <div style="opacity:.9">₹${p.price.toFixed(2)}</div>
                    <div style="margin-top:6px;color:var(--muted)">${p.desc}</div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px">
                    <button class="btn btn-approve" data-edit="${idx}">Edit</button>
                    <button class="btn btn-delete" data-del="${idx}">Delete</button>
                </div>
            </div>`;
            productsListEl.appendChild(card);
        });

        productsListEl.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.dataset.edit);
            openProductForm(products[i], i);
        }));

        productsListEl.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.dataset.del);
            if(confirm('Delete product?')){
                products.splice(i,1);
                save('ssh_products', products);
                renderProducts();
            }
        }));
    }

    /* Product Form */
    const productFormEl = $('productForm');
    const prodName  = $('prodName');
    const prodPrice = $('prodPrice');
    const prodImage = $('prodImage');
    const prodDesc  = $('prodDesc');
    let editIndex = -1;

    function openProductForm(product, idx){
        productFormEl.style.display = 'block';
        $('productFormTitle').innerText = product ? 'Edit Product' : 'Add Product';
        if(product){ prodName.value = product.name; prodPrice.value = product.price; prodImage.value = product.image; prodDesc.value = product.desc; editIndex = idx; }
        else { prodName.value=''; prodPrice.value=''; prodImage.value=''; prodDesc.value=''; editIndex = -1; }
    }

    $('btnAddProduct').addEventListener('click', () => openProductForm(null, -1));
    $('cancelProductBtn').addEventListener('click', () => productFormEl.style.display='none');
    $('saveProductBtn').addEventListener('click', () => {
        const name  = prodName.value.trim();
        const price = parseFloat(prodPrice.value) || 0;
        const image = prodImage.value.trim();
        const desc  = prodDesc.value.trim();

        if(!name){ alert('Name required'); return; }

        const obj = { name, price, image, desc };
        if(editIndex > -1) products[editIndex] = obj;
        else products.push(obj);

        save('ssh_products', products);
        productFormEl.style.display = 'none';
        renderProducts();
    });

    /* ----------------------------- BLOG POSTS ------------------------------ */
    function renderPosts(){
        postsListEl.innerHTML = '';
        if(posts.length === 0){ postsListEl.innerHTML = '<div class="empty">No posts yet</div>'; }

        posts.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = 'panel';
            card.style.marginBottom = '10px';
            card.innerHTML = `
                <strong>${p.title}</strong>
                <div style="opacity:.85;margin:6px 0">${p.date}</div>
                <div style="color:var(--muted)">${p.body.substring(0,140)}...</div>
                <div style="margin-top:8px;display:flex;gap:8px">
                    <button class="btn btn-approve" data-edit="${idx}">Edit</button>
                    <button class="btn btn-delete" data-del="${idx}">Delete</button>
                </div>`;
            postsListEl.appendChild(card);
        });

        postsListEl.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', e => {
            openPostForm(posts[parseInt(e.currentTarget.dataset.edit)], parseInt(e.currentTarget.dataset.edit));
        }));

        postsListEl.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', e => {
            const i = parseInt(e.currentTarget.dataset.del);
            if(confirm('Delete post?')){
                posts.splice(i,1);
                save('ssh_posts', posts);
                renderPosts();
            }
        }));
    }

    // Post Form
    const postFormEl = $('postForm');
    const postTitle = $('postTitle');
    const postImage = $('postImage');
    const postBody = $('postBody');
    let editPostIdx = -1;

    function openPostForm(post, idx){
        postFormEl.style.display='block';
        $('postFormTitle').innerText = post ? 'Edit Post' : 'Create Post';
        if(post){ postTitle.value=post.title; postImage.value=post.image; postBody.value=post.body; editPostIdx=idx; }
        else { postTitle.value=''; postImage.value=''; postBody.value=''; editPostIdx=-1; }
    }

    $('btnAddPost').addEventListener('click', () => openPostForm(null, -1));
    $('cancelPostBtn').addEventListener('click', () => postFormEl.style.display='none');
    $('savePostBtn').addEventListener

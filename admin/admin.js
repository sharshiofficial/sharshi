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

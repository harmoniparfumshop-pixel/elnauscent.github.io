// Produk default
let products = JSON.parse(localStorage.getItem("products")) || [
    {id:1, name:"Luxe Oud", price:450000, category:"unisex", image:"https://i.imgur.com/odvC2EQ.jpeg"},
    {id:2, name:"Royal Rose", price:380000, category:"woman", image:"https://i.imgur.com/vgCokzM.jpeg"},
    {id:3, name:"Black Noir", price:420000, category:"man", image:"https://i.imgur.com/3q0sMkd.jpeg"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Simpan produk & keranjang ke localStorage
function saveProducts() { localStorage.setItem("products", JSON.stringify(products)); }
function saveCart() { localStorage.setItem("cart", JSON.stringify(cart)); }

// Load produk di halaman utama
function loadProducts(list=products){
    const container = document.getElementById("product-list");
    if(!container) return;
    container.innerHTML = "";
    list.forEach(p=>{
        const item = document.createElement("div");
        item.className="product";
        item.innerHTML = `
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>Rp ${p.price.toLocaleString()}</p>
            <button onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
            <button onclick="deleteProduct(${p.id})" style="background:red;">Hapus</button>
        `;
        container.appendChild(item);
    });
}

// Keranjang
function addToCart(id){
    cart.push(products.find(p=>p.id===id));
    saveCart();
    updateCart();
}

function updateCart(){
    const c=document.getElementById("cart");
    if(!c) return;
    c.innerHTML="";
    let total=0;
    cart.forEach((item,i)=>{
        total+=item.price;
        c.innerHTML+=`
            <div class="cart-item">
                <p>${item.name} – Rp ${item.price.toLocaleString()}</p>
                <button onclick="removeItem(${i})">Hapus</button>
            </div>`;
    });
    if(document.getElementById("total")) document.getElementById("total").textContent=total.toLocaleString();
    if(document.getElementById("cart-count")) document.getElementById("cart-count").textContent=cart.length;
}

function removeItem(i){ 
    cart.splice(i,1); 
    saveCart();
    updateCart(); 
}

function deleteProduct(id){
    if(confirm("Apakah Anda yakin ingin menghapus produk ini?")){
        products = products.filter(p => p.id !== id);
        saveProducts();
        loadProducts();
    }
}

function searchProduct(){
    let key=document.getElementById("search")?document.getElementById("search").value.toLowerCase():"";
    loadProducts(products.filter(p=>p.name.toLowerCase().includes(key)));
}

function filterCategory(){
    let c=document.getElementById("categoryFilter")?document.getElementById("categoryFilter").value:"all";
    loadProducts(c==="all"?products:products.filter(p=>p.category===c));
}

function checkout(){
    if(cart.length===0){ 
        alert("Keranjang kosong!"); 
        return; 
    }
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    window.location.href = "checkout.html";
}

// Admin – Tambah produk dengan Base64
const form=document.getElementById("productForm");
if(form){
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        let name=document.getElementById("pname").value;
        let price=parseInt(document.getElementById("pprice").value);
        let category=document.getElementById("pcategory").value;
        let imgInput = document.getElementById("pimage").files[0];

        if(imgInput){
            const reader = new FileReader();
            reader.onload = function(e){
                let imgBase64 = e.target.result; // Konversi ke Base64
                products.push({id:Date.now(),name,price,category,image:imgBase64});
                saveProducts();
                alert("Produk berhasil ditambahkan!");
                window.location.href="index.html";
            }
            reader.readAsDataURL(imgInput);
        } else {
            alert("Harap pilih gambar produk!");
        }
    });
}

// Load produk awal
loadProducts();
updateCart();
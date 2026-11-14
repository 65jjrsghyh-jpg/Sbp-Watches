const WA_NUMBER="918328989469";
let cart=[];
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const $=id=>document.getElementById(id);
const productsEl=$("products");
function renderProducts(list=PRODUCTS){
 productsEl.innerHTML=list.map(p=>`<article class="product"><span class="pill">${p.badge}</span><div class="product-img"><img src="${p.image}" alt="${p.name}" loading="lazy"></div><h3>${p.name}</h3><div><span class="price">${money(p.price)}</span><span class="old-price">${money(p.oldPrice)}</span></div><button class="add" type="button" data-add="${p.id}">🛒 &nbsp; Add to Cart</button></article>`).join("")||"<p>No watches found.</p>";
}
function addToCart(id){
 const p=PRODUCTS.find(x=>Number(x.id)===Number(id)); if(!p)return;
 const found=cart.find(x=>x.id===p.id); if(found)found.qty+=1;else cart.push({...p,qty:1});
 renderCart(); openCart();
}
function renderCart(){
 $("cartCount").textContent=cart.reduce((s,p)=>s+p.qty,0);
 $("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-row"><span>${p.name}<br><small>${money(p.price)} each</small></span><span><button type="button" data-minus="${p.id}">−</button> ${p.qty} <button type="button" data-plus="${p.id}">+</button> <button type="button" data-remove="${p.id}">×</button><br><strong>${money(p.price*p.qty)}</strong></span></div>`).join(""):'<p class="empty">Your cart is empty.</p>';
 $("cartTotal").textContent="Total: "+money(cart.reduce((s,p)=>s+p.price*p.qty,0));
}
function openCart(){ $("cartPanel").classList.add("open"); $("overlay").classList.add("show");}
function closeCart(){ $("cartPanel").classList.remove("open"); $("overlay").classList.remove("show");}
productsEl.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(b.dataset.add);});
$("cartItems").addEventListener("click",e=>{
 const b=e.target.closest("button");if(!b)return;const id=Number(b.dataset.plus||b.dataset.minus||b.dataset.remove);const item=cart.find(p=>p.id===id);if(!item)return;
 if(b.dataset.plus)item.qty++;else if(b.dataset.minus)item.qty--;else item.qty=0;
 cart=cart.filter(p=>p.qty>0);renderCart();
});
$("cartToggle").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("overlay").addEventListener("click",closeCart);
$("checkout").addEventListener("click",()=>{
 if(!cart.length){alert("Please add a watch to your cart first.");return;}
 const lines=cart.map(p=>`${p.name} x ${p.qty} - ${money(p.price*p.qty)}`).join("\n");
 const total=cart.reduce((s,p)=>s+p.price*p.qty,0);
 const url="https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent("Hello SBP Watches! I would like to order:\n"+lines+"\nTotal: "+money(total));
 window.open(url,"_blank","noopener");
});
$("searchToggle").addEventListener("click",()=>$("searchbar").classList.toggle("show"));
$("searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase();renderProducts(PRODUCTS.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q)));});
document.querySelectorAll("[data-category]").forEach(a=>a.addEventListener("click",()=>{const c=a.dataset.category;renderProducts(PRODUCTS.filter(p=>p.category===c));}));
$("menuToggle").addEventListener("click",()=>document.querySelector(".left-nav").classList.toggle("open"));
$("subscribeForm").addEventListener("submit",e=>{e.preventDefault();$("subscribeMsg").textContent="Thanks for subscribing!";e.target.reset();});
$("year").textContent=new Date().getFullYear();
renderProducts();renderCart();

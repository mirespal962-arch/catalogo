const products = [
  {id:1,name:"Auriculares Nébula",category:"tecnologia",categoryLabel:"Tecnología",price:1299,description:"Sonido envolvente y diseño ligero para concentrarte en lo que importa.",image:"img/auriculares.svg",badge:"Más elegido",stock:true},
  {id:2,name:"Lámpara Halo",category:"accesorios",categoryLabel:"Accesorios",price:890,description:"Luz cálida regulable para crear un ambiente tranquilo en cualquier espacio.",image:"img/lampara.svg",badge:"Diseño esencial",stock:true},
  {id:3,name:"Bocina Nómada",category:"tecnologia",categoryLabel:"Tecnología",price:749,description:"Audio nítido en un formato compacto, listo para acompañarte.",image:"img/bocina.svg",badge:"Nuevo",stock:true},
  {id:4,name:"Mochila Boreal",category:"accesorios",categoryLabel:"Accesorios",price:1140,description:"Organización inteligente y materiales resistentes para tu rutina.",image:"img/mochila.svg",badge:"Uso diario",stock:true},
  {id:5,name:"Reloj Meridian",category:"accesorios",categoryLabel:"Accesorios",price:1590,description:"Líneas limpias y una correa cómoda que combina con todo.",image:"img/reloj.svg",badge:"Edición limitada",stock:false},
  {id:6,name:"Teclado Vector",category:"tecnologia",categoryLabel:"Tecnología",price:980,description:"Teclas silenciosas y una experiencia de escritura precisa y cómoda.",image:"img/teclado.svg",badge:"Minimal",stock:true}
];
const cart = new Map();
const grid = document.querySelector("#product-grid");
const filter = document.querySelector("#category-filter");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#empty-state");
const toast = document.querySelector("#toast");
let toastTimer;
const money = value => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:0}).format(value);

function renderProducts(){
  const selected = filter.value;
  const visible = products.filter(p => selected === "todos" || p.category === selected);
  grid.innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-badge ${p.stock ? "" : "sold"}">${p.stock ? p.badge : "Agotado"}</span>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-category">${p.categoryLabel}</div>
        <div class="product-title-row"><h3 class="product-title">${p.name}</h3><span class="price">${money(p.price)}</span></div>
        <p class="description">${p.description}</p>
        <button class="add-button" data-add="${p.id}" ${p.stock ? "" : "disabled"} aria-label="${p.stock ? `Agregar ${p.name} al carrito` : `${p.name}, producto agotado` }">
          <span>${p.stock ? "Agregar al carrito" : "No disponible"}</span><span class="plus" aria-hidden="true">${p.stock ? "+" : "—"}</span>
        </button>
      </div>
    </article>`).join("");
  count.textContent = visible.length;
  empty.hidden = visible.length !== 0;
}
function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function addToCart(id){
  const product = products.find(p=>p.id===id);
  if(!product || !product.stock) return;
  cart.set(id,(cart.get(id)||0)+1);
  renderCart();
  showToast(`${product.name} se agregó al carrito.`);
}
function renderCart(){
  const totalItems = [...cart.values()].reduce((sum,n)=>sum+n,0);
  document.querySelector("#cart-count").textContent = totalItems;
  const items = document.querySelector("#cart-items");
  if(!cart.size){
    items.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br><span>Agrega algo que te guste.</span></p>';
  } else {
    items.innerHTML = [...cart.entries()].map(([id,qty])=>{
      const p=products.find(product=>product.id===id);
      return `<div class="cart-item"><div><div class="cart-item-name">${p.name}</div><div class="cart-item-sub">${money(p.price)} · ${qty} ${qty===1?"unidad":"unidades"}</div><div class="quantity-controls"><button data-qty="-1" data-id="${id}" aria-label="Quitar una unidad de ${p.name}">−</button><span>${qty}</span><button data-qty="1" data-id="${id}" aria-label="Agregar una unidad de ${p.name}">+</button></div></div><div class="cart-item-price">${money(p.price*qty)}</div></div>`;
    }).join("");
  }
  const total=[...cart.entries()].reduce((sum,[id,qty])=>sum+products.find(p=>p.id===id).price*qty,0);
  document.querySelector("#cart-total").textContent=money(total);
}
grid.addEventListener("click",e=>{const button=e.target.closest("[data-add]");if(button&&!button.disabled)addToCart(Number(button.dataset.add));});
filter.addEventListener("change",renderProducts);
document.querySelector("#cart-items").addEventListener("click",e=>{
  const button=e.target.closest("[data-qty]"); if(!button)return;
  const id=Number(button.dataset.id),next=(cart.get(id)||0)+Number(button.dataset.qty);
  if(next<=0)cart.delete(id);else cart.set(id,next);
  renderCart();
});
const panel=document.querySelector("#cart-panel"),scrim=document.querySelector("#scrim");
function openCart(){panel.classList.add("open");panel.setAttribute("aria-hidden","false");scrim.hidden=false;document.querySelector("#close-cart").focus();}
function closeCart(){panel.classList.remove("open");panel.setAttribute("aria-hidden","true");scrim.hidden=true;document.querySelector("#open-cart").focus();}
document.querySelector("#open-cart").addEventListener("click",openCart);
document.querySelector("#close-cart").addEventListener("click",closeCart);
scrim.addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&panel.classList.contains("open"))closeCart();});
document.querySelector("#checkout-button").addEventListener("click",()=>showToast(cart.size?"Esta es una demo: no se procesan pagos.":"Tu carrito está vacío."));
renderProducts();renderCart();

// ================= DOM READY =================//

document.addEventListener("DOMContentLoaded", () => {
   loadProducts();
   initSliders();
});


// ================= LOAD PRODUCTS =================//

function loadProducts() {

   fetch("http://localhost:3000/product")
   .then(res => {
      if (!res.ok) throw new Error("Products not found");
      return res.json();
   })
   .then(data => {

      displayTrending(data);

      displayCategory("paintings", data);
      displayCategory("abstract", data);
      displayCategory("portrait", data);
      displayCategory("sculpture", data);
      displayCategory("resin", data);
      displayCategory("crochet", data);

   })
   .catch(err => console.log(err));
}


// ================= TRENDING =================//

function displayTrending(allProducts){

   const container = document.getElementById("trending");
   if(!container) return;

   container.innerHTML = "";

   const products = allProducts
      .filter(p => p.category === "trending")
      .slice(0, 4);

   products.forEach(product => {

      const card = document.createElement("div");
      card.className = "trending-card";

      card.innerHTML = `
         <img src="http://localhost:3000/${product.img}" alt="${product.name}">
         <h3>${product.name}</h3>
         <p class="price">₹${product.price}</p>
         <button class="cart-btn">Add to Cart</button>
      `;

      card.querySelector("button").addEventListener("click", () => {
         addToCart(product);
      });

      container.appendChild(card);
   });
}


// ================= CATEGORY =================//

function displayCategory(category, allProducts){

   const container = document.getElementById(category);
   if(!container) return;

   container.innerHTML = "";

   const products = allProducts.filter(p => p.category === category);

   products.forEach(product => {

      const slide = document.createElement("div");
      slide.className = "slide";

      slide.innerHTML = `
         <img src="http://localhost:3000/${product.img}" alt="${product.name}">
         <h4>${product.name}</h4>
         <p>₹${product.price}</p>
         <button class="cart-btn">Add to Cart</button>
      `;

      slide.querySelector("button").addEventListener("click", () => {
         addToCart(product);
      });

      container.appendChild(slide);
   });
}


// ================= ADD TO CART =================//

function addToCart(product) {

    fetch("http://localhost:3000/cart/add-to-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: product.name,
            price: product.price,
            img: product.img
        })
    })
    .then(res => res.json())
    .then(() => alert("Item added successfully"))
    .catch(err => console.log(err));
}


// ================= SLIDERS =================//

function initSliders(){

   document.querySelectorAll(".slider").forEach(slider => {

      const track = slider.querySelector(".slider-track");
      const prev = slider.querySelector(".prev");
      const next = slider.querySelector(".next");

      if(!track) return;

      const scrollAmount = () =>
         track.firstElementChild
            ? track.firstElementChild.offsetWidth + 16
            : 250;

      next?.addEventListener("click", () => {
         track.scrollBy({ left: scrollAmount(), behavior: "smooth" });
      });

      prev?.addEventListener("click", () => {
         track.scrollBy({ left: -scrollAmount(), behavior: "smooth" });
      });

   });
}


// ================= NAV =================//

function toggleMenu(){
   document.getElementById("menu").classList.toggle("active");
}

function goToCart(){
   window.location.href = "cart.html";
}
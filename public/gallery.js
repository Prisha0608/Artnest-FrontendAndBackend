

// ================= DOM READY =================

document.addEventListener("DOMContentLoaded", () => {
   loadProducts()
   initSliders()
})


// ================= LOAD PRODUCTS =================

function loadProducts() {

    fetch("../data/products.json")

   .then(res => {
      if (!res.ok) throw new Error("Product JSON not found")
      return res.json()
   })

   .then(data => {

      displayTrending(data.trending)
      displayCategory("paintings", data.paintings)
      displayCategory("abstract", data.abstract)
      displayCategory("portrait", data.portrait)
      displayCategory("sculpture", data.sculpture)
      displayCategory("resin", data.resin)
      displayCategory("crochet", data.crochet)

      initSliders();
   })

   .catch(err => {
      console.log("Product load error:", err)
   })
}


// ================= TRENDING =================

function displayTrending(products){

   const container = document.getElementById("trending")
   if(!container || !products) return

   container.innerHTML = ""

   products.forEach(product => {

      const card = document.createElement("div")
      card.className = "trending-card"

      card.innerHTML = `
         <img src="/${product.image}" alt="${product.name}">
         <h3>${product.name}</h3>
         <p class="price">₹${product.price}</p>
         <button class="cart-btn" onclick="event.stopPropagation(); return false;">
Add to Cart
</button>
      `

      card.querySelector("button").addEventListener("click", function(event){
    event.preventDefault();
    addToCart(product);
})

      container.appendChild(card)

   })
}


// ================= CATEGORY =================

function displayCategory(id, products){

   const container = document.getElementById(id)
   if(!container || !products) return

   container.innerHTML = ""

   products.forEach(product => {

      const slide = document.createElement("div")
      slide.className = "slide"

      slide.innerHTML = `
         <img src="/${product.image}" alt="${product.name}">
         <h4>${product.name}</h4>
         <p>₹${product.price}</p>
         <button class="cart-btn" onclick="event.stopPropagation(); return false;">
Add to Cart
</button>
      `

      slide.querySelector("button").addEventListener("click", function(event){
    event.preventDefault();      // stop default
    addToCart(product);          // call function normally
})

      container.appendChild(slide)

   })
}


// ================= ADD TO CART =================

function addToCart(product) {
    fetch("http://localhost:3000/add-to-cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: product.name,
            price: product.price,
            img: product.image
        })
    })
    .then(res => res.json())
    .then(data => {
        // No alert, no cart count update
        console.log("✅ Item added successfully")
    })
    .catch(err => {
        console.log("❌ Failed to add item:", err)
    })
}

// ================= SLIDER =================

function initSliders(){

   document.querySelectorAll(".slider").forEach(slider => {

      const track = slider.querySelector(".slider-track")
      const prev = slider.querySelector(".prev")
      const next = slider.querySelector(".next")

      if(!track) return

      const scrollAmount = () => {
         return track.firstElementChild
            ? track.firstElementChild.offsetWidth + 16
            : 250
      }

      next?.addEventListener("click", () => {
         track.scrollBy({
            left: scrollAmount(),
            behavior: "smooth"
         })
      })

      prev?.addEventListener("click", () => {
         track.scrollBy({
            left: -scrollAmount(),
            behavior: "smooth"
         })
      })

   })

}


// ================= NAV MENU TOGGLE =================

function toggleMenu(){

   document.getElementById("menu")
   .classList.toggle("active")

}


// ================= GO TO CART =================

function goToCart(){
   window.location.href = "cart.html"
}



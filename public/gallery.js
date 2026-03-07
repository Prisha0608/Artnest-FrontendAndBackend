
function goToCart() {
  window.location.href = "cart.html";
}


function addToCart(name, price, img) {

fetch("http://localhost:3000/add-to-cart",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name:name,
price:price,
img:img
})
})

.then(res=>res.json())

.then(data=>{
document.getElementById("cart-count").innerText = data.cartLength;
alert(name + " added to cart!");
})

}

function updateCartCount() {

fetch("http://localhost:3000/cart")
.then(res => res.json())
.then(cart => {

document.getElementById("cart-count").innerText = cart.length;

})
.catch(err => {
console.log("Cart count error:", err);
});

}

document.addEventListener("DOMContentLoaded", () => {
updateCartCount();
});

   // Smooth and limited slider movement

   document.addEventListener("DOMContentLoaded", function(){

document.querySelectorAll(".slider").forEach(slider => {

  const track = slider.querySelector(".slider-track");
  const slides = slider.querySelectorAll(".slide");
  const prev = slider.querySelector(".prev");
  const next = slider.querySelector(".next");

  let index = 0;

  if (slides.length === 0) return;

  const slideWidth = slides[0].offsetWidth + 20;
  const totalWidth = track.scrollWidth;
  const visibleWidth = slider.offsetWidth;

  next.onclick = () => {
    if ((index + 1) * slideWidth < totalWidth - visibleWidth / 2) {
      index++;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

  prev.onclick = () => {
    if (index > 0) {
      index--;
      track.style.transform = `translateX(-${index * slideWidth}px)`;
    }
  };

});

});
document.addEventListener('DOMContentLoaded', function() {
    
  
    const fanUser = sessionStorage.getItem('fanUser');
    const navLinks = document.querySelector('.nav-links');

    if (fanUser && navLinks) {
        
        
       
        const items = navLinks.querySelectorAll('li');
        const loginBtn = document.querySelector('.nav-link-login');
        const joinBtn = document.querySelector('.btn-join');
        const divider = document.querySelector('.auth-divider');

        if (loginBtn) loginBtn.parentElement.style.display = 'none';
        if (joinBtn) joinBtn.parentElement.style.display = 'none';
        if (divider) divider.style.display = 'none';

     
        const li = document.createElement('li');
        li.innerHTML = `<a href="profile.html" style="color:var(--gold); font-weight:bold;">Welcome, ${fanUser} <i class="fas fa-user-circle"></i></a>`;
        navLinks.appendChild(li);
    }

   
});
document.addEventListener('DOMContentLoaded', function() {
    
    
   
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
           
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    console.log("VolleyAdmin Site Loaded");
})


let cart = JSON.parse(localStorage.getItem('myCart')) || [];
updateCartUI();

function addToCart(name, category, price) {
    const item = { name, category, price };
    cart.push(item);
    saveCart();
    alert(`${name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('myCart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const countSpan = document.getElementById('cartCount');
    if(countSpan) countSpan.innerText = cart.length;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    const list = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    
    if (modal.style.display === 'flex') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
        list.innerHTML = "";
        let total = 0;

        if(cart.length === 0) {
            list.innerHTML = "<p>Your cart is empty.</p>";
        }

        cart.forEach((item, index) => {
            total += item.price;
            list.innerHTML += `
                <div class="cart-item">
                    <span>${item.name} (${item.category})</span>
                    <span>€${item.price.toFixed(2)} 
                        <i class="fas fa-trash" style="color:red; cursor:pointer; margin-left:10px;" onclick="removeFromCart(${index})"></i>
                    </span>
                </div>
            `;
        });
        totalSpan.innerText = total.toFixed(2);
    }
}


function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    toggleCart(); 
}


function checkout() {
    const user = sessionStorage.getItem('fanUser');
    
    if(!user) {
        alert("Please login to checkout!");
        window.location.href = 'login.html';
        return;
    }

    if(cart.length === 0) return;

    if(confirm("Confirm purchase?")) {
      
        let promises = cart.map(item => {
            return fetch('api/profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: user, 
                    item_name: item.name, 
                    category: item.category, 
                    price: item.price 
                })
            });
        });

        
        Promise.all(promises)
        .then(() => {
            alert("Order placed successfully! Check your Profile.");
            cart = []; 
            saveCart();
            toggleCart(); 
        })
        .catch(err => alert("Error processing order."));
    }
}
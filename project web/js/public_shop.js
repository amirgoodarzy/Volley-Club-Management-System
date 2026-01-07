document.addEventListener('DOMContentLoaded', function() {
    
    const grid = document.getElementById('publicShopGrid');

    fetch('api/shop.php')
    .then(response => response.json())
    .then(products => {
        
        grid.innerHTML = ""; 

        if(products.length === 0) {
            grid.innerHTML = "<p>No products available currently.</p>";
            return;
        }

        products.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <div class="product-image">
                    <img src="assets/images/${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="product-info">
                    <span class="category">${item.category}</span>
                    <h3>${item.name}</h3>
                    <div class="price">€ ${parseFloat(item.price).toFixed(2)}</div>
                    
                    <button class="btn-add-cart" 
                        onclick="addToCart('${item.name}', 'Product', ${item.price})">
                        Add to Cart
                    </button>
                </div>
            `;

            grid.appendChild(card);
        });

    })
    .catch(error => console.error('Error loading products:', error));

});
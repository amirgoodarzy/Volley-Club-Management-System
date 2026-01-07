document.addEventListener('DOMContentLoaded', function() {
    

    const tableBody = document.getElementById('shopTableBody');
    const modal = document.getElementById('shopModal');
    const form = document.getElementById('addProductForm');
    

    const addBtn = document.getElementById('addProductBtn'); 
    const closeSpan = document.querySelector('.close-modal'); 
    const saveBtn = document.querySelector('.btn-save'); 
    const modalTitle = document.querySelector('#shopModal h2'); 

    const pName = document.getElementById('pName');
    const pCategory = document.getElementById('pCategory');
    const pPrice = document.getElementById('pPrice');
    const pImage = document.getElementById('pImage');

    let allProducts = [];
    let editingId = null; 

    function loadProducts() {
        fetch('../api/shop.php')
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            tableBody.innerHTML = "";
            
            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='5'>No products found.</td></tr>";
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="../assets/images/${item.image}" width="40" onerror="this.src='../assets/images/default.png'"></td>
                    <td>${item.name}</td>
                    <td>${item.category}</td>
                    <td>€${parseFloat(item.price).toFixed(2)}</td>
                    <td>
                        <button class="btn-action btn-edit" type="button" onclick="openEditModal(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" type="button" onclick="deleteProduct(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
    }

    
    addBtn.onclick = function() {
        editingId = null; 
        form.reset(); 
        modalTitle.innerText = "Add Product"; 
        saveBtn.innerText = "Save Product"; 
        modal.style.display = "block"; 
    }


    window.openEditModal = function(id) {
        const item = allProducts.find(p => p.id == id);
        if (item) {
            editingId = id; 
            

            pName.value = item.name;
            pCategory.value = item.category;
            pPrice.value = item.price;
            if(pImage) pImage.value = item.image || "";


            modalTitle.innerText = "Edit Product";
            saveBtn.innerText = "Update Product";
            
            modal.style.display = "block"; 
        }
    };


    closeSpan.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const method = editingId ? 'PUT' : 'POST';
        
        const payload = { 
            name: pName.value, 
            category: pCategory.value, 
            price: pPrice.value,
            image: pImage ? pImage.value : "default.png"
        };
        
        if(editingId) payload.id = editingId;

        fetch('../api/shop.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                alert(editingId ? "Product Updated!" : "Product Added!");
                modal.style.display = "none"; 
                loadProducts(); 
            } else {
                alert("Error: " + (data.error || "Unknown"));
            }
        });
    });


    window.deleteProduct = function(id) {
        if(confirm("Are you sure you want to delete this product?")) {
            fetch('../api/shop.php', {
                method: 'DELETE',
                body: JSON.stringify({ id: id })
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) loadProducts();
            });
        }
    };

    loadProducts();
});
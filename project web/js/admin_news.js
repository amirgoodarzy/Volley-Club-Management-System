document.addEventListener('DOMContentLoaded', function() {
    
    const tableBody = document.getElementById('newsTableBody');
    const modal = document.getElementById('newsModal');
    const form = document.getElementById('addNewsForm');
    
    const addBtn = document.getElementById('addNewsBtn');
    const closeSpan = document.querySelector('.close-modal');
    const saveBtn = document.querySelector('.btn-save');
    const modalTitle = document.querySelector('#newsModal h2');

    const nTitle = document.getElementById('nTitle');
    const nCategory = document.getElementById('nCategory');
    const nContent = document.getElementById('nContent');
    const nImage = document.getElementById('nImage'); 

    let allNews = [];
    let editingId = null;

    function loadNews() {
        fetch('../api/news.php')
        .then(res => res.json())
        .then(data => {
            allNews = data;
            tableBody.innerHTML = "";
            
            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='5'>No news items found.</td></tr>";
                return;
            }

            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.title}</td>
                    <td>${item.category}</td>
                    <td>${item.content.substring(0, 50)}...</td>
                    <td>
                        <button class="btn-action btn-edit" type="button" onclick="openEditModal(${item.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" type="button" onclick="deleteNews(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
    }

    if(addBtn) {
        addBtn.onclick = function() {
            editingId = null;
            form.reset();
            modalTitle.innerText = "Add News Article";
            saveBtn.innerText = "Publish News";
            modal.style.display = "block";
        }
    }

    window.openEditModal = function(id) {
        const newsItem = allNews.find(n => n.id == id);
        if (newsItem) {
            editingId = id;
            
            nTitle.value = newsItem.title;
            nCategory.value = newsItem.category;
            nContent.value = newsItem.content;
            if(nImage) nImage.value = newsItem.image || "";

            modalTitle.innerText = "Edit Article";
            saveBtn.innerText = "Update Article";
            modal.style.display = "block";
        }
    };

    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const method = editingId ? 'PUT' : 'POST';
            const payload = { 
                title: nTitle.value, 
                category: nCategory.value, 
                content: nContent.value,
                image: nImage ? nImage.value : "news1.jpg"
            };
            
            if(editingId) payload.id = editingId;

            fetch('../api/news.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    alert(editingId ? "Article Updated!" : "Article Published!");
                    modal.style.display = "none";
                    loadNews();
                } else {
                    alert("Error: " + (data.error || "Unknown"));
                }
            });
        });
    }

    window.deleteNews = function(id) {
        if(confirm("Delete this article?")) {
            fetch('../api/news.php', {
                method: 'DELETE',
                body: JSON.stringify({ id: id })
            })
            .then(res => res.json())
            .then(data => { if(data.success) loadNews(); });
        }
    };

    loadNews();
});
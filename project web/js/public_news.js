document.addEventListener('DOMContentLoaded', function() {
    
    const newsList = document.getElementById('publicNewsList');

    
    fetch('api/news.php')
    .then(response => response.json())
    .then(articles => {
        
        newsList.innerHTML = ""; 

        articles.forEach(article => {
            
            
            const dateObj = new Date(article.date);
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-US', options);

            const card = document.createElement('article');
            card.className = 'news-card';

            card.innerHTML = `
                <div class="news-image">
                    <img src="assets/images/${article.image}" alt="News Image" onerror="this.src='https://via.placeholder.com/400x300?text=News+Image'">
                </div>
                <div class="news-content">
                    <div class="news-meta">
                        <span class="category">${article.category}</span>
                        <span class="date">${formattedDate}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.content.substring(0, 100)}...</p> <a href="#" class="read-more">Read Article <i class="fas fa-arrow-right"></i></a>
                </div>
            `;

            newsList.appendChild(card);
        });

    })
    .catch(error => console.error('Error loading news:', error));

});
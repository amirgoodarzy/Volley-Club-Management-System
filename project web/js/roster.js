document.addEventListener('DOMContentLoaded', function() {
    
  
    const observerOptions = {
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);


    const playerCards = document.querySelectorAll('.player-card');
    playerCards.forEach((card, index) => {
 
        card.style.transitionDelay = `${index * 0.1}s`; 
        observer.observe(card);
    });

    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            playerCards.forEach(card => {
                card.style.transitionDelay = '0s'; 
                
                const playerRole = card.getAttribute('data-role');

                if (filterValue === 'all' || playerRole === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10); 
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
});
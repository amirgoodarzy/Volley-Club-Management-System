document.addEventListener('DOMContentLoaded', function() {
    
    
    const elDays = document.getElementById('days');
    const elHours = document.getElementById('hours');
    const elMinutes = document.getElementById('minutes');
    const elTitle = document.querySelector('.match-title'); 
    const ticketList = document.getElementById('publicTicketsList');

    fetch('api/matches.php')
    .then(response => response.json())
    .then(matches => {
        
        const upcomingMatches = matches
            .filter(match => match.status === 'Upcoming')
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        if (upcomingMatches.length > 0) {
            const nextMatch = upcomingMatches[0]; 

            if(elTitle) elTitle.innerText = `penzegyur vs ${nextMatch.opponent.toUpperCase()}`;

            startCountdown(nextMatch.date);
        } else {
            if(elTitle) elTitle.innerText = "NO UPCOMING MATCHES";
        }

        if(ticketList) {
            ticketList.innerHTML = ""; 

            if(upcomingMatches.length === 0) {
                ticketList.innerHTML = "<p style='text-align:center;'>No tickets available.</p>";
                return;
            }

            upcomingMatches.forEach(match => {
                const dateObj = new Date(match.date);
                const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
 
                const price = 15.00;

                const card = document.createElement('div');
                card.className = 'ticket-card'; 
                card.innerHTML = `
                    <div class="t-head">
                        <p style="font-size:12px; opacity:0.8;">VS</p>
                        <h3>${match.opponent}</h3>
                    </div>
                    <div class="t-body">
                        <p><strong>Date:</strong> ${dateStr}</p>
                        <p><strong>Time:</strong> ${timeStr}</p>
                        <p><strong>Venue:</strong> ${match.location}</p>
                        <div class="t-price">€ ${price.toFixed(2)}</div>
                        
                        <button class="btn-buy" onclick="addToCart('Match vs ${match.opponent}', 'Ticket', ${price})">
                            Add to Cart
                        </button>
                    </div>
                `;
                ticketList.appendChild(card);
            });
        }
    })
    .catch(error => console.error('Error loading matches:', error));

    function startCountdown(dateString) {
        const targetDate = new Date(dateString).getTime();

        const timer = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                if(elDays) elDays.innerText = "00";
                if(elHours) elHours.innerText = "00";
                if(elMinutes) elMinutes.innerText = "00";
                return;
            }


            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            if(elDays) elDays.innerText = days < 10 ? "0" + days : days;
            if(elHours) elHours.innerText = hours < 10 ? "0" + hours : hours;
            if(elMinutes) elMinutes.innerText = minutes < 10 ? "0" + minutes : minutes;

        }, 1000);
    }

});
document.addEventListener('DOMContentLoaded', function() {
    
    const matchList = document.getElementById('publicMatchList');


    fetch('api/matches.php')
    .then(response => response.json())
    .then(matches => {
        
        matchList.innerHTML = ""; 

        matches.forEach(match => {
            
            
            let cardClass = "";
            let scoreHTML = "";
            
           
            const dateObj = new Date(match.date);
            const day = dateObj.getDate();
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const month = monthNames[dateObj.getMonth()];
            const time = dateObj.getHours() + ":" + (dateObj.getMinutes() < 10 ? '0' : '') + dateObj.getMinutes();

            if (match.status === 'Finished') {
                
                if (match.score_us > match.score_them) {
                    cardClass = "result-win";
                } else {
                    cardClass = "result-loss";
                }

                
                scoreHTML = `
                    <div class="score-board">
                        <span class="score">${match.score_us}</span>
                        <span class="divider">-</span>
                        <span class="score">${match.score_them}</span>
                        <div class="match-status">FINAL</div>
                    </div>
                `;
            } else {
                
                cardClass = "upcoming";
                
                
                scoreHTML = `
                    <div class="score-board">
                        <span class="vs-text">VS</span>
                        <div class="match-time">${time}</div>
                    </div>
                `;
            }

            
            const card = document.createElement('div');
            card.className = `match-card ${cardClass}`;

            card.innerHTML = `
                <div class="match-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                
                <div class="match-teams">
                    <div class="team">
                        <img src="assets/logos/logo.png" alt="Home">
                        <span class="team-name">penzegyur</span>
                    </div>
                    
                    ${scoreHTML}
                    
                    <div class="team">
                    <img src="assets/logos/${match.opponent}.png" alt="${match.opponent}" onerror="this.src='assets/logos/default.svg'">
                        <span class="team-name">${match.opponent}</span>
                    </div>
                </div>
                
                <div class="match-actions">
                    <span class="venue">${match.location}</span>
                    ${match.status === 'Upcoming' ? '<a href="tickets.html" class="btn-ticket">Buy Ticket</a>' : '<button class="btn-details">Stats</button>'}
                </div>
            `;

            matchList.appendChild(card);
        });

    })
    .catch(error => console.error('Error loading matches:', error));

});
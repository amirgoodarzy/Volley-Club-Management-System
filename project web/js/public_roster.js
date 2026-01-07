document.addEventListener('DOMContentLoaded', function() {
    
    const grid = document.getElementById('publicRosterGrid');

 
    fetch('api/players.php')
    .then(response => response.json())
    .then(players => {
        

        grid.innerHTML = "";

        players.forEach(player => {
            
            const card = document.createElement('div');
            card.className = 'player-card';

            card.innerHTML = `
                <div class="player-image">
                    <img src="assets/players/${player.image}" alt="${player.name}" onerror="this.src='https://via.placeholder.com/300x350?text=No+Image'">
                    <div class="player-number">${player.number}</div>
                </div>
                <div class="player-info">
                    <h3>${player.name}</h3>
                    <p>${player.position}</p>
                    <p style="font-size:12px; color:#aaa;">${player.height}</p>
                </div>
            `;

            grid.appendChild(card);
        });

    })
    .catch(error => console.error('Error loading roster:', error));

});
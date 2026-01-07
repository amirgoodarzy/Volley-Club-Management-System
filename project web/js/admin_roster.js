document.addEventListener('DOMContentLoaded', function() {
    
    
    const tableBody = document.getElementById('rosterTableBody');
    const modal = document.getElementById('playerModal'); 
    const form = document.getElementById('addPlayerForm'); 
    
    
    const addBtn = document.getElementById('addPlayerBtn'); 
    const closeSpan = document.querySelector('.close-modal');
    const saveBtn = document.querySelector('.btn-save');
    const modalTitle = document.querySelector('#playerModal h2');

    
    const pName = document.getElementById('pName');
    const pNumber = document.getElementById('pNumber');
    const pPosition = document.getElementById('pPosition');
    const pHeight = document.getElementById('pHeight');
    const pImage = document.getElementById('pImage');

    let allPlayers = [];
    let editingId = null;

    
    function loadRoster() {
        fetch('../api/players.php')
        .then(res => res.json())
        .then(data => {
            allPlayers = data;
            tableBody.innerHTML = "";
            
            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='6'>No players found.</td></tr>";
                return;
            }

            data.forEach(player => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player.number}</td>
                    <td><img src="../assets/images/${player.image}" width="40" onerror="this.src='../assets/images/default.png'"></td>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td>${player.height}</td>
                    <td>
                        <button class="btn-action btn-edit" type="button" onclick="openEditModal(${player.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" type="button" onclick="deletePlayer(${player.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
    }

    
    
    
    if (addBtn) {
        addBtn.onclick = function() {
            editingId = null;
            form.reset();
            modalTitle.innerText = "Add New Player";
            saveBtn.innerText = "Save Player";
            modal.style.display = "block";
        }
    }

    
    window.openEditModal = function(id) {
       
        const player = allPlayers.find(p => p.id == id);
        
        if (player) {
            editingId = id;
            
            pName.value = player.name;
            pNumber.value = player.number;
            pPosition.value = player.position;
            pHeight.value = player.height;
            if(pImage) pImage.value = player.image || "";

            
            modalTitle.innerText = "Edit Player";
            saveBtn.innerText = "Update Player";
            modal.style.display = "block";
        } else {
            console.error("Player ID not found in memory:", id);
        }
    };

    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };


    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const method = editingId ? 'PUT' : 'POST';
            
            const payload = { 
                name: pName.value, 
                number: pNumber.value, 
                position: pPosition.value, 
                height: pHeight.value,
                image: pImage ? pImage.value : "default_player.png"
            };
            
            if(editingId) payload.id = editingId;

            fetch('../api/players.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    alert(editingId ? "Player Updated Successfully!" : "Player Added Successfully!");
                    modal.style.display = "none";
                    loadRoster();
                } else {
                    alert("Server Error: " + (data.error || "Unknown error"));
                }
            })
            .catch(err => console.error("Fetch Error:", err));
        });
    }


    window.deletePlayer = function(id) {
        if(confirm("Delete this player?")) {
            fetch('../api/players.php', {
                method: 'DELETE',
                body: JSON.stringify({ id: id })
            })
            .then(res => res.json())
            .then(data => { if(data.success) loadRoster(); });
        }
    };

    loadRoster();
});
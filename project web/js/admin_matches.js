document.addEventListener('DOMContentLoaded', function() {
    
    const tableBody = document.getElementById('matchesTableBody');
    const modal = document.getElementById('matchModal');
    const form = document.getElementById('addMatchForm');
    
    const addBtn = document.getElementById('addMatchBtn');
    const closeSpan = document.querySelector('.close-modal');
    const saveBtn = document.querySelector('.btn-save');
    const modalTitle = document.querySelector('#matchModal h2');

    
    const mDate = document.getElementById('mDate');
    const mOpponent = document.getElementById('mOpponent');
    const mLocation = document.getElementById('mLocation');
    const mStatus = document.getElementById('mStatus');
    const mScoreUs = document.getElementById('mScoreUs');
    const mScoreThem = document.getElementById('mScoreThem');

    let allMatches = [];
    let editingId = null;

    
    function loadMatches() {
        fetch('../api/matches.php')
        .then(res => res.json())
        .then(data => {
            allMatches = data;
            tableBody.innerHTML = "";
            
            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='6'>No matches found.</td></tr>";
                return;
            }

            data.forEach(match => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${match.date}</td>
                    <td>${match.opponent}</td>
                    <td>${match.location}</td>
                    <td><span class="status-${match.status.toLowerCase()}">${match.status}</span></td>
                    <td>${match.score_us} - ${match.score_them}</td>
                    <td>
                        <button class="btn-action btn-edit" type="button" onclick="openEditModal(${match.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" type="button" onclick="deleteMatch(${match.id})">
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
            modalTitle.innerText = "Add New Match";
            saveBtn.innerText = "Save Match";
            
            if(mScoreUs) mScoreUs.value = 0;
            if(mScoreThem) mScoreThem.value = 0;
            modal.style.display = "block";
        }
    }

    window.openEditModal = function(id) {
        const match = allMatches.find(m => m.id == id);
        if (match) {
            editingId = id;
            
            mDate.value = match.date.replace(' ', 'T'); 
            mOpponent.value = match.opponent;
            mLocation.value = match.location;
            mStatus.value = match.status;
            mScoreUs.value = match.score_us;
            mScoreThem.value = match.score_them;

            modalTitle.innerText = "Edit Match Results";
            saveBtn.innerText = "Update Match";
            modal.style.display = "block";
        }
    };

    if(closeSpan) closeSpan.onclick = () => modal.style.display = "none";
    window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

    // SUBMIT
    if(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const method = editingId ? 'PUT' : 'POST';
            const payload = { 
                date: mDate.value, 
                opponent: mOpponent.value, 
                location: mLocation.value, 
                status: mStatus.value,
                score_us: mScoreUs.value,
                score_them: mScoreThem.value
            };
            
            if(editingId) payload.id = editingId;

            fetch('../api/matches.php', {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    alert(editingId ? "Match Updated!" : "Match Added!");
                    modal.style.display = "none";
                    loadMatches();
                } else {
                    alert("Error: " + (data.error || "Unknown"));
                }
            });
        });
    }

    // DELETE
    window.deleteMatch = function(id) {
        if(confirm("Delete this match?")) {
            fetch('../api/matches.php', {
                method: 'DELETE',
                body: JSON.stringify({ id: id })
            })
            .then(res => res.json())
            .then(data => { if(data.success) loadMatches(); });
        }
    };

    loadMatches();
});
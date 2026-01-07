const user = sessionStorage.getItem('fanUser');
if (!user) window.location.href = 'login.html';

document.getElementById('profileName').innerText = user.toUpperCase();


fetch(`api/profile.php?username=${user}`)
.then(res => res.json())
.then(data => {
    const tbody = document.getElementById('historyTable');
    tbody.innerHTML = "";
    
    if(data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>No purchases yet.</td></tr>";
        return;
    }

    data.forEach(order => {
        const date = new Date(order.date).toLocaleDateString();
        tbody.innerHTML += `
            <tr>
                <td>${date}</td>
                <td>${order.item_name}</td>
                <td><span style="font-weight:bold; color:${order.category === 'Ticket' ? '#c5a059' : '#333'}">${order.category}</span></td>
                <td>€ ${parseFloat(order.price).toFixed(2)}</td>
            </tr>
        `;
    });
});


function logout() {
    sessionStorage.removeItem('fanUser');
    window.location.href = 'index.html';
}
document.addEventListener('DOMContentLoaded', function() {
    

    const storedUser = sessionStorage.getItem('adminUser');
    

    const welcomeSpan = document.querySelector('.user-info span'); 

    if (storedUser && welcomeSpan) {
     
        welcomeSpan.innerHTML = `Welcome, <b>${storedUser}</b>`;
    } else {
       
    }


    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if(confirm("Are you sure you want to logout?")) {
                sessionStorage.removeItem('adminUser'); 
                window.location.href = 'index.html';
            }
        });
    }
});
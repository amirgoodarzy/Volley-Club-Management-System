document.addEventListener('DOMContentLoaded', function() {
    
    const loginForm = document.getElementById('loginForm');


    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            const errorMsg = document.getElementById('errorMsg');

            if(errorMsg) errorMsg.style.display = 'none';

            fetch('../api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    username: user, 
                    password: pass, 
                    role: 'admin' 
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    sessionStorage.setItem('adminUser', data.username); 
                    window.location.href = 'dashboard.html';
                } else {
                    if(errorMsg) {
                        errorMsg.style.display = 'block';
                        errorMsg.innerText = data.message;
                    } else {
                        alert(data.message);
                    }
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }
});
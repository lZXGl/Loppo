async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, rememberMe })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('loggedInUser', JSON.stringify(data.user));
            globalCurrentUser = data.user;
            window.location.href = 'index.html';
        } else {
            showNotification(data.error || 'Login failed', 'error');
        }
    } catch (e) {
        console.error(e);
    }
}

document.getElementById('loginForm')?.addEventListener('submit', handleLogin);

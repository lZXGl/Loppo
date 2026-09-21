async function handleSignup(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification("Passwords do not match", "error");
        return;
    }

    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, username, email, password })
        });
        const data = await res.json();
        if (res.ok) {
            showNotification('Signup successful! Please log in.', 'success');
            window.location.href = 'login.html';
        } else {
            showNotification(data.error || 'Signup failed', 'error');
        }
    } catch (e) {
        console.error(e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm')?.addEventListener('submit', handleSignup);
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        document.getElementById('mensaje-error').textContent = data.error;
      } else {
        localStorage.setItem('usuario', JSON.stringify(data));
        window.location.href = 'empleados.html'; // o cualquier página protegida
      }
    })
    .catch(err => {
      console.error('Error de login:', err);
      document.getElementById('mensaje-error').textContent = 'Error de conexión.';
    });
});

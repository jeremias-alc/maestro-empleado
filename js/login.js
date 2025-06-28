document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault(); // Evita que el formulario se recargue

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Credenciales fijas de prueba
  const validUser = "admin";
  const validPass = "271619";

  if (username === validUser && password === validPass) {
    // Guardar sesión en localStorage (opcional)
    localStorage.setItem("userLoggedIn", "true");
    
    // Redirigir a empleados.html
    window.location.href = "empleados.html";
  } else {
    document.getElementById('error').textContent = "Usuario o contraseña incorrectos.";
  }
});

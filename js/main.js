// Mostrar y ocultar modal
document.querySelector(".btn-nuevo").addEventListener("click", () => {
  document.getElementById("modal-empleado").style.display = "flex";
});

document.getElementById("cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-empleado").style.display = "none";
});

// Guardar nuevo empleado
document.getElementById("form-empleado").addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  // Convertir strings numéricos a número real
  data.salario = parseFloat(data.salario);
  data.expenses = parseFloat(data.expenses);
  data.total = parseFloat(data.total);

  fetch("http://localhost:3000/empleados", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(() => {
    alert("Empleado registrado exitosamente");
    document.getElementById("modal-empleado").style.display = "none";
    cargarEmpleados(); // Recargar la tabla
  })
  .catch(err => {
    console.error("Error al guardar empleado:", err);
    alert("Hubo un error al guardar el empleado.");
  });
});

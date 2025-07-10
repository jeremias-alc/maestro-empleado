document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalVacaciones");
  const btnNuevo = document.querySelector(".btn-nuevo");
  const cancelar = document.getElementById("cancelarModal");
  const form = document.getElementById("formVacaciones");
  const selectEmpleado = document.getElementById("id_empleado");

  // Mostrar modal
  btnNuevo.addEventListener("click", () => {
    modal.style.display = "block";
    cargarEmpleados();
  });

  // Cancelar modal
  cancelar.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
  });

  // Cargar empleados en el select
  function cargarEmpleados() {
    fetch("http://localhost:3000/empleados")
      .then(res => res.json())
      .then(data => {
        selectEmpleado.innerHTML = "";
        data.forEach(emp => {
          const option = document.createElement("option");
          option.value = emp.id_empleado;
          option.textContent = emp.nombre;
          selectEmpleado.appendChild(option);
        });
      });
  }

  // Enviar formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    await fetch("http://localhost:3000/vacaciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });
    modal.style.display = "none";
    form.reset();
    cargarVacaciones(); // recarga tabla
  });

  // Cargar tabla de vacaciones
  function cargarVacaciones() {
    fetch("http://localhost:3000/vacaciones")
      .then(res => res.json())
      .then(data => {
        const tbody = document.getElementById("tabla-vacaciones-body");
        tbody.innerHTML = "";
        data.forEach((vac, i) => {
          const fila = `
            <tr>
              <td>${i + 1}</td>
              <td>${vac.nombre}</td>  
              <td>${vac.año_vacaciones}</td>
              <td>${vac.fecha_inicio}</td>
              <td>${vac.fecha_fin}</td>
              <td>${vac.total_dias}</td>
              <td>${vac.tipo}</td>
              <td>${vac.comentarios || ""}</td>
            </tr>`;
          tbody.insertAdjacentHTML("beforeend", fila);
        });
      });
  }

  cargarVacaciones(); // al cargar la página
});

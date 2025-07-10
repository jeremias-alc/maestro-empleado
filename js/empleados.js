document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalEmpleado");
  const btnNuevo = document.querySelector(".btn-nuevo");
  const cancelar = document.getElementById("cancelarEmpleado");
  const form = document.getElementById("formEmpleado");
  const tbody = document.getElementById("tabla-empleados-body");

  // Mostrar modal
  btnNuevo.addEventListener("click", () => {
    modal.style.display = "block";
    form.reset();
    form.removeAttribute("data-editando");
  });

  // Cancelar modal
  cancelar.addEventListener("click", () => {
    modal.style.display = "none";
    form.reset();
    form.removeAttribute("data-editando");
  });

  // Enviar formulario (crear o editar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    const id = form.dataset.editando;

    const url = id
      ? `http://localhost:3000/empleados/${id}`
      : "http://localhost:3000/empleados";

    const metodo = id ? "PUT" : "POST";

    await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    form.reset();
    form.removeAttribute("data-editando");
    modal.style.display = "none";
    cargarEmpleados();
  });

  // Cargar tabla de empleados
  function cargarEmpleados() {
    fetch("http://localhost:3000/empleados")
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = "";
        data.forEach(emp => {
          const fila = `
            <tr>
              <td>${emp.codigo}</td>
              <td>${emp.nombre}</td>
              <td>${emp.posicion}</td>
              <td>${emp.fecha_ingreso}</td>
              <td>${emp.cedula}</td>
              <td>${emp.fecha_cumpleanos}</td>
              <td>${emp.fecha_ultimo_aumento || ""}</td>
              <td>${emp.salario}</td>
              <td>${emp.expenses}</td>
              <td>${emp.total}</td>
              <td>${emp.comentarios || ""}</td>
              <td>${emp.email}</td>
              <td>
                <button class="btn-ver" data-id="${emp.id_empleado}">👁</button>
                <button class="btn-editar" data-id="${emp.id_empleado}">✏️</button>
                <button class="btn-eliminar" data-id="${emp.id_empleado}">🗑</button>
              </td>
            </tr>`;
          tbody.insertAdjacentHTML("beforeend", fila);
        });

        // Eventos a los botones luego de pintar
        document.querySelectorAll(".btn-ver").forEach(btn =>
          btn.addEventListener("click", (e) => verEmpleado(e.target.dataset.id)));

        document.querySelectorAll(".btn-editar").forEach(btn =>
          btn.addEventListener("click", (e) => editarEmpleado(e.target.dataset.id)));

        document.querySelectorAll(".btn-eliminar").forEach(btn =>
          btn.addEventListener("click", (e) => eliminarEmpleado(e.target.dataset.id)));
      });
  }

  cargarEmpleados(); // al cargar la página

  // Función VER
  function verEmpleado(id) {
    fetch(`http://localhost:3000/empleados`)
      .then(res => res.json())
      .then(data => {
        const emp = data.find(e => e.id_empleado == id);
        alert(`Nombre: ${emp.nombre}\nPosición: ${emp.posicion}\nSalario: ${emp.salario}`);
      });
  }

  // Función EDITAR
  function editarEmpleado(id) {
    fetch(`http://localhost:3000/empleados`)
      .then(res => res.json())
      .then(data => {
        const emp = data.find(e => e.id_empleado == id);
        for (let campo in emp) {
          if (form.elements[campo]) {
            form.elements[campo].value = emp[campo];
          }
        }
        form.dataset.editando = id;
        modal.style.display = "block";
      });
  }

  // Función ELIMINAR
  function eliminarEmpleado(id) {
    if (confirm("¿Deseas eliminar este empleado y sus vacaciones?")) {
      fetch(`http://localhost:3000/empleados/${id}`, {
        method: "DELETE"
      })
      .then(res => res.json())
      .then(() => {
        alert("Empleado eliminado correctamente.");
        cargarEmpleados(); // recargar tabla
      })
      .catch(err => {
        console.error("Error al eliminar:", err);
        alert("Hubo un problema al eliminar.");
      });
    }
  }
});

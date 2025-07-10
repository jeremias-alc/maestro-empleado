document.addEventListener("DOMContentLoaded", () => {
  const paginaActual = window.location.pathname.split("/").pop();

  // Activar pestaña del navbar
  document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === paginaActual) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  if (paginaActual === "empleados.html") {
    cargarEmpleados();
  } else if (paginaActual === "vacaciones.html") {
    cargarVacaciones();
  }
});

// ===================== EMPLEADOS =====================
function cargarEmpleados() {
  fetch("http://localhost:3000/empleados")
    .then(res => res.json())
    .then(empleados => {
      const tbody = document.getElementById("tabla-empleados-body");
      tbody.innerHTML = "";

      empleados.forEach(emp => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${emp.codigo}</td>
          <td>${emp.nombre}</td>
          <td>${emp.posicion}</td>
          <td>${emp.fecha_ingreso}</td>
          <td>${emp.cedula}</td>
          <td>${emp.fecha_cumpleanos}</td>
          <td>${emp.fecha_ultimo_aumento}</td>
          <td>${emp.salario}</td>
          <td>${emp.expenses}</td>
          <td>${emp.total}</td>
          <td>${emp.comentarios}</td>
          <td>${emp.email}</td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar empleados:", err);
    });
}

// ===================== VACACIONES =====================
function cargarVacaciones() {
  // Aquí debes decidir qué ID de empleado cargar. Por ahora, cargamos todos.
  fetch("http://localhost:3000/vacaciones/1") // Cambia ID según necesites
    .then(res => res.json())
    .then(vacaciones => {
      const tbody = document.getElementById("tabla-vacaciones-body");
      tbody.innerHTML = "";

      vacaciones.forEach((v, i) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${i + 1}</td>
          <td>${v.id_empleado}</td>
          <td>${v.año_vacaciones}</td>
          <td>${v.fecha_inicio}</td>
          <td>${v.fecha_fin}</td>
          <td>${v.total_dias}</td>
          <td>${v.tipo}</td>
          <td>${v.comentarios || ""}</td>
        `;
        tbody.appendChild(fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar vacaciones:", err);
    });
}

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


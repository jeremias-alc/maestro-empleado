const API_URL = 'http://localhost:3000/api/empleados';

document.addEventListener('DOMContentLoaded', () => {
  cargarEmpleados();

  // Guardar empleado
  document.getElementById('form-empleado').addEventListener('submit', guardarEmpleado);

  // Abrir modal para nuevo empleado
  document.querySelector('.btn-nuevo').addEventListener('click', () => {
    document.getElementById('form-empleado').reset();
    document.getElementById('form-empleado').removeAttribute('data-id');
    document.getElementById('modal-empleado').style.display = 'flex';
  });

  // Cerrar modal
  document.getElementById('cerrar-modal').addEventListener('click', () => {
    document.getElementById('modal-empleado').style.display = 'none';
  });
});

document.getElementById('btn-filtrar-empleados').addEventListener('click', function () {
  document.getElementById('modal-filtros').style.display = 'block';
});

document.getElementById('cerrar-modal-filtros').addEventListener('click', function () {
  document.getElementById('modal-filtros').style.display = 'none';
});

document.getElementById('quitar-filtros').addEventListener('click', () => {
  // Limpia el formulario de filtros si lo deseas
  document.getElementById('form-filtro-empleado')?.reset();

  // Cargar todos los empleados
  cargarEmpleados(); // o la función que use tu tabla por defecto
});

function cargarEmpleados() {
  fetch(API_URL)
    .then(res => res.json())
    .then(empleados => {
      mostrarEmpleadosEnTabla(empleados);
    })
    .catch(err => console.error('Error al cargar empleados:', err));
}


function guardarEmpleado(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const datos = Object.fromEntries(formData.entries());
  const id = form.dataset.id;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(() => {
      alert(id ? 'Empleado actualizado' : 'Empleado agregado');
      form.reset();
      form.removeAttribute('data-id');
      document.getElementById('modal-empleado').style.display = 'none';
      cargarEmpleados();
    })
    .catch(err => {
      console.error('Error al guardar empleado:', err);
      alert('Hubo un error al guardar el empleado.');
    });
}

function agregarEventosBotones() {
  // Eliminar
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', function () {
      const tr = this.closest('tr');
      const id = tr.dataset.id;

      if (confirm('¿Seguro que deseas eliminar este empleado?')) {
        fetch(`${API_URL}/${id}`, {
          method: 'DELETE'
        })
          .then(() => {
            alert('Empleado eliminado correctamente');
            cargarEmpleados();
          })
          .catch(err => {
            console.error('Error al eliminar:', err);
            alert('Error al eliminar el empleado.');
          });
      }
    });
  });

  // Editar
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', function () {
      const tr = this.closest('tr');
      const id = tr.dataset.id;
      const celdas = tr.querySelectorAll('td');

      const campos = [
        "codigo", "nombre", "posicion", "fecha_ingreso", "cedula",
        "fecha_nacimiento", "fecha_ultimo_aumento", "salario",
        "expenses", "total", "comentarios", "email"
      ];

      const form = document.getElementById('form-empleado');

      campos.forEach((campo, i) => {
        form.elements[campo].value = celdas[i].textContent.trim();
      });

      form.dataset.id = id;
      document.getElementById('modal-empleado').style.display = 'flex';
    });
  });
}

function agregarEventoFila() {
  const filas = document.querySelectorAll('#tabla-empleados-body tr');
  filas.forEach(fila => {
    fila.addEventListener('click', function (e) {
      if (e.target.tagName === 'BUTTON') return;

      const celdas = this.querySelectorAll('td');
      const campos = [
        "Código", "Nombre", "Posición", "Fecha de Ingreso", "Cédula",
        "Fecha de Nacimiento", "Último Aumento", "Salario",
        "Gastos", "Total", "Comentarios", "Email"
      ];

      let mensaje = "📋 Datos del Empleado:\n\n";
      campos.forEach((campo, i) => {
        mensaje += `${campo}: ${celdas[i].textContent.trim()}\n`;
      });

      alert(mensaje);
    });
  });
}


function mostrarEmpleadosEnTabla(empleados) {
  const tbody = document.getElementById('tabla-empleados-body');
  tbody.innerHTML = '';

  empleados.forEach(emp => {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', emp.id);
    tr.innerHTML = `
      <td>${emp.codigo}</td>
      <td>${emp.nombre}</td>
      <td>${emp.posicion || ''}</td>
      <td>${emp.fecha_ingreso || ''}</td>
      <td>${emp.cedula || ''}</td>
      <td>${emp.fecha_nacimiento || ''}</td>
      <td>${emp.fecha_ultimo_aumento || ''}</td>
      <td>${emp.salario || ''}</td>
      <td>${emp.expenses || ''}</td>
      <td>${emp.total || ''}</td>
      <td>${emp.comentarios || ''}</td>
      <td>${emp.email || ''}</td>
      <td>
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  agregarEventosBotones();
  agregarEventoFila();
}


async function buscarEmpleados({ nombre, cedula, email }) {
  const params = new URLSearchParams();
  if (nombre) params.append('nombre', nombre);
  if (cedula) params.append('cedula', cedula);
  if (email) params.append('email', email);

  try {
    const res = await fetch(`/api/empleados/buscar?${params.toString()}`);
    const data = await res.json();
    mostrarEmpleadosEnTabla(data);
  } catch (error) {
    console.error("Error en búsqueda:", error);
  }
}

document.getElementById('busqueda-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  const nombre = form.nombre.value.trim();
  const cedula = form.cedula.value.trim();
  const email = form.email.value.trim();
  buscarEmpleados({ nombre, cedula, email });
});

// Filtrar por salario
document.getElementById('salario-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const operador = form.operador.value;
  const monto = form.monto.value;

  try {
    const res = await fetch(`/api/empleados/filtrar/salario?operador=${encodeURIComponent(operador)}&monto=${monto}`);
    const data = await res.json();
    mostrarEmpleadosEnTabla(data);
  } catch (err) {
    console.error('Error al filtrar salario:', err);
    alert('Error al filtrar por salario');
  }
});

// Filtrar empleados por fecha de ingreso (rango)
document.getElementById('fecha-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const desde = form.desde.value;
  const hasta = form.hasta.value;

  try {
    const res = await fetch(`/api/empleados/filtrar/fecha-ingreso?desde=${desde}&hasta=${hasta}`);
    const data = await res.json();
    mostrarEmpleadosEnTabla(data);
  } catch (err) {
    console.error('Error al filtrar por fecha:', err);
    alert('Error al filtrar por fecha de ingreso');
  }
});

// Filtrar empleados por mes y/o día de cumpleaños
document.getElementById('cumple-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const mes = form.mes.value;
  const dia = form.dia.value;

  try {
    const url = `/api/empleados/filtrar/cumpleanios?mes=${mes}${dia ? `&dia=${dia}` : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    mostrarEmpleadosEnTabla(data);
  } catch (err) {
    console.error('Error al filtrar cumpleaños:', err);
    alert('Error al filtrar por cumpleaños');
  }
});

async function cargarEstadisticas() {
  try {
    const res = await fetch('/api/empleados/estadisticas');
    const data = await res.json();

    const contenedor = document.getElementById('estadisticas-contenido');
    contenedor.innerHTML = `
      <p><strong>Total empleados:</strong> ${data.total_empleados}</p>
      <p><strong>Promedio salario:</strong> RD$${parseFloat(data.promedio_salario || 0).toFixed(2)}</p>
      <p><strong>Promedio gastos:</strong> RD$${parseFloat(data.promedio_expenses || 0).toFixed(2)}</p>
      <p><strong>Promedio total:</strong> RD$${parseFloat(data.promedio_total || 0).toFixed(2)}</p>
    `;
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    alert('No se pudieron cargar las estadísticas.');
  }
}

// Llamar automáticamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarEstadisticas();
});

document.getElementById('btn-buscar-posicion').addEventListener('click', (e) => {
  e.preventDefault();
  const valor = document.getElementById('buscar-posicion').value;

  if (!valor) return alert('Ingrese una posición');

  fetch(`/api/empleados/buscar-posicion?posicion=${encodeURIComponent(valor)}`)
    .then(res => res.json())
    .then(data => {
      mostrarEmpleadosEnTabla(data);
    })
    .catch(err => {
      console.error('Error al buscar por posición:', err);
    });
});

//fechaingreso
document.getElementById('btn-filtrar-ingreso').addEventListener('click', (e) => {
  e.preventDefault();

  const desde = document.getElementById('filtro-desde-ingreso').value;
  const hasta = document.getElementById('filtro-hasta-ingreso').value;

  if (!desde || !hasta) {
    return alert('Debes ingresar ambas fechas');
  }

  fetch(`/api/empleados/filtrar-ingreso?desde=${desde}&hasta=${hasta}`)
    .then(res => res.json())
    .then(data => {
      mostrarEmpleadosEnTabla(data);
    })
    .catch(err => {
      console.error('Error al filtrar por fecha de ingreso:', err);
    });
});

// 🔍 Filtro: Cumpleaños por mes y/o día
document.getElementById('btn-filtrar-cumple').addEventListener('click', (e) => {
  e.preventDefault();

  const mes = document.getElementById('filtro-cumple-mes').value;
  const dia = document.getElementById('filtro-cumple-dia').value;

  if (!mes && !dia) {
    return alert('Debes ingresar al menos mes o día');
  }

  const params = new URLSearchParams();
  if (mes) params.append('mes', mes);
  if (dia) params.append('dia', dia);

  fetch(`/api/empleados/filtrar-cumple?${params.toString()}`)
    .then(res => res.json())
    .then(data => {
      mostrarEmpleadosEnTabla(data);
    })
    .catch(err => {
      console.error('Error al filtrar por cumpleaños:', err);
    });
});
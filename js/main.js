const API_URL = 'http://localhost:3000/api/empleados';

document.addEventListener('DOMContentLoaded', () => {
  cargarEmpleados();

  // Evento guardar empleado
  document.getElementById('form-empleado').addEventListener('submit', guardarEmpleado);

  // Evento para abrir modal
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

function cargarEmpleados() {
  fetch(API_URL)
    .then(res => res.json())
    .then(empleados => {
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

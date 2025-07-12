const API_VACACIONES = 'http://localhost:3000/api/vacaciones';
const API_EMPLEADOS = 'http://localhost:3000/api/empleados';

document.addEventListener('DOMContentLoaded', () => {
  cargarVacaciones();
  cargarEmpleadosEnSelect();

  document.querySelector('.btn-nuevo').addEventListener('click', () => {
    document.getElementById('form-vacacion').reset();
    document.getElementById('form-vacacion').removeAttribute('data-id');
    document.getElementById('modal-vacacion').style.display = 'flex';
  });

  document.getElementById('cerrar-modal-vacacion').addEventListener('click', () => {
    document.getElementById('modal-vacacion').style.display = 'none';
  });

  document.getElementById('form-vacacion').addEventListener('submit', guardarVacacion);
});

function cargarVacaciones() {
  fetch(API_VACACIONES)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('tabla-vacaciones-body');
      tbody.innerHTML = '';

      data.forEach((v, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${i + 1}</td>
          <td>${v.nombre_empleado}</td>
          <td>${v.periodo}</td>
          <td>${v.fecha_inicio}</td>
          <td>${v.fecha_fin}</td>
          <td>${v.dias_disfrutados}</td>
          <td>${v.tipo}</td>
          <td>${v.comentarios || ''}</td>
        `;
        tr.addEventListener('click', () => abrirEditarVacacion(v));
        tbody.appendChild(tr);
      });
    })
    .catch(err => console.error('Error al cargar vacaciones:', err));
}

function cargarEmpleadosEnSelect() {
  fetch(API_EMPLEADOS)
    .then(res => res.json())
    .then(empleados => {
      const select = document.querySelector('#form-vacacion select[name="empleado_id"]');
      empleados.forEach(emp => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = emp.nombre;
        select.appendChild(option);
      });
    });
}

function guardarVacacion(e) {
  e.preventDefault();
  const form = e.target;
  const datos = Object.fromEntries(new FormData(form).entries());
  const id = form.dataset.id;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_VACACIONES}/${id}` : API_VACACIONES;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  })
    .then(res => res.json())
    .then(() => {
      alert(id ? 'Vacación actualizada' : 'Vacación registrada');
      form.reset();
      form.removeAttribute('data-id');
      document.getElementById('modal-vacacion').style.display = 'none';
      cargarVacaciones();
    })
    .catch(err => {
      console.error('Error al guardar vacación:', err);
      alert('Error al guardar.');
    });
}

function abrirEditarVacacion(v) {
  const form = document.getElementById('form-vacacion');
  form.elements['empleado_id'].value = v.empleado_id;
  form.elements['periodo'].value = v.periodo;
  form.elements['fecha_inicio'].value = v.fecha_inicio;
  form.elements['fecha_fin'].value = v.fecha_fin;
  form.elements['dias_disfrutados'].value = v.dias_disfrutados;
  form.elements['tipo'].value = v.tipo;
  form.elements['comentarios'].value = v.comentarios || '';
  form.dataset.id = v.id;
  document.getElementById('modal-vacacion').style.display = 'flex';
}

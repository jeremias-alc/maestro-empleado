const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Conexión a la base de datos
const db = new sqlite3.Database('./db/empleados.db');

// Obtener todos los empleados
router.get('/', (req, res) => {
  db.all('SELECT * FROM empleados', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Eliminar un empleado por ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM empleados WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Agregar un nuevo empleado
router.post('/', (req, res) => {
  const {
    codigo, nombre, posicion, fecha_ingreso, cedula,
    fecha_nacimiento, fecha_ultimo_aumento, salario,
    expenses, total, comentarios, email
  } = req.body;

  const sql = `
    INSERT INTO empleados (
      codigo, nombre, posicion, fecha_ingreso, cedula,
      fecha_nacimiento, fecha_ultimo_aumento, salario,
      expenses, total, comentarios, email
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    codigo, nombre, posicion, fecha_ingreso, cedula,
    fecha_nacimiento, fecha_ultimo_aumento, salario,
    expenses, total, comentarios, email
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Actualizar un empleado existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const datos = req.body;

  const sql = `
    UPDATE empleados SET
      codigo = ?, nombre = ?, posicion = ?, fecha_ingreso = ?, cedula = ?,
      fecha_nacimiento = ?, fecha_ultimo_aumento = ?, salario = ?, expenses = ?,
      total = ?, comentarios = ?, email = ?
    WHERE id = ?
  `;

  db.run(sql, [
    datos.codigo, datos.nombre, datos.posicion, datos.fecha_ingreso, datos.cedula,
    datos.fecha_nacimiento, datos.fecha_ultimo_aumento, datos.salario, datos.expenses,
    datos.total, datos.comentarios, datos.email, id
  ], function(err) {
    if (err) {
      console.error('Error al actualizar empleado:', err);
      return res.status(500).json({ error: 'Error al actualizar el empleado' });
    }
    res.json({ mensaje: 'Empleado actualizado correctamente' });
  });
});

// Buscar por nombre, cédula o email
router.get('/buscar', (req, res) => {
  const { nombre, cedula, email } = req.query;

  let condiciones = [];
  let valores = [];

  if (nombre) {
    condiciones.push("nombre LIKE ?");
    valores.push(`%${nombre}%`);
  }
  if (cedula) {
    condiciones.push("cedula LIKE ?");
    valores.push(`%${cedula}%`);
  }
  if (email) {
    condiciones.push("email LIKE ?");
    valores.push(`%${email}%`);
  }

  if (condiciones.length === 0) {
    return res.status(400).json({ error: "Debe enviar al menos un parámetro de búsqueda" });
  }

  const sql = `SELECT * FROM empleados WHERE ${condiciones.join(" AND ")}`;
  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Buscar empleados por salario (mayor o menor a un valor)
router.get('/filtrar/salario', (req, res) => {
  const { operador, monto } = req.query;

  if (!operador || !monto) {
    return res.status(400).json({ error: 'Debe proporcionar operador y monto' });
  }

  // Validar operador
  if (!['>', '<', '>=', '<=', '='].includes(operador)) {
    return res.status(400).json({ error: 'Operador no válido' });
  }

  const sql = `SELECT * FROM empleados WHERE salario ${operador} ?`;
  db.all(sql, [monto], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Filtrar empleados por rango de fecha de ingreso
router.get('/filtrar/fecha-ingreso', (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debe proporcionar fecha desde y hasta' });
  }

  const sql = `
    SELECT * FROM empleados
    WHERE fecha_ingreso BETWEEN ? AND ?
  `;

  db.all(sql, [desde, hasta], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Filtrar empleados por cumpleaños (mes o mes/día)
router.get('/filtrar/cumpleanios', (req, res) => {
  const { mes, dia } = req.query;

  if (!mes) {
    return res.status(400).json({ error: 'Debe proporcionar al menos el mes' });
  }

  let condicion = "strftime('%m', fecha_nacimiento) = ?";
  let valores = [mes.padStart(2, '0')]; // Asegura que sea 2 dígitos

  if (dia) {
    condicion += " AND strftime('%d', fecha_nacimiento) = ?";
    valores.push(dia.padStart(2, '0'));
  }

  const sql = `SELECT * FROM empleados WHERE ${condicion}`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta para obtener estadísticas básicas
router.get('/estadisticas', (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total_empleados,
      AVG(salario) AS promedio_salario,
      AVG(expenses) AS promedio_expenses,
      AVG(total) AS promedio_total
    FROM empleados
  `;

  db.get(sql, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Buscar por posición
router.get('/buscar-posicion', (req, res) => {
  const { posicion } = req.query;

  if (!posicion) {
    return res.status(400).json({ error: 'Debe proporcionar una posición' });
  }

  const sql = `SELECT * FROM empleados WHERE posicion LIKE ?`;
  db.all(sql, [`%${posicion}%`], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

//filtrar por fecha de ingreso
router.get('/filtrar-ingreso', (req, res) => {
  const { desde, hasta } = req.query;

  if (!desde || !hasta) {
    return res.status(400).json({ error: 'Debe enviar las fechas desde y hasta' });
  }

  const sql = `SELECT * FROM empleados WHERE fecha_ingreso BETWEEN ? AND ?`;
  db.all(sql, [desde, hasta], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 🔍 Filtrar por fecha de cumpleaños (mes/día)
router.get('/filtrar-cumple', (req, res) => {
  const { mes, dia } = req.query;

  if (!mes && !dia) {
    return res.status(400).json({ error: 'Debes enviar al menos mes o día' });
  }

  let condiciones = [];
  let valores = [];

  if (mes) {
    condiciones.push("strftime('%m', fecha_nacimiento) = ?");
    valores.push(mes.padStart(2, '0'));
  }

  if (dia) {
    condiciones.push("strftime('%d', fecha_nacimiento) = ?");
    valores.push(dia.padStart(2, '0'));
  }

  const sql = `SELECT * FROM empleados WHERE ${condiciones.join(' AND ')}`;

  db.all(sql, valores, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;

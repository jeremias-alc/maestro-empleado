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

//Eliminar un empleado por ID
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
  const id = req.params.id;
  const {
    codigo, nombre, posicion, fecha_ingreso, cedula,
    fecha_nacimiento, fecha_ultimo_aumento, salario,
    expenses, total, comentarios, email
  } = req.body;

  const sql = `
    UPDATE empleados SET
      codigo = ?, nombre = ?, posicion = ?, fecha_ingreso = ?, cedula = ?,
      fecha_nacimiento = ?, fecha_ultimo_aumento = ?, salario = ?,
      expenses = ?, total = ?, comentarios = ?, email = ?
    WHERE id = ?
  `;

  db.run(sql, [
    codigo, nombre, posicion, fecha_ingreso, cedula,
    fecha_nacimiento, fecha_ultimo_aumento, salario,
    expenses, total, comentarios, email, id
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});



// Puedes agregar PUT, DELETE, etc.

module.exports = router;

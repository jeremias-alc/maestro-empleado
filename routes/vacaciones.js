const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

const db = new sqlite3.Database('./db/empleados.db');

// Obtener todas las vacaciones con nombre del empleado
router.get('/', (req, res) => {
  const sql = `
    SELECT v.id, v.empleado_id, e.nombre AS nombre_empleado,
           v.periodo, v.fecha_inicio, v.fecha_fin,
           v.dias_disfrutados, v.tipo, v.comentarios
    FROM vacaciones v
    JOIN empleados e ON v.empleado_id = e.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Crear una vacación
router.post('/', (req, res) => {
  const { empleado_id, periodo, fecha_inicio, fecha_fin, dias_disfrutados, tipo, comentarios } = req.body;
  const sql = `
    INSERT INTO vacaciones (
      empleado_id, periodo, fecha_inicio, fecha_fin,
      dias_disfrutados, tipo, comentarios
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [
    empleado_id, periodo, fecha_inicio, fecha_fin,
    dias_disfrutados, tipo, comentarios
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Actualizar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { periodo, fecha_inicio, fecha_fin, dias_disfrutados, tipo, comentarios } = req.body;

  const sql = `
    UPDATE vacaciones
    SET periodo = ?, fecha_inicio = ?, fecha_fin = ?, dias_disfrutados = ?, tipo = ?, comentarios = ?
    WHERE id = ?
  `;
  db.run(sql, [periodo, fecha_inicio, fecha_fin, dias_disfrutados, tipo, comentarios, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Vacación actualizada correctamente' });
  });
});

// Eliminar
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM vacaciones WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ mensaje: 'Vacación eliminada correctamente' });
  });
});

module.exports = router;

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database("./empresa.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Conectado a la base de datos SQLite.");
});

// Crear tablas si no existen
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS empleados (
    id_empleado INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT,
    nombre TEXT,
    posicion TEXT,
    fecha_ingreso TEXT,
    cedula TEXT,
    fecha_cumpleanos TEXT,
    fecha_ultimo_aumento TEXT,
    salario REAL,
    expenses REAL,
    total REAL,
    comentarios TEXT,
    email TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hist_vacaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_empleado INTEGER,
    año_vacaciones INTEGER,
    fecha_inicio TEXT,
    fecha_fin TEXT,
    total_dias INTEGER,
    tipo TEXT,
    comentarios TEXT,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hist_ajustes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_empleado INTEGER,
    fecha_efectividad TEXT,
    salario REAL,
    expenses REAL,
    comentarios TEXT,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado)
  )`);
});


// ======================== RUTAS EMPLEADOS ========================
// Obtener todos los empleados
app.get("/empleados", (req, res) => {
  db.all("SELECT * FROM empleados", (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Insertar nuevo empleado
app.post("/empleados", (req, res) => {
  const e = req.body;
  const sql = `INSERT INTO empleados 
    (codigo, nombre, posicion, fecha_ingreso, cedula, fecha_cumpleanos, fecha_ultimo_aumento, salario, expenses, total, comentarios, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    e.codigo, e.nombre, e.posicion, e.fecha_ingreso, e.cedula,
    e.fecha_cumpleanos, e.fecha_ultimo_aumento, e.salario, e.expenses,
    e.total, e.comentarios, e.email
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: this.lastID });
  });
});

// Actualizar empleado
app.put("/empleados/:id", (req, res) => {
  const id = req.params.id;
  const e = req.body;
  const sql = `
    UPDATE empleados SET
      codigo=?, nombre=?, posicion=?, fecha_ingreso=?, cedula=?,
      fecha_cumpleanos=?, fecha_ultimo_aumento=?, salario=?, expenses=?,
      total=?, comentarios=?, email=?
    WHERE id_empleado=?
  `;
  db.run(sql, [
    e.codigo, e.nombre, e.posicion, e.fecha_ingreso, e.cedula,
    e.fecha_cumpleanos, e.fecha_ultimo_aumento, e.salario, e.expenses,
    e.total, e.comentarios, e.email, id
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Eliminar empleado
app.delete("/empleados/:id", (req, res) => {
  db.run("DELETE FROM empleados WHERE id_empleado = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Borra vacaciones + empleado
app.delete("/empleados/:id", (req, res) => {
  const id = req.params.id;
  db.serialize(() => {
    db.run("DELETE FROM hist_vacaciones WHERE id_empleado = ?", [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.run("DELETE FROM empleados WHERE id_empleado = ?", [id], function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ message: "Empleado y vacaciones eliminados", changes: this.changes });
      });
    });
  });
});

/*/ ======================== RUTAS VACACIONES ========================
// Obtener vacaciones de un empleado
app.get("/vacaciones/:id_empleado", (req, res) => {
  const id = req.params.id_empleado;
  db.all("SELECT * FROM hist_vacaciones WHERE id_empleado = ?", [id], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Agregar vacaciones
app.post("/vacaciones", (req, res) => {
  const v = req.body;
  const sql = `INSERT INTO hist_vacaciones 
    (id_empleado, año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(sql, [
    v.id_empleado, v.año_vacaciones, v.fecha_inicio, v.fecha_fin,
    v.total_dias, v.tipo, v.comentarios
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: this.lastID });
  });
});

*/

// ==================== CRUD HIST_VACACIONES ====================

// Obtener todas las vacaciones
app.get("/vacaciones", (req, res) => {
  const sql = `
    SELECT v.*, e.nombre
    FROM hist_vacaciones v
    JOIN empleados e ON v.id_empleado = e.id_empleado
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Obtener vacaciones por empleado
app.get("/vacaciones/empleado/:id", (req, res) => {
  const id = req.params.id;
  db.all("SELECT * FROM hist_vacaciones WHERE id_empleado = ?", [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Agregar nuevo registro de vacaciones
app.post("/vacaciones", (req, res) => {
  const { id_empleado, año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios } = req.body;
  const sql = `
    INSERT INTO hist_vacaciones (id_empleado, año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(sql, [id_empleado, año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
});

// Actualizar un registro
app.put("/vacaciones/:id", (req, res) => {
  const id = req.params.id;
  const { año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios } = req.body;
  const sql = `
    UPDATE hist_vacaciones SET
      año_vacaciones = ?, fecha_inicio = ?, fecha_fin = ?, total_dias = ?, tipo = ?, comentarios = ?
    WHERE id = ?
  `;
  db.run(sql, [año_vacaciones, fecha_inicio, fecha_fin, total_dias, tipo, comentarios, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Eliminar un registro
app.delete("/vacaciones/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM hist_vacaciones WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});


// ======================== RUTAS AJUSTES ========================
// Obtener historial de ajustes
app.get("/ajustes/:id_empleado", (req, res) => {
  const id = req.params.id_empleado;
  db.all("SELECT * FROM hist_ajustes WHERE id_empleado = ?", [id], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

// Insertar ajuste
app.post("/ajustes", (req, res) => {
  const a = req.body;
  const sql = `INSERT INTO hist_ajustes 
    (id_empleado, fecha_efectividad, salario, expenses, comentarios)
    VALUES (?, ?, ?, ?, ?)`;

  db.run(sql, [
    a.id_empleado, a.fecha_efectividad, a.salario, a.expenses, a.comentarios
  ], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ id: this.lastID });
  });
});

// ======================== INICIAR SERVIDOR ========================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

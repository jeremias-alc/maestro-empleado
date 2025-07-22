const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Conexión directa para esta ruta (puedes usar req.db si prefieres)
const db = new sqlite3.Database(path.join(__dirname, '../db/empleados.db'));

// POST /api/auth/login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
  }

  const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;

  db.get(query, [username, password], (err, row) => {
    if (err) {
      console.error('Error al consultar usuario:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Usuario válido
    res.json({ success: true, username: row.username });
  });
});

module.exports = router;

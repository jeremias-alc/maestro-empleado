const express = require('express');
const path = require('path');
const cors = require('cors');
const empleadosRouter = require('./routes/empleados');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use(express.json()); // Permitir JSON en el cuerpo de la petición

// 2. Rutas API
app.use('/api/empleados', empleadosRouter);

// 3. Archivos estáticos (js, css, assets)
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 4. Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'empleados.html'));
});

// 5. Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

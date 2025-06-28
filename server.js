const express = require('express');
const path = require('path');
const cors = require('cors');
const empleadosRouter = require('./routes/empleados');

const app = express();
app.use(cors()); // Habilitar CORS para todas las rutas
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API para empleados
app.use('/api/empleados', empleadosRouter);

// Servir archivos estáticos (JS, CSS, imágenes, etc.)
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Ruta principal que devuelve el archivo empleados.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'empleados.html'));
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

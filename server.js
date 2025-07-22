const express = require('express');
const path = require('path');
const cors = require('cors');

// Routers
const empleadosRouter = require('./routes/empleados');
const vacacionesRouter = require('./routes/vacaciones');
const authRouter = require('./routes/auth'); // Ruta para autenticación

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Rutas API
app.use('/api/empleados', empleadosRouter);
app.use('/api/vacaciones', vacacionesRouter);
app.use('/api/auth', authRouter); // Ruta para autenticación

// 3. Archivos estáticos
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 4. Páginas principales
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // Página de login
});

app.get('/empleados', (req, res) => {
  res.sendFile(path.join(__dirname, 'empleados.html'));
});

app.get('/vacaciones', (req, res) => {
  res.sendFile(path.join(__dirname, 'vacaciones.html'));
});

// 5. Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

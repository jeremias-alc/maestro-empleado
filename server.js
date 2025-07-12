const express = require('express');
const path = require('path');
const cors = require('cors');

// Routers
const empleadosRouter = require('./routes/empleados');
const vacacionesRouter = require('./routes/vacaciones'); // <-- NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. Rutas API
app.use('/api/empleados', empleadosRouter);
app.use('/api/vacaciones', vacacionesRouter); // <-- NUEVO

// 3. Archivos estáticos
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

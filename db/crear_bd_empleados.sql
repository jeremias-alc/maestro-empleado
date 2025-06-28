CREATE TABLE IF NOT EXISTS empleados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  posicion TEXT,
  fecha_ingreso TEXT,
  cedula TEXT,
  fecha_nacimiento TEXT,
  fecha_ultimo_aumento TEXT,
  salario REAL,
  expenses REAL,
  total REAL,
  comentarios TEXT,
  email TEXT
);

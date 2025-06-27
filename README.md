HTML CSS & JAVASCRIPT
-------------------------

Paleta de colores:
Azul
#1D8FF2
Verde suave
#1CA698
Verde mas intenso
#0F8C46
Amarillo 
#F29422
Blanco
#F2F2F2
gris
#888888
---------------------------

    font-family
Specifies a prioritized list of font family names or generic family names. A user agent iterates through the list of family names until it matches an available font that contains a glyph for the character to be rendered.
Learn more
Don't show
: Quicksand, sans-serif;

font-family: -apple-system, BlinkMacSystemFont, "Nunito Sans", sans-serif;
----------------------------

Estructura del proyecto:

/maestro-empleados/
├── index.html
├── empleados.html             ← Página principal de consultas
├── vacaciones.html            ← Control de vacaciones
├── historial.html             ← Ajustes salariales, historial por año
├── login.html                 ← (al final)
├── css/
│   └── estilos.css
├── js/
│   ├── main.js
│   ├── empleados.js
│   ├── vacaciones.js
│   ├── historial.js
│   └── auth.js                ← (al final)
├── data/
│   └── empleados.json         ← Datos locales si usas JSON como base
└── assets/
    └── logo.png
---------------------
Estructura explicada
HTML
index.html:
Página de bienvenida, navegación o dashboard general.

empleados.html:
Consulta de empleados por nombre, cédula, cargo, salario, etc.
→ Conectado con empleados.js.

vacaciones.html:
Aquí se implementará la tabla mensual de vacaciones por empleado (como la imagen que mostraste).
→ Conectado con vacaciones.js.

historial.html:
Historial de ajustes salariales y cambios por año.
→ Conectado con historial.js.

login.html:
Sistema de autenticación local si deseas proteger el acceso.
****
JavaScript
js/main.js:
Código común, navegación general, utilidades globales (validación, manejo de fechas, etc.).

js/empleados.js:
CRUD de empleados + filtros por nombre, cédula, posición, salario.

js/vacaciones.js:
Aquí se manejará el control mensual por empleado:

Añadir filas por mes

Calcular días automáticamente

Guardar en localStorage o empleados.json

Mostrar comentarios

js/historial.js:
Manejo del historial de ajustes salariales (por año, por monto, etc.).

js/auth.js:
Manejo de login/logout si decides añadir autenticación.
***
Datos
data/empleados.json:
Datos base si eliges cargar desde archivo (útil para exportar/importar).
→ Podría incluir también:

vacaciones.json

historial.json

--------------------

 Funcionalidades clave que implementaremos:
 Agregar empleados

 Buscar por cédula, nombre, código, etc.

 Listar todos los empleados

 Ver historial de vacaciones

 Ver historial de ajustes salariales

 Consultas por fecha (cumpleaños, ingreso, último aumento)

 Filtros: salario, departamento, posición

 Estadísticas básicas (promedios, totales)

 Todo 100% local (sin conexión)
----------------------------
Consultas sobre la tabla Empleados
Buscar empleado por nombre

Buscar empleado por cédula

Buscar por posición

Buscar por departamento

Filtrar empleados por fecha de ingreso (rango)

Filtrar empleados por fecha de cumpleaños (mes/día)

Filtrar por salario mensual mayor o menor a cierto monto

Buscar por estado (activo/inactivo)

Consultar empleados que no han tenido aumentos en cierto tiempo

Buscar por email

Filtrar empleados por cantidad de vacaciones pendientes

Listar empleados con vacaciones tomadas mayores a cierto número

Ordenar empleados por salario, nombre o fecha de ingreso

Buscar empleados que ingresaron en un año específico

Buscar empleados con salarios entre dos valores

Ver todos los empleados con sus datos completos

Buscar empleados con expenses mayores a cierto valor

Filtrar por empleados creados en una fecha específica

Consultas sobre la tabla hist_vacaciones
Ver historial de vacaciones por empleado

Filtrar vacaciones por año

Buscar por fecha de inicio/fin de vacaciones

Consultar total de días de vacaciones tomados por empleado

Filtrar por tipo de vacaciones (ej: normales, médicas, etc.)

Consultas sobre la tabla hist_ajustes
Ver historial de ajustes de salario por empleado
------------------
1. Diseño base y navegación (HTML + CSS + estructura)
Empieza por:

🔧 Estructura HTML mínima:
Crea las páginas vacías: index.html, empleados.html, vacaciones.html, historial.html

Añade una navbar reutilizable en cada una (copiada desde un solo archivo o como componente si luego usas algo como Vue o React).

Añade un logo, y títulos o secciones visibles para identificar en qué página estás.

CSS inicial:
Define los estilos base: fuente, colores, botones, navbar, contenedores.

Asegúrate de que sea responsive desde el inicio (flexbox o grid, media queries básicas).

Esto te permite ver el sistema moverse, ir de una sección a otra y probar la experiencia como usuario.

2. Carga y visualización de datos (JavaScript básico + JSON/LocalStorage)
Una vez tengas las páginas y navegación:

En empleados.html, crea la tabla que lea los datos desde un archivo empleados.json o desde localStorage.

Luego haz lo mismo en vacaciones.html y historial.html.

Así validas que tu sistema puede mostrar datos reales con estructura real.

3. Funciones de consulta y filtrado (JavaScript avanzado)
Ya con el diseño y datos cargando, ahora sí:

En empleados.js, implementa las consultas: por nombre, cédula, salario, fecha, etc.

Usa filtros dinámicos, buscadores, selectores, botones.

Esta es la parte que hace útil tu sistema.

4. Agregar y editar datos
Después, puedes agregar formularios para:

Agregar empleados

Registrar vacaciones

Editar historial

Ya el sistema se vuelve interactivo y útil para gestión completa.

5. Login y autenticación (si decides usarlo)
Esto puede venir al final:

Pantalla de login.html

Validación sencilla (ej: clave fija guardada en localStorage)

Redirección automática si no hay sesión activa

Orden sugerido final (por tareas)
Navbar + estructura de carpetas

- HTML base de todas las páginas

- CSS base para estilos compartidos

- Lectura y visualización de datos en empleados.html

- Consulta/filtros

- Vacaciones + historial

- Formularios para agregar/editar

- Login











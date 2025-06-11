# 📚 Librería

Este proyecto es un monorepo compuesto de dos proyectos: Backend y Frontend para la gestión de una web destinada a la venta de libros

---

## 🚀 Requisitos

- Node.js v22 (si lo ejecutás sin Docker)
- Docker y Docker Compose (recomendado)
- MySQL Workbench u otro cliente para conectarse a la base de datos (opcional)

---

## 🐳 Ejecución con Docker (recomendado) -> Genera y levanta Back y Front

1. **Construcción y ejecución del contenedor**:

   ```bash
   docker-compose -p libreria up --build
   ```

2. **Si ocurre un error con la base de datos** (contenedor mal creado, datos corruptos, etc.), podés reiniciar todo limpiamente:

   ```bash
   docker-compose down -v
   ```

3. **Datos de conexión a la base de datos (MySQL)**:

   Podés conectarte con MySQL Workbench o cualquier cliente compatible usando los siguientes datos:

   ```
   Host:         localhost o 127.0.0.1
   Puerto:       3307
   Usuario:      user
   Contraseña:   password
   Base de datos: tienda_libros
   ```

   ⚠️ Asegurate de que el contenedor esté levantado, de lo contrario no podrás conectarte.

---

## 🛠️ Ejecución local (sin Docker)

### Backend:

1. Ingresa a la carpeta de backend:

   ```bash
   cd backend
   ```

2. Instalá globalmente las siguientes herramientas si no las tenés:

   ```bash
   npm install -g ts-node nodemon typescript
   ```

3. Instalá las dependencias del proyecto:

   ```bash
   npm install
   ```

4. Asegurate de tener una base de datos MySQL disponible (local o remota) y actualizá el archivo `.env` con los datos de conexión:

   ```env
   DB_HOST=localhost
   DB_USER=user
   DB_PASSWORD=password
   DB_NAME=tienda_libros
   DB_PORT=3307
   ```

5. Corre la aplicación:
   ```bash
   npm run dev
   ```

## Frontend

1. Ingresa a la carpeta de frontend:

   ```bash
   cd frontend
   ```

2. Instalá las dependencias del proyecto:

   ```bash
   npm install
   ```

3. Corre la aplicación:
   ```bash
   npm run dev
   ```

---

## 🛠️ Inicializacióm de los datos

1. Lo primero que debe hacer una vez iniciada la aplicación, desde otra terminal, es ejecutar la sincronización de los modelos del sistema:

   ```bash
   npm run syncModels
   ```

   Corriendo la sincronización de esa forma, es por default. En el siguiente cuadro se muestran las diferentes opciones:
   | Command | Description |
   | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
   | `npm run syncModels` | Sincroniza todos los modelos a la BD por primera vez (default alter: true, force: false). |
   | `npm run syncModels -- <ModelName> --alter (-a) --force (-f) --associations (-A)` | Sincronizar con opciones |

   alter -> Modifica los cambios en la estructura sin tocar los datos existentes.

   force -> Borra todos los datos y modifica la estructura (para limpiar todo de cero)

   associations -> Registra las asociaciones de lo modelos antes de sincronizar. Esto sirve para crear los relaciones en las tablas.

2. Para el uso de la aplicación son necesarios datos de inicio. Para ello correremos un comando 'seed' para insertar estos primeros registros:
   ```bash
   npm run seed
   ```
   Con este comando se instalará:

- Administrador -> Se configura en el .env
- Libros de muestra

      nota: Una vez acceda con ese admin por primera vez. Le pedirá cambiar de contraseña.

3. .env de Ejemplo:

   ```env
      PORT=3001

      DB_HOST=mysql
      DB_USER=user
      DB_PASSWORD=password
      DB_NAME=tienda_libros
      DB_PORT=3306

      JWT_SECRET=

      API_BASE_URL_V1=/api/v1

      SMTP_HOST=
      SMTP_PORT=
      SMTP_USER=
      SMTP_PASS=
      SMTP_NAME=
      SMTP_SECURE=

      SUPER_ADMIN_NAME=admin
      SUPER_ADMIN_EMAIL=
      SUPER_ADMIN_PASSWORD=admin1234
   ```

## 🧪 Tecnologías

- Node.js 22
- TypeScript 5.7.3
- Sequelize ORM
- MySQL

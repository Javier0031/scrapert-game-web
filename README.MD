# Scrapert Game

Aplicación web educativa e interactiva diseñada para la resolución de desafíos mediante actividades didácticas. Desarrollada con una arquitectura cliente-servidor moderna.

## Tecnologías y Arquitectura en la Nube (Cloud)

El proyecto ha sido desplegado exitosamente en internet utilizando infraestructura gratuita de grado profesional para garantizar su disponibilidad:

* **Frontend (Interfaz de Usuario):** Desarrollado con **React + Vite**. Desplegado y alojado en **Vercel**.
* **Backend (Servidor/API):** Construido con **Node.js y Express**. Desplegado y alojado en **Render** con soporte SSL.
* **Base de Datos:** Estructurada en **MySQL**. Alojada de forma remota y segura en **Aiven**.

---

## Enlaces de Producción

El proyecto se encuentra 100% funcional en la nube. Puede ser evaluado directamente desde cualquier navegador web sin necesidad de configuración local a través del siguiente enlace:

* **Aplicación Web (Juego en vivo):** https://scrapert-game-web.vercel.app
* **API del Servidor (Backend):** https://scrapert-game-web.onrender.com

---

## Instrucciones para Ejecución Local

Si el evaluador requiere analizar y ejecutar el código fuente en un entorno local (localhost), debe seguir estrictamente los siguientes pasos.

### Requisitos Previos
* Node.js instalado (versión 16 o superior).
* Gestor de base de datos MySQL local (ej. XAMPP, WAMP, MySQL Workbench).

### 1. Configuración de la Base de Datos
1. Inicie su servidor MySQL local.
2. Ejecute el script SQL proporcionado en la raíz del proyecto (`bd_scrapert_game.sql`) en su gestor de bases de datos. Esto creará automáticamente la base de datos, la estructura de tablas y los registros requeridos para el funcionamiento del juego.

### 2. Configuración del Backend (Servidor)
1. Abra una terminal y navegue hacia el directorio del servidor:
   ```bash
   cd servidor
   ```
2. Instale las dependencias requeridas:
   ```bash
   npm install
   ```
3. Verifique que las variables de entorno en el archivo `.env` apunten a su configuración local (usualmente puerto 3306 y usuario root sin contraseña en XAMPP):
   ```env
   BD_HOST=localhost
   BD_USUARIO=root
   BD_CLAVE=
   BD_NOMBRE=bd_scrapert_game
   BD_PUERTO=3306
   ORIGEN_PERMITIDO=http://localhost:5173
   PORT=4000
   ```
4. Inicie el servidor:
   ```bash
   npm start
   ```
   El servicio confirmará la conexión a la base de datos y estará escuchando en el puerto 4000.

### 3. Configuración del Frontend (Cliente)
1. Abra una nueva terminal y navegue hacia el directorio del cliente:
   ```bash
   cd cliente
   ```
2. Instale las dependencias de la interfaz:
   ```bash
   npm install
   ```
3. Inicie el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. Acceda a la aplicación en su navegador web a través de la dirección generada, típicamente `http://localhost:5173`.

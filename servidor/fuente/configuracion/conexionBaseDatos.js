import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Pool de conexiones concurrentes a MySQL
export const grupoConexiones = mysql.createPool({
    host: process.env.BD_HOST || 'localhost',
    user: process.env.BD_USUARIO || 'root',
    password: process.env.BD_CLAVE || '',
    database: process.env.BD_NOMBRE || 'bd_scrapert_game',
    port: Number(process.env.BD_PUERTO) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false } // Obligatorio para Aiven
});

// Comprobación inicial de enlace
grupoConexiones.getConnection()
    .then((enlace) => {
        console.log(' Conexión establecida con la base de datos MySQL (bd_scrapert_game)');
        enlace.release();
    })
    // Reemplaza el bloque .catch por este:
grupoConexiones.getConnection()
    .then((enlace) => {
        console.log(' Conexión establecida con la base de datos MySQL (bd_scrapert_game)');
        enlace.release();
    })
    .catch((error) => {
        console.error(' Error de conexión con MySQL:');
        console.error('Código de error:', error.code);
        console.error('Mensaje detallado:', error.sqlMessage || error.message);
    });
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importación de enrutadores
import rutasActividades from './rutas/actividadesRutas.js';
import rutasEstudiantes from './rutas/estudiantesRutas.js';
import rutasProgresos from './rutas/progresosRutas.js';
import rutasCuadroHonor from './rutas/cuadroHonorRutas.js';

dotenv.config();

const aplicacion = express();
const puerto = Number(process.env.PUERTO_SERVIDOR) || 4000;

// Configuración de CORS
aplicacion.use(cors({
  origin: true,
  credentials: true
}));

aplicacion.use(express.json());

// Registro de endpoints de la API REST
aplicacion.use('/api/actividades', rutasActividades);
aplicacion.use('/api/estudiantes', rutasEstudiantes);
aplicacion.use('/api/progresos', rutasProgresos);
aplicacion.use('/api/cuadro-honor', rutasCuadroHonor);

// Verificación de estado de la API
aplicacion.get('/api/estado', (peticion, respuesta) => {
  respuesta.json({ 
    proyecto: 'Scrapert Game API', 
    estado: 'operativo', 
    tiempo: new Date().toISOString() 
  });
});

aplicacion.listen(puerto, () => {
  console.log(` Servidor de Scrapert Game activo en: http://localhost:${puerto}`);
});
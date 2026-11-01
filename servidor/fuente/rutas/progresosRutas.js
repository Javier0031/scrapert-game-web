import { Router } from 'express';
import { 
  registrarProgresoPartida, 
  obtenerReportesDocentes 
} from '../controladores/progresosControlador.js';

const enrutador = Router();

// Endpoint para guardar partidas
enrutador.post('/', registrarProgresoPartida);

// Endpoint para obtener la auditoría del panel docente
enrutador.get('/reportes', obtenerReportesDocentes);

export default enrutador;
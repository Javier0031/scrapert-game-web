import { Router } from 'express';
import { ingresarEstudiante, listarEstudiantes } from '../controladores/estudiantesControlador.js';

const enrutador = Router();
enrutador.post('/ingreso', ingresarEstudiante);
enrutador.get('/', listarEstudiantes);

export default enrutador;
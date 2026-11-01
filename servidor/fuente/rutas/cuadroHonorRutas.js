import { Router } from 'express';
import { obtenerCuadroHonor } from '../controladores/cuadroHonorControlador.js';

const enrutador = Router();

enrutador.get('/', obtenerCuadroHonor);

export default enrutador;
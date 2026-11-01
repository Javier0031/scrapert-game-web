import { Router } from 'express';
import { listarActividades } from '../controladores/actividadesControlador.js';

const enrutador = Router();
enrutador.get('/', listarActividades);

export default enrutador;
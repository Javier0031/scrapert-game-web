import { grupoConexiones } from '../configuracion/conexionBaseDatos.js';

export const listarActividades = async (peticion, respuesta) => {
    try {
        const consulta = `
            SELECT a.id, a.codigo_referencia, a.titulo, a.instrucciones, 
                   a.puntos_recompensa, c.nombre AS categoria, c.nivel_educativo
            FROM actividades a
            INNER JOIN categorias c ON a.categoria_id = c.id
            WHERE a.esta_activa = TRUE
            ORDER BY c.id ASC, a.id ASC
        `;
        const [filas] = await grupoConexiones.query(consulta);
        return respuesta.json({ exito: true, datos: filas });
    } catch (error) {
        return respuesta.status(500).json({ 
            exito: false, 
            mensaje: 'Error al consultar el catálogo de actividades', 
            detalle: error.message 
        });
    }
};
import { grupoConexiones } from '../configuracion/conexionBaseDatos.js';

export const obtenerCuadroHonor = async (peticion, respuesta) => {
  try {
    const consulta = `
      SELECT 
        e.id, 
        e.nombre, 
        e.icono_avatar,
        COALESCE(SUM(p.puntos_obtenidos), 0) AS puntaje_total,
        COALESCE(SUM(p.puntos_obtenidos), 0) AS puntos_totales,
        COUNT(p.id) AS partidas_jugadas
      FROM estudiantes e
      INNER JOIN progresos_juegos p ON e.id = p.estudiante_id
      GROUP BY e.id, e.nombre, e.icono_avatar
      ORDER BY puntaje_total DESC
      LIMIT 10;
    `;

    const [mejoresJugadores] = await grupoConexiones.query(consulta);

    // Se envían 'datos' y 'ranking' para máxima compatibilidad con el frontend
    return respuesta.json({ 
      exito: true, 
      datos: mejoresJugadores,
      ranking: mejoresJugadores 
    });
  } catch (error) {
    return respuesta.status(500).json({
      exito: false,
      mensaje: 'Error al obtener la tabla de líderes',
      detalle: error.message
    });
  }
};
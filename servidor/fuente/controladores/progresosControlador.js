import { grupoConexiones } from '../configuracion/conexionBaseDatos.js';

// RF-05: Guardar el progreso y resultados de una partida en MySQL
export const registrarProgresoPartida = async (peticion, respuesta) => {
  try {
    const { 
      estudiante_id, 
      actividad_id, 
      puntos_obtenidos, 
      aciertos, 
      fallos, 
      duracion_segundos 
    } = peticion.body;

    const consulta = `
      INSERT INTO progresos_juegos 
      (estudiante_id, actividad_id, puntos_obtenidos, aciertos, fallos, duracion_segundos) 
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const [resultado] = await grupoConexiones.query(consulta, [
      estudiante_id,
      actividad_id,
      puntos_obtenidos || 0,
      aciertos || 0,
      fallos || 0,
      duracion_segundos || 0
    ]);

    return respuesta.json({
      exito: true,
      mensaje: 'Progreso registrado exitosamente',
      idInsertado: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar progreso:', error);
    return respuesta.status(500).json({
      exito: false,
      mensaje: 'Error al registrar progreso de la partida',
      detalle: error.message
    });
  }
};

// RF-06 y RF-08: Reportes pedagógicos con filtro por estudiante para el panel docente
export const obtenerReportesDocentes = async (peticion, respuesta) => {
  try {
    const { filtro_estudiante } = peticion.query;

    let consulta = `
      SELECT 
        p.id,
        p.estudiante_id,
        e.nombre AS estudiante_nombre,
        e.icono_avatar,
        e.edad AS estudiante_edad,
        a.titulo AS actividad_titulo,
        a.codigo_referencia,
        p.puntos_obtenidos,
        p.aciertos,
        p.fallos,
        p.duracion_segundos
      FROM progresos_juegos p
      INNER JOIN estudiantes e ON p.estudiante_id = e.id
      INNER JOIN actividades a ON p.actividad_id = a.id
    `;

    const parametros = [];

    if (filtro_estudiante && filtro_estudiante !== 'todos') {
      consulta += ` WHERE p.estudiante_id = ? `;
      parametros.push(filtro_estudiante);
    }

    consulta += ` ORDER BY p.id DESC LIMIT 100;`;

    const [filas] = await grupoConexiones.query(consulta, parametros);

    return respuesta.json({
      exito: true,
      datos: filas
    });
  } catch (error) {
    console.error('Error al obtener reportes docentes:', error);
    return respuesta.status(500).json({
      exito: false,
      mensaje: 'Error al obtener reportes docentes',
      detalle: error.message
    });
  }
};
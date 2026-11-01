//const URL_BASE = 'http://localhost:4000/api';
const URL_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const servicioApi = {
  // RF-01: Registro o ingreso de niño
  async ingresarEstudiante(datosEstudiante) {
    try {
      const respuesta = await fetch(`${URL_BASE}/estudiantes/ingreso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEstudiante)
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error al ingresar estudiante:', error);
      return { exito: false, mensaje: 'Error de conexión con el servidor' };
    }
  },

  // RF-07: Catálogo de actividades desde MySQL
  async obtenerActividades() {
    try {
      const respuesta = await fetch(`${URL_BASE}/actividades`);
      return await respuesta.json();
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      return { exito: false, datos: [] };
    }
  },

  // RF-05: Enviar progreso de partida a MySQL
  async guardarResultadoPartida(datosProgreso) {
    try {
      const respuesta = await fetch(`${URL_BASE}/progresos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosProgreso)
      });
      return await respuesta.json();
    } catch (error) {
      console.error('Error al guardar partida:', error);
      return { exito: false, mensaje: 'Error al registrar el progreso' };
    }
  },

  // Starboard / Cuadro de Honor
  async obtenerCuadroHonor() {
    try {
      const respuesta = await fetch(`${URL_BASE}/cuadro-honor`);
      return await respuesta.json();
    } catch (error) {
      console.error('Error al consultar el cuadro de honor:', error);
      return { exito: false, datos: [], ranking: [] };
    }
  },

  // RF-06 y RF-08: Reportes docentes con filtro
  async obtenerReportesDocentes(idEstudiante = '') {
    try {
      const url = idEstudiante 
        ? `${URL_BASE}/progresos/reportes?filtro_estudiante=${idEstudiante}`
        : `${URL_BASE}/progresos/reportes`;
      const respuesta = await fetch(url);
      return await respuesta.json();
    } catch (error) {
      console.error('Error al obtener reportes docentes:', error);
      return { exito: false, datos: [] };
    }
  }
};
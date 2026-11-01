import { grupoConexiones } from '../configuracion/conexionBaseDatos.js';

// Registrar o iniciar sesión simple con nombre y edad
export const ingresarEstudiante = async (peticion, respuesta) => {
    const { nombre, edad, icono_avatar } = peticion.body;

    if (!nombre || !edad) {
        return respuesta.status(400).json({ 
            exito: false, 
            mensaje: 'El nombre y la edad son obligatorios' 
        });
    }

    try {
        const consultaExistente = 'SELECT * FROM estudiantes WHERE LOWER(nombre) = LOWER(?) LIMIT 1';
        const [coincidencias] = await grupoConexiones.query(consultaExistente, [nombre.trim()]);

        if (coincidencias.length > 0) {
            return respuesta.json({
                exito: true,
                mensaje: 'Bienvenido de nuevo',
                estudiante: coincidencias[0]
            });
        }

        const avatarFinal = icono_avatar || 'gato_scrapert';
        const insercion = 'INSERT INTO estudiantes (nombre, edad, icono_avatar) VALUES (?, ?, ?)';
        const [resultado] = await grupoConexiones.query(insercion, [nombre.trim(), Number(edad), avatarFinal]);

        return respuesta.status(201).json({
            exito: true,
            mensaje: 'Estudiante registrado correctamente',
            estudiante: {
                id: resultado.insertId,
                nombre: nombre.trim(),
                edad: Number(edad),
                icono_avatar: avatarFinal
            }
        });
    } catch (error) {
        return respuesta.status(500).json({ 
            exito: false, 
            mensaje: 'No fue posible registrar al estudiante', 
            detalle: error.message 
        });
    }
};

export const listarEstudiantes = async (peticion, respuesta) => {
    try {
        const [estudiantes] = await grupoConexiones.query(
            'SELECT id, nombre, edad, icono_avatar FROM estudiantes ORDER BY nombre ASC'
        );
        return respuesta.json({ exito: true, datos: estudiantes });
    } catch (error) {
        return respuesta.status(500).json({ 
            exito: false, 
            mensaje: 'Error al obtener los estudiantes', 
            detalle: error.message 
        });
    }
};
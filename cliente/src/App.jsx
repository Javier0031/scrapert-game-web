import React, { useState, useEffect } from 'react';
import PantallaIngreso from './vistas/PantallaIngreso.jsx';
import MenuPrincipal from './vistas/MenuPrincipal.jsx';
import CuadroHonor from './vistas/CuadroHonor.jsx';
import PanelDocente from './vistas/PanelDocente.jsx';
import JuegoEspacial from './juegos/JuegoEspacial.jsx';
import JuegoFiguras from './juegos/JuegoFiguras.jsx';
import JuegoMemoria from './juegos/JuegoMemoria.jsx';
import JuegoMixto from './juegos/JuegoMixto.jsx';
import JuegoMultiplicar from './juegos/JuegoMultiplicar.jsx';
import JuegoQuebrados from './juegos/JuegoQuebrados.jsx';
import JuegoDecimales from './juegos/JuegoDecimales.jsx';
import JuegoTeleColores from './juegos/JuegoTeleColores.jsx';
import { musicaGlobal } from './utilidades/musicaFondo.js';
import './estilos/principal.css';

export default function App() {
  const [estudianteActivo, setEstudianteActivo] = useState(null);
  const [vistaActual, setVistaActual] = useState('ingreso'); 
  const [juegoActivo, setJuegoActivo] = useState(null);

  // Sincronización de música por vista
  useEffect(() => {
    if (vistaActual === 'ingreso' || vistaActual === 'menu' || vistaActual === 'cuadro_honor' || vistaActual === 'panel_docente') {
      const pistaActual = musicaGlobal.obtenerPistaActual();
      if (!pistaActual.startsWith('menu_')) {
        musicaGlobal.cambiarPista('menu_1');
      }
    } else if (vistaActual === 'jugando' && juegoActivo) {
      const ref = juegoActivo.codigo_referencia || '';
      if (ref.startsWith('espacial_')) {
        musicaGlobal.cambiarPista('espacial');
      } else if (ref === 'figuras_geometricas') {
        musicaGlobal.cambiarPista('figuras');
      } else if (ref === 'memoria_parejas') {
        musicaGlobal.cambiarPista('memoria');
      } else if (ref === 'desafio_mixto_preprimaria' || ref.includes('tele') || ref.includes('color') || ref.includes('stroop')) {
        musicaGlobal.cambiarPista('desafio');
      } else if (ref.includes('decimal') || ref.includes('tiendita')) {
        musicaGlobal.cambiarPista('figuras');
      } else if (ref === 'tablas_multiplicar' || ref.includes('multiplica')) {
        musicaGlobal.cambiarPista('desafio');
      } else if (ref.includes('quebrados') || ref.includes('fraccion')) {
        musicaGlobal.cambiarPista('figuras');
      }
    }
  }, [vistaActual, juegoActivo]);

  const manejarIngresoEstudiante = (datosEstudiante) => {
    setEstudianteActivo(datosEstudiante);
    setVistaActual('menu');
  };

  const manejarSeleccionarJuego = (actividad) => {
    setJuegoActivo(actividad);
    setVistaActual('jugando');
  };

  // Enrutador exclusivo: solo un juego se ejecuta a la vez
  const renderizarJuegoActivo = () => {
    const ref = juegoActivo?.codigo_referencia || '';

    // 1. Pre-Primaria: Aventura Espacial
    if (ref.startsWith('espacial_')) {
      return (
        <JuegoEspacial
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 2. Pre-Primaria: Figuras Geométricas
    if (ref === 'figuras_geometricas') {
      return (
        <JuegoFiguras
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 3. Pre-Primaria: Memoria de Patitas
    if (ref === 'memoria_parejas') {
      return (
        <JuegoMemoria
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 4. Pre-Primaria: El Gran Desafío de Scrapert
    if (ref === 'desafio_mixto_preprimaria') {
      return (
        <JuegoMixto
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 5. Primaria: La Tele Mágica de Colores
    if (ref === 'tele_magica_colores' || ref.includes('tele') || ref.includes('color') || ref.includes('stroop')) {
      return (
        <JuegoTeleColores
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 6. Primaria: La Tiendita Decimal
    if (ref === 'multiplicacion_decimales' || ref.includes('decimal') || ref.includes('tiendita')) {
      return (
        <JuegoDecimales
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 7. Primaria: Carrera de Multiplicar
    if (ref === 'tablas_multiplicar' || ref.includes('multiplica')) {
      return (
        <JuegoMultiplicar
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    // 8. Primaria: Suma de Quebrados
    if (ref === 'suma_quebrados' || ref.includes('quebrados') || ref.includes('fraccion')) {
      return (
        <JuegoQuebrados
          actividad={juegoActivo}
          estudiante={estudianteActivo}
          alVolverAlMenu={() => setVistaActual('menu')}
        />
      );
    }

    return (
      <div className="tarjeta-juego" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--color-texto-oscuro)', marginBottom: '1rem' }}>
          Actividad: {juegoActivo?.titulo}
        </h2>
        <button 
          className="boton-juguete boton-coral" 
          onClick={() => setVistaActual('menu')}
        >
          Volver al Menú
        </button>
      </div>
    );
  };

  return (
    <main style={{ minHeight: '100vh', padding: '1rem' }}>
      {/* 1. Ingreso de Estudiante */}
      {vistaActual === 'ingreso' && (
        <PantallaIngreso 
          alIngresarEstudiante={manejarIngresoEstudiante}
          alAbrirPanelDocente={() => setVistaActual('panel_docente')}
          alAbrirCuadroHonor={() => setVistaActual('cuadro_honor')}
        />
      )}

      {/* 2. Menú Principal */}
      {vistaActual === 'menu' && (
        <MenuPrincipal
          estudiante={estudianteActivo}
          alSeleccionarJuego={manejarSeleccionarJuego}
          alCerrarSesion={() => {
            setEstudianteActivo(null);
            setVistaActual('ingreso');
          }}
          alIrCuadroHonor={() => setVistaActual('cuadro_honor')}
          alAbrirPanelDocente={() => setVistaActual('panel_docente')}
          alIrPanelDocente={() => setVistaActual('panel_docente')}
        />
      )}

      {/* 3. Juegos en Ejecución */}
      {vistaActual === 'jugando' && renderizarJuegoActivo()}

      {/* 4. Cuadro de Honor (Starboard) */}
      {vistaActual === 'cuadro_honor' && (
        <CuadroHonor
          estudiante={estudianteActivo}
          alVolver={() => setVistaActual(estudianteActivo ? 'menu' : 'ingreso')}
        />
      )}

      {/* 5. Panel Docente Protegido por PIN */}
      {vistaActual === 'panel_docente' && (
        <PanelDocente
          alVolver={() => setVistaActual(estudianteActivo ? 'menu' : 'ingreso')}
        />
      )}
    </main>
  );
}
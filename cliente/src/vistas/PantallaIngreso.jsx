import React, { useState } from 'react';
import MascotaScrapert from '../componentes/MascotaScrapert';
import { servicioApi } from '../servicios/servicioApi';
import { Sparkles, GraduationCap, Play } from 'lucide-react';

const AVATARES_DISPONIBLES = [
  { id: 'gato_scrapert', emoji: '🐱', etiqueta: 'Scrapert', colorFondo: 'var(--color-rosa-texas)' },
  { id: 'cohete_veloz', emoji: '🚀', etiqueta: 'Cohete', colorFondo: 'var(--color-cielo-verano)' },
  { id: 'estrella_brillante', emoji: '⭐', etiqueta: 'Estrella', colorFondo: 'var(--color-turquesa-suave)' },
  { id: 'leon_valiente', emoji: '🦁', etiqueta: 'León', colorFondo: 'var(--color-mona-lisa)' },
  { id: 'delfin_alegre', emoji: '🐬', etiqueta: 'Delfín', colorFondo: 'var(--color-azul-pizarra)' }
];

export default function PantallaIngreso({ alIngresarEstudiante, alAbrirPanelDocente, alAbrirCuadroHonor }) {
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState(5);
  const [avatarSeleccionado, setAvatarSeleccionado] = useState('gato_scrapert');
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  const manejarEnvioFormulario = async (evento) => {
    evento.preventDefault();
    if (!nombre.trim()) {
      setMensajeError('¡Escribe tu nombre para empezar a jugar!');
      return;
    }

    setCargando(true);
    setMensajeError('');

    try {
      const respuesta = await servicioApi.ingresarEstudiante({
        nombre: nombre.trim(),
        edad: Number(edad),
        icono_avatar: avatarSeleccionado
      });

      if (respuesta.exito) {
        alIngresarEstudiante(respuesta.estudiante);
      } else {
        setMensajeError(respuesta.mensaje || 'Ocurrió un problema al iniciar.');
      }
    } catch (error) {
      setMensajeError('No se pudo conectar al servidor. Revisa que el backend esté encendido.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      
      {/* Banner superior al estilo de la guía de diseño */}
      <div className="cartel-cabecera">
        <span>01</span>
        <span>•</span>
        <span>Scrapert Game</span>
      </div>

      {/* Mascota con sus expresiones dinámicas */}
      <MascotaScrapert 
        animacion={cargando ? 'pensando' : 'reposo'} 
        mensaje={cargando ? '¡Abriendo tu libro de juegos...!' : '¡Hola! Escribe tu nombre y elige tu avatar favorito'} 
        tamano={150}
      />

      <div className="tarjeta-juego" style={{ width: '100%' }}>
        {mensajeError && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px',
            borderRadius: '16px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '1.2rem',
            border: '2px solid #FCA5A5'
          }}>
            {mensajeError}
          </div>
        )}

        <form onSubmit={manejarEnvioFormulario} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          
          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-texto-oscuro)' }}>
              ¿Cuál es tu nombre?
            </label>
            <input 
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Escribe tu nombre..."
              style={{
                width: '100%',
                padding: '14px 18px',
                fontSize: '1.15rem',
                borderRadius: '16px',
                border: '2.5px solid #CBD5E1',
                outline: 'none',
                fontWeight: 600,
                color: 'var(--color-texto-oscuro)',
                backgroundColor: '#FAFCFE'
              }}
              maxLength={25}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-texto-oscuro)' }}>
              ¿Cuántos años tienes? ({edad} años)
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[4, 5, 6, 7, 8, 9, 10, 11, 12].map((numeroEdad) => {
                const estaSeleccionado = edad === numeroEdad;
                return (
                  <button
                    type="button"
                    key={numeroEdad}
                    onClick={() => setEdad(numeroEdad)}
                    style={{
                      flex: '1 0 18%',
                      padding: '10px',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      borderRadius: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: estaSeleccionado ? 'var(--color-cielo-verano)' : '#EDF2F7',
                      color: estaSeleccionado ? '#FFFFFF' : 'var(--color-texto-oscuro)',
                      boxShadow: estaSeleccionado ? '0 4px 0 var(--color-cielo-verano-sombra)' : 'none',
                      transform: estaSeleccionado ? 'translateY(-2px)' : 'none',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    {numeroEdad}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--color-texto-oscuro)' }}>
              Elige tu avatar:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {AVATARES_DISPONIBLES.map((avatar) => {
                const seleccionado = avatarSeleccionado === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => setAvatarSeleccionado(avatar.id)}
                    className={`ficha-elemento ${seleccionado ? 'seleccionada' : ''}`}
                    style={{ padding: '8px 4px 0 4px' }}
                  >
                    <span style={{ fontSize: '2.2rem', margin: '4px 0' }}>{avatar.emoji}</span>
                    <div 
                      className="etiqueta-ficha" 
                      style={{ 
                        backgroundColor: avatar.colorFondo, 
                        color: '#FFFFFF' 
                      }}
                    >
                      {avatar.etiqueta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="boton-juguete boton-verde" 
            disabled={cargando}
            style={{ width: '100%', marginTop: '0.8rem', fontSize: '1.3rem', padding: '14px' }}
          >
            <Play size={24} fill="white" />
            {cargando ? 'Ingresando...' : '¡A Jugar!'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '1.6rem',
          paddingTop: '1.2rem',
          borderTop: '2px dashed #E2E8F0'
        }}>
          <button
            type="button"
            onClick={alAbrirCuadroHonor}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-rosa-texas)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={20} />
            Cuadro de Honor
          </button>

          <button
            type="button"
            onClick={alAbrirPanelDocente}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-texto-suave)',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <GraduationCap size={20} />
            Docentes
          </button>
        </div>
      </div>
    </div>
  );
}
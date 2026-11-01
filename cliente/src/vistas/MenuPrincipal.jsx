import React, { useState, useEffect } from 'react';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import BarraSuperior from '../componentes/BarraSuperior.jsx';
import ModalComoJugar from '../componentes/ModalComoJugar.jsx';
import { servicioApi } from '../servicios/servicioApi.js';
import { Play, Sparkles, BookOpen, BrainCircuit, HelpCircle, Lock, Trophy } from 'lucide-react';

export default function MenuPrincipal({ estudiante, alSeleccionarJuego, alCerrarSesion, alIrCuadroHonor }) {
  const [listaActividades, setListaActividades] = useState([]);
  const [juegosJugadosCodigos, setJuegosJugadosCodigos] = useState([]);
  const [nivelElegido, setNivelElegido] = useState(
    estudiante?.edad <= 6 ? 'pre_primaria' : 'primaria'
  );
  const [estaCargando, setEstaCargando] = useState(true);
  const [actividadAyudaSeleccionada, setActividadAyudaSeleccionada] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, [estudiante?.id]);

  const cargarDatos = async () => {
    try {
      const [respActividades, respReportes] = await Promise.all([
        servicioApi.obtenerActividades(),
        servicioApi.obtenerReportesDocentes(estudiante?.id)
      ]);

      if (respActividades.exito) {
        setListaActividades(respActividades.datos);
      }

      if (respReportes.exito) {
        // Extraer los títulos jugados por el estudiante
        const titulosJugados = respReportes.datos.map((r) => r.juego || r.actividad_titulo || '');
        setJuegosJugadosCodigos(titulosJugados);
      }
    } catch (error) {
      console.error('Error al cargar datos del menú:', error);
    } finally {
      setEstaCargando(false);
    }
  };

  // Requisitos para desbloquear el reto mixto
  const jugoEspacial = juegosJugadosCodigos.some((t) => t?.includes('Aventura Espacial') || t?.includes('Adentro'));
  const jugoFiguras = juegosJugadosCodigos.some((t) => t?.includes('Figuras'));
  const jugoMemoria = juegosJugadosCodigos.some((t) => t?.includes('Memoria'));

  const juegosCompletadosCount = (jugoEspacial ? 1 : 0) + (jugoFiguras ? 1 : 0) + (jugoMemoria ? 1 : 0);
  const retoMixtoDesbloqueado = juegosCompletadosCount === 3;

  const actividadesFiltradas = listaActividades.filter(
    (actividad) => actividad.nivel_educativo === nivelElegido
  );

  const paletaTarjetas = [
    { boton: 'boton-cielo', etiqueta: 'var(--color-cielo-verano)' },
    { boton: 'boton-verde', etiqueta: 'var(--color-verde-pastel)' },
    { boton: 'boton-amatista', etiqueta: 'var(--color-amatista)' },
    { boton: 'boton-coral', etiqueta: 'var(--color-mona-lisa)' },
    { boton: 'boton-naranja', etiqueta: 'var(--color-rosa-texas)' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '1rem auto', padding: '0 1rem' }}>
      <BarraSuperior 
        estudiante={estudiante} 
        alCerrarSesion={alCerrarSesion} 
        alIrCuadroHonor={alIrCuadroHonor} 
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <MascotaScrapert 
          animacion="reposo" 
          mensaje={
            retoMixtoDesbloqueado 
              ? `¡Felicidades ${estudiante?.nombre}! ¡Desbloqueaste El Gran Desafío de Scrapert!` 
              : `¡Juega los 3 juegos de Pre-Primaria para desbloquear el Gran Desafío!`
          } 
          tamano={130} 
        />
      </div>

      {/* Selectores de Nivel */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '2rem' }}>
        <button
          type="button"
          onClick={() => setNivelElegido('pre_primaria')}
          className={`boton-juguete ${nivelElegido === 'pre_primaria' ? 'boton-turquesa' : ''}`}
          style={{
            backgroundColor: nivelElegido === 'pre_primaria' ? undefined : '#EDF2F7',
            color: nivelElegido === 'pre_primaria' ? undefined : '#64748B',
            boxShadow: nivelElegido === 'pre_primaria' ? undefined : 'none'
          }}
        >
          <BookOpen size={20} />
          Pre-Primaria
        </button>

        <button
          type="button"
          onClick={() => setNivelElegido('primaria')}
          className={`boton-juguete ${nivelElegido === 'primaria' ? 'boton-amatista' : ''}`}
          style={{
            backgroundColor: nivelElegido === 'primaria' ? undefined : '#EDF2F7',
            color: nivelElegido === 'primaria' ? undefined : '#64748B',
            boxShadow: nivelElegido === 'primaria' ? undefined : 'none'
          }}
        >
          <BrainCircuit size={20} />
          Primaria
        </button>
      </div>

      {/* Grid de Actividades */}
      {estaCargando ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 800, color: '#64748B' }}>
          Cargando catálogo desde la base de datos...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {actividadesFiltradas.map((actividad, indice) => {
            const estiloColor = paletaTarjetas[indice % paletaTarjetas.length];
            const esElRetoMixto = actividad.codigo_referencia === 'desafio_mixto_preprimaria';
            const estaBloqueado = esElRetoMixto && !retoMixtoDesbloqueado;

            return (
              <div 
                key={actividad.id}
                className="tarjeta-juego"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.5rem',
                  borderTop: esElRetoMixto ? '6px solid var(--color-amatista)' : `6px solid ${estiloColor.etiqueta}`,
                  backgroundColor: estaBloqueado ? '#F8FAFC' : '#FFFFFF',
                  opacity: estaBloqueado ? 0.85 : 1,
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: esElRetoMixto ? 'var(--color-amatista)' : estiloColor.etiqueta,
                      backgroundColor: '#F8FAFC',
                      padding: '4px 10px',
                      borderRadius: '10px'
                    }}>
                      {actividad.categoria}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      color: 'var(--color-rosa-texas)'
                    }}>
                      <Sparkles size={16} />
                      +{actividad.puntos_recompensa} pts
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginBottom: '8px' }}>
                    {actividad.titulo}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--color-texto-suave)', lineHeight: 1.4, marginBottom: '1.2rem' }}>
                    {actividad.instrucciones}
                  </p>
                </div>

                {/* Si está bloqueado, mostrar barra de requisitos */}
                {estaBloqueado ? (
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '2px solid #FCD34D',
                    borderRadius: '16px',
                    padding: '12px',
                    textAlign: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#B45309', fontWeight: 900 }}>
                      <Lock size={18} />
                      <span>Bloqueado ({juegosCompletadosCount} de 3 completados)</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#78350F', display: 'block', marginTop: '4px', fontWeight: 700 }}>
                      Juega Espacial, Figuras y Memoria para abrirlo
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setActividadAyudaSeleccionada(actividad)}
                      style={{
                        background: '#F1F5F9',
                        border: '2px solid #CBD5E1',
                        borderRadius: '16px',
                        padding: '10px 14px',
                        color: '#475569',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        boxShadow: '0 4px 0 #CBD5E1'
                      }}
                      title="¿Cómo jugar?"
                    >
                      <HelpCircle size={20} />
                    </button>

                    <button
                      type="button"
                      onClick={() => alSeleccionarJuego(actividad)}
                      className={`boton-juguete ${esElRetoMixto ? 'boton-amatista' : estiloColor.boton}`}
                      style={{ flex: 1, padding: '10px', fontSize: '1.05rem' }}
                    >
                      {esElRetoMixto ? <Trophy size={18} /> : <Play size={18} fill="white" />}
                      {esElRetoMixto ? '¡Jugar Desafío!' : 'Jugar Ahora'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ModalComoJugar
        abierto={actividadAyudaSeleccionada !== null}
        alCerrar={() => setActividadAyudaSeleccionada(null)}
        actividad={actividadAyudaSeleccionada}
      />
    </div>
  );
}
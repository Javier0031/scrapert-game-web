import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import MascotaScrapert from './MascotaScrapert.jsx';
import ModalComoJugar from './ModalComoJugar.jsx';
import { servicioApi } from '../servicios/servicioApi.js';
import { efectosSonoros } from '../utilidades/musicaFondo.js';
import { ArrowLeft, Clock, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';

export default function MarcoJuego({ 
  actividad, 
  estudiante, 
  totalRondas = 5, 
  rondaActual, 
  puntosAcumulados, 
  aciertos, 
  fallos, 
  juegoTerminado, 
  alSalir, 
  alReiniciar, 
  children 
}) {
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0);
  const [guardandoEnBd, setGuardandoEnBd] = useState(false);
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);
  const [mostrarModalAyuda, setMostrarModalAyuda] = useState(false);

  useEffect(() => {
    let temporizador;
    if (!juegoTerminado && !mostrarModalAyuda) {
      temporizador = setInterval(() => {
        setSegundosTranscurridos((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(temporizador);
  }, [juegoTerminado, mostrarModalAyuda]);

  // Al finalizar: disparar confeti, fanfarria sonora y guardar en BD
  useEffect(() => {
    if (juegoTerminado && !guardadoExitoso) {
      efectosSonoros.reproducirVictoria();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      enviarResultadosAlServidor();
    }
  }, [juegoTerminado]);

  const enviarResultadosAlServidor = async () => {
    setGuardandoEnBd(true);
    try {
      const payload = {
        estudiante_id: estudiante.id,
        actividad_id: actividad.id,
        puntos_obtenidos: puntosAcumulados,
        aciertos: aciertos,
        fallos: fallos,
        duracion_segundos: segundosTranscurridos
      };
      const respuesta = await servicioApi.guardarResultadoPartida(payload);
      if (respuesta.exito) {
        setGuardadoExitoso(true);
      }
    } catch (error) {
      console.error('Error al guardar el progreso en MySQL:', error);
    } finally {
      setGuardandoEnBd(false);
    }
  };

  const porcentajeProgreso = Math.min(100, ((rondaActual - 1) / totalRondas) * 100);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1rem' }}>
      {/* Barra de estado superior */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '20px',
        border: '2px solid #EBF4F6',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
        marginBottom: '1rem'
      }}>
        <button
          type="button"
          onClick={() => {
            efectosSonoros.reproducirClic();
            alSalir();
          }}
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '14px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 800,
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          Menú
        </button>

        <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-texto-oscuro)' }}>
          {actividad.titulo}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              efectosSonoros.reproducirClic();
              setMostrarModalAyuda(true);
            }}
            style={{
              background: '#F0F9FF',
              border: '2px solid var(--color-turquesa-suave)',
              borderRadius: '14px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-cielo-verano)',
              cursor: 'pointer'
            }}
          >
            <HelpCircle size={16} />
            ¿Cómo jugar?
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontWeight: 800 }}>
            <Clock size={16} />
            <span>{segundosTranscurridos}s</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--color-rosa-texas)',
            fontWeight: 900,
            fontSize: '1.05rem'
          }}>
            <Sparkles size={18} />
            <span>{puntosAcumulados} pts</span>
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {!juegoTerminado && (
        <div style={{
          width: '100%',
          height: '14px',
          backgroundColor: '#E2E8F0',
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          border: '2px solid #CBD5E1'
        }}>
          <div style={{
            width: `${porcentajeProgreso}%`,
            height: '100%',
            backgroundColor: 'var(--color-verde-pastel)',
            transition: 'width 0.4s ease'
          }} />
        </div>
      )}

      {/* Pantalla de Fin de Juego o Tablero Activo */}
      {juegoTerminado ? (
        <div className="tarjeta-juego" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <MascotaScrapert 
            animacion="feliz" 
            accesorio="lentes"
            mensaje={`¡Increíble trabajo, ${estudiante.nombre}! ¡Completaste el juego!`} 
            tamano={160} 
          />

          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-cielo-verano)', marginTop: '1.5rem' }}>
            ¡Misión Cumplida!
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            margin: '2rem 0'
          }}>
            <div style={{ background: '#F8FAFC', padding: '16px 24px', borderRadius: '18px', border: '2px solid #E2E8F0' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748B', fontWeight: 700 }}>Puntaje Total</span>
              <strong style={{ fontSize: '1.8rem', color: 'var(--color-rosa-texas)' }}>+{puntosAcumulados} pts</strong>
            </div>
            <div style={{ background: '#F0FDF4', padding: '16px 24px', borderRadius: '18px', border: '2px solid #BBF7D0' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#166534', fontWeight: 700 }}>Aciertos</span>
              <strong style={{ fontSize: '1.8rem', color: '#15803D' }}>{aciertos} / {totalRondas}</strong>
            </div>
            <div style={{ background: '#EFF6FF', padding: '16px 24px', borderRadius: '18px', border: '2px solid #BFDBFE' }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#1E40AF', fontWeight: 700 }}>Tiempo</span>
              <strong style={{ fontSize: '1.8rem', color: '#1D4ED8' }}>{segundosTranscurridos}s</strong>
            </div>
          </div>

          <p style={{ color: '#64748B', fontWeight: 700, marginBottom: '2rem' }}>
            {guardandoEnBd 
              ? 'Guardando resultado en MySQL...' 
              : guardadoExitoso 
                ? ' ¡Progreso guardado en el servidor!' 
                : ''}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              type="button"
              onClick={() => {
                efectosSonoros.reproducirClic();
                alReiniciar();
              }}
              className="boton-juguete boton-naranja"
            >
              <RotateCcw size={20} />
              Jugar de Nuevo
            </button>
            <button
              type="button"
              onClick={() => {
                efectosSonoros.reproducirClic();
                alSalir();
              }}
              className="boton-juguete boton-cielo"
            >
              Volver al Menú
            </button>
          </div>
        </div>
      ) : (
        children
      )}

      {/* Modal de instrucciones */}
      <ModalComoJugar
        abierto={mostrarModalAyuda}
        alCerrar={() => setMostrarModalAyuda(false)}
        actividad={actividad}
      />
    </div>
  );
}
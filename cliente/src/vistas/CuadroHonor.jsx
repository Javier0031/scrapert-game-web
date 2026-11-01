import React, { useState, useEffect } from 'react';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { ArrowLeft, Trophy, Medal, Star } from 'lucide-react';
import { servicioApi } from '../servicios/servicioApi.js';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const MAPA_AVATARES = {
  gato_scrapert: '🐱',
  cohete_veloz: '🚀',
  estrella_brillante: '⭐',
  leon_valiente: '🦁',
  delfin_alegre: '🐬'
};

export default function CuadroHonor({ estudiante, alVolver }) {
  const [ranking, setRanking] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosRanking();
  }, []);

  const cargarDatosRanking = async () => {
    setCargando(true);
    try {
      const respuesta = await servicioApi.obtenerCuadroHonor();
      const lista = respuesta.datos || respuesta.ranking || [];
      if (respuesta.exito && Array.isArray(lista)) {
        setRanking(lista);
        if (lista.length > 0) {
          efectosSonoros.reproducirVictoria();
          confetti({
            particleCount: 80,
            spread: 80,
            origin: { y: 0.5 }
          });
        }
      }
    } catch (e) {
      console.error('Error al cargar ranking:', e);
    } finally {
      setCargando(false);
    }
  };

  const primerLugar = ranking[0] || null;
  const segundoLugar = ranking[1] || null;
  const tercerLugar = ranking[2] || null;
  const restoEstudiantes = ranking.slice(3);

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1rem' }}>
      {/* Barra de navegación */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: '12px 20px',
        borderRadius: '20px',
        border: '2px solid #EBF4F6',
        boxShadow: '0 6px 16px rgba(0,0,0,0.04)',
        marginBottom: '1.5rem'
      }}>
        <button
          type="button"
          onClick={() => {
            efectosSonoros.reproducirClic();
            alVolver();
          }}
          style={{
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '14px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            color: '#64748B',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          Volver
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={26} color="#F59E0B" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-texto-oscuro)' }}>
            Starboard de Campeones
          </h2>
        </div>

        <div style={{ width: '80px' }} />
      </div>

      <div className="tarjeta-juego" style={{ padding: '2rem 1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <MascotaScrapert
            animacion="feliz"
            accesorio="lentes"
            mensaje="¡Felicidades a los grandes campeones de Scrapert Game!"
            tamano={130}
          />
        </div>

        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 800, color: '#64748B' }}>
            Cargando las mejores puntuaciones...
          </div>
        ) : ranking.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B' }}>
            <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>¡Aún no hay partidas registradas!</p>
            <p>Juega una partida para inaugurar el podio de honor.</p>
          </div>
        ) : (
          <>
            {/* Podio Olímpico */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '16px',
              margin: '2rem 0 3rem 0',
              paddingTop: '2rem'
            }}>
              {/* 2.º Lugar: Plata */}
              {segundoLugar && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                  <div style={{
                    fontSize: '2.4rem',
                    background: '#F1F5F9',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #94A3B8',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                    marginBottom: '8px'
                  }}>
                    {MAPA_AVATARES[segundoLugar.icono_avatar] || '🥈'}
                  </div>
                  <span style={{ fontWeight: 900, color: 'var(--color-texto-oscuro)', fontSize: '0.95rem', textAlign: 'center' }}>
                    {segundoLugar.nombre}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#64748B', marginBottom: '8px' }}>
                    {segundoLugar.puntaje_total} pts
                  </span>
                  <div style={{
                    width: '100%',
                    height: '110px',
                    background: 'linear-gradient(180deg, #E2E8F0 0%, #94A3B8 100%)',
                    borderRadius: '16px 16px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    boxShadow: '0 8px 18px rgba(148, 163, 184, 0.3)'
                  }}>
                    <Medal size={32} />
                    <span style={{ fontSize: '1.4rem' }}>2.º</span>
                  </div>
                </div>
              )}

              {/* 1.º Lugar: Oro */}
              {primerLugar && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '160px' }}>
                  <div style={{
                    position: 'relative',
                    fontSize: '2.8rem',
                    background: '#FEF3C7',
                    width: '76px',
                    height: '76px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '4px solid #F59E0B',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.25)',
                    marginBottom: '8px',
                    animation: 'saltitoFeliz 1s ease infinite'
                  }}>
                    <span style={{ position: 'absolute', top: '-18px', fontSize: '1.6rem' }}>👑</span>
                    {MAPA_AVATARES[primerLugar.icono_avatar] || '🥇'}
                  </div>
                  <span style={{ fontWeight: 900, color: 'var(--color-texto-oscuro)', fontSize: '1.1rem', textAlign: 'center' }}>
                    {primerLugar.nombre}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#D97706', marginBottom: '8px' }}>
                    {primerLugar.puntaje_total} pts
                  </span>
                  <div style={{
                    width: '100%',
                    height: '150px',
                    background: 'linear-gradient(180deg, #FDE68A 0%, #F59E0B 100%)',
                    borderRadius: '18px 18px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)'
                  }}>
                    <Trophy size={40} />
                    <span style={{ fontSize: '1.8rem' }}>1.º</span>
                  </div>
                </div>
              )}

              {/* 3.º Lugar: Bronce */}
              {tercerLugar && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '140px' }}>
                  <div style={{
                    fontSize: '2.4rem',
                    background: '#FFEDD5',
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #EA580C',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.08)',
                    marginBottom: '8px'
                  }}>
                    {MAPA_AVATARES[tercerLugar.icono_avatar] || '🥉'}
                  </div>
                  <span style={{ fontWeight: 900, color: 'var(--color-texto-oscuro)', fontSize: '0.95rem', textAlign: 'center' }}>
                    {tercerLugar.nombre}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#C2410C', marginBottom: '8px' }}>
                    {tercerLugar.puntaje_total} pts
                  </span>
                  <div style={{
                    width: '100%',
                    height: '85px',
                    background: 'linear-gradient(180deg, #FED7AA 0%, #EA580C 100%)',
                    borderRadius: '16px 16px 0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    boxShadow: '0 8px 18px rgba(234, 88, 12, 0.25)'
                  }}>
                    <Medal size={28} />
                    <span style={{ fontSize: '1.3rem' }}>3.º</span>
                  </div>
                </div>
              )}
            </div>

            {/* Del 4.º al 10.º */}
            {restoEstudiantes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#64748B', marginBottom: '4px' }}>
                  Tabla General
                </h3>

                {restoEstudiantes.map((jugador, idx) => {
                  const posicion = idx + 4;
                  const esEstudianteActual = estudiante?.id === jugador.id;

                  return (
                    <div
                      key={jugador.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 18px',
                        backgroundColor: esEstudianteActual ? '#EFF6FF' : '#F8FAFC',
                        border: esEstudianteActual ? '2.5px solid var(--color-cielo-verano)' : '2px solid #E2E8F0',
                        borderRadius: '16px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#64748B', width: '28px' }}>
                          #{posicion}
                        </span>
                        <span style={{ fontSize: '1.8rem' }}>
                          {MAPA_AVATARES[jugador.icono_avatar] || '🐱'}
                        </span>
                        <div>
                          <span style={{ display: 'block', fontWeight: 900, fontSize: '1rem', color: 'var(--color-texto-oscuro)' }}>
                            {jugador.nombre} {esEstudianteActual && '(Tú)'}
                          </span>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>
                            {jugador.partidas_jugadas} partidas jugadas
                          </span>
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: 900,
                        fontSize: '1.15rem',
                        color: 'var(--color-rosa-texas)'
                      }}>
                        <Star size={18} fill="currentColor" />
                        <span>{jugador.puntaje_total} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
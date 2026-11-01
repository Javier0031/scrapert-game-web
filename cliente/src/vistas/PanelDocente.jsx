import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  RefreshCw, 
  Delete 
} from 'lucide-react';
import { servicioApi } from '../servicios/servicioApi.js';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const MAPA_AVATARES = {
  gato_scrapert: '🐱',
  cohete_veloz: '🚀',
  estrella_brillante: '⭐',
  leon_valiente: '🦁',
  delfin_alegre: '🐬'
};

const PIN_MAESTRO = '1234';

export default function PanelDocente({ alVolver }) {
  const [pinIngresado, setPinIngresado] = useState('');
  const [accesoConcedido, setAccesoConcedido] = useState(false);
  const [errorPin, setErrorPin] = useState(false);

  const [partidas, setPartidas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todos');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (accesoConcedido) {
      cargarReportes('todos');
    }
  }, [accesoConcedido]);

  const manejarPulsarDigito = (digito) => {
    efectosSonoros.reproducirClic();
    setErrorPin(false);
    if (pinIngresado.length < 4) {
      const nuevoPin = pinIngresado + digito;
      setPinIngresado(nuevoPin);
      if (nuevoPin.length === 4) {
        verificarPin(nuevoPin);
      }
    }
  };

  const manejarBorrarDigito = () => {
    efectosSonoros.reproducirClic();
    setPinIngresado((prev) => prev.slice(0, -1));
    setErrorPin(false);
  };

  const verificarPin = (pin) => {
    if (pin === PIN_MAESTRO) {
      efectosSonoros.reproducirAcierto();
      setAccesoConcedido(true);
    } else {
      efectosSonoros.reproducirFallo();
      setErrorPin(true);
      setTimeout(() => {
        setPinIngresado('');
        setErrorPin(false);
      }, 700);
    }
  };

  const cargarReportes = async (idEstudiante) => {
    setCargando(true);
    try {
      const respuesta = await servicioApi.obtenerReportesDocentes(idEstudiante === 'todos' ? '' : idEstudiante);
      if (respuesta.exito && Array.isArray(respuesta.datos)) {
        setPartidas(respuesta.datos);

        if (estudiantes.length === 0) {
          const mapaEstudiantes = new Map();
          respuesta.datos.forEach((p) => {
            if (!mapaEstudiantes.has(p.estudiante_id)) {
              mapaEstudiantes.set(p.estudiante_id, {
                id: p.estudiante_id,
                nombre: p.estudiante_nombre,
                icono_avatar: p.icono_avatar
              });
            }
          });
          setEstudiantes(Array.from(mapaEstudiantes.values()));
        }
      }
    } catch (e) {
      console.error('Error al cargar reportes docentes:', e);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambiarFiltro = (e) => {
    const nuevoFiltro = e.target.value;
    setFiltroSeleccionado(nuevoFiltro);
    cargarReportes(nuevoFiltro);
  };

  const totalPartidas = partidas.length;
  const totalPuntos = partidas.reduce((acc, p) => acc + (p.puntos_obtenidos || 0), 0);
  const totalAciertos = partidas.reduce((acc, p) => acc + (p.aciertos || 0), 0);
  const totalFallos = partidas.reduce((acc, p) => acc + (p.fallos || 0), 0);
  const porcentajeEfectividad = (totalAciertos + totalFallos) > 0 
    ? Math.round((totalAciertos / (totalAciertos + totalFallos)) * 100) 
    : 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Barra superior de navegación */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: '12px 24px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '2rem'
      }}>
        <button
          type="button"
          onClick={() => {
            efectosSonoros.reproducirClic();
            alVolver();
          }}
          style={{
            background: 'transparent',
            border: '1px solid #CBD5E1',
            borderRadius: '10px',
            padding: '7px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            color: '#475569',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <ArrowLeft size={16} />
          Volver
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {accesoConcedido ? <Unlock size={20} color="#059669" /> : <Lock size={20} color="#0284C7" />}
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px', margin: 0 }}>
            Módulo de Supervisión Docente
          </h2>
        </div>

        <div style={{ width: '80px' }} />
      </div>

      {/* VISTA 1: Autenticación Profesional Minimalista */}
      {!accesoConcedido ? (
        <div style={{
          maxWidth: '380px',
          margin: '3rem auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06)',
          padding: '2.5rem 2rem',
          textAlign: 'center'
        }}>
          {/* Icono de seguridad institucional */}
          <div style={{
            width: '56px',
            height: '56px',
            margin: '0 auto 1.2rem auto',
            borderRadius: '16px',
            backgroundColor: errorPin ? '#FEE2E2' : '#F0F9FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}>
            <ShieldCheck size={28} color={errorPin ? '#DC2626' : '#0284C7'} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
            Acceso Docente
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 1.8rem 0' }}>
            Ingrese el PIN de seguridad de 4 dígitos
          </p>

          {/* Indicadores de dígitos */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '2rem'
          }}>
            {[0, 1, 2, 3].map((idx) => {
              const estaLleno = pinIngresado.length > idx;
              return (
                <div
                  key={idx}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: estaLleno 
                      ? (errorPin ? '#EF4444' : '#0284C7') 
                      : '#E2E8F0',
                    border: '2px solid transparent',
                    transform: estaLleno ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.15s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Teclado numérico minimalista */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            maxWidth: '260px',
            margin: '0 auto 1.5rem auto'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((tecla) => {
              const esEspecial = tecla === 'C' || tecla === 'DEL';
              return (
                <button
                  key={tecla}
                  type="button"
                  onClick={() => {
                    if (tecla === 'C') {
                      efectosSonoros.reproducirClic();
                      setPinIngresado('');
                      setErrorPin(false);
                    } else if (tecla === 'DEL') {
                      manejarBorrarDigito();
                    } else {
                      manejarPulsarDigito(tecla);
                    }
                  }}
                  style={{
                    height: '52px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: esEspecial ? '#F8FAFC' : '#FFFFFF',
                    color: esEspecial ? '#64748B' : '#0F172A',
                    fontSize: esEspecial ? '0.85rem' : '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F1F5F9';
                    e.currentTarget.style.borderColor = '#CBD5E1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = esEspecial ? '#F8FAFC' : '#FFFFFF';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                  }}
                >
                  {tecla === 'DEL' ? <Delete size={18} /> : tecla}
                </button>
              );
            })}
          </div>

          <div style={{
            fontSize: '0.75rem',
            color: '#94A3B8',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '12px'
          }}>
            PIN predeterminado: <strong>1234</strong>
          </div>
        </div>
      ) : (
        /* VISTA 2: Dashboard Administrativo */
        <div>
          {/* Métricas clave */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '1.8rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ backgroundColor: '#F0F9FF', padding: '12px', borderRadius: '12px', color: '#0284C7' }}>
                <Users size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Partidas Totales
                </span>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: '#0F172A', marginTop: '2px' }}>
                  {totalPartidas}
                </strong>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ backgroundColor: '#ECFDF5', padding: '12px', borderRadius: '12px', color: '#059669' }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Tasa de Precisión
                </span>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: '#059669', marginTop: '2px' }}>
                  {porcentajeEfectividad}%
                </strong>
              </div>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ backgroundColor: '#FFFBEB', padding: '12px', borderRadius: '12px', color: '#D97706' }}>
                <Sparkles size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Puntos Concedidos
                </span>
                <strong style={{ display: 'block', fontSize: '1.6rem', color: '#D97706', marginTop: '2px' }}>
                  {totalPuntos}
                </strong>
              </div>
            </div>
          </div>

          {/* Tabla de auditoría */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
            padding: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '1.2rem',
              borderBottom: '1px solid #F1F5F9',
              paddingBottom: '1rem'
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Registro de Actividades
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Auditoría cronológica de partidas realizadas
                </span>
              </div>

              {/* Selector de filtro por estudiante */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={16} color="#64748B" />
                <select
                  value={filtroSeleccionado}
                  onChange={manejarCambiarFiltro}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <option value="todos">Todos los alumnos</option>
                  {estudiantes.map((est) => (
                    <option key={est.id} value={est.id}>
                      {MAPA_AVATARES[est.icono_avatar] || '🐱'} {est.nombre}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => cargarReportes(filtroSeleccionado)}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '7px 10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Actualizar datos"
                >
                  <RefreshCw size={14} color="#64748B" />
                </button>
              </div>
            </div>

            {cargando ? (
              <div style={{ textAlign: 'center', padding: '3rem', fontWeight: 600, color: '#64748B' }}>
                Cargando registros...
              </div>
            ) : partidas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#64748B', fontSize: '0.9rem' }}>
                No se encontraron partidas para el filtro seleccionado.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <th style={{ padding: '10px 12px' }}>Alumno</th>
                      <th style={{ padding: '10px 12px' }}>Actividad</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Puntaje</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Aciertos</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Fallos</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partidas.map((fila) => (
                      <tr 
                        key={fila.id}
                        style={{ borderBottom: '1px solid #F8FAFC', fontSize: '0.9rem' }}
                      >
                        <td style={{ padding: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{MAPA_AVATARES[fila.icono_avatar] || '🐱'}</span>
                            <span style={{ fontWeight: 700, color: '#0F172A' }}>{fila.estudiante_nombre}</span>
                          </div>
                        </td>

                        <td style={{ padding: '12px', color: '#475569', fontWeight: 500 }}>
                          {fila.actividad_titulo}
                        </td>

                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#0F172A' }}>
                          +{fila.puntos_obtenidos}
                        </td>

                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            backgroundColor: '#ECFDF5',
                            color: '#059669',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem'
                          }}>
                            {fila.aciertos}
                          </span>
                        </td>

                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '0.8rem'
                          }}>
                            {fila.fallos}
                          </span>
                        </td>

                        <td style={{ padding: '12px', textAlign: 'center', color: '#64748B', fontSize: '0.85rem' }}>
                          {fila.duracion_segundos}s
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
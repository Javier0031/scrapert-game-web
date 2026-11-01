import React, { useState, useEffect, useRef } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles, Timer } from 'lucide-react';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const barajar = (lista) => {
  const clon = [...lista];
  for (let i = clon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clon[i], clon[j]] = [clon[j], clon[i]];
  }
  return clon;
};

// Generador de 10 retos de multiplicación únicos contra reloj
const generarDiezRetosMultiplicar = () => {
  const retosGenerados = [];
  const combinacionesUsadas = new Set();

  while (retosGenerados.length < 10) {
    // Multiplicaciones del 2 al 10 para Primaria
    const num1 = Math.floor(Math.random() * 9) + 2;
    const num2 = Math.floor(Math.random() * 9) + 2;
    const clave = `${Math.min(num1, num2)}x${Math.max(num1, num2)}`;

    if (!combinacionesUsadas.has(clave)) {
      combinacionesUsadas.add(clave);
      const resultadoCorrecto = num1 * num2;

      // Distractores matemáticos cercanos y creíbles
      const distractores = new Set();
      distractores.add(resultadoCorrecto + (Math.random() > 0.5 ? num1 : -num1));
      distractores.add(resultadoCorrecto + (Math.random() > 0.5 ? 2 : -2));
      distractores.add(resultadoCorrecto + (Math.random() > 0.5 ? num2 : -num2));

      // Asegurar que sean 3 distractores positivos distintos del resultado
      const opcionesFalsas = Array.from(distractores)
        .filter((val) => val > 0 && val !== resultadoCorrecto)
        .slice(0, 3);

      while (opcionesFalsas.length < 3) {
        const extra = resultadoCorrecto + (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
        if (extra > 0 && extra !== resultadoCorrecto && !opcionesFalsas.includes(extra)) {
          opcionesFalsas.push(extra);
        }
      }

      const opciones = barajar([
        { id: resultadoCorrecto, valor: resultadoCorrecto, esCorrecta: true },
        ...opcionesFalsas.map((falsa) => ({ id: falsa, valor: falsa, esCorrecta: false }))
      ]);

      retosGenerados.push({
        num1,
        num2,
        resultadoCorrecto,
        opciones,
        esBonusPistaScrapert: false
      });
    }
  }

  // Asignar 1 o 2 rondas de bonificación dorada
  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesBonus = barajar([2, 4, 6, 8]).slice(0, cantidadBonus);
  indicesBonus.forEach((idx) => {
    retosGenerados[idx].esBonusPistaScrapert = true;
  });

  return retosGenerados;
};

const SEGUNDOS_POR_RONDA = 12;

export default function JuegoMultiplicar({ actividad, estudiante, alVolverAlMenu }) {
  const [retosPartida, setRetosPartida] = useState([]);
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoRondaRestante, setTiempoRondaRestante] = useState(SEGUNDOS_POR_RONDA);

  const temporizadorRef = useRef(null);

  useEffect(() => {
    iniciarPartida();
    return () => clearInterval(temporizadorRef.current);
  }, []);

  // Reloj de cuenta regresiva por ronda
  useEffect(() => {
    if (juegoTerminado || respuestaSeleccionada !== null) {
      clearInterval(temporizadorRef.current);
      return;
    }

    temporizadorRef.current = setInterval(() => {
      setTiempoRondaRestante((prev) => {
        if (prev <= 1) {
          clearInterval(temporizadorRef.current);
          manejarTiempoAgotado();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(temporizadorRef.current);
  }, [indiceRonda, respuestaSeleccionada, juegoTerminado]);

  const iniciarPartida = () => {
    const nuevosRetos = generarDiezRetosMultiplicar();
    setRetosPartida(nuevosRetos);
    setIndiceRonda(0);
    setPuntos(0);
    setAciertos(0);
    setFallos(0);
    setRespuestaSeleccionada(null);
    setEsAcierto(null);
    setJuegoTerminado(false);
    setTiempoRondaRestante(SEGUNDOS_POR_RONDA);
  };

  const retoActual = retosPartida[indiceRonda];

  const manejarTiempoAgotado = () => {
    efectosSonoros.reproducirFallo();
    setRespuestaSeleccionada('agotado');
    setEsAcierto(false);
    setFallos((prev) => prev + 1);
    avanzarRonda();
  };

  const manejarSeleccion = (opcion) => {
    if (respuestaSeleccionada !== null) return;
    clearInterval(temporizadorRef.current);

    setRespuestaSeleccionada(opcion.id);
    const acerto = opcion.esCorrecta;
    setEsAcierto(acerto);

    if (acerto) {
      let pts = actividad.puntos_recompensa || 30;
      if (retoActual?.esBonusPistaScrapert) {
        pts *= 2;
        efectosSonoros.reproducirBonoDorado();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        efectosSonoros.reproducirAcierto();
      }
      // Puntos extra por rapidez si contestó con más de 6 segundos sobrantes
      if (tiempoRondaRestante > 6) {
        pts += 5;
      }
      setPuntos((prev) => prev + pts);
      setAciertos((prev) => prev + 1);
    } else {
      efectosSonoros.reproducirFallo();
      setFallos((prev) => prev + 1);
    }

    avanzarRonda();
  };

  const avanzarRonda = () => {
    setTimeout(() => {
      if (indiceRonda + 1 < retosPartida.length) {
        setIndiceRonda((prev) => prev + 1);
        setRespuestaSeleccionada(null);
        setEsAcierto(null);
        setTiempoRondaRestante(SEGUNDOS_POR_RONDA);
      } else {
        setJuegoTerminado(true);
      }
    }, 1300);
  };

  if (!retoActual) return null;

  const esBonus = retoActual.esBonusPistaScrapert;
  const porcentajeTiempo = (tiempoRondaRestante / SEGUNDOS_POR_RONDA) * 100;

  return (
    <MarcoJuego
      actividad={actividad}
      estudiante={estudiante}
      totalRondas={retosPartida.length}
      rondaActual={indiceRonda + 1}
      puntosAcumulados={puntos}
      aciertos={aciertos}
      fallos={fallos}
      juegoTerminado={juegoTerminado}
      alSalir={alVolverAlMenu}
      alReiniciar={iniciarPartida}
    >
      <div 
        className="tarjeta-juego"
        style={{
          border: esBonus ? '3.5px solid #F59E0B' : '3px solid var(--color-cielo-verano)',
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : undefined
        }}
      >
        {/* Cabecera con indicador de ronda y bonificación */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#EFF6FF',
              color: 'var(--color-cielo-verano)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              Multiplicación Rápida
            </span>

            {esBonus && (
              <span style={{
                background: 'linear-gradient(135deg, #FFB356, #FF7A00)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '4px 14px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                animation: 'saltitoFeliz 0.8s ease infinite'
              }}>
                <Sparkles size={16} />
                ¡BONO DORADO! PUNTOS DOBLES (x2)
              </span>
            )}
          </div>

          {/* Barra de tiempo de ronda */}
          <div style={{
            maxWidth: '260px',
            margin: '12px auto 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Timer size={18} color={tiempoRondaRestante <= 4 ? '#EF4444' : '#64748B'} />
            <div style={{ flex: 1, height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${porcentajeTiempo}%`,
                background: tiempoRondaRestante <= 4 ? '#EF4444' : 'var(--color-verde-pastel)',
                transition: 'width 1s linear'
              }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: tiempoRondaRestante <= 4 ? '#EF4444' : '#64748B' }}>
              {tiempoRondaRestante}s
            </span>
          </div>
        </div>

        {/* Tablero central con la operación matemática */}
        <div style={{
          background: '#FAFCFE',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '1.2rem'
        }}>
          <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--color-texto-oscuro)' }}>
            {retoActual.num1}
          </span>
          <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--color-cielo-verano)' }}>
            ×
          </span>
          <span style={{ fontSize: '3.2rem', fontWeight: 900, color: 'var(--color-texto-oscuro)' }}>
            {retoActual.num2}
          </span>
          <span style={{ fontSize: '2.8rem', fontWeight: 900, color: '#94A3B8' }}>
            =
          </span>
          <span style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: esAcierto !== null ? (esAcierto ? 'var(--color-verde-pastel)' : '#EF4444') : 'var(--color-rosa-texas)',
            minWidth: '70px',
            textAlign: 'center'
          }}>
            {respuestaSeleccionada !== null ? (respuestaSeleccionada === 'agotado' ? '⏰' : respuestaSeleccionada) : '?'}
          </span>
        </div>

        {/* Mascota animada */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
          <MascotaScrapert
            animacion={esAcierto === true ? 'baile' : esAcierto === false ? 'triste' : 'reposo'}
            accesorio={esBonus ? 'lentes' : 'gorra'}
            mensaje={
              esAcierto === true 
                ? '¡Cálculo veloz! ¡Eres un genio!' 
                : esAcierto === false 
                  ? (respuestaSeleccionada === 'agotado' ? '¡Se agotó el tiempo! ¡Más rápido en la siguiente!' : '¡Casi! Revisa las tablas y concéntrate') 
                  : esBonus 
                    ? '¡Ronda de puntos dobles! ¿Cuánto da esta multiplicación?' 
                    : 'Selecciona el resultado correcto antes del tiempo'
            }
            tamano={120}
          />
        </div>

        {/* 4 Opciones en cuadrícula de 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {retoActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.id;
            let claseBoton = esBonus ? 'boton-naranja' : 'boton-cielo';

            if (estaElegida) {
              claseBoton = opcion.esCorrecta ? 'boton-verde' : 'boton-coral';
            }

            return (
              <button
                key={opcion.id}
                type="button"
                onClick={() => manejarSeleccion(opcion)}
                disabled={respuestaSeleccionada !== null}
                className={`boton-juguete ${claseBoton}`}
                style={{
                  padding: '16px',
                  fontSize: '1.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: respuestaSeleccionada !== null && !estaElegida ? 0.6 : 1
                }}
              >
                <span>{opcion.valor}</span>
                {estaElegida && opcion.esCorrecta && <Check size={26} strokeWidth={3} />}
                {estaElegida && !opcion.esCorrecta && <X size={26} strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </MarcoJuego>
  );
}
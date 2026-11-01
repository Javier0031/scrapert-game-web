import React, { useState, useEffect, useRef } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles, Timer, Flame } from 'lucide-react';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const barajar = (lista) => {
  const clon = [...lista];
  for (let i = clon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clon[i], clon[j]] = [clon[j], clon[i]];
  }
  return clon;
};

// Paleta completa de colores con sus tonos de fondo, sombras y contraste de texto
const BANCO_COLORES = [
  { id: 'rojo', nombre: 'Rojo', hex: '#EF4444', sombra: '#B91C1C', texto: '#FFFFFF' },
  { id: 'azul', nombre: 'Azul', hex: '#2563EB', sombra: '#1D4ED8', texto: '#FFFFFF' },
  { id: 'verde', nombre: 'Verde', hex: '#16A34A', sombra: '#15803D', texto: '#FFFFFF' },
  { id: 'amarillo', nombre: 'Amarillo', hex: '#FACC15', sombra: '#CA8A04', texto: '#713F12' },
  { id: 'morado', nombre: 'Morado', hex: '#9333EA', sombra: '#7E22CE', texto: '#FFFFFF' },
  { id: 'naranja', nombre: 'Naranja', hex: '#EA580C', sombra: '#C2410C', texto: '#FFFFFF' },
  { id: 'rosa', nombre: 'Rosa', hex: '#EC4899', sombra: '#BE185D', texto: '#FFFFFF' },
  { id: 'cafe', nombre: 'Café', hex: '#78350F', sombra: '#451A03', texto: '#FFFFFF' },
  { id: 'negro', nombre: 'Negro', hex: '#1E293B', sombra: '#0F172A', texto: '#FFFFFF' }
];

// Algoritmo para cruzar los fondos: cada botón recibe un color de caja DISTINTO a su texto
const asignarColoresFondoCruzados = (opciones) => {
  let fondosDisponibles = barajar([...BANCO_COLORES]);

  return opciones.map((opcion, idx) => {
    // Buscar un color de fondo cuyo id NO coincida con el texto de la opción
    let colorFondo = fondosDisponibles.find((c) => c.id !== opcion.id);

    if (!colorFondo) {
      colorFondo = BANCO_COLORES.find((c) => c.id !== opcion.id);
    } else {
      // Consumir el color para variedad visual en la cuadrícula
      fondosDisponibles = fondosDisponibles.filter((c) => c.id !== colorFondo.id);
      if (fondosDisponibles.length === 0) {
        fondosDisponibles = barajar([...BANCO_COLORES]);
      }
    }

    return {
      ...opcion,
      colorFondoCaja: colorFondo,
      idUnico: `ronda_${idx}_${opcion.id}_caja_${colorFondo.id}`
    };
  });
};

// Generador de 10 rondas con doble trampa Stroop (4, 6 y 9 opciones)
const generarDiezRondasDobleStroop = () => {
  const rondas = [];

  for (let i = 0; i < 10; i++) {
    let cantidadOpciones = 4;
    let columnasGrid = 'repeat(2, 1fr)';

    if (i >= 3 && i < 7) {
      cantidadOpciones = 6;
      columnasGrid = 'repeat(3, 1fr)';
    } else if (i >= 7) {
      cantidadOpciones = 9;
      columnasGrid = 'repeat(3, 1fr)';
    }

    const coloresDisponibles = barajar(BANCO_COLORES);
    const colorTinta = coloresDisponibles[0];
    const palabraTexto = coloresDisponibles[1];

    // Opciones de respuesta: el botón con el NOMBRE de la tinta es la respuesta correcta
    const opcionesFalsas = coloresDisponibles
      .filter((c) => c.id !== colorTinta.id)
      .slice(0, cantidadOpciones - 1);

    const opcionesMezcladas = barajar([
      { ...colorTinta, esCorrecta: true },
      ...opcionesFalsas.map((c) => ({ ...c, esCorrecta: false }))
    ]);

    // Cruzar los fondos de las cajas para que difieran de lo que dice el botón
    const opcionesConFondoCruzado = asignarColoresFondoCruzados(opcionesMezcladas).map((opc, idx) => ({
      ...opc,
      idUnico: `ronda_${i}_opc_${idx}_texto_${opc.id}_fondo_${opc.colorFondoCaja.id}`
    }));

    rondas.push({
      colorTinta,
      palabraTexto,
      opciones: opcionesConFondoCruzado,
      columnasGrid,
      cantidadOpciones,
      canalNumero: i + 1,
      esBonusPistaScrapert: false
    });
  }

  // Asignar 1 o 2 bonificaciones doradas
  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesBonus = barajar([2, 5, 8]).slice(0, cantidadBonus);
  indicesBonus.forEach((idx) => {
    rondas[idx].esBonusPistaScrapert = true;
  });

  return rondas;
};

const SEGUNDOS_POR_RONDA = 8;

export default function JuegoTeleColores({ actividad, estudiante, alVolverAlMenu }) {
  const [rondasPartida, setRondasPartida] = useState([]);
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [rachaConsecutiva, setRachaConsecutiva] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(SEGUNDOS_POR_RONDA);
  const [cambiandoCanal, setCambiandoCanal] = useState(false);

  const temporizadorRef = useRef(null);

  useEffect(() => {
    iniciarPartida();
    return () => clearInterval(temporizadorRef.current);
  }, []);

  // Reloj de cuenta regresiva
  useEffect(() => {
    if (juegoTerminado || respuestaSeleccionada !== null) {
      clearInterval(temporizadorRef.current);
      return;
    }

    temporizadorRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
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
    const nuevas = generarDiezRondasDobleStroop();
    setRondasPartida(nuevas);
    setIndiceRonda(0);
    setPuntos(0);
    setAciertos(0);
    setFallos(0);
    setRachaConsecutiva(0);
    setRespuestaSeleccionada(null);
    setEsAcierto(null);
    setJuegoTerminado(false);
    setTiempoRestante(SEGUNDOS_POR_RONDA);
  };

  const rondaActual = rondasPartida[indiceRonda];

  const manejarTiempoAgotado = () => {
    efectosSonoros.reproducirFallo();
    setRespuestaSeleccionada('agotado');
    setEsAcierto(false);
    setFallos((prev) => prev + 1);
    setRachaConsecutiva(0);
    avanzarRonda();
  };

  const manejarSeleccion = (opcion) => {
    if (respuestaSeleccionada !== null) return;
    clearInterval(temporizadorRef.current);

    setRespuestaSeleccionada(opcion.idUnico);
    const correcto = opcion.esCorrecta;
    setEsAcierto(correcto);

    if (correcto) {
      const nuevaRacha = rachaConsecutiva + 1;
      setRachaConsecutiva(nuevaRacha);

      let ptsRonda = 15;
      if (nuevaRacha >= 3) {
        ptsRonda += 5;
      }
      if (rondaActual?.esBonusPistaScrapert) {
        ptsRonda *= 2;
        efectosSonoros.reproducirBonoDorado();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        efectosSonoros.reproducirAcierto();
      }

      setPuntos((prev) => prev + ptsRonda);
      setAciertos((prev) => prev + 1);
    } else {
      efectosSonoros.reproducirFallo();
      setFallos((prev) => prev + 1);
      setRachaConsecutiva(0);
    }

    avanzarRonda();
  };

  const avanzarRonda = () => {
    setTimeout(() => {
      if (indiceRonda + 1 < rondasPartida.length) {
        setCambiandoCanal(true);
        setTimeout(() => {
          setIndiceRonda((prev) => prev + 1);
          setRespuestaSeleccionada(null);
          setEsAcierto(null);
          setTiempoRestante(SEGUNDOS_POR_RONDA);
          setCambiandoCanal(false);
        }, 180);
      } else {
        setJuegoTerminado(true);
      }
    }, 1250);
  };

  if (!rondaActual) return null;

  const esBonus = rondaActual.esBonusPistaScrapert;
  const porcentajeTiempo = (tiempoRestante / SEGUNDOS_POR_RONDA) * 100;

  return (
    <MarcoJuego
      actividad={actividad}
      estudiante={estudiante}
      totalRondas={rondasPartida.length}
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
          border: esBonus ? '3.5px solid #F59E0B' : '3px solid #8B5CF6',
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : '0 10px 25px rgba(139, 92, 246, 0.12)'
        }}
      >
        {/* Cabecera, Canal y Combo */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#EDE9FE',
              color: '#7C3AED',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              CANAL {rondaActual.canalNumero < 10 ? `0${rondaActual.canalNumero}` : rondaActual.canalNumero} / 10
            </span>

            {/* Racha */}
            {rachaConsecutiva >= 2 && (
              <span style={{
                background: 'linear-gradient(135deg, #FF6B6B, #EE5253)',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '4px 12px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 10px rgba(238, 82, 83, 0.35)',
                animation: 'saltitoFeliz 0.7s ease infinite'
              }}>
                <Flame size={16} fill="white" />
                ¡RACHA x{rachaConsecutiva}! (+5 pts)
              </span>
            )}

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

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginTop: '8px' }}>
            ¿De qué color es la TINTA de la tele? ¡Ojo! Los botones tienen cajas de colores engañosos.
          </h2>

          {/* Reloj */}
          <div style={{
            maxWidth: '260px',
            margin: '10px auto 0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Timer size={18} color={tiempoRestante <= 3 ? '#EF4444' : '#64748B'} />
            <div style={{ flex: 1, height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${porcentajeTiempo}%`,
                background: tiempoRestante <= 3 ? '#EF4444' : '#8B5CF6',
                transition: 'width 1s linear'
              }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '0.9rem', color: tiempoRestante <= 3 ? '#EF4444' : '#64748B' }}>
              {tiempoRestante}s
            </span>
          </div>
        </div>

        {/* Televisión retro CRT */}
        <div style={{
          position: 'relative',
          maxWidth: '430px',
          margin: '0 auto 1.3rem auto',
          background: '#1E293B',
          borderRadius: '34px',
          padding: '22px 18px 16px 18px',
          border: '5px solid #0F172A',
          boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
        }}>
          {/* Antenas */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '24px'
          }}>
            <div style={{ width: '4px', height: '22px', background: '#94A3B8', transform: 'rotate(-25deg)', borderRadius: '2px' }} />
            <div style={{ width: '4px', height: '22px', background: '#94A3B8', transform: 'rotate(25deg)', borderRadius: '2px' }} />
          </div>

          {/* Pantalla CRT */}
          <div style={{
            position: 'relative',
            background: cambiandoCanal ? '#CBD5E1' : '#0F172A',
            borderRadius: '22px',
            border: '4px solid #334155',
            padding: '2.4rem 1rem 1.8rem 1rem',
            textAlign: 'center',
            overflow: 'hidden',
            transition: 'background 0.15s ease'
          }}>
            <span style={{
              position: 'absolute',
              top: '10px',
              left: '16px',
              color: '#22C55E',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              fontWeight: 900,
              letterSpacing: '1px'
            }}>
              CH-0{rondaActual.canalNumero}
            </span>

            <span style={{
              display: 'block',
              fontSize: '3.1rem',
              fontWeight: 900,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: rondaActual.colorTinta.hex,
              textShadow: `0 0 20px ${rondaActual.colorTinta.hex}44`,
              userSelect: 'none',
              transform: cambiandoCanal ? 'scale(0.95)' : 'scale(1)',
              transition: 'transform 0.15s ease'
            }}>
              {rondaActual.palabraTexto.nombre}
            </span>
          </div>

          {/* Perillas */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', padding: '0 10px' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <div style={{ width: '18px', height: '4px', background: '#475569', borderRadius: '2px' }} />
              <div style={{ width: '18px', height: '4px', background: '#475569', borderRadius: '2px' }} />
              <div style={{ width: '18px', height: '4px', background: '#475569', borderRadius: '2px' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#64748B', border: '2px solid #334155' }} />
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#64748B', border: '2px solid #334155' }} />
            </div>
          </div>
        </div>

        {/* Mascota Scrapert */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
          <MascotaScrapert
            animacion={esAcierto === true ? 'baile' : esAcierto === false ? 'triste' : 'reposo'}
            accesorio={rachaConsecutiva >= 3 ? 'lentes' : 'gorra'}
            mensaje={
              esAcierto === true 
                ? (rachaConsecutiva >= 3 ? `¡INCREÍBLE! ¡Racha de ${rachaConsecutiva} aciertos!` : '¡Genial! Leíste el texto correcto sin dejarte engañar.') 
                : esAcierto === false 
                  ? (respuestaSeleccionada === 'agotado' ? '¡Se acabó el tiempo!' : '¡Te engañó el color de la caja! Lee el texto con calma.') 
                  : esBonus 
                    ? '¡Doble Stroop Dorado! ¡Puntos dobles!' 
                    : 'Busca el botón cuyo TEXTO coincida con el color de la tinta'
            }
            tamano={115}
          />
        </div>

        {/* Cuadrícula de botones: Cajas pintadas de colores cruzados diferentes a su texto */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: rondaActual.columnasGrid,
          gap: '12px',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          {rondaActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.idUnico;

            // El color de la caja proviene del color cruzado asignado
            let backgroundBoton = opcion.colorFondoCaja.hex;
            let sombraBoton = opcion.colorFondoCaja.sombra;
            let colorTexto = opcion.colorFondoCaja.texto;

            if (estaElegida) {
              if (opcion.esCorrecta) {
                backgroundBoton = '#10B981';
                sombraBoton = '#047857';
                colorTexto = '#FFFFFF';
              } else {
                backgroundBoton = '#EF4444';
                sombraBoton = '#B91C1C';
                colorTexto = '#FFFFFF';
              }
            }

            return (
              <button
                key={opcion.idUnico}
                type="button"
                onClick={() => manejarSeleccion(opcion)}
                disabled={respuestaSeleccionada !== null}
                style={{
                  background: backgroundBoton,
                  color: colorTexto,
                  boxShadow: `0 6px 0 ${sombraBoton}, 0 8px 15px rgba(0,0,0,0.14)`,
                  border: '2.5px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '18px',
                  cursor: respuestaSeleccionada !== null ? 'default' : 'pointer',
                  padding: rondaActual.cantidadOpciones === 9 ? '13px 6px' : '16px 12px',
                  fontSize: rondaActual.cantidadOpciones === 9 ? '1.1rem' : '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  userSelect: 'none',
                  transform: estaElegida ? 'translateY(4px)' : 'none',
                  opacity: respuestaSeleccionada !== null && !estaElegida ? 0.45 : 1,
                  transition: 'transform 0.1s ease, opacity 0.2s ease'
                }}
              >
                <span>{opcion.nombre}</span>
                {estaElegida && opcion.esCorrecta && <Check size={22} strokeWidth={3.5} />}
                {estaElegida && !opcion.esCorrecta && <X size={22} strokeWidth={3.5} />}
              </button>
            );
          })}
        </div>
      </div>
    </MarcoJuego>
  );
}
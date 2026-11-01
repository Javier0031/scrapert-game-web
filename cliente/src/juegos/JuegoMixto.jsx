import React, { useState, useEffect } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles } from 'lucide-react';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const barajar = (lista) => {
  const clon = [...lista];
  for (let i = clon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clon[i], clon[j]] = [clon[j], clon[i]];
  }
  return clon;
};

const elegirAleatorio = (lista) => lista[Math.floor(Math.random() * lista.length)];

const crearRetoEspacialAleatorio = () => {
  const opcionesEspacio = [
    {
      etiqueta: 'Reto Espacial',
      pregunta: '¿Cuál juguete está ADENTRO de la caja de madera?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="50" y="45" width="130" height="85" rx="12" fill="#FED7AA" stroke="#EA580C" strokeWidth="4" />
          <text x="115" y="92" fontSize="34" textAnchor="middle">⚽</text>
          <text x="245" y="105" fontSize="34" textAnchor="middle">🧸</text>
        </svg>
      ),
      opciones: barajar([
        { id: 'Pelota', nombre: 'Pelota', emoji: '⚽', esCorrecta: true },
        { id: 'Osito', nombre: 'Osito', emoji: '🧸', esCorrecta: false }
      ])
    },
    {
      etiqueta: 'Reto Espacial',
      pregunta: '¿Quién está ubicado ARRIBA en el árbol?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="145" y="65" width="30" height="75" fill="#A16207" />
          <circle cx="160" cy="50" r="45" fill="#86EFAC" stroke="#22C55E" strokeWidth="4" />
          <text x="160" y="45" fontSize="32" textAnchor="middle">🐦</text>
          <text x="225" y="135" fontSize="32" textAnchor="middle">🐿️</text>
        </svg>
      ),
      opciones: barajar([
        { id: 'Pajarito', nombre: 'Pajarito', emoji: '🐦', esCorrecta: true },
        { id: 'Ardilla', nombre: 'Ardilla', emoji: '🐿️', esCorrecta: false }
      ])
    },
    {
      etiqueta: 'Reto Espacial',
      pregunta: '¿Qué objeto está ENCIMA del escritorio?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="70" y="65" width="180" height="15" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
          <text x="160" y="52" fontSize="30" textAnchor="middle">📓</text>
          <text x="160" y="125" fontSize="30" textAnchor="middle">🎒</text>
        </svg>
      ),
      opciones: barajar([
        { id: 'Cuaderno', nombre: 'Cuaderno', emoji: '📓', esCorrecta: true },
        { id: 'Mochila', nombre: 'Mochila', emoji: '🎒', esCorrecta: false }
      ])
    }
  ];
  return elegirAleatorio(opcionesEspacio);
};

const crearRetoFiguraAleatorio = () => {
  const figuras = [
    {
      etiqueta: 'Reto Geométrico',
      pregunta: 'Tiene exactamente 3 esquinas y 3 lados. ¿Cuál figura es?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <polygon points="160,25 110,125 210,125" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="6" strokeLinejoin="round" />
        </svg>
      ),
      opciones: barajar([
        { id: 'triangulo', nombre: 'Triángulo', emoji: '🔺', esCorrecta: true },
        { id: 'cuadrado', nombre: 'Cuadrado', emoji: '🟦', esCorrecta: false },
        { id: 'circulo', nombre: 'Círculo', emoji: '⚪', esCorrecta: false }
      ])
    },
    {
      etiqueta: 'Mundo Real',
      pregunta: '¿Qué figura geométrica redonda tiene este rico pastel?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <circle cx="160" cy="75" r="48" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="4" />
          <text x="160" y="90" fontSize="46" textAnchor="middle">🎂</text>
        </svg>
      ),
      opciones: barajar([
        { id: 'circulo', nombre: 'Círculo', emoji: '⚪', esCorrecta: true },
        { id: 'rectangulo', nombre: 'Rectángulo', emoji: '🟩', esCorrecta: false },
        { id: 'triangulo', nombre: 'Triángulo', emoji: '🔺', esCorrecta: false }
      ])
    },
    {
      etiqueta: 'Reto Geométrico',
      pregunta: 'Sus 4 lados son gemelos exactamente iguales. ¿Cómo se llama?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="115" y="30" width="90" height="90" rx="10" fill="#BBF7D0" stroke="#16A34A" strokeWidth="6" />
        </svg>
      ),
      opciones: barajar([
        { id: 'cuadrado', nombre: 'Cuadrado', emoji: '🟦', esCorrecta: true },
        { id: 'rectangulo', nombre: 'Rectángulo', emoji: '🟩', esCorrecta: false },
        { id: 'circulo', nombre: 'Círculo', emoji: '⚪', esCorrecta: false }
      ])
    }
  ];
  return elegirAleatorio(figuras);
};

const crearRetoMemoriaRelampago = () => {
  const cartas = barajar([
    { idUnico: 'c1', idItem: 'peces', emoji: '🐠', nombre: 'Pez' },
    { idUnico: 'c2', idItem: 'peces', emoji: '🐠', nombre: 'Pez' },
    { idUnico: 'c3', idItem: 'estrellas', emoji: '⭐', nombre: 'Estrella' },
    { idUnico: 'c4', idItem: 'estrellas', emoji: '⭐', nombre: 'Estrella' }
  ]);

  return {
    etiqueta: 'Memoria Relámpago',
    esTipoMemoria: true,
    pregunta: '¡Minirreto de memoria! Encuentra las 2 parejas de cartas.',
    cartas
  };
};

const generarDiezRondasMixtas = () => {
  const generadores = [
    crearRetoEspacialAleatorio,
    crearRetoFiguraAleatorio,
    crearRetoMemoriaRelampago,
    crearRetoEspacialAleatorio,
    crearRetoFiguraAleatorio,
    crearRetoMemoriaRelampago,
    crearRetoEspacialAleatorio,
    crearRetoFiguraAleatorio,
    crearRetoEspacialAleatorio,
    crearRetoFiguraAleatorio
  ];

  const diezRondas = barajar(generadores).map((fn) => fn());

  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesCandidatos = barajar([2, 4, 6, 8]).slice(0, cantidadBonus);

  return diezRondas.map((ronda, i) => ({
    ...ronda,
    esBonusPistaScrapert: indicesCandidatos.includes(i)
  }));
};

const ACCESORIOS = ['lentes', 'gorra', 'soda', 'paleta'];

export default function JuegoMixto({ actividad, estudiante, alVolverAlMenu }) {
  const [rondasPartida, setRondasPartida] = useState([]);
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [accesorioActual, setAccesorioActual] = useState('lentes');

  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  const [parejasListas, setParejasListas] = useState([]);
  const [bloquearCartas, setBloquearCartas] = useState(false);

  useEffect(() => {
    iniciarPartida();
  }, []);

  const iniciarPartida = () => {
    const rondas = generarDiezRondasMixtas();
    setRondasPartida(rondas);
    setIndiceRonda(0);
    setPuntos(0);
    setAciertos(0);
    setFallos(0);
    setRespuestaSeleccionada(null);
    setEsAcierto(null);
    setCartasVolteadas([]);
    setParejasListas([]);
    setBloquearCartas(false);
    setJuegoTerminado(false);
    setAccesorioActual(elegirAleatorio(ACCESORIOS));
  };

  const rondaActual = rondasPartida[indiceRonda];

  const manejarSeleccion = (opcion) => {
    if (respuestaSeleccionada !== null) return;

    setRespuestaSeleccionada(opcion.id);
    const correcto = opcion.esCorrecta;
    setEsAcierto(correcto);

    if (correcto) {
      let pts = 15;
      if (rondaActual?.esBonusPistaScrapert) {
        pts *= 2;
        efectosSonoros.reproducirBonoDorado();
        confetti({ particleCount: 45, spread: 50 });
      } else {
        efectosSonoros.reproducirAcierto();
      }
      setPuntos((prev) => prev + pts);
      setAciertos((prev) => prev + 1);
    } else {
      efectosSonoros.reproducirFallo();
      setFallos((prev) => prev + 1);
    }

    avanzarSiguienteRonda();
  };

  const manejarClickCarta = (carta) => {
    if (bloquearCartas || parejasListas.includes(carta.idItem)) return;
    if (cartasVolteadas.some((c) => c.idUnico === carta.idUnico)) return;

    efectosSonoros.reproducirVolteoCarta();

    const nuevas = [...cartasVolteadas, carta];
    setCartasVolteadas(nuevas);

    if (nuevas.length === 2) {
      setBloquearCartas(true);
      if (nuevas[0].idItem === nuevas[1].idItem) {
        const nuevasResueltas = [...parejasListas, nuevas[0].idItem];
        setParejasListas(nuevasResueltas);
        setCartasVolteadas([]);
        setBloquearCartas(false);

        if (nuevasResueltas.length === 2) {
          let pts = 20;
          if (rondaActual?.esBonusPistaScrapert) {
            pts *= 2;
            efectosSonoros.reproducirBonoDorado();
            confetti({ particleCount: 45, spread: 50 });
          } else {
            efectosSonoros.reproducirAcierto();
          }
          setPuntos((prev) => prev + pts);
          setAciertos((prev) => prev + 1);
          setEsAcierto(true);
          avanzarSiguienteRonda();
        }
      } else {
        efectosSonoros.reproducirFallo();
        setTimeout(() => {
          setCartasVolteadas([]);
          setBloquearCartas(false);
        }, 900);
      }
    }
  };

  const avanzarSiguienteRonda = () => {
    setTimeout(() => {
      if (indiceRonda + 1 < rondasPartida.length) {
        setIndiceRonda((prev) => prev + 1);
        setRespuestaSeleccionada(null);
        setEsAcierto(null);
        setCartasVolteadas([]);
        setParejasListas([]);
        setBloquearCartas(false);
        setAccesorioActual(elegirAleatorio(ACCESORIOS));
      } else {
        setJuegoTerminado(true);
        setAccesorioActual('lentes');
      }
    }, 1300);
  };

  if (!rondaActual) return null;
  const esBonus = rondaActual.esBonusPistaScrapert;

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
          border: esBonus ? '3.5px solid #F59E0B' : '3px solid var(--color-amatista)',
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : '0 10px 25px rgba(153, 86, 222, 0.15)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#F3E8FF',
              color: 'var(--color-amatista)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              {rondaActual.etiqueta}
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
                ¡BONO DE SCRAPERT! PUNTOS DOBLES (x2)
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginTop: '8px' }}>
            {rondaActual.pregunta}
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.2rem' }}>
          <MascotaScrapert
            animacion={esAcierto === true ? 'baile' : esAcierto === false ? 'triste' : 'reposo'}
            accesorio={accesorioActual}
            mensaje={
              esAcierto === true 
                ? '¡Súper! ¡Completaste esta ronda mixta!' 
                : esBonus 
                  ? '¡Atento, es ronda especial con puntos dobles!' 
                  : '¡Vamos, Scrapert confía en ti!'
            }
            tamano={120}
          />
        </div>

        {rondaActual.esTipoMemoria ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
            maxWidth: '460px',
            margin: '0 auto'
          }}>
            {rondaActual.cartas.map((carta) => {
              const volteada = cartasVolteadas.some((c) => c.idUnico === carta.idUnico) || 
                               parejasListas.includes(carta.idItem);
              const lista = parejasListas.includes(carta.idItem);

              return (
                <div
                  key={carta.idUnico}
                  className={`contenedor-carta-memoria ${lista ? 'carta-acertada' : ''}`}
                  onClick={() => manejarClickCarta(carta)}
                >
                  <div className={`carta-giratoria ${volteada ? 'volteada' : ''}`}>
                    <div className="cara-carta cara-dorso">
                      <span style={{ fontSize: '2rem' }}>✨</span>
                    </div>
                    <div className="cara-carta cara-frente">
                      <span style={{ fontSize: '2.4rem' }}>{carta.emoji}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <>
            <div style={{
              background: '#FAFCFE',
              borderRadius: '20px',
              border: '2px solid #E2E8F0',
              padding: '0.8rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '1.2rem'
            }}>
              {rondaActual.escenario}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${rondaActual.opciones.length}, 1fr)`,
              gap: '14px'
            }}>
              {rondaActual.opciones.map((opcion) => {
                const estaElegida = respuestaSeleccionada === opcion.id;
                let claseBoton = esBonus ? 'boton-naranja' : 'boton-amatista';

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
                      padding: '16px 10px',
                      fontSize: '1.15rem',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: respuestaSeleccionada !== null && !estaElegida ? 0.6 : 1
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{opcion.emoji}</span>
                    <span>{opcion.nombre}</span>
                    {estaElegida && opcion.esCorrecta && <Check size={24} strokeWidth={3} />}
                    {estaElegida && !opcion.esCorrecta && <X size={24} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </MarcoJuego>
  );
}
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

const PALETA_COLORES = [
  { relleno: '#BAE6FD', borde: '#0284C7' },
  { relleno: '#BBF7D0', borde: '#16A34A' },
  { relleno: '#DDD6FE', borde: '#7C3AED' },
  { relleno: '#FED7AA', borde: '#EA580C' },
  { relleno: '#FECDD3', borde: '#E11D48' },
  { relleno: '#FEF08A', borde: '#CA8A04' }
];

const DICCIONARIO_FIGURAS = {
  circulo: { id: 'circulo', nombre: 'Círculo', emoji: '⚪' },
  cuadrado: { id: 'cuadrado', nombre: 'Cuadrado', emoji: '🟦' },
  triangulo: { id: 'triangulo', nombre: 'Triángulo', emoji: '🔺' },
  rectangulo: { id: 'rectangulo', nombre: 'Rectángulo', emoji: '🟩' }
};

// BANCO 1: SILUETAS GEOMÉTRICAS VARIADAS
const BANCO_SILUETAS = [
  {
    figuraId: 'circulo',
    detalle: '¿Qué figura geométrica redonda es esta?',
    dibujar: (c) => <circle cx="160" cy="75" r="46" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
  },
  {
    figuraId: 'circulo',
    detalle: 'Esta figura forma un aro perfecto sin ninguna esquina. ¿Cuál es?',
    dibujar: (c) => (
      <g>
        <circle cx="160" cy="75" r="48" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
        <circle cx="160" cy="75" r="22" fill="#FAFCFE" stroke={c.borde} strokeWidth="4" />
      </g>
    )
  },
  {
    figuraId: 'cuadrado',
    detalle: 'Sus 4 lados miden exactamente lo mismo. ¿Cómo se llama?',
    dibujar: (c) => <rect x="115" y="30" width="90" height="90" rx="10" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
  },
  {
    figuraId: 'cuadrado',
    detalle: 'Observa este bloque con sus 4 lados iguales. ¿Qué figura es?',
    dibujar: (c) => (
      <g>
        <rect x="115" y="30" width="90" height="90" rx="10" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
        <line x1="160" y1="30" x2="160" y2="120" stroke={c.borde} strokeWidth="3" strokeDasharray="4" />
        <line x1="115" y1="75" x2="205" y2="75" stroke={c.borde} strokeWidth="3" strokeDasharray="4" />
      </g>
    )
  },
  {
    figuraId: 'triangulo',
    detalle: 'Cuenta sus 3 esquinas con atención. ¿Cuál figura es?',
    dibujar: (c) => <polygon points="160,25 110,125 210,125" fill={c.relleno} stroke={c.borde} strokeWidth="6" strokeLinejoin="round" />
  },
  {
    figuraId: 'triangulo',
    detalle: 'Aunque esté hacia abajo, sigue teniendo 3 lados y 3 esquinas. ¿Cuál es?',
    dibujar: (c) => <polygon points="110,25 210,25 160,125" fill={c.relleno} stroke={c.borde} strokeWidth="6" strokeLinejoin="round" />
  },
  {
    figuraId: 'rectangulo',
    detalle: 'Tiene 2 lados largos y 2 lados cortos acostados. ¿Cuál figura es?',
    dibujar: (c) => <rect x="95" y="42" width="130" height="68" rx="10" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
  },
  {
    figuraId: 'rectangulo',
    detalle: 'Esta figura está de pie como una puerta. ¿Cómo se llama?',
    dibujar: (c) => <rect x="125" y="20" width="70" height="110" rx="10" fill={c.relleno} stroke={c.borde} strokeWidth="6" />
  }
];

// BANCO 2: MUNDO REAL EXTENDIDO
const BANCO_OBJETOS_REALES = [
  { objeto: 'Reloj de pared', figuraId: 'circulo', emoji: '⏰', detalle: '¿Qué figura geométrica redonda tiene este reloj?' },
  { objeto: 'Moneda dorada', figuraId: 'circulo', emoji: '🪙', detalle: '¿A qué figura mágica se parece esta monedita?' },
  { objeto: 'Rueda de bicicleta', figuraId: 'circulo', emoji: '🛞', detalle: '¿Qué figura forma la rueda para poder girar?' },
  { objeto: 'Dona glaseada', figuraId: 'circulo', emoji: '🍩', detalle: '¿Qué forma redondita y dulce tiene esta dona?' },
  { objeto: 'Botón de camisa', figuraId: 'circulo', emoji: '🔘', detalle: '¿Qué forma geométrica tiene el botón de la ropa?' },
  { objeto: 'Plato hondo', figuraId: 'circulo', emoji: '🍽️', detalle: '¿A qué figura geométrica se parece este plato?' },

  { objeto: 'Dado de juego', figuraId: 'cuadrado', emoji: '🎲', detalle: '¿Qué figura tienen los lados iguales de un dado?' },
  { objeto: 'Caja de regalo', figuraId: 'cuadrado', emoji: '🎁', detalle: '¿Qué forma tiene la tapa de este regalo sorpresa?' },
  { objeto: 'Ventana de casa', figuraId: 'cuadrado', emoji: '🪟', detalle: '¿Qué figura con 4 lados gemelos forma la ventana?' },
  { objeto: 'Cuadro de fotos', figuraId: 'cuadrado', emoji: '🖼️', detalle: '¿Qué forma tiene este portarretrato con 4 lados iguales?' },
  { objeto: 'Bloque de construcción', figuraId: 'cuadrado', emoji: '🧱', detalle: '¿Qué figura geométrica tiene la cara de este bloque?' },
  { objeto: 'Galleta de soda', figuraId: 'cuadrado', emoji: '🧇', detalle: '¿A qué figura con 4 esquinas iguales se parece esta galleta?' },

  { objeto: 'Rebanada de pizza', figuraId: 'triangulo', emoji: '🍕', detalle: '¿Qué figura con 3 esquinas tiene esta rica pizza?' },
  { objeto: 'Cono de helado', figuraId: 'triangulo', emoji: '🍦', detalle: '¿Qué forma tiene el barquillo de este helado?' },
  { objeto: 'Señal de peligro', figuraId: 'triangulo', emoji: '⚠️', detalle: '¿Qué figura geométrica de 3 lados tiene esta señal?' },
  { objeto: 'Gorro de fiesta', figuraId: 'triangulo', emoji: '🎉', detalle: '¿Qué figura en punta tiene este gorrito cumpleañero?' },
  { objeto: 'Tienda de campamento', figuraId: 'triangulo', emoji: '⛺', detalle: '¿Qué forma con 3 lados tiene la carpa de acampar?' },
  { objeto: 'Trozo de sandía', figuraId: 'triangulo', emoji: '🍉', detalle: '¿A qué figura geométrica se parece este corte de sandía?' },

  { objeto: 'Puerta de entrada', figuraId: 'rectangulo', emoji: '🚪', detalle: '¿Qué figura geométrica con 2 lados más largos tiene una puerta?' },
  { objeto: 'Pizarra escolar', figuraId: 'rectangulo', emoji: '📋', detalle: '¿A qué figura alargada se parece la pizarra de la clase?' },
  { objeto: 'Pantalla de televisión', figuraId: 'rectangulo', emoji: '📺', detalle: '¿Qué forma tiene la pantalla ancha de la tele?' },
  { objeto: 'Billete de dinero', figuraId: 'rectangulo', emoji: '💵', detalle: '¿Qué figura con 4 esquinas y lados desiguales es un billete?' },
  { objeto: 'Libro de cuentos', figuraId: 'rectangulo', emoji: '📘', detalle: '¿Qué figura geométrica forma la portada de este libro?' },
  { objeto: 'Barra de chocolate', figuraId: 'rectangulo', emoji: '🍫', detalle: '¿A qué figura alargada se parece esta barra de chocolate?' }
];

// BANCO 3: ADIVINANZAS GEOMÉTRICAS
const BANCO_ADIVINANZAS = [
  {
    figuraId: 'circulo',
    etiquetaTema: 'Enigma Redondo',
    icono: '🔮',
    pistaTexto: 'Si la pones en el piso rueda sin parar, ¡porque no tiene ni una sola esquina!'
  },
  {
    figuraId: 'circulo',
    etiquetaTema: 'Cielo Nocturno',
    icono: '🌕',
    pistaTexto: 'Es la forma redonda y completa que tiene la luna llena en la noche.'
  },
  {
    figuraId: 'triangulo',
    etiquetaTema: 'Geometría Puntiaguda',
    icono: '📐',
    pistaTexto: 'Cuenta conmigo: una esquina arriba y dos en la base... ¡Tiene exactamente 3 lados!'
  },
  {
    figuraId: 'triangulo',
    etiquetaTema: 'Enigma Picudo',
    icono: '🧀',
    pistaTexto: 'Es la forma en punta que tienen las pirámides y los trozos de queso suizo.'
  },
  {
    figuraId: 'cuadrado',
    etiquetaTema: 'Lados Gemelos',
    icono: '📦',
    pistaTexto: 'Tiene 4 esquinas perfectas y sus 4 lados son hermanitos exactamente iguales.'
  },
  {
    figuraId: 'cuadrado',
    etiquetaTema: 'Objetos en Bloque',
    icono: '🪟',
    pistaTexto: 'Es la figura simétrica de los dados de juguete y de las baldosas del suelo.'
  },
  {
    figuraId: 'rectangulo',
    etiquetaTema: 'Forma Alargada',
    icono: '📱',
    pistaTexto: 'Se parece al cuadrado pero se estiró: ¡tiene dos lados largos y dos lados cortos!'
  },
  {
    figuraId: 'rectangulo',
    etiquetaTema: 'Transporte y Espacio',
    icono: '🚌',
    pistaTexto: 'Es alargado, tiene 4 esquinas y es la misma forma de los autobuses de paseo.'
  }
];

const crearDiezRondasFiguras = () => {
  const todasLasLlaves = ['circulo', 'cuadrado', 'triangulo', 'rectangulo'];

  const siluetasElegidas = barajar(BANCO_SILUETAS).slice(0, 3).map((item) => {
    const color = elegirAleatorio(PALETA_COLORES);
    const distractores = barajar(todasLasLlaves.filter((k) => k !== item.figuraId)).slice(0, 2);
    const correcta = DICCIONARIO_FIGURAS[item.figuraId];

    return {
      subtipo: 'Silueta Visual',
      nivelTexto: 'Fase 1: Formas',
      pregunta: item.detalle,
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          {item.dibujar(color)}
        </svg>
      ),
      opciones: barajar([
        { id: correcta.id, nombre: correcta.nombre, emoji: correcta.emoji, esCorrecta: true },
        { id: distractores[0], nombre: DICCIONARIO_FIGURAS[distractores[0]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[0]].emoji, esCorrecta: false },
        { id: distractores[1], nombre: DICCIONARIO_FIGURAS[distractores[1]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[1]].emoji, esCorrecta: false }
      ])
    };
  });

  const objetosElegidos = barajar(BANCO_OBJETOS_REALES).slice(0, 4).map((item) => {
    const distractores = barajar(todasLasLlaves.filter((k) => k !== item.figuraId)).slice(0, 2);
    const correcta = DICCIONARIO_FIGURAS[item.figuraId];

    return {
      subtipo: 'Mundo Real',
      nivelTexto: 'Fase 2: Objetos',
      pregunta: item.detalle,
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <circle cx="160" cy="75" r="50" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="4" />
          <text x="160" y="88" fontSize="46" textAnchor="middle">{item.emoji}</text>
          <text x="160" y="138" fontSize="13" fontWeight="900" fill="#78350F" textAnchor="middle">
            {item.objeto.toUpperCase()}
          </text>
        </svg>
      ),
      opciones: barajar([
        { id: correcta.id, nombre: correcta.nombre, emoji: correcta.emoji, esCorrecta: true },
        { id: distractores[0], nombre: DICCIONARIO_FIGURAS[distractores[0]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[0]].emoji, esCorrecta: false },
        { id: distractores[1], nombre: DICCIONARIO_FIGURAS[distractores[1]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[1]].emoji, esCorrecta: false }
      ])
    };
  });

  const adivinanzasElegidas = barajar(BANCO_ADIVINANZAS).slice(0, 3).map((item) => {
    const distractores = barajar(todasLasLlaves.filter((k) => k !== item.figuraId)).slice(0, 2);
    const correcta = DICCIONARIO_FIGURAS[item.figuraId];

    return {
      subtipo: item.etiquetaTema,
      nivelTexto: 'Fase 3: Adivinanza',
      pregunta: item.pistaTexto,
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="50" y="30" width="220" height="90" rx="16" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="3" />
          <text x="160" y="78" fontSize="38" textAnchor="middle">{item.icono}</text>
          <text x="160" y="108" fontSize="12" fontWeight="900" fill="#475569" textAnchor="middle">
            ¡ADIVINA LA FIGURA OCULTA!
          </text>
        </svg>
      ),
      opciones: barajar([
        { id: correcta.id, nombre: correcta.nombre, emoji: correcta.emoji, esCorrecta: true },
        { id: distractores[0], nombre: DICCIONARIO_FIGURAS[distractores[0]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[0]].emoji, esCorrecta: false },
        { id: distractores[1], nombre: DICCIONARIO_FIGURAS[distractores[1]].nombre, emoji: DICCIONARIO_FIGURAS[distractores[1]].emoji, esCorrecta: false }
      ])
    };
  });

  const diezRondas = [...siluetasElegidas, ...objetosElegidos, ...adivinanzasElegidas];

  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesCandidatos = barajar([2, 4, 6, 8]).slice(0, cantidadBonus);

  return diezRondas.map((ronda, indice) => {
    if (indicesCandidatos.includes(indice)) {
      return {
        ...ronda,
        esBonusPistaScrapert: true
      };
    }
    return ronda;
  });
};

const ACCESORIOS = ['ninguno', 'lentes', 'gorra', 'soda', 'paleta'];

export default function JuegoFiguras({ actividad, estudiante, alVolverAlMenu }) {
  const [rondasPartida, setRondasPartida] = useState([]);
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [accesorioActual, setAccesorioActual] = useState('ninguno');

  useEffect(() => {
    iniciarPartidaCompleta();
  }, []);

  const iniciarPartidaCompleta = () => {
    const diezRondas = crearDiezRondasFiguras();
    setRondasPartida(diezRondas);
    setIndiceRonda(0);
    setPuntos(0);
    setAciertos(0);
    setFallos(0);
    setRespuestaSeleccionada(null);
    setEsAcierto(null);
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
      let puntosRonda = actividad.puntos_recompensa;
      if (rondaActual?.esBonusPistaScrapert) {
        puntosRonda *= 2;
        efectosSonoros.reproducirBonoDorado();
        confetti({ particleCount: 45, spread: 50, origin: { y: 0.7 } });
      } else {
        efectosSonoros.reproducirAcierto();
      }

      setPuntos((prev) => prev + puntosRonda);
      setAciertos((prev) => prev + 1);
    } else {
      efectosSonoros.reproducirFallo();
      setFallos((prev) => prev + 1);
    }

    setTimeout(() => {
      if (indiceRonda + 1 < rondasPartida.length) {
        setIndiceRonda((prev) => prev + 1);
        setRespuestaSeleccionada(null);
        setEsAcierto(null);
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
      alReiniciar={iniciarPartidaCompleta}
    >
      <div 
        className="tarjeta-juego"
        style={{
          border: esBonus ? '3.5px solid #F59E0B' : undefined,
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : undefined,
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: esBonus ? '#FEF3C7' : '#F3E8FF',
              color: esBonus ? '#B45309' : 'var(--color-amatista)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {rondaActual.subtipo}
            </span>

            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {rondaActual.nivelTexto}
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
                boxShadow: '0 4px 10px rgba(255, 122, 0, 0.35)',
                animation: 'saltitoFeliz 0.8s ease infinite'
              }}>
                <Sparkles size={16} />
                ¡PISTA DE SCRAPERT! PUNTOS DOBLES (x2)
              </span>
            )}
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginTop: '8px' }}>
            {rondaActual.pregunta}
          </h2>
        </div>

        <div style={{
          background: esBonus ? '#FFFDF5' : '#FAFCFE',
          borderRadius: '20px',
          border: esBonus ? '2px dashed #F59E0B' : '2px solid #E2E8F0',
          padding: '0.8rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '1.2rem'
        }}>
          {rondaActual.escenario}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <MascotaScrapert
            animacion={
              esAcierto === true 
                ? 'baile' 
                : esAcierto === false 
                  ? 'triste' 
                  : esBonus 
                    ? 'sorpresa' 
                    : 'reposo'
            }
            accesorio={esBonus ? 'lentes' : accesorioActual}
            mensaje={
              esAcierto === true 
                ? (esBonus ? '¡GENIAL! ¡Puntos dobles ganados!' : '¡Esa es la figura correcta!') 
                : esAcierto === false 
                  ? '¡Oh! Cuenta los lados y lo lograrás' 
                  : esBonus 
                    ? '¡Atento! ¡Pista de Scrapert dorada activa!' 
                    : 'Toca la tarjeta de la figura correspondiente'
            }
            tamano={130}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {rondaActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.id;
            let claseBoton = esBonus ? 'boton-naranja' : 'boton-turquesa';

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
      </div>
    </MarcoJuego>
  );
}
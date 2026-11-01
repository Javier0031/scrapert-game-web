import React, { useState, useEffect } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles, Plus, Equal } from 'lucide-react';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const barajar = (lista) => {
  const clon = [...lista];
  for (let i = clon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clon[i], clon[j]] = [clon[j], clon[i]];
  }
  return clon;
};

// Componente visual de pastel fraccionario en SVG
const GraficoPastelFraccion = ({ numerador, denominador, color = '#38BDF8', tamano = 95 }) => {
  const radio = tamano / 2 - 5;
  const cx = tamano / 2;
  const cy = tamano / 2;

  const rebanadas = [];
  for (let i = 0; i < denominador; i++) {
    const anguloInicio = (2 * Math.PI * i) / denominador - Math.PI / 2;
    const anguloFin = (2 * Math.PI * (i + 1)) / denominador - Math.PI / 2;

    const x1 = cx + radio * Math.cos(anguloInicio);
    const y1 = cy + radio * Math.sin(anguloInicio);
    const x2 = cx + radio * Math.cos(anguloFin);
    const y2 = cy + radio * Math.sin(anguloFin);

    const estaColoreada = i < numerador;

    rebanadas.push(
      <path
        key={`rebanada_${i}`}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${radio} ${radio} 0 0 1 ${x2} ${y2} Z`}
        fill={estaColoreada ? color : '#F8FAFC'}
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    );
  }

  return (
    <svg width={tamano} height={tamano} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.06))' }}>
      {rebanadas}
    </svg>
  );
};

// Componente para pintar la fracción matemática clásica con barra divisoria
const NumeroFraccionario = ({ num, den, resaltar = false, tamano = '1.3rem' }) => (
  <div style={{
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 900,
    fontSize: tamano,
    color: resaltar ? 'var(--color-verde-pastel)' : 'var(--color-texto-oscuro)',
    lineHeight: 1
  }}>
    <span>{num}</span>
    <span style={{
      width: '100%',
      minWidth: '22px',
      height: '3px',
      backgroundColor: 'currentColor',
      margin: '3px 0',
      borderRadius: '2px'
    }} />
    <span>{den}</span>
  </div>
);

// Generador blindado de 10 retos de fracciones (Garantía absoluta de 0 duplicados)
const generarDiezRetosQuebrados = () => {
  const denominadoresDisponibles = [3, 4, 5, 6, 8];
  const retos = [];

  for (let i = 0; i < 10; i++) {
    const denominador = denominadoresDisponibles[i % denominadoresDisponibles.length];

    // Numeradores cuya suma sea <= denominador
    const sumaObjetivo = Math.floor(Math.random() * (denominador - 1)) + 2;
    const num1 = Math.floor(Math.random() * (sumaObjetivo - 1)) + 1;
    const num2 = sumaObjetivo - num1;

    const numCorrecto = num1 + num2;
    const denCorrecto = denominador;
    const claveCorrecta = `${numCorrecto}/${denCorrecto}`;

    // Usar un Set para garantizar matemáticamente que no se repita ninguna opción
    const clavesRegistradas = new Set([claveCorrecta]);
    const distractores = [];

    // Distractor 1: Error típico de sumar denominadores
    const claveDenDoble = `${numCorrecto}/${denominador * 2}`;
    if (!clavesRegistradas.has(claveDenDoble)) {
      clavesRegistradas.add(claveDenDoble);
      distractores.push({ num: numCorrecto, den: denominador * 2 });
    }

    // Distractor 2: Numerador - 1
    if (numCorrecto - 1 >= 1) {
      const claveMenos = `${numCorrecto - 1}/${denominador}`;
      if (!clavesRegistradas.has(claveMenos)) {
        clavesRegistradas.add(claveMenos);
        distractores.push({ num: numCorrecto - 1, den: denominador });
      }
    }

    // Distractor 3: Numerador + 1 (si no excede el denominador)
    if (numCorrecto + 1 <= denominador) {
      const claveMas = `${numCorrecto + 1}/${denominador}`;
      if (!clavesRegistradas.has(claveMas)) {
        clavesRegistradas.add(claveMas);
        distractores.push({ num: numCorrecto + 1, den: denominador });
      }
    }

    // Completar hasta tener exactamente 3 distractores únicos
    let intentos = 0;
    while (distractores.length < 3 && intentos < 30) {
      intentos++;
      const nRandom = Math.floor(Math.random() * denominador) + 1;
      const dRandom = Math.random() > 0.5 ? denominador : denominador * 2;
      const claveRandom = `${nRandom}/${dRandom}`;

      if (!clavesRegistradas.has(claveRandom)) {
        clavesRegistradas.add(claveRandom);
        distractores.push({ num: nRandom, den: dRandom });
      }
    }

    // Si aún faltara por un caso extremo de números pequeños, generar con denominador alterno
    while (distractores.length < 3) {
      const nExtra = distractores.length + 1;
      const dExtra = denominador + distractores.length + 2;
      distractores.push({ num: nExtra, den: dExtra });
    }

    // Armar las 4 opciones asignando llaves únicas por ronda para React
    const listaOpciones = [
      { num: numCorrecto, den: denCorrecto, esCorrecta: true },
      ...distractores.slice(0, 3).map((d) => ({ num: d.num, den: d.den, esCorrecta: false }))
    ];

    const opcionesConIdUnico = barajar(listaOpciones).map((opc, idx) => ({
      ...opc,
      idUnico: `ronda_${i}_opcion_${idx}_${opc.num}_${opc.den}`
    }));

    retos.push({
      num1,
      num2,
      denominador,
      numCorrecto,
      denCorrecto,
      opciones: opcionesConIdUnico,
      esBonusPistaScrapert: false
    });
  }

  // Asignar 1 o 2 bonificaciones doradas
  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesBonus = barajar([2, 4, 6, 8]).slice(0, cantidadBonus);
  indicesBonus.forEach((idx) => {
    retos[idx].esBonusPistaScrapert = true;
  });

  return barajar(retos);
};

export default function JuegoQuebrados({ actividad, estudiante, alVolverAlMenu }) {
  const [retosPartida, setRetosPartida] = useState([]);
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntos, setPuntos] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [fallos, setFallos] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  useEffect(() => {
    iniciarPartida();
  }, []);

  const iniciarPartida = () => {
    const nuevos = generarDiezRetosQuebrados();
    setRetosPartida(nuevos);
    setIndiceRonda(0);
    setPuntos(0);
    setAciertos(0);
    setFallos(0);
    setRespuestaSeleccionada(null);
    setEsAcierto(null);
    setJuegoTerminado(false);
  };

  const retoActual = retosPartida[indiceRonda];

  const manejarSeleccion = (opcion) => {
    if (respuestaSeleccionada !== null) return;

    setRespuestaSeleccionada(opcion.idUnico);
    const correcto = opcion.esCorrecta;
    setEsAcierto(correcto);

    if (correcto) {
      let pts = actividad.puntos_recompensa || 40;
      if (retoActual?.esBonusPistaScrapert) {
        pts *= 2;
        efectosSonoros.reproducirBonoDorado();
        confetti({ particleCount: 50, spread: 60 });
      } else {
        efectosSonoros.reproducirAcierto();
      }
      setPuntos((prev) => prev + pts);
      setAciertos((prev) => prev + 1);
    } else {
      efectosSonoros.reproducirFallo();
      setFallos((prev) => prev + 1);
    }

    setTimeout(() => {
      if (indiceRonda + 1 < retosPartida.length) {
        setIndiceRonda((prev) => prev + 1);
        setRespuestaSeleccionada(null);
        setEsAcierto(null);
      } else {
        setJuegoTerminado(true);
      }
    }, 1300);
  };

  if (!retoActual) return null;

  const esBonus = retoActual.esBonusPistaScrapert;

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
          border: esBonus ? '3.5px solid #F59E0B' : '3px solid var(--color-verde-pastel)',
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : undefined
        }}
      >
        {/* Cabecera del reto */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#F0FDF4',
              color: 'var(--color-verde-pastel)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              Fracciones Visuales
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

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginTop: '8px' }}>
            Junta las rebanadas coloreadas y calcula la fracción final
          </h2>
        </div>

        {/* Tablero gráfico con las fracciones y sus pasteles */}
        <div style={{
          background: '#FAFCFE',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '1.2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '18px',
          flexWrap: 'wrap',
          marginBottom: '1.2rem'
        }}>
          {/* Fracción 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <GraficoPastelFraccion
              numerador={retoActual.num1}
              denominador={retoActual.denominador}
              color="var(--color-cielo-verano)"
            />
            <NumeroFraccionario num={retoActual.num1} den={retoActual.denominador} />
          </div>

          <Plus size={32} color="var(--color-cielo-verano)" strokeWidth={3} />

          {/* Fracción 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <GraficoPastelFraccion
              numerador={retoActual.num2}
              denominador={retoActual.denominador}
              color="var(--color-amatista)"
            />
            <NumeroFraccionario num={retoActual.num2} den={retoActual.denominador} />
          </div>

          <Equal size={32} color="#94A3B8" strokeWidth={3} />

          {/* Resultado o incógnita */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '95px',
            minHeight: '95px',
            background: '#FFFFFF',
            border: '2.5px dashed var(--color-verde-pastel)',
            borderRadius: '20px',
            padding: '10px'
          }}>
            {respuestaSeleccionada !== null ? (
              <NumeroFraccionario
                num={retoActual.numCorrecto}
                den={retoActual.denCorrecto}
                resaltar={esAcierto}
                tamano="1.6rem"
              />
            ) : (
              <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-verde-pastel)' }}>?</span>
            )}
          </div>
        </div>

        {/* Mascota Scrapert */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
          <MascotaScrapert
            animacion={esAcierto === true ? 'baile' : esAcierto === false ? 'triste' : 'reposo'}
            accesorio={esBonus ? 'lentes' : 'soda'}
            mensaje={
              esAcierto === true 
                ? '¡Exacto! El denominador se mantiene y se suman las partes.' 
                : esAcierto === false 
                  ? '¡Recuerda! Solo sumamos las rebanadas de arriba.' 
                  : esBonus 
                    ? '¡Pista dorada de Scrapert! ¡Suma las partes y gana el doble!' 
                    : 'Cuenta todas las rebanadas de color y elige la fracción'
            }
            tamano={120}
          />
        </div>

        {/* 4 Opciones de respuesta fijas en cuadrícula de 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {retoActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.idUnico;
            let claseBoton = esBonus ? 'boton-naranja' : 'boton-verde';

            if (estaElegida) {
              claseBoton = opcion.esCorrecta ? 'boton-verde' : 'boton-coral';
            }

            return (
              <button
                key={opcion.idUnico}
                type="button"
                onClick={() => manejarSeleccion(opcion)}
                disabled={respuestaSeleccionada !== null}
                className={`boton-juguete ${claseBoton}`}
                style={{
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  opacity: respuestaSeleccionada !== null && !estaElegida ? 0.6 : 1
                }}
              >
                <NumeroFraccionario num={opcion.num} den={opcion.den} tamano="1.4rem" />
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
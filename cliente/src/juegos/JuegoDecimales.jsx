import React, { useState, useEffect } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
import { Check, X, Sparkles, ShoppingBag, ShoppingCart } from 'lucide-react';
import { efectosSonoros } from '../utilidades/musicaFondo.js';

const barajar = (lista) => {
  const clon = [...lista];
  for (let i = clon.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [clon[i], clon[j]] = [clon[j], clon[i]];
  }
  return clon;
};

// Catálogo de productos de la tiendita con precios decimales amigables
const CATALOGO_PRODUCTOS = [
  { nombre: 'Manzana roja', emoji: '🍎', precio: 1.50 },
  { nombre: 'Caja de jugo', emoji: '🧃', precio: 2.25 },
  { nombre: 'Paleta dulce', emoji: '🍭', precio: 0.75 },
  { nombre: 'Croissant horneado', emoji: '🥐', precio: 1.25 },
  { nombre: 'Helado de fresa', emoji: '🍦', precio: 2.50 },
  { nombre: 'Galleta con chispas', emoji: '🍪', precio: 0.50 },
  { nombre: 'Taza de leche', emoji: '🥛', precio: 3.25 },
  { nombre: 'Dona glaseada', emoji: '🍩', precio: 1.75 },
  { nombre: 'Bolsa de palomitas', emoji: '🍿', precio: 2.00 },
  { nombre: 'Barrita de chocolate', emoji: '🍫', precio: 2.75 },
  { nombre: 'Rebanada de sandía', emoji: '🍉', precio: 1.80 },
  { nombre: 'Muffin de vainilla', emoji: '🧁', precio: 2.10 }
];

// Generador de 10 retos de compras con números decimales
const generarDiezRetosDecimales = () => {
  const retos = [];
  const productosBarajados = barajar(CATALOGO_PRODUCTOS);

  for (let i = 0; i < 10; i++) {
    const item = productosBarajados[i % productosBarajados.length];
    // Cantidad a comprar: entre 2 y 5 unidades
    const cantidad = Math.floor(Math.random() * 4) + 2;
    const totalExacto = Number((item.precio * cantidad).toFixed(2));

    const claveCorrecta = totalExacto.toFixed(2);
    const opcionesRegistradas = new Set([claveCorrecta]);
    const distractores = [];

    // Distractor 1: Error de punto decimal desplazado o suma
    const distractorSuma = Number((item.precio + cantidad).toFixed(2));
    if (!opcionesRegistradas.has(distractorSuma.toFixed(2))) {
      opcionesRegistradas.add(distractorSuma.toFixed(2));
      distractores.push(distractorSuma);
    }

    // Distractor 2: Desfase de centavos (+0.50 o -0.50)
    const distractorCents = Number((totalExacto + (Math.random() > 0.5 ? 0.50 : -0.50)).toFixed(2));
    if (distractorCents > 0 && !opcionesRegistradas.has(distractorCents.toFixed(2))) {
      opcionesRegistradas.add(distractorCents.toFixed(2));
      distractores.push(distractorCents);
    }

    // Distractor 3: Desfase de una unidad (+1.00 o -1.00)
    const distractorUnidad = Number((totalExacto + (Math.random() > 0.5 ? 1.00 : -1.00)).toFixed(2));
    if (distractorUnidad > 0 && !opcionesRegistradas.has(distractorUnidad.toFixed(2))) {
      opcionesRegistradas.add(distractorUnidad.toFixed(2));
      distractores.push(distractorUnidad);
    }

    // Rellenar si hiciera falta hasta tener 3 distractores únicos
    let intentos = 0;
    while (distractores.length < 3 && intentos < 20) {
      intentos++;
      const valorRandom = Number((totalExacto + (Math.floor(Math.random() * 4) + 1) * 0.25 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2));
      if (valorRandom > 0 && !opcionesRegistradas.has(valorRandom.toFixed(2))) {
        opcionesRegistradas.add(valorRandom.toFixed(2));
        distractores.push(valorRandom);
      }
    }

    while (distractores.length < 3) {
      const extra = Number((totalExacto + distractores.length + 0.75).toFixed(2));
      distractores.push(extra);
    }

    // Crear las 4 opciones con idUnico blindado por ronda
    const listaOpciones = [
      { valor: totalExacto, esCorrecta: true },
      ...distractores.slice(0, 3).map((v) => ({ valor: v, esCorrecta: false }))
    ];

    const opcionesConId = barajar(listaOpciones).map((opc, idx) => ({
      ...opc,
      idUnico: `ronda_${i}_opc_${idx}_${opc.valor.toFixed(2)}`
    }));

    retos.push({
      item,
      cantidad,
      totalExacto,
      opciones: opcionesConId,
      esBonusPistaScrapert: false
    });
  }

  // Asignar 1 o 2 bonificaciones doradas
  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesBonus = barajar([2, 4, 6, 8]).slice(0, cantidadBonus);
  indicesBonus.forEach((idx) => {
    retos[idx].esBonusPistaScrapert = true;
  });

  return retos;
};

export default function JuegoDecimales({ actividad, estudiante, alVolverAlMenu }) {
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
    const nuevos = generarDiezRetosDecimales();
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
      let pts = actividad.puntos_recompensa || 50;
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
          border: esBonus ? '3.5px solid #F59E0B' : '3px solid var(--color-rosa-texas)',
          boxShadow: esBonus ? '0 10px 30px rgba(245, 158, 11, 0.22)' : undefined
        }}
      >
        {/* Cabecera del reto */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: '#FFF1F2',
              color: 'var(--color-rosa-texas)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              La Tiendita de Scrapert
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
            ¿Cuánto dinero costarán {retoActual.cantidad} unidades de {retoActual.item.nombre}?
          </h2>
        </div>

        {/* Mostrador de la Tiendita con productos alineados */}
        <div style={{
          background: '#FAFCFE',
          borderRadius: '24px',
          border: '2px solid #E2E8F0',
          padding: '1.4rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          marginBottom: '1.2rem'
        }}>
          {/* Fila de productos comprados */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {Array.from({ length: retoActual.cantidad }).map((_, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #CBD5E1',
                  borderRadius: '18px',
                  padding: '10px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.04)'
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>{retoActual.item.emoji}</span>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: 'var(--color-texto-oscuro)',
                  backgroundColor: '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: '8px',
                  marginTop: '4px'
                }}>
                  Q{retoActual.item.precio.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Ecuación matemática clara de la compra */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--color-texto-oscuro)',
            backgroundColor: '#F8FAFC',
            padding: '8px 20px',
            borderRadius: '16px',
            border: '2px solid #E2E8F0'
          }}>
            <span>{retoActual.cantidad}</span>
            <span style={{ color: 'var(--color-rosa-texas)' }}>×</span>
            <span>Q{retoActual.item.precio.toFixed(2)}</span>
            <span style={{ color: '#94A3B8' }}>=</span>
            <span style={{
              color: esAcierto !== null ? (esAcierto ? 'var(--color-verde-pastel)' : '#EF4444') : 'var(--color-rosa-texas)',
              minWidth: '70px',
              textAlign: 'center'
            }}>
              {respuestaSeleccionada !== null ? `Q${retoActual.totalExacto.toFixed(2)}` : 'Q ?'}
            </span>
          </div>
        </div>

        {/* Mascota Scrapert */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.4rem' }}>
          <MascotaScrapert
            animacion={esAcierto === true ? 'baile' : esAcierto === false ? 'triste' : 'reposo'}
            accesorio={esBonus ? 'lentes' : 'gorra'}
            mensaje={
              esAcierto === true 
                ? '¡Cobro exacto! ¡Qué gran cajero eres!' 
                : esAcierto === false 
                  ? '¡Ups! Multiplica precio por cantidad con cuidado.' 
                  : esBonus 
                    ? '¡Pista dorada activa! Multiplica los decimales y duplica puntos.' 
                    : 'Selecciona la cantidad de dinero exacta a pagar'
            }
            tamano={120}
          />
        </div>

        {/* 4 Opciones de respuesta fijas en cuadrícula de 2x2 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {retoActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.idUnico;
            let claseBoton = esBonus ? 'boton-naranja' : 'boton-coral';

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
                  padding: '16px',
                  fontSize: '1.45rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: respuestaSeleccionada !== null && !estaElegida ? 0.6 : 1
                }}
              >
                <span>Q{opcion.valor.toFixed(2)}</span>
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
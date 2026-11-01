import React, { useState, useEffect } from 'react';
import MarcoJuego from '../componentes/MarcoJuego.jsx';
import MascotaScrapert from '../componentes/MascotaScrapert.jsx';
import confetti from 'canvas-confetti';
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

const BANCO_ELEMENTOS = [
  { idItem: 'pescado', nombre: 'Pescadito', emoji: '🐟' },
  { idItem: 'leche', nombre: 'Taza de leche', emoji: '🥛' },
  { idItem: 'ovillo', nombre: 'Ovillo de lana', emoji: '🧶' },
  { idItem: 'raton', nombre: 'Ratoncito', emoji: '🐭' },
  { idItem: 'huellita', nombre: 'Huellita', emoji: '🐾' },
  { idItem: 'cascabel', nombre: 'Cascabel', emoji: '🔔' },
  { idItem: 'cojin', nombre: 'Cojín suave', emoji: '🛋️' },
  { idItem: 'estrella', nombre: 'Estrella', emoji: '⭐' },
  { idItem: 'corazon', nombre: 'Corazoncito', emoji: '💖' },
  { idItem: 'pizza', nombre: 'Rebanada', emoji: '🍕' },
  { idItem: 'cohete', nombre: 'Cohete veloz', emoji: '🚀' },
  { idItem: 'pelota', nombre: 'Pelota', emoji: '⚽' }
];

const CONFIGURACION_NIVELES = [
  { nivel: 1, nombreNivel: 'Nivel 1: Cachorro', parejasRequeridas: 3, columnas: 'repeat(3, 1fr)' },
  { nivel: 2, nombreNivel: 'Nivel 2: Explorador', parejasRequeridas: 4, columnas: 'repeat(4, 1fr)' },
  { nivel: 3, nombreNivel: 'Nivel 3: Maestro Felino', parejasRequeridas: 6, columnas: 'repeat(4, 1fr)' }
];

const TOTAL_PAREJAS_PARTIDA = CONFIGURACION_NIVELES.reduce(
  (acumulado, nivel) => acumulado + nivel.parejasRequeridas, 
  0
);

const ACCESORIOS = ['ninguno', 'gorra', 'paleta', 'soda', 'lentes'];

export default function JuegoMemoria({ actividad, estudiante, alVolverAlMenu }) {
  const [indiceNivel, setIndiceNivel] = useState(0);
  const [cartasTablero, setCartasTablero] = useState([]);
  const [cartasSeleccionadas, setCartasSeleccionadas] = useState([]);
  const [idsParejasResueltas, setIdsParejasResueltas] = useState([]);
  const [bloquearTablero, setBloquearTablero] = useState(false);

  const [puntos, setPuntos] = useState(0);
  const [parejasEncontradasTotales, setParejasEncontradasTotales] = useState(0);
  const [fallosTotales, setFallosTotales] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const [estadoScrapert, setEstadoScrapert] = useState('reposo');
  const [mensajeScrapert, setMensajeScrapert] = useState('Toca dos tarjetas para descubrir sus parejas');
  const [accesorioActual, setAccesorioActual] = useState('ninguno');

  const nivelActual = CONFIGURACION_NIVELES[indiceNivel];

  useEffect(() => {
    prepararTablero(indiceNivel);
  }, [indiceNivel]);

  const prepararTablero = (nivelIdx) => {
    const config = CONFIGURACION_NIVELES[nivelIdx];
    const elementosElegidos = barajar(BANCO_ELEMENTOS).slice(0, config.parejasRequeridas);

    const cartasDuplicadas = [];
    elementosElegidos.forEach((elem, index) => {
      cartasDuplicadas.push({
        idUnico: `carta_${index}_a`,
        idItem: elem.idItem,
        nombre: elem.nombre,
        emoji: elem.emoji
      });
      cartasDuplicadas.push({
        idUnico: `carta_${index}_b`,
        idItem: elem.idItem,
        nombre: elem.nombre,
        emoji: elem.emoji
      });
    });

    setCartasTablero(barajar(cartasDuplicadas));
    setCartasSeleccionadas([]);
    setIdsParejasResueltas([]);
    setBloquearTablero(false);
    setEstadoScrapert('reposo');
    setMensajeScrapert(`¡${config.nombreNivel}! Encuentra las ${config.parejasRequeridas} parejas.`);
    setAccesorioActual(elegirAleatorio(ACCESORIOS));
  };

  const manejarClickCarta = (carta) => {
    if (bloquearTablero) return;
    if (idsParejasResueltas.includes(carta.idItem)) return;
    if (cartasSeleccionadas.some((c) => c.idUnico === carta.idUnico)) return;

    efectosSonoros.reproducirVolteoCarta();

    const nuevasSeleccionadas = [...cartasSeleccionadas, carta];
    setCartasSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === 2) {
      setBloquearTablero(true);
      const [primera, segunda] = nuevasSeleccionadas;

      if (primera.idItem === segunda.idItem) {
        efectosSonoros.reproducirAcierto();
        setIdsParejasResueltas((prev) => [...prev, primera.idItem]);
        setPuntos((prev) => prev + actividad.puntos_recompensa);
        setParejasEncontradasTotales((prev) => prev + 1);
        setEstadoScrapert('baile');
        setMensajeScrapert(`¡Genial! ¡Encontraste la pareja de ${primera.nombre}!`);

        const parejasEnNivel = idsParejasResueltas.length + 1;
        if (parejasEnNivel === nivelActual.parejasRequeridas) {
          setTimeout(() => {
            if (indiceNivel + 1 < CONFIGURACION_NIVELES.length) {
              confetti({ particleCount: 50, spread: 60 });
              setIndiceNivel((prev) => prev + 1);
            } else {
              setJuegoTerminado(true);
              setEstadoScrapert('feliz');
              setAccesorioActual('lentes');
              setMensajeScrapert('¡Completaste todos los niveles de memoria!');
            }
          }, 1000);
        }

        setTimeout(() => {
          setCartasSeleccionadas([]);
          setBloquearTablero(false);
        }, 600);

      } else {
        efectosSonoros.reproducirFallo();
        setFallosTotales((prev) => prev + 1);
        setEstadoScrapert('triste');
        setMensajeScrapert('¡Oh, son distintas! Memoriza su lugar.');

        setTimeout(() => {
          setCartasSeleccionadas([]);
          setBloquearTablero(false);
          setEstadoScrapert('reposo');
        }, 1100);
      }
    }
  };

  const reiniciarJuegoCompleto = () => {
    setIndiceNivel(0);
    setPuntos(0);
    setParejasEncontradasTotales(0);
    setFallosTotales(0);
    setJuegoTerminado(false);
    prepararTablero(0);
  };

  return (
    <MarcoJuego
      actividad={actividad}
      estudiante={estudiante}
      totalRondas={TOTAL_PAREJAS_PARTIDA}
      rondaActual={parejasEncontradasTotales + 1}
      puntosAcumulados={puntos}
      aciertos={parejasEncontradasTotales}
      fallos={fallosTotales}
      juegoTerminado={juegoTerminado}
      alSalir={alVolverAlMenu}
      alReiniciar={reiniciarJuegoCompleto}
    >
      <div className="tarjeta-juego">
        <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#EFF6FF',
              color: 'var(--color-azul-pizarra)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              Memoria Visual
            </span>
            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {nivelActual.nombreNivel}
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', marginTop: '8px' }}>
            Encuentra las parejas ({idsParejasResueltas.length} de {nivelActual.parejasRequeridas} en este nivel)
          </h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <MascotaScrapert
            animacion={estadoScrapert}
            accesorio={accesorioActual}
            mensaje={mensajeScrapert}
            tamano={125}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: nivelActual.columnas,
          gap: '14px',
          maxWidth: '560px',
          margin: '0 auto'
        }}>
          {cartasTablero.map((carta) => {
            const estaVolteada = cartasSeleccionadas.some((c) => c.idUnico === carta.idUnico) || 
                                 idsParejasResueltas.includes(carta.idItem);
            const estaResuelta = idsParejasResueltas.includes(carta.idItem);

            return (
              <div
                key={carta.idUnico}
                className={`contenedor-carta-memoria ${estaResuelta ? 'carta-acertada' : ''}`}
                onClick={() => manejarClickCarta(carta)}
              >
                <div className={`carta-giratoria ${estaVolteada ? 'volteada' : ''}`}>
                  <div className="cara-carta cara-dorso">
                    <span style={{ fontSize: '2.4rem' }}>✨</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      letterSpacing: '1px',
                      marginTop: '4px',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                      SCRAPERT
                    </span>
                  </div>

                  <div className="cara-carta cara-frente">
                    <span style={{ fontSize: '2.5rem' }}>{carta.emoji}</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      color: 'var(--color-texto-oscuro)',
                      marginTop: '4px'
                    }}>
                      {carta.nombre}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MarcoJuego>
  );
}
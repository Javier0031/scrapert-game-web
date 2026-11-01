import React from 'react';
import MascotaScrapert from './MascotaScrapert.jsx';
import { X, CheckCircle, Lightbulb, Play } from 'lucide-react';

// Diccionario de reglas sencillas adaptadas para niños
const GUIA_POR_JUEGO = {
  espacial_aventura_total: {
    icono: '🚀',
    pasos: [
      { emoji: '👀', titulo: 'Mira el dibujo', detalle: 'Observa bien dónde está cada personaje u objeto en pantalla.' },
      { emoji: '💡', titulo: 'Sigue la pista', detalle: 'Lee si debes buscar quién está adentro, afuera, arriba, abajo, cerca o lejos.' },
      { emoji: '⭐', titulo: 'Toca tu respuesta', detalle: 'Presiona el botón correcto para sumar puntos y estrellas mágicas.' }
    ]
  },
  figuras_geometricas: {
    icono: '📐',
    pasos: [
      { emoji: '🔍', titulo: 'Cuenta esquinas y lados', detalle: 'Los triángulos tienen 3 esquinas, los cuadrados 4 lados iguales y los círculos son redondos.' },
      { emoji: '🍕', titulo: 'Mira el mundo real', detalle: 'A veces te preguntaremos a qué se parece una pizza, una ventana o una puerta.' },
      { emoji: '🎯', titulo: '¡Toca la figura!', detalle: 'Presiona la tarjeta que coincida con la figura correcta.' }
    ]
  },
  memoria_parejas: {
    icono: '🃏',
    pasos: [
      { emoji: '👆', titulo: 'Voltea dos tarjetas', detalle: 'Toca una tarjeta y luego otra para ver sus dibujos.' },
      { emoji: '🎉', titulo: 'Encuentra las parejas', detalle: 'Si son iguales, ¡se quedan abiertas y ganas puntos!' },
      { emoji: '🧠', titulo: 'Recuerda su lugar', detalle: 'Si son diferentes se voltearán de nuevo. ¡Memoriza dónde estaban!' }
    ]
  },
  tablas_multiplicar: {
    icono: '✖️',
    pasos: [
      { emoji: '⚡', titulo: 'Calcula veloz', detalle: 'Multiplica los dos números que aparecen en pantalla.' },
      { emoji: '⏱️', titulo: 'Gánale al reloj', detalle: 'Contesta antes de que se agote la barrita de tiempo.' },
      { emoji: '🏆', titulo: '¡Racha de puntos!', detalle: 'Entre más aciertes seguido, más rápido subes en el Starboard.' }
    ]
  },
  suma_quebrados: {
    icono: '🍰',
    pasos: [
      { emoji: '🎂', titulo: 'Mira los pasteles', detalle: 'Cada gráfica te muestra cuántas rebanadas están coloreadas.' },
      { emoji: '➕', titulo: 'Suma las partes', detalle: 'Junta las rebanadas para obtener la fracción total.' },
      { emoji: '🌟', titulo: 'Elige el resultado', detalle: 'Toca la fracción correcta para ganar el reto.' }
    ]
  },
  multiplicacion_decimales: {
    icono: '🛒',
    pasos: [
      { emoji: '🏪', titulo: 'De compras con Scrapert', detalle: 'Mira el precio de cada artículo en la tiendita.' },
      { emoji: '🪙', titulo: 'Calcula el total', detalle: 'Multiplica la cantidad de productos por su valor con decimales.' },
      { emoji: '💳', titulo: 'Paga con la cifra exacta', detalle: 'Selecciona la cantidad de dinero correcta.' }
    ]
  },
  reto_tele_colores: {
    icono: '📺',
    pasos: [
      { emoji: '⚠️', titulo: '¡No te confundas!', detalle: 'La tele mágica mostrará una palabra escrita con tinta de otro color.' },
      { emoji: '📖', titulo: 'LEE la palabra', detalle: 'Busca el botón que TENGA ESCRITA la palabra que leíste en la tele.' },
      { emoji: '⏱️', titulo: '¡Sé muy rápido!', detalle: 'El tiempo se reduce en cada una de las 10 rondas. ¡Es el juego con más puntos!' }
    ]
  }
};

export default function ModalComoJugar({ abierto, alCerrar, actividad }) {
  if (!abierto || !actividad) return null;

  const guia = GUIA_POR_JUEGO[actividad.codigo_referencia] || {
    icono: '🎮',
    pasos: [
      { emoji: '👀', titulo: 'Mira la pantalla', detalle: actividad.instrucciones || 'Observa la pregunta que aparece en el juego.' },
      { emoji: '⭐', titulo: 'Elige tu opción', detalle: 'Toca la respuesta que consideres correcta.' },
      { emoji: '🏆', titulo: 'Acumula puntos', detalle: 'Gana estrellas para entrar al Cuadro de Honor.' }
    ]
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(30, 41, 59, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="tarjeta-juego" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2rem 1.8rem',
        position: 'relative',
        animation: 'saltoCelebracion 0.3s ease-out'
      }}>
        {/* Botón circular para cerrar */}
        <button
          type="button"
          onClick={alCerrar}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>

        {/* Mascota con accesorio explicando */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
          <MascotaScrapert 
            animacion="reposo" 
            accesorio="lentes" 
            mensaje="¡Te enseño cómo jugar en tres pasitos!" 
            tamano={120} 
          />
        </div>

        <h3 style={{
          textAlign: 'center',
          fontSize: '1.45rem',
          fontWeight: 900,
          color: 'var(--color-texto-oscuro)',
          marginBottom: '0.4rem'
        }}>
          ¿Cómo jugar a {actividad.titulo}?
        </h3>
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748B', fontWeight: 700, marginBottom: '1.4rem' }}>
          Instrucciones fáciles para campeones
        </p>

        {/* Pasos visuales infantiles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.8rem' }}>
          {guia.pasos.map((paso, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              backgroundColor: '#FAFCFE',
              border: '2px solid #E2E8F0',
              padding: '12px 14px',
              borderRadius: '16px'
            }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>{paso.emoji}</span>
              <div>
                <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--color-texto-oscuro)', fontWeight: 800 }}>
                  {paso.titulo}
                </strong>
                <span style={{ fontSize: '0.92rem', color: '#64748B', fontWeight: 600, lineHeight: 1.3 }}>
                  {paso.detalle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de cierre grande */}
        <button
          type="button"
          onClick={alCerrar}
          className="boton-juguete boton-verde"
          style={{ width: '100%', padding: '12px', fontSize: '1.15rem' }}
        >
          <CheckCircle size={20} />
          ¡Entendido, vamos!
        </button>
      </div>
    </div>
  );
}
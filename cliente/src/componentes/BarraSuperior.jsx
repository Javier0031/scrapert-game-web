import React, { useState } from 'react';
import { LogOut, Award, Volume2, VolumeX, Shuffle } from 'lucide-react';
import { musicaGlobal, efectosSonoros } from '../utilidades/musicaFondo.js';

export default function BarraSuperior({ estudiante, alCerrarSesion, alIrCuadroHonor, enElMenu = false }) {
  const [musicaSonando, setMusicaSonando] = useState(musicaGlobal.obtenerEstado());
  const [nombreMelodia, setNombreMelodia] = useState(musicaGlobal.obtenerNombrePistaActual());

  const mapaAvatares = {
    gato_scrapert: '🐱',
    cohete_veloz: '🚀',
    estrella_brillante: '⭐',
    leon_valiente: '🦁',
    delfin_alegre: '🐬'
  };

  const alternarSonido = () => {
    efectosSonoros.reproducirClic();
    const estado = musicaGlobal.alternarMusica();
    setMusicaSonando(estado);
    setNombreMelodia(musicaGlobal.obtenerNombrePistaActual());
  };

  const cambiarMelodiaMenu = () => {
    efectosSonoros.reproducirClic();
    const nuevoNombre = musicaGlobal.alternarMelodiaMenu();
    setNombreMelodia(nuevoNombre);
    if (!musicaSonando) {
      musicaGlobal.alternarMusica();
      setMusicaSonando(true);
    }
  };

  return (
    <header style={{
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto 1.5rem auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#FFFFFF',
      padding: '12px 22px',
      borderRadius: '22px',
      border: '2px solid #EBF4F6',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Datos del Estudiante */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          fontSize: '2rem',
          backgroundColor: '#F0FDF4',
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2.5px solid var(--color-verde-pastel)'
        }}>
          {mapaAvatares[estudiante?.icono_avatar] || '🐱'}
        </div>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-texto-oscuro)', lineHeight: 1.1 }}>
            {estudiante?.nombre}
          </h2>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-texto-suave)' }}>
            Nivel: {estudiante?.edad <= 6 ? 'Pre-Primaria' : 'Primaria'} ({estudiante?.edad} años)
          </span>
        </div>
      </div>

      {/* Acciones y Audio */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Alternar melodía del menú */}
        {enElMenu && (
          <button
            type="button"
            onClick={cambiarMelodiaMenu}
            style={{
              background: '#F8FAFC',
              border: '2px solid #E2E8F0',
              borderRadius: '14px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: 'var(--color-texto-oscuro)',
              cursor: 'pointer'
            }}
            title="Cambiar melodía del menú"
          >
            <Shuffle size={16} />
            <span>Pista: {nombreMelodia}</span>
          </button>
        )}

        {/* Interruptor de música general */}
        <button
          type="button"
          onClick={alternarSonido}
          className={`boton-juguete ${musicaSonando ? 'boton-turquesa' : ''}`}
          style={{
            backgroundColor: musicaSonando ? undefined : '#F1F5F9',
            color: musicaSonando ? '#FFFFFF' : '#64748B',
            boxShadow: musicaSonando ? undefined : 'none',
            padding: '9px 14px',
            fontSize: '0.95rem'
          }}
          title={musicaSonando ? 'Silenciar música' : 'Activar música alegre'}
        >
          {musicaSonando ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        <button
          type="button"
          onClick={() => {
            efectosSonoros.reproducirClic();
            alIrCuadroHonor();
          }}
          className="boton-juguete boton-naranja"
          style={{ padding: '9px 18px', fontSize: '0.95rem' }}
        >
          <Award size={18} />
          Starboard
        </button>

        <button
          type="button"
          onClick={() => {
            efectosSonoros.reproducirClic();
            alCerrarSesion();
          }}
          style={{
            background: '#F1F5F9',
            border: 'none',
            color: '#64748B',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
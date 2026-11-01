import React from 'react';

export default function MascotaScrapert({ 
  animacion = 'reposo', 
  mensaje = '', 
  tamano = 160,
  accesorio = 'ninguno' // 'ninguno', 'lentes', 'gorra', 'soda', 'paleta'
}) {
  // Configuración de expresiones faciales
  const obtenerExpresion = () => {
    switch (animacion) {
      case 'celebracion':
      case 'feliz':
        return {
          ojos: (
            <>
              {/* Ojos de emoción cerrada en curva */}
              <path d="M 64 78 Q 74 66 84 78" stroke="#1E293B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M 116 78 Q 126 66 136 78" stroke="#1E293B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Sonrojo tierno */}
              <circle cx="58" cy="88" r="9" fill="#FDA4AF" opacity="0.85" />
              <circle cx="142" cy="88" r="9" fill="#FDA4AF" opacity="0.85" />
            </>
          ),
          boca: (
            <path d="M 88 94 Q 100 112 112 94" stroke="#1E293B" strokeWidth="4" fill="#FB7185" strokeLinecap="round" />
          ),
          claseCss: animacion === 'celebracion' ? 'animacion-celebracion' : 'animacion-feliz'
        };
      case 'baile':
        return {
          ojos: (
            <>
              {/* Ojo izquierdo guiñando, ojo derecho abierto */}
              <path d="M 64 78 Q 74 68 84 78" stroke="#1E293B" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <circle cx="126" cy="78" r="9" fill="#1E293B" />
              <circle cx="123" cy="74" r="3.5" fill="#FFFFFF" />
              <circle cx="58" cy="88" r="8" fill="#FDA4AF" opacity="0.8" />
              <circle cx="142" cy="88" r="8" fill="#FDA4AF" opacity="0.8" />
            </>
          ),
          boca: <path d="M 90 94 Q 100 108 110 94" stroke="#1E293B" strokeWidth="4" fill="#FB7185" strokeLinecap="round" />,
          claseCss: 'animacion-baile'
        };
      case 'triste':
        return {
          ojos: (
            <>
              <circle cx="74" cy="80" r="7.5" fill="#1E293B" />
              <circle cx="126" cy="80" r="7.5" fill="#1E293B" />
              {/* Lagrimita kawaii */}
              <ellipse cx="64" cy="92" rx="3.5" ry="5.5" fill="#38BDF8" />
            </>
          ),
          boca: <path d="M 90 102 Q 100 90 110 102" stroke="#1E293B" strokeWidth="4" fill="none" strokeLinecap="round" />,
          claseCss: 'animacion-triste'
        };
      case 'sorpresa':
        return {
          ojos: (
            <>
              <circle cx="72" cy="76" r="10" fill="#1E293B" />
              <circle cx="69" cy="72" r="4" fill="#FFFFFF" />
              <circle cx="128" cy="76" r="10" fill="#1E293B" />
              <circle cx="125" cy="72" r="4" fill="#FFFFFF" />
            </>
          ),
          boca: <circle cx="100" cy="98" r="7" fill="#1E293B" />,
          claseCss: 'animacion-sorpresa'
        };
      case 'reposo':
      default:
        return {
          ojos: (
            <>
              <circle cx="74" cy="78" r="8" fill="#1E293B" />
              <circle cx="71" cy="75" r="3" fill="#FFFFFF" />
              <circle cx="126" cy="78" r="8" fill="#1E293B" />
              <circle cx="123" cy="75" r="3" fill="#FFFFFF" />
            </>
          ),
          boca: <path d="M 92 93 Q 100 101 108 93" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />,
          claseCss: 'animacion-reposo'
        };
    }
  };

  const expresion = obtenerExpresion();

  // Capas de accesorios vectoriales
  const renderizarAccesorio = () => {
    switch (accesorio) {
      case 'lentes':
        return (
          <g>
            {/* Lentes de sol cancheros */}
            <rect x="52" y="66" width="38" height="24" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <rect x="110" y="66" width="38" height="24" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2.5" />
            <line x1="90" y1="74" x2="110" y2="74" stroke="#0F172A" strokeWidth="4" />
            {/* Reflejos de cristal */}
            <line x1="58" y1="72" x2="68" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="116" y1="72" x2="126" y2="82" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      case 'gorra':
        return (
          <g>
            {/* Gorra moderna con visera al frente */}
            <path d="M 50 56 Q 100 20 150 56 Z" fill="#1FA7E1" stroke="#1583B3" strokeWidth="3" />
            <ellipse cx="100" cy="56" rx="55" ry="10" fill="#1FA7E1" />
            <path d="M 120 54 Q 170 54 180 62 Q 135 68 115 58 Z" fill="#7274ED" stroke="#585ACD" strokeWidth="2.5" />
            <circle cx="100" cy="36" r="5" fill="#FFB356" />
          </g>
        );
      case 'soda':
        return (
          <g>
            {/* Vaso de refresco con pajilla en la patita derecha */}
            <polygon points="145,120 152,165 178,165 185,120" fill="#FB7185" stroke="#E11D48" strokeWidth="2.5" />
            <ellipse cx="165" cy="120" rx="20" ry="6" fill="#FDA4AF" stroke="#E11D48" strokeWidth="2" />
            {/* Pajilla / Popote a rayas */}
            <line x1="165" y1="120" x2="152" y2="92" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
            <line x1="152" y1="92" x2="142" y2="90" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
          </g>
        );
      case 'paleta':
        return (
          <g>
            {/* Paleta dulce redonda de caramelo en la patita izquierda */}
            <line x1="38" y1="140" x2="38" y2="175" stroke="#D1D5DB" strokeWidth="4" strokeLinecap="round" />
            <circle cx="38" cy="130" r="18" fill="#F43F5E" stroke="#BE123C" strokeWidth="3" />
            {/* Espiral dulce */}
            <path d="M 38 130 A 6 6 0 0 1 44 130 A 10 10 0 0 1 34 136" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case 'ninguno':
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      {/* Globo de diálogo estilo historieta */}
      {mensaje && (
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '10px 18px',
          borderRadius: '18px',
          fontSize: '1rem',
          fontWeight: 800,
          color: 'var(--color-texto-oscuro)',
          border: '3px solid var(--color-turquesa-suave)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
          position: 'relative',
          marginBottom: '6px',
          maxWidth: '300px',
          textAlign: 'center'
        }}>
          {mensaje}
        </div>
      )}

      {/* Ilustración de Scrapert */}
      <div className={expresion.claseCss} style={{ width: tamano, height: tamano }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          {/* Cola alegre */}
          <path d="M 140 145 Q 185 140 180 115 Q 175 100 160 112" fill="none" stroke="#EA580C" strokeWidth="8" strokeLinecap="round" />
          
          {/* Orejitas */}
          <polygon points="50,60 30,10 80,35" fill="var(--color-rosa-texas)" stroke="var(--color-rosa-texas-sombra)" strokeWidth="4" />
          <polygon points="52,50 40,22 72,38" fill="#FED7AA" />
          <polygon points="150,60 170,10 120,35" fill="var(--color-rosa-texas)" stroke="var(--color-rosa-texas-sombra)" strokeWidth="4" />
          <polygon points="148,50 160,22 128,38" fill="#FED7AA" />

          {/* Cabeza / Cuerpo gordito */}
          <circle cx="100" cy="95" r="55" fill="var(--color-rosa-texas)" stroke="var(--color-rosa-texas-sombra)" strokeWidth="4" />
          
          {/* Mancha frontal de la frente */}
          <path d="M 85 45 Q 100 65 115 45 Z" fill="var(--color-rosa-texas-sombra)" />

          {/* Bigotes */}
          <line x1="40" y1="90" x2="15" y2="85" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="98" x2="15" y2="102" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="160" y1="90" x2="185" y2="85" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
          <line x1="160" y1="98" x2="185" y2="102" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

          {/* Nariz */}
          <polygon points="95,87 105,87 100,93" fill="var(--color-mona-lisa)" />

          {/* Ojos y Boca */}
          {expresion.ojos}
          {expresion.boca}

          {/* Patitas delanteras */}
          <ellipse cx="70" cy="148" rx="16" ry="12" fill="#FED7AA" stroke="var(--color-rosa-texas-sombra)" strokeWidth="3" />
          <ellipse cx="130" cy="148" rx="16" ry="12" fill="#FED7AA" stroke="var(--color-rosa-texas-sombra)" strokeWidth="3" />

          {/* Accesorio dinámico */}
          {renderizarAccesorio()}
        </svg>
      </div>
    </div>
  );
}
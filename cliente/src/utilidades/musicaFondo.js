// =========================================================================
// MOTOR DE AUDIO SCRAPERT: MELODÍAS EXTENDIDAS, CALMADAS Y EFECTOS SONOROS
// =========================================================================

class GestorAudioScrapert {
  constructor() {
    this.contextoAudio = null;
    this.musicaActiva = false;
    this.efectosActivos = true;
    this.temporizadorMelodia = null;
    this.indiceNotaActual = 0;
    this.pistaSeleccionada = 'menu_1';

    this.repertorioMusical = {
      // 1. Menú 1: "Mañana Alegre" (Sin modificaciones)
      menu_1: {
        nombre: 'Mañana Alegre',
        tipoOnda: 'triangle',
        volumen: 0.18,
        pausa: 0.04,
        notas: [
          { f: 261.63, d: 0.20 }, { f: 329.63, d: 0.20 }, { f: 392.00, d: 0.20 }, { f: 523.25, d: 0.32 },
          { f: 440.00, d: 0.18 }, { f: 392.00, d: 0.18 }, { f: 329.63, d: 0.30 }, { f: 293.66, d: 0.20 },
          { f: 329.63, d: 0.20 }, { f: 392.00, d: 0.20 }, { f: 440.00, d: 0.28 }, { f: 392.00, d: 0.35 },
          { f: 523.25, d: 0.20 }, { f: 587.33, d: 0.20 }, { f: 659.25, d: 0.32 }, { f: 587.33, d: 0.20 },
          { f: 523.25, d: 0.20 }, { f: 440.00, d: 0.28 }, { f: 392.00, d: 0.20 }, { f: 329.63, d: 0.20 },
          { f: 349.23, d: 0.20 }, { f: 392.00, d: 0.20 }, { f: 293.66, d: 0.32 }, { f: 261.63, d: 0.50 }
        ]
      },

      // 2. Menú 2: "El Paseo de Scrapert" (Sin modificaciones)
      menu_2: {
        nombre: 'El Paseo de Scrapert',
        tipoOnda: 'sine',
        volumen: 0.22,
        pausa: 0.03,
        notas: [
          { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.15 }, { f: 659.25, d: 0.20 }, { f: 523.25, d: 0.15 },
          { f: 659.25, d: 0.15 }, { f: 783.99, d: 0.28 }, { f: 659.25, d: 0.15 }, { f: 587.33, d: 0.20 },
          { f: 523.25, d: 0.16 }, { f: 440.00, d: 0.16 }, { f: 523.25, d: 0.28 }, { f: 392.00, d: 0.20 },
          { f: 440.00, d: 0.15 }, { f: 523.25, d: 0.15 }, { f: 587.33, d: 0.22 }, { f: 659.25, d: 0.15 },
          { f: 783.99, d: 0.18 }, { f: 880.00, d: 0.25 }, { f: 783.99, d: 0.16 }, { f: 659.25, d: 0.20 },
          { f: 587.33, d: 0.16 }, { f: 523.25, d: 0.20 }, { f: 440.00, d: 0.22 }, { f: 523.25, d: 0.40 }
        ]
      },

      // 3. Juego Espacial: "Exploración Cósmica" (Ambiente etéreo, suave y muy espaciado)
      espacial: {
        nombre: 'Exploración Cósmica',
        tipoOnda: 'sine',
        volumen: 0.16,
        pausa: 0.18,
        notas: [
          { f: 196.00, d: 0.50 }, { f: 293.66, d: 0.50 }, { f: 392.00, d: 0.60 }, { f: 493.88, d: 0.70 },
          { f: 587.33, d: 0.75 }, { f: 493.88, d: 0.50 }, { f: 392.00, d: 0.50 }, { f: 293.66, d: 0.60 },
          { f: 220.00, d: 0.50 }, { f: 329.63, d: 0.50 }, { f: 440.00, d: 0.60 }, { f: 523.25, d: 0.70 },
          { f: 659.25, d: 0.75 }, { f: 523.25, d: 0.50 }, { f: 440.00, d: 0.50 }, { f: 329.63, d: 0.60 },
          { f: 261.63, d: 0.55 }, { f: 392.00, d: 0.55 }, { f: 523.25, d: 0.65 }, { f: 392.00, d: 0.80 }
        ]
      },

      // 4. Juego de Figuras: "El Taller de Bloques" (Xilófono pausado y apacible)
      figuras: {
        nombre: 'El Taller de Bloques',
        tipoOnda: 'triangle',
        volumen: 0.16,
        pausa: 0.12,
        notas: [
          { f: 349.23, d: 0.32 }, { f: 392.00, d: 0.32 }, { f: 440.00, d: 0.45 }, { f: 349.23, d: 0.32 },
          { f: 440.00, d: 0.32 }, { f: 523.25, d: 0.55 }, { f: 440.00, d: 0.32 }, { f: 392.00, d: 0.32 },
          { f: 349.23, d: 0.45 }, { f: 293.66, d: 0.32 }, { f: 329.63, d: 0.32 }, { f: 349.23, d: 0.45 },
          { f: 392.00, d: 0.32 }, { f: 440.00, d: 0.42 }, { f: 523.25, d: 0.36 }, { f: 587.33, d: 0.60 },
          { f: 523.25, d: 0.32 }, { f: 440.00, d: 0.32 }, { f: 392.00, d: 0.38 }, { f: 349.23, d: 0.65 }
        ]
      },

      // 5. Juego de Memoria: "El Enigma de las Patitas" (Lento, contemplativo y relajante)
      memoria: {
        nombre: 'El Enigma de las Patitas',
        tipoOnda: 'sine',
        volumen: 0.16,
        pausa: 0.16,
        notas: [
          { f: 440.00, d: 0.45 }, { f: 493.88, d: 0.45 }, { f: 523.25, d: 0.60 }, { f: 392.00, d: 0.45 },
          { f: 349.23, d: 0.45 }, { f: 440.00, d: 0.65 }, { f: 329.63, d: 0.50 }, { f: 261.63, d: 0.70 },
          { f: 293.66, d: 0.45 }, { f: 349.23, d: 0.45 }, { f: 440.00, d: 0.60 }, { f: 523.25, d: 0.45 },
          { f: 587.33, d: 0.55 }, { f: 493.88, d: 0.50 }, { f: 440.00, d: 0.80 }
        ]
      },

      // 6. El Gran Desafío: "Marcha de Scrapert" (Serena, constante y sin prisa)
      desafio: {
        nombre: 'La Gran Prueba de Scrapert',
        tipoOnda: 'triangle',
        volumen: 0.17,
        pausa: 0.10,
        notas: [
          { f: 329.63, d: 0.30 }, { f: 392.00, d: 0.30 }, { f: 493.88, d: 0.30 }, { f: 587.33, d: 0.45 },
          { f: 493.88, d: 0.30 }, { f: 587.33, d: 0.30 }, { f: 659.25, d: 0.55 }, { f: 587.33, d: 0.30 },
          { f: 659.25, d: 0.30 }, { f: 783.99, d: 0.55 }, { f: 659.25, d: 0.30 }, { f: 587.33, d: 0.35 },
          { f: 493.88, d: 0.30 }, { f: 392.00, d: 0.45 }, { f: 440.00, d: 0.30 }, { f: 493.88, d: 0.30 },
          { f: 587.33, d: 0.45 }, { f: 493.88, d: 0.38 }, { f: 329.63, d: 0.75 }
        ]
      }
    };
  }

  asegurarContexto() {
    if (!this.contextoAudio) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.contextoAudio = new AudioCtx();
    }
    if (this.contextoAudio.state === 'suspended') {
      this.contextoAudio.resume();
    }
  }

  tocarNota(frecuencia, duracion, tipoOnda, volumen) {
    if (!this.musicaActiva || !this.contextoAudio) return;

    try {
      const osc = this.contextoAudio.createOscillator();
      const gain = this.contextoAudio.createGain();

      osc.type = tipoOnda;
      osc.frequency.setValueAtTime(frecuencia, this.contextoAudio.currentTime);

      gain.gain.setValueAtTime(0.001, this.contextoAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(volumen, this.contextoAudio.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.contextoAudio.currentTime + duracion);

      osc.connect(gain);
      gain.connect(this.contextoAudio.destination);

      osc.start();
      osc.stop(this.contextoAudio.currentTime + duracion);
    } catch (e) {}
  }

  cicloMelodico() {
    if (!this.musicaActiva) return;

    const pista = this.repertorioMusical[this.pistaSeleccionada] || this.repertorioMusical.menu_1;
    const nota = pista.notas[this.indiceNotaActual];

    this.tocarNota(nota.f, nota.d, pista.tipoOnda, pista.volumen);
    this.indiceNotaActual = (this.indiceNotaActual + 1) % pista.notas.length;

    this.temporizadorMelodia = setTimeout(() => {
      this.cicloMelodico();
    }, (nota.d + pista.pausa) * 1000);
  }

  cambiarPista(idPista) {
    if (!this.repertorioMusical[idPista] || this.pistaSeleccionada === idPista) return;

    this.pistaSeleccionada = idPista;
    this.indiceNotaActual = 0;

    if (this.musicaActiva) {
      clearTimeout(this.temporizadorMelodia);
      this.cicloMelodico();
    }
  }

  alternarMelodiaMenu() {
    const siguiente = this.pistaSeleccionada === 'menu_1' ? 'menu_2' : 'menu_1';
    this.cambiarPista(siguiente);
    return this.repertorioMusical[siguiente].nombre;
  }

  alternarMusica() {
    this.asegurarContexto();
    this.musicaActiva = !this.musicaActiva;

    if (this.musicaActiva) {
      this.indiceNotaActual = 0;
      this.cicloMelodico();
    } else {
      clearTimeout(this.temporizadorMelodia);
    }

    return this.musicaActiva;
  }
  alternarEstado() {
    return this.alternarMusica();
  }

  obtenerEstadoMusica() {
    return this.musicaActiva;
  }
  obtenerEstado() {
    return this.musicaActiva;
  }

  obtenerPistaActual() {
    return this.pistaSeleccionada;
  }

  obtenerNombrePistaActual() {
    return this.repertorioMusical[this.pistaSeleccionada]?.nombre || '';
  }

  // =========================================================================
  // EFECTOS SONOROS (SFX)
  // =========================================================================

  reproducirClic() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    try {
      const osc = this.contextoAudio.createOscillator();
      const gain = this.contextoAudio.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.contextoAudio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.contextoAudio.currentTime + 0.06);

      gain.gain.setValueAtTime(0.18, this.contextoAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.contextoAudio.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.contextoAudio.destination);

      osc.start();
      osc.stop(this.contextoAudio.currentTime + 0.06);
    } catch (e) {}
  }

  reproducirAcierto() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    const notas = [659.25, 783.99, 1046.50];
    notas.forEach((frec, idx) => {
      try {
        const t = this.contextoAudio.currentTime + idx * 0.08;
        const osc = this.contextoAudio.createOscillator();
        const gain = this.contextoAudio.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frec, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.24, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(this.contextoAudio.destination);

        osc.start(t);
        osc.stop(t + 0.35);
      } catch (e) {}
    });
  }

  reproducirFallo() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    try {
      const osc = this.contextoAudio.createOscillator();
      const gain = this.contextoAudio.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.contextoAudio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.contextoAudio.currentTime + 0.22);

      gain.gain.setValueAtTime(0.20, this.contextoAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.contextoAudio.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(this.contextoAudio.destination);

      osc.start();
      osc.stop(this.contextoAudio.currentTime + 0.22);
    } catch (e) {}
  }

  reproducirVolteoCarta() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    try {
      const osc = this.contextoAudio.createOscillator();
      const gain = this.contextoAudio.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.contextoAudio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.contextoAudio.currentTime + 0.05);

      gain.gain.setValueAtTime(0.16, this.contextoAudio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.contextoAudio.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.contextoAudio.destination);

      osc.start();
      osc.stop(this.contextoAudio.currentTime + 0.05);
    } catch (e) {}
  }

  reproducirBonoDorado() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    const arpegio = [783.99, 987.77, 1174.66, 1567.98];
    arpegio.forEach((frec, idx) => {
      try {
        const t = this.contextoAudio.currentTime + idx * 0.05;
        const osc = this.contextoAudio.createOscillator();
        const gain = this.contextoAudio.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frec, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

        osc.connect(gain);
        gain.connect(this.contextoAudio.destination);

        osc.start(t);
        osc.stop(t + 0.28);
      } catch (e) {}
    });
  }

  reproducirVictoria() {
    if (!this.efectosActivos) return;
    this.asegurarContexto();

    const notas = [
      { f: 523.25, d: 0.14, t: 0.00 },
      { f: 523.25, d: 0.14, t: 0.15 },
      { f: 523.25, d: 0.14, t: 0.30 },
      { f: 659.25, d: 0.38, t: 0.45 },
      { f: 587.33, d: 0.20, t: 0.85 },
      { f: 659.25, d: 0.15, t: 1.05 },
      { f: 783.99, d: 0.60, t: 1.20 }
    ];

    notas.forEach((n) => {
      try {
        const inicio = this.contextoAudio.currentTime + n.t;
        const osc = this.contextoAudio.createOscillator();
        const gain = this.contextoAudio.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, inicio);

        gain.gain.setValueAtTime(0.001, inicio);
        gain.gain.exponentialRampToValueAtTime(0.24, inicio + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, inicio + n.d);

        osc.connect(gain);
        gain.connect(this.contextoAudio.destination);

        osc.start(inicio);
        osc.stop(inicio + n.d);
      } catch (e) {}
    });
  }
}

export const musicaGlobal = new GestorAudioScrapert();
export const efectosSonoros = musicaGlobal;
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

// BANCO DE FASE 1: 10 RETOS BÁSICOS DIRECTOS (2 OPCIONES)
const BANCO_FASE_1 = [
  () => {
    const pedirAdentro = Math.random() > 0.5;
    const adentro = { nombre: 'Pelota', emoji: '⚽' };
    const afuera = { nombre: 'Osito', emoji: '🧸' };
    const objetivo = pedirAdentro ? adentro : afuera;
    return {
      etiqueta: 'Adentro / Afuera',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirAdentro ? '¿Qué juguete está ADENTRO de la caja de madera?' : '¿Qué juguete está AFUERA de la caja?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="50" y="45" width="130" height="85" rx="12" fill="#FED7AA" stroke="#EA580C" strokeWidth="4" />
          <rect x="40" y="38" width="150" height="16" rx="6" fill="#FDBA74" stroke="#EA580C" strokeWidth="3" />
          <text x="115" y="92" fontSize="34" textAnchor="middle">{adentro.emoji}</text>
          <text x="245" y="105" fontSize="34" textAnchor="middle">{afuera.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: adentro.nombre, nombre: adentro.nombre, emoji: adentro.emoji, esCorrecta: objetivo.nombre === adentro.nombre },
        { id: afuera.nombre, nombre: afuera.nombre, emoji: afuera.emoji, esCorrecta: objetivo.nombre === afuera.nombre }
      ])
    };
  },
  () => {
    const pedirArriba = Math.random() > 0.5;
    const arriba = { nombre: 'Pajarito', emoji: '🐦' };
    const abajo = { nombre: 'Ardilla', emoji: '🐿️' };
    const objetivo = pedirArriba ? arriba : abajo;
    return {
      etiqueta: 'Arriba / Abajo',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirArriba ? '¿Quién está ubicado ARRIBA en el árbol?' : '¿Quién está ubicado ABAJO en el césped?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="145" y="65" width="30" height="75" rx="6" fill="#A16207" />
          <circle cx="160" cy="50" r="45" fill="#86EFAC" stroke="#22C55E" strokeWidth="4" />
          <text x="160" y="45" fontSize="32" textAnchor="middle">{arriba.emoji}</text>
          <text x="225" y="135" fontSize="32" textAnchor="middle">{abajo.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: arriba.nombre, nombre: arriba.nombre, emoji: arriba.emoji, esCorrecta: objetivo.nombre === arriba.nombre },
        { id: abajo.nombre, nombre: abajo.nombre, emoji: abajo.emoji, esCorrecta: objetivo.nombre === abajo.nombre }
      ])
    };
  },
  () => {
    const pedirEncima = Math.random() > 0.5;
    const encima = { nombre: 'Cuaderno', emoji: '📓' };
    const debajo = { nombre: 'Mochila', emoji: '🎒' };
    const objetivo = pedirEncima ? encima : debajo;
    return {
      etiqueta: 'Encima / Debajo',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirEncima ? '¿Qué elemento está ENCIMA del escritorio?' : '¿Qué elemento está DEBAJO del escritorio?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="70" y="65" width="180" height="15" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
          <rect x="85" y="80" width="12" height="55" rx="3" fill="#D97706" />
          <rect x="223" y="80" width="12" height="55" rx="3" fill="#D97706" />
          <text x="160" y="52" fontSize="30" textAnchor="middle">{encima.emoji}</text>
          <text x="160" y="125" fontSize="30" textAnchor="middle">{debajo.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: encima.nombre, nombre: encima.nombre, emoji: encima.emoji, esCorrecta: objetivo.nombre === encima.nombre },
        { id: debajo.nombre, nombre: debajo.nombre, emoji: debajo.emoji, esCorrecta: objetivo.nombre === debajo.nombre }
      ])
    };
  },
  () => {
    const pedirCerca = Math.random() > 0.5;
    const cerca = { nombre: 'Delfín', emoji: '🐬' };
    const lejos = { nombre: 'Barco velero', emoji: '⛵' };
    const objetivo = pedirCerca ? cerca : lejos;
    return {
      etiqueta: 'Cerca / Lejos',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirCerca ? '¿Quién está nadando más CERCA del faro?' : '¿Quién navega más LEJOS del faro?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="0" y="100" width="320" height="50" fill="#BAE6FD" />
          <polygon points="35,100 45,30 65,30 75,100" fill="#EF4444" stroke="#B91C1C" strokeWidth="3" />
          <text x="120" y="125" fontSize="32" textAnchor="middle">{cerca.emoji}</text>
          <text x="260" y="115" fontSize="32" textAnchor="middle">{lejos.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: cerca.nombre, nombre: cerca.nombre, emoji: cerca.emoji, esCorrecta: objetivo.nombre === cerca.nombre },
        { id: lejos.nombre, nombre: lejos.nombre, emoji: lejos.emoji, esCorrecta: objetivo.nombre === lejos.nombre }
      ])
    };
  },
  () => {
    const pedirAdentro = Math.random() > 0.5;
    const adentro = { nombre: 'Pez dorado', emoji: '🐠' };
    const afuera = { nombre: 'Mariposa', emoji: '🦋' };
    const objetivo = pedirAdentro ? adentro : afuera;
    return {
      etiqueta: 'Adentro / Afuera',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirAdentro ? '¿Quién está nadando ADENTRO de la pecera?' : '¿Quién vuela AFUERA de la pecera?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <circle cx="110" cy="80" r="50" fill="#E0F2FE" stroke="#0284C7" strokeWidth="4" />
          <text x="110" y="90" fontSize="32" textAnchor="middle">{adentro.emoji}</text>
          <text x="240" y="65" fontSize="32" textAnchor="middle">{afuera.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: adentro.nombre, nombre: adentro.nombre, emoji: adentro.emoji, esCorrecta: objetivo.nombre === adentro.nombre },
        { id: afuera.nombre, nombre: afuera.nombre, emoji: afuera.emoji, esCorrecta: objetivo.nombre === afuera.nombre }
      ])
    };
  },
  () => {
    const pedirArriba = Math.random() > 0.5;
    const arriba = { nombre: 'Helicóptero', emoji: '🚁' };
    const abajo = { nombre: 'Camión de carga', emoji: '🚚' };
    const objetivo = pedirArriba ? arriba : abajo;
    return {
      etiqueta: 'Arriba / Abajo',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirArriba ? '¿Quién vuela ARRIBA por las nubes?' : '¿Quién avanza ABAJO por la pista?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="0" y="95" width="320" height="55" fill="#E2E8F0" />
          <text x="160" y="48" fontSize="34" textAnchor="middle">{arriba.emoji}</text>
          <text x="160" y="132" fontSize="34" textAnchor="middle">{abajo.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: arriba.nombre, nombre: arriba.nombre, emoji: arriba.emoji, esCorrecta: objetivo.nombre === arriba.nombre },
        { id: abajo.nombre, nombre: abajo.nombre, emoji: abajo.emoji, esCorrecta: objetivo.nombre === abajo.nombre }
      ])
    };
  },
  () => {
    const pedirEncima = Math.random() > 0.5;
    const encima = { nombre: 'Gatito siamés', emoji: '🐈' };
    const debajo = { nombre: 'Pantuflas suaves', emoji: '🩴' };
    const objetivo = pedirEncima ? encima : debajo;
    return {
      etiqueta: 'Encima / Debajo',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirEncima ? '¿Quién duerme ENCIMA de la cama?' : '¿Qué calzado está guardado DEBAJO de la cama?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="55" y="70" width="190" height="25" rx="6" fill="#93C5FD" stroke="#2563EB" strokeWidth="3" />
          <rect x="65" y="95" width="10" height="40" fill="#64748B" />
          <rect x="235" y="95" width="10" height="40" fill="#64748B" />
          <text x="150" y="60" fontSize="30" textAnchor="middle">{encima.emoji}</text>
          <text x="150" y="130" fontSize="28" textAnchor="middle">{debajo.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: encima.nombre, nombre: encima.nombre, emoji: encima.emoji, esCorrecta: objetivo.nombre === encima.nombre },
        { id: debajo.nombre, nombre: debajo.nombre, emoji: debajo.emoji, esCorrecta: objetivo.nombre === debajo.nombre }
      ])
    };
  },
  () => {
    const pedirCerca = Math.random() > 0.5;
    const cerca = { nombre: 'Planeta Tierra', emoji: '🌍' };
    const lejos = { nombre: 'Planeta con anillos', emoji: '🪐' };
    const objetivo = pedirCerca ? cerca : lejos;
    return {
      etiqueta: 'Cerca / Lejos',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirCerca ? '¿Qué planeta está más CERCA del cohete espacial?' : '¿Qué planeta está más LEJOS del cohete?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <text x="40" y="85" fontSize="38" textAnchor="middle">🚀</text>
          <text x="125" y="85" fontSize="32" textAnchor="middle">{cerca.emoji}</text>
          <text x="270" y="85" fontSize="32" textAnchor="middle">{lejos.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: cerca.nombre, nombre: cerca.nombre, emoji: cerca.emoji, esCorrecta: objetivo.nombre === cerca.nombre },
        { id: lejos.nombre, nombre: lejos.nombre, emoji: lejos.emoji, esCorrecta: objetivo.nombre === lejos.nombre }
      ])
    };
  },
  () => {
    const pedirAdentro = Math.random() > 0.5;
    const adentro = { nombre: 'Zanahoria fresca', emoji: '🥕' };
    const afuera = { nombre: 'Botella de agua', emoji: '🍶' };
    const objetivo = pedirAdentro ? adentro : afuera;
    return {
      etiqueta: 'Adentro / Afuera',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirAdentro ? '¿Qué alimento está ADENTRO de la canastita?' : '¿Qué bebida está AFUERA de la canastita?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="60" y="55" width="120" height="70" rx="10" fill="#FED7AA" stroke="#EA580C" strokeWidth="4" />
          <text x="120" y="100" fontSize="32" textAnchor="middle">{adentro.emoji}</text>
          <text x="240" y="105" fontSize="32" textAnchor="middle">{afuera.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: adentro.nombre, nombre: adentro.nombre, emoji: adentro.emoji, esCorrecta: objetivo.nombre === adentro.nombre },
        { id: afuera.nombre, nombre: afuera.nombre, emoji: afuera.emoji, esCorrecta: objetivo.nombre === afuera.nombre }
      ])
    };
  },
  () => {
    const pedirArriba = Math.random() > 0.5;
    const arriba = { nombre: 'Luz roja (Alto)', emoji: '🔴' };
    const abajo = { nombre: 'Luz verde (Siga)', emoji: '🟢' };
    const objetivo = pedirArriba ? arriba : abajo;
    return {
      etiqueta: 'Arriba / Abajo',
      nivelDificultad: 'Fase 1: Básico',
      pregunta: pedirArriba ? '¿Qué señal de luz está ubicada ARRIBA en el semáforo?' : '¿Qué señal de luz está ubicada ABAJO en el semáforo?',
      escenario: (
        <svg viewBox="0 0 320 150" width="100%" height="150">
          <rect x="135" y="25" width="50" height="100" rx="12" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
          <text x="160" y="55" fontSize="24" textAnchor="middle">{arriba.emoji}</text>
          <circle cx="160" cy="75" r="10" fill="#FACC15" />
          <text x="160" y="112" fontSize="24" textAnchor="middle">{abajo.emoji}</text>
        </svg>
      ),
      opciones: barajar([
        { id: arriba.nombre, nombre: arriba.nombre, emoji: arriba.emoji, esCorrecta: objetivo.nombre === arriba.nombre },
        { id: abajo.nombre, nombre: abajo.nombre, emoji: abajo.emoji, esCorrecta: objetivo.nombre === abajo.nombre }
      ])
    };
  }
];

// BANCO DE FASE 2: 10 ENIGMAS Y RETOS ESPACIALES (3 OPCIONES)
const BANCO_FASE_2 = [
  () => ({
    etiqueta: 'Enigma de Alimentos',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Es de color rojo, dulce y está guardada ADENTRO del frutero de cristal.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <ellipse cx="130" cy="85" rx="65" ry="30" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
        <text x="130" y="88" fontSize="34" textAnchor="middle">🍎</text>
        <text x="245" y="85" fontSize="32" textAnchor="middle">🍇</text>
        <text x="60" y="135" fontSize="30" textAnchor="middle">🍐</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Manzana roja', nombre: 'Manzana roja', emoji: '🍎', esCorrecta: true },
      { id: 'Uvas moradas', nombre: 'Uvas moradas', emoji: '🍇', esCorrecta: false },
      { id: 'Pera verde', nombre: 'Pera verde', emoji: '🍐', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Naturaleza Acuática',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Tiene plumas amarillas y está nadando alegremente ADENTRO del agua del estanque.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <ellipse cx="120" cy="80" rx="70" ry="40" fill="#BAE6FD" stroke="#0284C7" strokeWidth="4" />
        <text x="120" y="88" fontSize="34" textAnchor="middle">🦆</text>
        <text x="240" y="65" fontSize="32" textAnchor="middle">🐰</text>
        <text x="235" y="125" fontSize="30" textAnchor="middle">🐢</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Patito', nombre: 'Patito', emoji: '🦆', esCorrecta: true },
      { id: 'Conejito', nombre: 'Conejito', emoji: '🐰', esCorrecta: false },
      { id: 'Tortuguita', nombre: 'Tortuguita', emoji: '🐢', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Transportes del Cielo',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Tiene dos alas de metal y va volando a toda velocidad ARRIBA por el cielo.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="0" y="90" width="320" height="60" fill="#E2E8F0" />
        <text x="160" y="45" fontSize="36" textAnchor="middle">✈️</text>
        <text x="80" y="130" fontSize="32" textAnchor="middle">⛵</text>
        <text x="240" y="130" fontSize="32" textAnchor="middle">🚗</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Avión veloz', nombre: 'Avión veloz', emoji: '✈️', esCorrecta: true },
      { id: 'Barco velero', nombre: 'Barco velero', emoji: '⛵', esCorrecta: false },
      { id: 'Autito de carreras', nombre: 'Autito de carreras', emoji: '🚗', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Objetos del Hogar',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Es muy suave para descansar la cabecita y está colocada ENCIMA de la cama.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="60" y="65" width="190" height="25" rx="6" fill="#93C5FD" stroke="#2563EB" strokeWidth="3" />
        <rect x="70" y="90" width="10" height="45" fill="#64748B" />
        <rect x="230" y="90" width="10" height="45" fill="#64748B" />
        <text x="150" y="55" fontSize="32" textAnchor="middle">🛌</text>
        <text x="150" y="125" fontSize="28" textAnchor="middle">🎒</text>
        <text x="275" y="125" fontSize="28" textAnchor="middle">🩴</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Almohada suave', nombre: 'Almohada suave', emoji: '🛌', esCorrecta: true },
      { id: 'Mochila escolar', nombre: 'Mochila escolar', emoji: '🎒', esCorrecta: false },
      { id: 'Pantuflas', nombre: 'Pantuflas', emoji: '🩴', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Misión Galáctica',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Tiene traje espacial blanco con visera y es quien está más CERCA de la nave cohete.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <text x="45" y="85" fontSize="42" textAnchor="middle">🚀</text>
        <text x="115" y="85" fontSize="30" textAnchor="middle">🧑‍🚀</text>
        <text x="115" y="115" fontSize="11" fontWeight="800" fill="#64748B" textAnchor="middle">A</text>
        <text x="210" y="85" fontSize="30" textAnchor="middle">👨‍🚀</text>
        <text x="210" y="115" fontSize="11" fontWeight="800" fill="#64748B" textAnchor="middle">B</text>
        <text x="285" y="85" fontSize="30" textAnchor="middle">🛰️</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Astronauta A', nombre: 'Astronauta A', emoji: '🧑‍🚀', esCorrecta: true },
      { id: 'Astronauta B', nombre: 'Astronauta B', emoji: '👨‍🚀', esCorrecta: false },
      { id: 'Satélite lejano', nombre: 'Satélite lejano', emoji: '🛰️', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'En la Cocina',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Es nutritiva, fresca y está guardada bien fría ADENTRO del refrigerador.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="70" y="30" width="120" height="105" rx="10" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
        <line x1="70" y1="75" x2="190" y2="75" stroke="#475569" strokeWidth="3" />
        <text x="130" y="65" fontSize="30" textAnchor="middle">🥛</text>
        <text x="245" y="70" fontSize="30" textAnchor="middle">🍕</text>
        <text x="245" y="125" fontSize="30" textAnchor="middle">🍔</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Leche fría', nombre: 'Leche fría', emoji: '🥛', esCorrecta: true },
      { id: 'Rebanada de pizza', nombre: 'Rebanada de pizza', emoji: '🍕', esCorrecta: false },
      { id: 'Hamburguesa', nombre: 'Hamburguesa', emoji: '🍔', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Castillo y Playa',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Es triangular, ondea con la brisa marina y está colocada ARRIBA de la torre.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="120" y="60" width="80" height="75" fill="#FDE68A" stroke="#D97706" strokeWidth="4" />
        <text x="160" y="45" fontSize="34" textAnchor="middle">🚩</text>
        <text x="70" y="130" fontSize="30" textAnchor="middle">🦀</text>
        <text x="250" y="130" fontSize="30" textAnchor="middle">🐚</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Bandera roja', nombre: 'Bandera roja', emoji: '🚩', esCorrecta: true },
      { id: 'Cangrejo playero', nombre: 'Cangrejo playero', emoji: '🦀', esCorrecta: false },
      { id: 'Conchita de mar', nombre: 'Conchita de mar', emoji: '🐚', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Bosque Silvestre',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Tiene grandes ojos sabios y está asomado despierto ADENTRO del tronco del árbol.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="130" y="40" width="60" height="100" fill="#78350F" />
        <ellipse cx="160" cy="80" rx="22" ry="28" fill="#1E293B" />
        <text x="160" y="88" fontSize="28" textAnchor="middle">🦉</text>
        <text x="60" y="130" fontSize="30" textAnchor="middle">🦔</text>
        <text x="250" y="130" fontSize="30" textAnchor="middle">🍄</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Búho sabio', nombre: 'Búho sabio', emoji: '🦉', esCorrecta: true },
      { id: 'Erizo curioso', nombre: 'Erizo curioso', emoji: '🦔', esCorrecta: false },
      { id: 'Hongo del bosque', nombre: 'Hongo del bosque', emoji: '🍄', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Rincón de Pintura',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Sirve para mezclar colores artísticos y está colocada limpia ENCIMA de la mesa.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="70" y="65" width="180" height="15" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
        <rect x="85" y="80" width="10" height="55" fill="#D97706" />
        <rect x="225" y="80" width="10" height="55" fill="#D97706" />
        <text x="160" y="52" fontSize="30" textAnchor="middle">🎨</text>
        <text x="160" y="125" fontSize="28" textAnchor="middle">🗑️</text>
        <text x="275" y="125" fontSize="28" textAnchor="middle">👟</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Paleta de pintor', nombre: 'Paleta de pintor', emoji: '🎨', esCorrecta: true },
      { id: 'Papelera', nombre: 'Papelera', emoji: '🗑️', esCorrecta: false },
      { id: 'Zapatos', nombre: 'Zapatos', emoji: '👟', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Pista de Carreras',
    nivelDificultad: 'Fase 2: Detective',
    pregunta: 'Tiene caparazón verde, camina con calma y es quien está más LEJOS de la línea de meta.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <line x1="40" y1="30" x2="40" y2="135" stroke="#16A34A" strokeWidth="6" strokeDasharray="6" />
        <text x="40" y="25" fontSize="12" fontWeight="900" fill="#16A34A" textAnchor="middle">META</text>
        <text x="95" y="90" fontSize="32" textAnchor="middle">🐆</text>
        <text x="180" y="90" fontSize="32" textAnchor="middle">🐰</text>
        <text x="275" y="90" fontSize="32" textAnchor="middle">🐢</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Tortuguita', nombre: 'Tortuguita', emoji: '🐢', esCorrecta: true },
      { id: 'Guepardo veloz', nombre: 'Guepardo veloz', emoji: '🐆', esCorrecta: false },
      { id: 'Conejito saltarín', nombre: 'Conejito saltarín', emoji: '🐰', esCorrecta: false }
    ])
  })
];

// BANCO DE FASE 3: 10 DESAFÍOS MAESTROS (4 OPCIONES)
const BANCO_FASE_3 = [
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Cuál elemento está ARRIBA en el árbol y además ADENTRO del nido de ramas?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="145" y="60" width="30" height="85" fill="#A16207" />
        <circle cx="160" cy="50" r="50" fill="#86EFAC" stroke="#22C55E" strokeWidth="4" />
        <ellipse cx="160" cy="55" rx="26" ry="14" fill="#D97706" />
        <text x="160" y="55" fontSize="20" textAnchor="middle">🥚</text>
        <text x="125" y="30" fontSize="24" textAnchor="middle">🐦</text>
        <text x="195" y="45" fontSize="22" textAnchor="middle">🍎</text>
        <text x="245" y="135" fontSize="30" textAnchor="middle">🐰</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Huevito mágico', nombre: 'Huevito mágico', emoji: '🥚', esCorrecta: true },
      { id: 'Pajarito cantor', nombre: 'Pajarito cantor', emoji: '🐦', esCorrecta: false },
      { id: 'Manzana madura', nombre: 'Manzana madura', emoji: '🍎', esCorrecta: false },
      { id: 'Conejito', nombre: 'Conejito', emoji: '🐰', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Qué objeto está ENCIMA del tapete verde pero DEBAJO de la mesa de madera?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <ellipse cx="160" cy="130" rx="90" ry="18" fill="#BBF7D0" stroke="#16A34A" strokeWidth="2" />
        <rect x="80" y="65" width="160" height="15" rx="4" fill="#FBBF24" stroke="#D97706" strokeWidth="3" />
        <rect x="95" y="80" width="10" height="50" fill="#D97706" />
        <rect x="215" y="80" width="10" height="50" fill="#D97706" />
        <text x="130" y="55" fontSize="26" textAnchor="middle">☕</text>
        <text x="190" y="55" fontSize="26" textAnchor="middle">💡</text>
        <text x="160" y="120" fontSize="28" textAnchor="middle">⚽</text>
        <text x="275" y="135" fontSize="30" textAnchor="middle">🐱</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Pelota de fútbol', nombre: 'Pelota de fútbol', emoji: '⚽', esCorrecta: true },
      { id: 'Taza de té', nombre: 'Taza de té', emoji: '☕', esCorrecta: false },
      { id: 'Lámpara', nombre: 'Lámpara', emoji: '💡', esCorrecta: false },
      { id: 'Gatito durmiente', nombre: 'Gatito durmiente', emoji: '🐱', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Quién está AFUERA de la canasta pero ENCIMA del mantel rojo de picnic?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="60" y="60" width="190" height="75" rx="8" fill="#FEE2E2" stroke="#EF4444" strokeWidth="3" />
        <rect x="80" y="70" width="70" height="50" rx="8" fill="#FED7AA" stroke="#EA580C" strokeWidth="3" />
        <text x="100" y="95" fontSize="20" textAnchor="middle">🧃</text>
        <text x="125" y="95" fontSize="20" textAnchor="middle">🥪</text>
        <text x="200" y="105" fontSize="32" textAnchor="middle">🍉</text>
        <text x="275" y="130" fontSize="24" textAnchor="middle">🐜</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Sandía fresca', nombre: 'Sandía fresca', emoji: '🍉', esCorrecta: true },
      { id: 'Jugo de naranja', nombre: 'Jugo de naranja', emoji: '🧃', esCorrecta: false },
      { id: 'Sándwich', nombre: 'Sándwich', emoji: '🥪', esCorrecta: false },
      { id: 'Hormiguita', nombre: 'Hormiguita', emoji: '🐜', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: 'No vuela, tiene bigotes naranjas, hace "miau" y está sentado ARRIBA del tejado.',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <polygon points="160,30 60,80 260,80" fill="#F87171" stroke="#DC2626" strokeWidth="4" />
        <rect x="80" y="80" width="160" height="65" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
        <text x="160" y="45" fontSize="36" textAnchor="middle">🐱</text>
        <text x="75" y="45" fontSize="26" textAnchor="middle">🕊️</text>
        <text x="45" y="135" fontSize="30" textAnchor="middle">🐶</text>
        <text x="265" y="135" fontSize="26" textAnchor="middle">🐭</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Scrapert el gato', nombre: 'Scrapert el gato', emoji: '🐱', esCorrecta: true },
      { id: 'Paloma blanca', nombre: 'Paloma blanca', emoji: '🕊️', esCorrecta: false },
      { id: 'Perrito fiel', nombre: 'Perrito fiel', emoji: '🐶', esCorrecta: false },
      { id: 'Ratón veloz', nombre: 'Ratón veloz', emoji: '🐭', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Qué animalito viaja ADENTRO del segundo vagón del trenecito?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="20" y="70" width="70" height="50" rx="6" fill="#EF4444" />
        <rect x="110" y="75" width="70" height="45" rx="6" fill="#3B82F6" />
        <rect x="200" y="75" width="70" height="45" rx="6" fill="#10B981" />
        <text x="55" y="105" fontSize="28" textAnchor="middle">🚂</text>
        <text x="145" y="105" fontSize="26" textAnchor="middle">🦁</text>
        <text x="235" y="105" fontSize="26" textAnchor="middle">🐼</text>
        <text x="295" y="135" fontSize="26" textAnchor="middle">🐦</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Oso Panda', nombre: 'Oso Panda', emoji: '🐼', esCorrecta: true },
      { id: 'León rugiente', nombre: 'León rugiente', emoji: '🦁', esCorrecta: false },
      { id: 'Locomotora', nombre: 'Locomotora', emoji: '🚂', esCorrecta: false },
      { id: 'Pajarito', nombre: 'Pajarito', emoji: '🐦', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Qué tesoro brilla ADENTRO del cofre pirata en el fondo del mar?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="0" y="0" width="320" height="150" fill="#E0F2FE" />
        <text x="60" y="45" fontSize="30" textAnchor="middle">🤿</text>
        <rect x="120" y="85" width="80" height="50" rx="8" fill="#D97706" stroke="#78350F" strokeWidth="3" />
        <text x="160" y="118" fontSize="28" textAnchor="middle">💎</text>
        <text x="240" y="70" fontSize="30" textAnchor="middle">🐙</text>
        <text x="270" y="135" fontSize="26" textAnchor="middle">🐚</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Diamante brillante', nombre: 'Diamante brillante', emoji: '💎', esCorrecta: true },
      { id: 'Pulpo morado', nombre: 'Pulpo morado', emoji: '🐙', esCorrecta: false },
      { id: 'Buceador', nombre: 'Buceador', emoji: '🤿', esCorrecta: false },
      { id: 'Conchita marina', nombre: 'Conchita marina', emoji: '🐚', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Qué objeto dorado está ENCIMA de toda la torre de libros?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="110" y="115" width="100" height="20" rx="4" fill="#3B82F6" />
        <rect x="120" y="92" width="80" height="20" rx="4" fill="#10B981" />
        <rect x="130" y="69" width="60" height="20" rx="4" fill="#F43F5E" />
        <text x="160" y="55" fontSize="32" textAnchor="middle">👑</text>
        <text x="50" y="135" fontSize="28" textAnchor="middle">👓</text>
        <text x="250" y="135" fontSize="28" textAnchor="middle">🍎</text>
        <text x="280" y="80" fontSize="28" textAnchor="middle">✏️</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Corona de oro', nombre: 'Corona de oro', emoji: '👑', esCorrecta: true },
      { id: 'Gafas de lectura', nombre: 'Gafas de lectura', emoji: '👓', esCorrecta: false },
      { id: 'Manzana roja', nombre: 'Manzana roja', emoji: '🍎', esCorrecta: false },
      { id: 'Lápiz de color', nombre: 'Lápiz de color', emoji: '✏️', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Cuál bandera multicolor está clavada ENCIMA de la colina lunar?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <path d="M 40 150 Q 160 50 280 150 Z" fill="#CBD5E1" stroke="#64748B" strokeWidth="3" />
        <text x="160" y="60" fontSize="34" textAnchor="middle">🏳️‍🌈</text>
        <text x="80" y="135" fontSize="30" textAnchor="middle">🚀</text>
        <text x="240" y="135" fontSize="30" textAnchor="middle">🧑‍🚀</text>
        <text x="285" y="45" fontSize="26" textAnchor="middle">⭐</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Bandera multicolor', nombre: 'Bandera multicolor', emoji: '🏳️‍🌈', esCorrecta: true },
      { id: 'Cohete espacial', nombre: 'Cohete espacial', emoji: '🚀', esCorrecta: false },
      { id: 'Astronauta', nombre: 'Astronauta', emoji: '🧑‍🚀', esCorrecta: false },
      { id: 'Estrella fugaz', nombre: 'Estrella fugaz', emoji: '⭐', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Quién navega por el río pasando justo por DEBAJO del puente?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="0" y="95" width="320" height="55" fill="#BAE6FD" />
        <path d="M 60 95 Q 160 50 260 95" stroke="#92400E" strokeWidth="10" fill="none" />
        <text x="160" y="60" fontSize="28" textAnchor="middle">🚴</text>
        <text x="160" y="130" fontSize="32" textAnchor="middle">🚣</text>
        <text x="40" y="70" fontSize="28" textAnchor="middle">🌳</text>
        <text x="280" y="70" fontSize="28" textAnchor="middle">🐦</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Bote con remos', nombre: 'Bote con remos', emoji: '🚣', esCorrecta: true },
      { id: 'Ciclista en puente', nombre: 'Ciclista en puente', emoji: '🚴', esCorrecta: false },
      { id: 'Árbol verde', nombre: 'Árbol verde', emoji: '🌳', esCorrecta: false },
      { id: 'Pajarito', nombre: 'Pajarito', emoji: '🐦', esCorrecta: false }
    ])
  }),
  () => ({
    etiqueta: 'Desafío Maestro',
    nivelDificultad: 'Fase 3: Maestro',
    pregunta: '¿Cuál balón está encestado justo ADENTRO del aro de básquetbol?',
    escenario: (
      <svg viewBox="0 0 320 150" width="100%" height="150">
        <rect x="180" y="25" width="10" height="110" fill="#64748B" />
        <rect x="120" y="35" width="60" height="40" fill="#F8FAFC" stroke="#DC2626" strokeWidth="3" />
        <ellipse cx="140" cy="75" rx="20" ry="8" fill="none" stroke="#EA580C" strokeWidth="4" />
        <text x="140" y="78" fontSize="22" textAnchor="middle">🏀</text>
        <text x="80" y="135" fontSize="28" textAnchor="middle">⚽</text>
        <text x="235" y="135" fontSize="28" textAnchor="middle">🏈</text>
        <text x="280" y="135" fontSize="28" textAnchor="middle">⚾</text>
      </svg>
    ),
    opciones: barajar([
      { id: 'Balón de básquetbol', nombre: 'Balón de básquetbol', emoji: '🏀', esCorrecta: true },
      { id: 'Balón de fútbol', nombre: 'Balón de fútbol', emoji: '⚽', esCorrecta: false },
      { id: 'Balón de fútbol americano', nombre: 'Balón de fútbol americano', emoji: '🏈', esCorrecta: false },
      { id: 'Pelota de béisbol', nombre: 'Pelota de béisbol', emoji: '⚾', esCorrecta: false }
    ])
  })
];

const crearQuinceRondasProgresivas = () => {
  const fase1 = barajar(BANCO_FASE_1).slice(0, 5).map((fn) => fn());
  const fase2 = barajar(BANCO_FASE_2).slice(0, 5).map((fn) => fn());
  const fase3 = barajar(BANCO_FASE_3).slice(0, 5).map((fn) => fn());
  const quinceRondas = [...fase1, ...fase2, ...fase3];

  const cantidadBonus = Math.floor(Math.random() * 2) + 1;
  const indicesCandidatos = barajar([3, 5, 7, 9, 11, 13]).slice(0, cantidadBonus);

  return quinceRondas.map((ronda, indice) => {
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

export default function JuegoEspacial({ actividad, estudiante, alVolverAlMenu }) {
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
    const rondas = crearQuinceRondasProgresivas();
    setRondasPartida(rondas);
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
      let puntosRonda = indiceRonda < 5 ? 5 : indiceRonda < 10 ? 10 : 15;
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

  const totalOpciones = rondaActual.opciones.length;
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
              backgroundColor: esBonus ? '#FEF3C7' : '#F0F9FF',
              color: esBonus ? '#B45309' : 'var(--color-cielo-verano)',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 14px',
              borderRadius: '12px',
              textTransform: 'uppercase'
            }}>
              {rondaActual.etiqueta}
            </span>

            <span style={{
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              fontWeight: 900,
              fontSize: '0.85rem',
              padding: '4px 12px',
              borderRadius: '12px'
            }}>
              {rondaActual.nivelDificultad}
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
                ? (esBonus ? '¡WOW! ¡Duplicaste tus puntos!' : '¡Exacto! ¡Qué gran vista tienes!') 
                : esAcierto === false 
                  ? '¡Oh! Estuvo cerca, ¡ánimo!' 
                  : esBonus 
                    ? '¡Atento! ¡Esta es una Pista de Scrapert dorada!' 
                    : 'Toca la tarjeta con la respuesta correcta'
            }
            tamano={130}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: totalOpciones === 2 
            ? 'repeat(2, 1fr)' 
            : totalOpciones === 3 
              ? 'repeat(3, 1fr)' 
              : 'repeat(2, 1fr)',
          gap: '14px'
        }}>
          {rondaActual.opciones.map((opcion) => {
            const estaElegida = respuestaSeleccionada === opcion.id;
            let claseBoton = totalOpciones === 2 ? 'boton-cielo' : totalOpciones === 3 ? 'boton-turquesa' : 'boton-amatista';

            if (esBonus) {
              claseBoton = 'boton-naranja';
            }

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
                  padding: totalOpciones === 4 ? '14px 10px' : '16px 12px',
                  fontSize: totalOpciones === 4 ? '1.1rem' : '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  opacity: respuestaSeleccionada !== null && !estaElegida ? 0.6 : 1
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{opcion.emoji}</span>
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
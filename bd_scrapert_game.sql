-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-11-2026 a las 04:22:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_scrapert_game`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `codigo_referencia` varchar(60) NOT NULL,
  `titulo` varchar(120) NOT NULL,
  `instrucciones` text DEFAULT NULL,
  `puntos_recompensa` int(11) NOT NULL DEFAULT 10,
  `esta_activa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `categoria_id`, `codigo_referencia`, `titulo`, `instrucciones`, `puntos_recompensa`, `esta_activa`) VALUES
(1, 1, 'espacial_aventura_total', 'La Gran Aventura Espacial', 'Supera las 15 rondas progresivas aprendiendo adentro/afuera, arriba/abajo, cerca/lejos y encima/debajo con pistas secretas.', 25, 1),
(5, 2, 'figuras_geometricas', 'El Taller de Figuras', 'Encuentra círculos, cuadrados, triángulos y rectángulos en pantalla.', 15, 1),
(6, 3, 'memoria_parejas', 'Memoria de Patitas', 'Voltea las tarjetas y encuentra todas las parejas idénticas.', 20, 1),
(7, 4, 'tablas_multiplicar', 'Desafío de Multiplicación', 'Resuelve multiplicaciones directas del 1 al 10 contra reloj.', 30, 1),
(8, 4, 'suma_quebrados', 'Suma de Quebrados', 'Calcula la suma de fracciones apoyándote en las representaciones visuales.', 40, 1),
(9, 4, 'multiplicacion_decimales', 'La Tiendita Decimal', 'Multiplica cantidades decimales en situaciones cotidianas de compra.', 50, 1),
(10, 5, 'reto_tele_colores', 'La Tele Mágica de Colores', 'Supera las 10 rondas del Efecto Stroop seleccionando el texto correcto antes de que se acabe el tiempo.', 150, 1),
(11, 6, 'desafio_mixto_preprimaria', 'El Gran Desafío de Scrapert', '¡Demuestra tu maestría! 10 rondas sorpresa que mezclan retos espaciales, figuras geométricas y parejas de memoria.', 50, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(60) NOT NULL,
  `nivel_educativo` enum('pre_primaria','primaria') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `nivel_educativo`) VALUES
(1, 'Conocimientos Espaciales', 'pre_primaria'),
(2, 'Figuras Geométricas', 'pre_primaria'),
(3, 'Memoria Visual', 'pre_primaria'),
(4, 'Operaciones Matemáticas', 'primaria'),
(5, 'Desafíos Mentales Avanzados', 'primaria'),
(6, 'Desafío Maestro', 'pre_primaria');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

CREATE TABLE `docentes` (
  `id` int(11) NOT NULL,
  `nombre_completo` varchar(120) NOT NULL,
  `clave_acceso` varchar(20) NOT NULL DEFAULT '1234',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`id`, `nombre_completo`, `clave_acceso`, `fecha_creacion`) VALUES
(1, 'Profesor Guía', '1234', '2026-10-18 20:31:29');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `edad` int(11) NOT NULL,
  `icono_avatar` varchar(50) DEFAULT 'gato_scrapert',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `nombre`, `edad`, `icono_avatar`, `fecha_registro`) VALUES
(1, 'Javier', 5, 'gato_scrapert', '2026-10-18 20:52:20'),
(2, 'Ale', 4, 'leon_valiente', '2026-10-18 21:24:00'),
(3, 'Pedro', 10, 'estrella_brillante', '2026-10-18 21:31:42'),
(4, 'p', 5, 'gato_scrapert', '2026-10-18 21:38:19'),
(5, 'Jose', 12, 'leon_valiente', '2026-10-18 22:20:15'),
(6, 'test', 5, 'delfin_alegre', '2026-10-18 22:22:35'),
(7, 'joaquin', 12, 'cohete_veloz', '2026-10-18 22:47:02'),
(8, 'Melani', 6, 'gato_scrapert', '2026-10-18 22:53:06'),
(9, 'Kabtzin', 6, 'cohete_veloz', '2026-10-31 20:00:02'),
(10, 'Mateo', 5, 'estrella_brillante', '2026-11-01 03:15:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progresos_juegos`
--

CREATE TABLE `progresos_juegos` (
  `id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `actividad_id` int(11) NOT NULL,
  `puntos_obtenidos` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `fallos` int(11) NOT NULL,
  `duracion_segundos` int(11) DEFAULT 0,
  `fecha_partida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `progresos_juegos`
--

INSERT INTO `progresos_juegos` (`id`, `estudiante_id`, `actividad_id`, `puntos_obtenidos`, `aciertos`, `fallos`, `duracion_segundos`, `fecha_partida`) VALUES
(1, 1, 1, 50, 5, 0, 29, '2026-10-18 21:10:47'),
(2, 1, 1, 50, 5, 0, 17, '2026-10-18 21:11:59'),
(3, 1, 1, 40, 4, 1, 17, '2026-10-18 21:18:02'),
(4, 1, 1, 50, 5, 0, 26, '2026-10-18 21:20:40'),
(5, 2, 1, 50, 5, 0, 27, '2026-10-18 21:24:52'),
(7, 3, 5, 60, 4, 1, 32, '2026-10-18 21:33:07'),
(8, 3, 1, 50, 5, 0, 39, '2026-10-18 21:35:02'),
(9, 4, 1, 150, 15, 0, 109, '2026-10-18 21:40:49'),
(10, 4, 1, 150, 15, 0, 80, '2026-10-18 21:44:38'),
(11, 4, 5, 150, 10, 0, 64, '2026-10-18 21:52:15'),
(12, 4, 6, 260, 13, 11, 70, '2026-10-18 21:57:18'),
(13, 4, 5, 150, 10, 0, 50, '2026-10-18 22:02:09'),
(14, 4, 6, 260, 13, 12, 63, '2026-10-18 22:03:18'),
(15, 4, 1, 145, 14, 1, 94, '2026-10-18 22:11:21'),
(16, 4, 5, 180, 10, 0, 47, '2026-10-18 22:12:18'),
(17, 1, 1, 20, 2, 13, 37, '2026-10-18 22:27:39'),
(18, 4, 11, 190, 10, 0, 55, '2026-10-18 22:30:17'),
(19, 4, 1, 140, 12, 3, 54, '2026-10-18 22:41:05'),
(20, 4, 5, 135, 8, 2, 36, '2026-10-18 22:41:48'),
(21, 4, 1, 160, 14, 1, 66, '2026-10-18 22:45:03'),
(22, 4, 5, 165, 10, 0, 47, '2026-10-18 22:45:58'),
(23, 7, 1, 135, 14, 1, 96, '2026-10-18 22:49:02'),
(24, 7, 5, 150, 9, 1, 24, '2026-10-18 22:49:39'),
(25, 7, 6, 260, 13, 16, 60, '2026-10-18 22:50:51'),
(26, 7, 11, 145, 8, 2, 45, '2026-10-18 22:51:44'),
(27, 2, 1, 130, 13, 2, 87, '2026-10-30 03:44:36'),
(28, 2, 7, 245, 7, 3, 52, '2026-10-30 04:11:25'),
(29, 2, 1, 180, 15, 0, 83, '2026-10-30 04:19:48'),
(30, 2, 8, 480, 10, 0, 89, '2026-10-30 04:23:06'),
(31, 2, 9, 300, 5, 5, 74, '2026-10-30 04:45:34'),
(32, 2, 10, 165, 9, 1, 47, '2026-10-30 04:48:40'),
(33, 2, 10, 130, 7, 3, 39, '2026-10-30 04:53:51'),
(34, 2, 10, 0, 0, 2, 9, '2026-10-31 19:47:11'),
(35, 9, 1, 125, 11, 4, 130, '2026-10-31 20:04:36'),
(36, 9, 5, 150, 9, 1, 31, '2026-10-31 20:05:17'),
(37, 9, 6, 260, 13, 10, 48, '2026-10-31 20:06:15'),
(38, 10, 1, 135, 13, 2, 71, '2026-11-01 03:17:26'),
(39, 10, 5, 165, 10, 0, 31, '2026-11-01 03:18:08'),
(40, 10, 6, 260, 13, 8, 42, '2026-11-01 03:18:56'),
(41, 10, 11, 160, 9, 1, 36, '2026-11-01 03:19:41');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_referencia` (`codigo_referencia`),
  ADD KEY `fk_categoria_actividad` (`categoria_id`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `progresos_juegos`
--
ALTER TABLE `progresos_juegos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_estudiante_progreso` (`estudiante_id`),
  ADD KEY `fk_actividad_progreso` (`actividad_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `progresos_juegos`
--
ALTER TABLE `progresos_juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `fk_categoria_actividad` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `progresos_juegos`
--
ALTER TABLE `progresos_juegos`
  ADD CONSTRAINT `fk_actividad_progreso` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_estudiante_progreso` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

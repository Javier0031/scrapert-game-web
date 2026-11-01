CREATE DATABASE IF NOT EXISTS bd_scrapert_game
CHARACTER SET utf8mb4 
COLLATE utf8mb4_spanish_ci;

USE bd_scrapert_game;

CREATE TABLE IF NOT EXISTS docentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(120) NOT NULL,
    clave_acceso VARCHAR(20) NOT NULL DEFAULT '1234',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    icono_avatar VARCHAR(50) DEFAULT 'gato_scrapert',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    nivel_educativo ENUM('pre_primaria', 'primaria') NOT NULL
);

CREATE TABLE IF NOT EXISTS actividades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    codigo_referencia VARCHAR(60) UNIQUE NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    instrucciones TEXT,
    puntos_recompensa INT NOT NULL DEFAULT 10,
    esta_activa BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_categoria_actividad 
        FOREIGN KEY (categoria_id) REFERENCES categorias(id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progresos_juegos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    actividad_id INT NOT NULL,
    puntos_obtenidos INT NOT NULL,
    aciertos INT NOT NULL,
    fallos INT NOT NULL,
    duracion_segundos INT DEFAULT 0,
    fecha_partida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_estudiante_progreso 
        FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_actividad_progreso 
        FOREIGN KEY (actividad_id) REFERENCES actividades(id) 
        ON DELETE CASCADE
);

--carga de datos
INSERT INTO docentes (nombre_completo, clave_acceso) 
VALUES ('Profesor Guía', '1234');

-- Categorías por nivel
INSERT INTO categorias (id, nombre, nivel_educativo) VALUES
(1, 'Conocimientos Espaciales', 'pre_primaria'),
(2, 'Figuras Geométricas', 'pre_primaria'),
(3, 'Memoria Visual', 'pre_primaria'),
(4, 'Operaciones Matemáticas', 'primaria'),
(5, 'Desafíos Mentales Avanzados', 'primaria');

-- Catalogo
INSERT INTO actividades (categoria_id, codigo_referencia, titulo, instrucciones, puntos_recompensa) VALUES
(1, 'espacial_adentro_afuera', 'Adentro y Afuera con Scrapert', 'Selecciona el elemento que se encuentra adentro o afuera del objeto indicado.', 10),
(1, 'espacial_arriba_abajo', 'Arriba y Abajo', 'Descubre cuál de los elementos está ubicado arriba o abajo en el escenario.', 10),
(1, 'espacial_cerca_lejos', 'Cerca y Lejos', 'Identifica qué objeto se halla más cerca o más lejos del punto de referencia.', 10),
(1, 'espacial_encima_debajo', 'Encima y Debajo', 'Reconoce las posiciones relativas sobre o debajo de las superficies.', 10),
(2, 'figuras_geometricas', 'El Taller de Figuras', 'Encuentra círculos, cuadrados, triángulos y rectángulos en pantalla.', 15),
(3, 'memoria_parejas', 'Memoria de Patitas', 'Voltea las tarjetas y encuentra todas las parejas idénticas.', 20),

(4, 'tablas_multiplicar', 'Desafío de Multiplicación', 'Resuelve multiplicaciones directas del 1 al 10 contra reloj.', 30),
(4, 'suma_quebrados', 'Suma de Quebrados', 'Calcula la suma de fracciones apoyándote en las representaciones visuales.', 40),
(4, 'multiplicacion_decimales', 'La Tiendita Decimal', 'Multiplica cantidades decimales en situaciones cotidianas de compra.', 50),
(5, 'reto_tele_colores', 'La Tele Mágica de Colores', 'Supera las 10 rondas del Efecto Stroop seleccionando el texto correcto antes de que se acabe el tiempo.', 150);
# Scrapert Game - Sistema Web Educativo Interactivo

Plataforma web diseñada para el desarrollo cognitivo, la discriminación visoespacial y el refuerzo lógico-matemático en etapas formativas, segmentada en dos niveles pedagógicos: Pre-Primaria (4 a 6 años) y Primaria (7 a 12 años). El sistema integra control reactivo de interfaces, persistencia asíncrona de métricas de desempeño, evaluación basada en gamificación y una consola docente de auditoría protegida mediante control de acceso numérico.

---

## 1. Arquitectura y Tecnologías

### Frontend
- **Framework:** React 18
- **Herramienta de compilación:** Vite
- **Iconografía:** Lucide React
- **Estilos:** CSS3 modular con variables de diseño personalizadas y diseño adaptativo

### Backend
- **Entorno de ejecución:** Node.js
- **Framework HTTP:** Express
- **Middleware:** CORS (intercambio de recursos de origen cruzado), Dotenv (gestión de variables de entorno)
- **Protocolo:** API RESTful desacoplada con respuestas estructuradas en formato JSON

### Persistencia y Base de Datos
- **Motor:** MySQL / MariaDB
- **Controlador:** `mysql2/promise` implementando un pool de conexiones optimizado para transacciones asíncronas concurrentes

---

## 2. Catálogo de Módulos y Actividades

### Nivel Pre-Primaria
- **La Gran Aventura Espacial:** Evaluación de discriminación posicional y orientación espacial relativa (nociones de adentro y afuera).
- **El Taller de Figuras:** Identificación visual y velocidad de reacción ante patrones y formas geométricas bidimensionales.
- **Memoria de Patitas:** Ejercicio de correspondencia visomotora y memoria de trabajo a corto plazo mediante emparejamiento de tarjetas.
- **El Gran Desafío de Scrapert:** Evaluación integral desbloqueable sujeta a la culminación previa de las tres actividades base del nivel.

### Nivel Primaria
- **Desafío de Multiplicación:** Automatización y agilidad de cálculo mental en tablas de multiplicar del 1 al 10 bajo control de tiempo.
- **Suma de Quebrados:** Resolución de adición de fracciones homogéneas y heterogéneas asistida por representaciones visuales proporcionales.
- **La Tiendita Decimal:** Multiplicación con cantidades decimales orientada a problemas de cálculo comercial cotidiano.
- **La Tele Mágica de Colores:** Evaluación de atención selectiva y control inhibitorio mediante el paradigma neurocognitivo del Efecto Stroop con distractores gráficos cruzados.

---

## 3. Módulos Institucionales y de Control

### Cuadro de Honor (Starboard)
- Visualización jerárquica de puntuaciones acumuladas a nivel global.
- Estructuración de podio para las tres mejores calificaciones y tabla general ordenada de rendimientos.

### Módulo de Supervisión Docente (Parental Gate)
- Control de acceso de cuatro dígitos diseñado para prevenir la alteración o salida no autorizada del entorno lúdico.
- **Código PIN predeterminado:** `1234`
- Indicadores Clave de Desempeño (KPIs): partidas totales registradas, tasa porcentual de precisión colectiva y puntos globales emitidos.
- Filtro interactivo por alumno con auditoría de actividades, aciertos, errores y duración exacta en segundos.

---

## 4. Requisitos del Sistema

- **Node.js:** Versión 18.0.0 o superior
- **Gestor de paquetes:** npm (incluido con Node.js)
- **Servidor de base de datos:** MySQL 5.7+ o MariaDB 10.4+ (ejecutable mediante entornos locales como XAMPP)

---

## 5. Instalación y Puesta en Marcha

### Paso 1: Configuración de la Base de Datos
1. Iniciar los servicios de Apache y MySQL en el panel de control correspondiente.
2. Acceder al gestor de bases de datos (por ejemplo, phpMyAdmin en `http://localhost/phpmyadmin`).
3. Crear una nueva base de datos denominada exactamente:
   ```text
   bd_scrapert_game
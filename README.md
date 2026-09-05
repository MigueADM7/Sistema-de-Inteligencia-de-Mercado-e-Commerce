# Simulador de Rentabilidad e-Commerce Full-Stack

## 🚀 Descripción Técnica del MVP

Este proyecto consiste en un **Simulador Dinámico de Inteligencia de Mercado** diseñado para el sector e-Commerce. El objetivo principal del MVP es proporcionar a "El Gigante del Hogar" una herramienta integral de análisis de datos de productos y proyección financiera.

La arquitectura de la solución es **Full-Stack**, separando claramente las responsabilidades:
- **Backend (Node.js/Express)**: Encargado de la ingesta de datos de catálogos externos, limpieza, validaciones, procesamiento de lógicas de negocio, cálculos financieros y exposición de endpoints RESTful. Está diseñado priorizando el rendimiento y la tolerancia a fallos.
- **Frontend (React/Vite)**: Capa de presentación reactiva con diseño moderno (Glassmorphism), enfocada en una experiencia de usuario (UX) ágil y responsiva. Permite la manipulación en tiempo real de márgenes comerciales y recálculo de proyecciones de rentabilidad en memoria.

---

## 💻 Instrucciones de Despliegue

Sigue estos pasos para levantar el ecosistema completo en tu entorno local.

### 1. Clonar el repositorio
Abre una terminal y ejecuta los siguientes comandos:
```bash
git clone <URL_DEL_REPOSITORIO>
cd Sistema-de-Inteligencia-de-Mercado-e-Commerce
```

### 2. Levantar el Backend
El backend expone la API y se encarga del procesamiento pesado. Abre una terminal en la raíz del proyecto y ejecuta:

```bash
cd backend
npm install
node src/app.js
```
El servidor backend estará escuchando en: `http://localhost:3001`

### 3. Levantar el Frontend
El frontend consume la API local. Abre una **nueva terminal** en la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible de forma interactiva en: `http://localhost:5173`

---

## 🧠 Arquitectura y Toma de Decisiones Técnicas

### 1. Gestión de Recursos: Optimización con Node-Cache
**Argumentación sobre la implementación de `node-cache` (TTL 10 min) en el `ExternalApiRepository`:**

La integración constante con APIs de terceros (como FakeStoreAPI) conlleva latencias de red y riesgos de cuellos de botella. Para mitigarlos, la arquitectura incorpora una capa de caché en memoria a través de `node-cache` configurada con un Time-To-Live (TTL) de 10 minutos. Esta decisión técnica aporta tres ventajas cruciales:

1. **Aislamiento de Carga**: Protegemos nuestro sistema y evitamos sobrecargar la API de terceros (previniendo bloqueos por *Rate Limiting*).
2. **Reducción Drástica de Latencias**: Tras la primera consulta, las peticiones subsecuentes dentro de la ventana de 10 minutos se sirven desde la memoria RAM del servidor. Esto desploma los tiempos de respuesta de cientos de milisegundos a apenas unos pocos, ofreciendo una experiencia instantánea en el dashboard.
3. **Optimización de Consumo de CPU**: Al omitir el proceso de establecer nuevas conexiones HTTP, serializar/deserializar respuestas JSON y enrutar datos constantemente de la red, liberamos hilos de ejecución de Node.js y ahorramos valiosos ciclos de CPU del servidor.

### 2. Continuidad del Negocio: Resiliencia con Circuit Breaker
**Documentación sobre la Alta Disponibilidad (HA) mediante el patrón Circuit Breaker y Fallback:**

En un entorno corporativo, la presentación gerencial de un dashboard no puede verse interrumpida si el proveedor de datos externo sufre una caída. Para blindar la continuidad del negocio, el backend implementa el patrón de diseño **Circuit Breaker** utilizando la librería `opossum`.

- **Manejo Preventivo de Fallos**: Si la API externa (`fakestoreapi.com`) colapsa o demora demasiado (Timeout), el Circuit Breaker corta las peticiones externas temporales para evitar que el backend se ahogue esperando respuestas imposibles.
- **Mecanismo de Fallback (Respaldo)**: En el instante en que se detecta el fallo o el circuito se abre, se intercepta la caída y se activa automáticamente la inyección del archivo local de respaldo (`backup_catalog.json`).
- **Garantía de Operación**: El resultado final es completamente transparente para el cliente. El dashboard seguirá consumiendo el catálogo respaldado, asegurando una alta disponibilidad del 100% durante presentaciones críticas, sin importar la inestabilidad de la red externa.
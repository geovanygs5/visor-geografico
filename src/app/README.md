# 🌍 Visor Geográfico Interactivo de Terremotos

Single Page Application (SPA) desarrollada con **Angular 22** y **MapLibre GL** que visualiza en un mapa interactivo los terremotos de magnitud mayor a 4.5 ocurridos en los últimos 30 días, consumiendo el feed público GeoJSON de la **USGS** (United States Geological Survey).

> **Prueba técnica de desarrollo frontend** — demostración de integración de librerías de mapas de terceros, consumo de datos espaciales y sincronización de estado entre mapa e interfaz de usuario.

---

## ✨ Características

- 🗺️ **Mapa interactivo** con MapLibre GL y estilo público `demotiles.maplibre.org`
- 📍 **647 sismos renderizados** como puntos cuyo **tamaño** y **color** varían según la magnitud
- 📋 **Listado lateral** con tarjetas que muestran ubicación, magnitud, fecha y estado
- 🔄 **Interactividad bidireccional sincronizada:**
  - Click en un punto del mapa → resalta la tarjeta correspondiente y muestra el panel de detalle
  - Click en una tarjeta → vuela (`flyTo`) al punto en el mapa y muestra el detalle
  - Hover sobre una tarjeta → resalta el punto en el mapa (borde verde)
  - Hover sobre un punto → cambia el cursor a pointer
- 🔍 **Filtros sincronizados** por rango de magnitud y rango de fechas, aplicados **simultáneamente** al mapa y al listado
- 📊 **Panel de detalle** con las propiedades completas del sismo seleccionado: lugar, magnitud, profundidad, fecha/hora exacta, estado, coordenadas y enlace a USGS
- ⚡ **State management reactivo** con **Angular Signals** + `computed` + `effect`
- 🎨 **Estilos con TailwindCSS**
- 📱 **Diseño responsive** con layout de 75% mapa / 25% panel lateral

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Angular** | 22.1.6 | Framework principal (standalone components + signals) |
| **MapLibre GL** | 6.9.0 | Renderizado del mapa y capa GeoJSON |
| **TypeScript** | 6.0.x | Tipado estático |
| **TailwindCSS** | 3.4.x | Estilos utilitarios |
| **RxJS** | 7.8.x | Manejo de peticiones HTTP |
| **Node.js** | >= 20.x | Entorno de ejecución |

---

## 📦 Requisitos previos

- **Node.js** >= 20.x ([descargar](https://nodejs.org/))
- **npm** >= 10.x (viene incluido con Node.js)
- **Git** (para clonar el repositorio)
- Conexión a internet (la app consume la API pública de USGS)

---

## 🚀 Instalación y ejecución en local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/visor-geografico.git
cd visor-geografico

# 2. Instalar dependencias
npm install

# 3. Ejecutar el servidor de desarrollo
ng serve

# 4. Abrir en el navegador
# http://localhost:4200
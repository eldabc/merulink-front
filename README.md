MeruLink es una plataforma web integral de gestión hotelera. Este repositorio contiene el código fuente de la aplicación del lado del cliente (Frontend), construida con una arquitectura moderna, reactiva y optimizada para la administración de personal y flujos de trabajo.

## 🚀 Características Principales
Módulo de Planificación de Turnos (ScheduleGrid): Potente grilla interactiva impulsada por AG Grid Community que permite la asignación masiva de turnos a empleados mediante una herramienta de arrastre/brocha en tiempo real.

Vigilante de Alertas en Vivo: Sistema inteligente en el cliente que analiza la quincena de manera reactiva mediante Day.js, arrojando advertencias visuales.

Gestión de Eventos y Calendarios: Integración visual completa mediante librerías como FullCalendar para la organización de eventos del hotel.

Gestión de empleados: Ficha de empleados, asignación de lockers, integración con apis própias y de terceros.

## 🛠️ Stack Tecnológico
Core: React 18+ (con Hooks personalizados y Context API para la gestión del estado global por módulo).

Herramienta de Construcción: Vite.

Estilos: Tailwind CSS (diseño responsivo y soporte nativo para interfaces oscuras/claras).

Tablas Complejas: AG Grid Community Module (Renderizado de alto rendimiento para matrices de empleados).

Formularios: React Hook Form (validaciones eficientes sin re-renders innecesarios).

Fechas: Day.js (manipulación, diferencias horarias y formateo internacional).


/**
* Todos los derechos reservados Hotel Plaza Meru. 2026
*/
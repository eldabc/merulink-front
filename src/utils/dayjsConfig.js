import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isBetween from 'dayjs/plugin/isBetween'; // Plugin para rangos de fechas
import relativeTime from 'dayjs/plugin/relativeTime'; // Opcional: "hace 2 horas", etc.

// Configura el idioma global a español
dayjs.locale('es');

// Activación de plugins
dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default dayjs;
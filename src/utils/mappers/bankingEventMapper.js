import { EVENT_CAT } from "../eventConfig";

//*** Mapeo Banking array
export const mapBankingEventToBackend = (eventsArray, year) => {
  return eventsArray.map((event, index) => ({
    title: event.title,
    start: event.start + 'T00:00:00',
    end: null, 
    all_day: true,

    extended_props: {
      status: 'Creado',
      description: `Feriado Bancario - Año ${year}`,
    },

    category_key: EVENT_CAT.B_MONDAYS.key,
  }));
}
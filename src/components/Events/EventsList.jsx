import React, { useMemo } from 'react';
import { INITIAL_EVENTS } from '../../utils/StaticData/event-utils';

export default function EventsList({ categoryKey }) {
  // categoryKey can be 'meru-events', 'event-wedding' or 'otros'
  const items = useMemo(() => {
    if (categoryKey === 'otros') {
      // everything not meru-events nor event-wedding
      return INITIAL_EVENTS.filter(ev => {
        const cat = ev.extendedProps?.category;
        return cat && cat !== 'meru-events' && cat !== 'event-wedding';
      });
    }
    return INITIAL_EVENTS.filter(ev => ev.extendedProps?.category === categoryKey);
  }, [categoryKey]);

  if (!items || items.length === 0) {
    return <div className="p-4">No hay eventos en esta categoría.</div>;
  }

  return (
    <div className="events-list">
      <ul className="space-y-3">
        {items.map(ev => (
          <li key={ev.id} className="p-3 bg-[#0f1720] rounded-md border border-[#ffffff0d]">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-lg font-semibold">{ev.title}</div>
                <div className="text-sm text-gray-400">{new Date(ev.start).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-400">{ev.extendedProps?.category || '-'}</div>
            </div>
            {ev.extendedProps?.description && (
              <p className="mt-2 text-sm text-gray-300">{ev.extendedProps.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

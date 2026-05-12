import { Link } from 'react-router-dom';

export default function SidebarEvent({ event, isSelected, onSelectEvent }) {
  // Obtener la clase CSS del evento
  const eventColorClass = event.classNames?.[0] || event.className || 'g-calendar-ve-holidays';
  
  return (
    <li 
      className={`sidebar-event-item ${isSelected ? `border-${eventColorClass}` : ''}`} 
      onClick={() => onSelectEvent(event)}
      style={{ cursor: 'pointer' }}
    >
      <div className="sidebar-event-content">
        <div 
          className={`event-color-indicator ${eventColorClass}`}
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '10px',
            flexShrink: 0
          }}
        />
        <span>
           <Link className="event-title" to={event?.extendedProps?.routePath}> {event.title} </Link>
        </span>
      </div>
    </li>
  );
}


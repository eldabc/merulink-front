export default function SidebarEvent({ event, isSelected, onSelectEvent }) {
  // Obtener la clase CSS del color del evento
  const eventColorClass = event.classNames?.[0] || event.className || '';
  
  return (
    <li 
      className={`sidebar-event-item ${isSelected ? 'selected' : ''}`} 
      onClick={() => onSelectEvent(event)}
      style={{ cursor: 'pointer' }}
    >
      <div className="sidebar-event-content">
        <div 
          className={`event-color-indicator ${eventColorClass}`}
          style={{
            backgroundColor: eventColorClass === 'event-red' 
              ? 'rgb(128, 0, 64)' 
              : eventColorClass === 'event-blue'
              ? 'rgb(13, 0, 128)'
              : '#ccc',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            display: 'inline-block',
            marginRight: '10px',
            flexShrink: 0
          }}
        />
        <span className="event-title">{event.title}</span>
      </div>
    </li>
  );
}


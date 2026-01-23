export default function SidebarEvent({ event, isSelected, onSelectEvent }) {
  // Obtener la clase CSS del evento
  const eventColorClass = event.classNames?.[0] || event.className || 'g-calendar-ve-holidays';
  
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


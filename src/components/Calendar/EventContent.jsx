export default function EventContent({ eventInfo, onDotClick }) {
  return (
    <>
      <div onClick={() => onDotClick(eventInfo.event)} className="event-dot"></div>
    </>
  );
}


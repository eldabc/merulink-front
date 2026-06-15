function LiveAlerts({ alerts }) {
  return (
    <div className="w-full md:flex-1 bg-amber-500/10 border border-amber-500/30 text-amber-200 p-3 rounded-lg flex flex-col gap-2 shadow-inner">
      <div className="font-bold border-b border-amber-500/20 pb-1 flex items-center gap-2 text-amber-400 text-xs uppercase tracking-wider">
        <span>⚠️ Alertas de Planificación ({alerts.length})</span>
      </div>
      <div className="list-disc pl-5 flex flex-col gap-1">
        {alerts.map((alert) => (
          <div key={alert.id} className="text-xs tracking-wide">
            <span dangerouslySetInnerHTML={{ __html: alert.message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveAlerts;
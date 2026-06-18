function AlertBadge({ alert }) {
  
  const ALERT_STYLES = {
    new_modification: "bg-cyan-950 text-cyan-400 border-cyan-800",
    warning: "bg-amber-950 text-amber-400 border-amber-800",
    danger: "bg-red-950 text-red-400 border-red-800"
  };

  const type_alert_style = ALERT_STYLES[alert?.type] || "bg-gray-800 text-gray-400 border-gray-700";
  
  return (
    <span 
      title={alert?.tooltip}
      className={`
        ${type_alert_style}
        absolute 
        -top-3 
        -right-1 
        transform 
        translate-x-1/2 
        -translate-y-1/4
        text-[10px] 
        font-black 
        tracking-wider 
        px-1.5 
        py-0.5 
        rounded-lg
        shadow-md 
        border 
        uppercase
        select-none
        animate-bounce
      `}
      style={{ animationDuration: '4s' }}
    >
      {alert?.label} 
    </span>
  );
};

export default AlertBadge;
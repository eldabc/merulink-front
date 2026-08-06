{/* Barra de Arrastre */}
function DragBar({ onClose, text }) {
    return (
      <div className="bg-[#2f3132] px-4 py-2 flex items-center justify-between cursor-move select-none border-b border-gray-600 shrink-0">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
          <span>📋 Visor: {text} </span>
        </div>
        <button 
          onClick={onClose}
          // onTouchStart para interceptar el toque en celulares al instante
          onTouchStart={(e) => {
            e.stopPropagation();
            onClose();
          }}
          // 'no-drag' para que react-rnd sepa que aquí NO se arrastra.
          className="no-drag relative z-50 text-gray-400 hover:text-red-400 active:text-red-500 text-sm font-bold p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>
    );  
}

export default DragBar;
function ButtonCancel({ onClose }) {
  return (
    <button
      onClick={onClose}
      className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
    >
      Cancelar
    </button>
  ); 
}

export default ButtonCancel;
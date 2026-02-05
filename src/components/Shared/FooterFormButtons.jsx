function FooterFormButtons({ onBack, onSave, isSubmitting, mode, navigate, txtCreate = '', creatorName = "Sistema", isTemplate, setIsTemplate }) {
  return (
        <div className="mt-6 flex justify-end gap-3">

      
      <button type="button" onClick={() => typeof onBack === 'function' ? onBack() : navigate(-1)} className="px-6 py-2 font-semibold">Cancelar</button>
      {mode !== 'view' && (
        <button type="submit" 
          disabled={isSubmitting}
          onClick={onSave} 
          className="px-6 py-2 font-semibold">
          {isSubmitting ? 'Procesando...' : (mode === 'edit' ? 'Guardar cambios' : `Crear ${txtCreate}`)}
        </button>
      )}
    </div>
  );
}

export default FooterFormButtons;
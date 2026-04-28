import React, { useMemo } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ readonly, value, onChange, placeholder }) => {

  // Configuración básica (añadir o quitar botones aquí)
  const config = useMemo(() => ({
    readonly: readonly,
    placeholder: placeholder || 'Empieza a escribir...',
    buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'font', 'fontsize', 'brush', 'paragraph', '|', 'table', 'link', '|', 'undo', 'redo'],
    theme: 'dark',
    language: 'es',
    height: 300,

    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false, // Quita el "P"
    statusbar: false, // Oculta toda la barra inferior

    toolbarAdaptive: false, // Evita que los botones desaparezcan en pantallas pequeñas
  }), [placeholder]);

  return (
    <div className="jodit-wrapper border border-gray-700 rounded-lg overflow-hidden">
      <JoditEditor
        value={value}
        config={config}
        tabIndex={1} // tabIndex de inicio
        onBlur={newContent => onChange(newContent)} // Actualiza al salir del editor
        onChange={newContent => {}} // Opcional
      />
    </div>
  );
};

export default RichTextEditor;
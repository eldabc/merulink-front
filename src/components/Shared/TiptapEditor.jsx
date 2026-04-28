import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Escribe los detalles del evento o notas de la habitación...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="w-full border border-gray-700 rounded-xl overflow-hidden bg-[#1e293b]"> {/* Fondo oscuro tipo MeruLink */}
      {/* Barra de herramientas mejorada */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#0f172a] border-b border-gray-700">
        <MenuBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} label="B" />
        <MenuBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} label="I" />
        <MenuBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} label="U" />
        
        <div className="w-px h-6 bg-gray-700 mx-1" /> {/* Separador */}
        
        <MenuBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} label="Left" />
        <MenuBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} label="Center" />
        
        <div className="w-px h-6 bg-gray-700 mx-1" />
        
        <MenuBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} label="• Lista" />
      </div>

      {/* Área de texto con estilos prose corregidos */}
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 min-h-[200px] focus:outline-none text-gray-200"
      />
    </div>
  );
};

// Sub-componente para botones limpios
const MenuBtn = ({ onClick, active, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
      active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
    }`}
  >
    {label}
  </button>
);

export default TiptapEditor;
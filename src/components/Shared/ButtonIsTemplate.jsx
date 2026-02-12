import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

function ButtonIsTemplate() {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); }}
      title='Evento Plantilla'
      type="button" className={`skip-style-btn ml-5 tags-work-btn p-1.5! }`}>
      <ClipboardDocumentCheckIcon className='w-6 h-6 text-[#8fbedd]' />
    </button>
  );
}

export default ButtonIsTemplate;
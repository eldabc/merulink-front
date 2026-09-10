import { XMarkIcon } from '@heroicons/react/24/solid';

function ButtonDelete({ setIsModalOpen, title = 'Eliminar', dynamicClasses, disabled }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      disabled={disabled}
      title={title}
      type="button" className={`tags-work-btn p-1.5! ${dynamicClasses}`}>
    <XMarkIcon className='w-5 h-5 text-red-400' />
    </button>
  );
}

export default ButtonDelete;
import { XMarkIcon } from '@heroicons/react/24/solid';

function ButtonDelete({ setIsModalOpen, title = 'Eliminar', dinamicClasses, disabled }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      disabled={disabled}
      title={title}
      type="button" className={`tags-work-btn p-1.5! ${dinamicClasses}`}>
    <XMarkIcon className='w-5 h-5 text-red-400' />
    </button>
  );
}

export default ButtonDelete;
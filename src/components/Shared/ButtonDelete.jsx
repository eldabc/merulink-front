import { XMarkIcon } from '@heroicons/react/24/solid';

function ButtonDelete({ setIsModalOpen }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      title='Eliminar'
      type="button" className={`tags-work-btn p-1.5! }`}>
    <XMarkIcon className='w-5 h-5 text-red-400' />
    </button>
  );
}

export default ButtonDelete;
import { XMarkIcon } from '@heroicons/react/24/solid';

function ButtonDelete({setIsModalOpen, id}) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      title='Eliminar'
      type="button" className={`tags-work-btn }`}>
    <XMarkIcon className='w-5 h-5 text-red-400' />
    </button>
  );
}

export default ButtonDelete;
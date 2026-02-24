
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';

function ButtonReset({ setIsModalOpen }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      className='flex flex-row items-center space-x-1' type='button' title='Resetear Locker'>
        <ArrowPathRoundedSquareIcon className='w-5 h-5 text-red-400 mr-1.5'/> Resetear
    </button>
  );
}

export default ButtonReset;

import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';

function ButtonReset({ setIsModalOpen, colorIcon, customStyle, title  = '' }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      className={`${customStyle} flex flex-row items-center space-x-1 rounded-lg p-1`} type='button' title={`Resetear Locker ${title}`}>
        <ArrowPathRoundedSquareIcon 
        className={`w-5 h-5 ${colorIcon ? colorIcon : 'text-red-400'} mr-1.5`}/> Resetear {title}
    </button>
  );
}

export default ButtonReset;
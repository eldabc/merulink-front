
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/solid';

function ButtonReset({ setIsModalOpen, colorIcon, customStyle, title, disabled = false }) { //  = ''
  return (
    <button 
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        setIsModalOpen(true);
      }}
      className={`${customStyle} flex flex-row items-center space-x-1 rounded-lg p-1
                  ${disabled && 'opacity-50 cursor-not-allowed'}`} type='button' title={`Resetear Locker ${title}`}>
        <ArrowPathRoundedSquareIcon 
        className={`w-5 h-5 ${colorIcon ? colorIcon : 'text-red-400'} mr-1.5`}/> Resetear {title}
    </button>
  );
}

export default ButtonReset;
import { ClockIcon } from '@heroicons/react/24/solid';

function ButtonHistory({ showHistory, setShowHistory }) {
  return (
    <button
      onClick={() => setShowHistory(!showHistory)}
      className={`flex items-center gap-2 px-4 py-2 transition-all duration-200 ml-auto mr-7 mb-5 bg-[#2f3d44]! hover:border-[#9fd8ff]!
        ${ showHistory 
          ? 'text-[#9fd8ff] shadow-inner border-[#ffffff21]!' 
          : 'text-white-600 shadow-sm'
        }`}
    >
      <ClockIcon className='w-5' />  {showHistory ? 'Ocultar' : 'Historial'}
    </button>
  );
}

export default ButtonHistory;
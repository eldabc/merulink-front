import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/solid';

function HistoryNavigation({ setHistoryYear, setCurrentPage, historyYear, currentSystemYear  }) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <button
        type="button"
        onClick={() => {
          setHistoryYear((prev) => Math.max(prev - 1, 1900));
          setCurrentPage(1);
        }}
        className="px-3 py-2 rounded border text-sm hover:bg-[#2f3d44]! transition"
      >
        <ChevronDoubleLeftIcon className='w-3 h-3 text-[#9fd8ff]' />
      </button>

      <span className="text-sm font-semibold">Historial del año {historyYear}</span>

      <button
        type="button"
        onClick={() => {
          setHistoryYear((prev) => Math.min(prev + 1, currentSystemYear));
          setCurrentPage(1);
        }}
        disabled={historyYear >= currentSystemYear}
        className={`px-3 py-2 text-sm transition hover:bg-[#2f3d44]!`}
      >
        <ChevronDoubleRightIcon className={`w-3 h-3 text-[#9fd8ff]! ${historyYear >= currentSystemYear ? 'border-slate-400 text-slate-400 cursor-not-allowed' : 'border-slate-500 hover:bg-slate-700'}`} />
      </button>

      {historyYear !== currentSystemYear && (
        <button
          type="button"
          onClick={() => {
            setHistoryYear(currentSystemYear);
            setCurrentPage(1);
          }}
          className="px-1 py-1 text-sm! rounded border bg-[#2f3d44]! hover:border-[#9fd8ff]! transition text-[#9fd8ff] shadow-inner border-[#ffffff21]!"
        >
          Año actual
        </button>
      )}
    </div>
  );
}

export default HistoryNavigation;
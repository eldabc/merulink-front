import { AlertCircle } from 'lucide-react';

function TabButtons({ tabId, setActiveTab, hasEventContact, activeTab, tabLabel, tabError }) {
  return (
    <div key={tabId} data-tab-id={tabId} className="flex flex-col items-center shrink-0">
      <button
        type='button'
        onClick={() => setActiveTab(tabId)}
        className={`transition-all text-xl mb-1 leading-tight flex flex-col items-center gap-1 whitespace-nowrap
          ${!hasEventContact && tabId === 'eventContact' && 'hidden'}
          ${activeTab === tabId
            ? "border-[#9fd8ff]! text-[#9fd8ff]"
            : "border-transparent text-gray-400"}
        `}
      >
        <span>{tabLabel}</span>
        {tabError && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/25">
            <AlertCircle className="w-3 h-3 shrink-0" />
            Campos erróneos
          </span>
        )}
      </button>
    </div>
  );
}

export default TabButtons;
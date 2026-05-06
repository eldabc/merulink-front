function TabButtons({ tabId, setActiveTab, hasEventContact, activeTab, tabLabel, tabError }) {
  return (
    <div key={tabId} className="flex flex-col items-center sm:items-center"> 
      <button
        type='button'
        onClick={() => setActiveTab(tabId)}
        className={`transition-all text-xl mb-2 w-[200px] md:w-auto
          ${!hasEventContact && tabId === 'eventContact' && 'hidden'}
          ${activeTab === tabId
            ? "border-[#9fd8ff]! text-[#9fd8ff]"
            : "border-transparent text-gray-400"}
        `}
      >
        {tabLabel}
        {tabError && ( 
          <p className="px-2 py-1 rounded-full text-xs font-semibold bg-red-255 text-red-400 hover:text-red-800">Tienes campos erróneos en esta pestaña</p> 
        )}
      </button>
    </div>
  );
}

export default TabButtons;
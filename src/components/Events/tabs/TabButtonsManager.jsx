import { tabsEvents } from '../../../utils/tabs-utils';

import TabButtons from '../../Shared/TabButtons';
import CarouselTabs from '../../Shared/CarouselTabs';

function TabButtonsManager({ activeTab, setActiveTab, event, mode, errors, hasEventContact }) {

  // Determina si una pestaña tiene errores de formulario
  const getTabError = (tab) => {
    if (!errors) return false;
    const formEventKeys = ['eventName','startDate','startTime', 'endDate','endTime','locationId'];
    if (tab.id === 'formEvent') return formEventKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
    if (tab.id === 'eventContact') return !!errors.contacts;
    return false;
  };

  return (
    <CarouselTabs
      items={tabsEvents}
      activeId={activeTab}
      onSelect={setActiveTab}
      className="border-b border-[#ffffff21]"
      getLabel={(tab) => tab.label}
      renderItem={(tab, { onSelect }) => (
        <TabButtons
          tabId={tab.id}
          setActiveTab={onSelect}
          hasEventContact={hasEventContact}
          activeTab={activeTab}
          tabLabel={tab.label}
          tabError={getTabError(tab)}
        />
      )}
    />
  );
}

export default TabButtonsManager;
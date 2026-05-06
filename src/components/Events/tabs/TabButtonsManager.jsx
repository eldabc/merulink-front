import { tabsEvents } from '../../../utils/tabs-utils';

import TabButtons from '../../Shared/TabButtons';

function TabButtonsManager({ activeTab, setActiveTab, event, mode, errors, hasEventContact }) {

  return (
    <div className="flex flex-col md:flex-row gap-4 border-b border-[#ffffff21]">
      {tabsEvents
        // .filter(() => {
        //   if ((mode === 'create')) return true;
        //   return false;
        // })
        .map((tab) => {
        // determine if this tab currently has errors from formState.errors
        const tabError = (() => {
          if (!errors) return false;
          const formEventKeys = ['eventName','startDate','startTime', 'endDate','endTime','locationId'];
          if (tab.id === 'formEvent') return formEventKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
          if (tab.id === 'eventContact') return !!errors.contacts;
          return false;
        })();

        return (
          <TabButtons 
            key={tab.id} 
            tabId={tab.id} 
            setActiveTab={setActiveTab} 
            hasEventContact={hasEventContact} 
            activeTab={activeTab} 
            tabLabel={tab.label} 
            tabError={tabError} 
          />
        );      
      })}
    </div>
  );
}

export default TabButtonsManager;
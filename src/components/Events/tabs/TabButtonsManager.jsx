import { tabsEvents } from '../../../utils/tabs-utils';

function TabButtonsManager({ activeTab, setActiveTab, event, mode }) { //, errors, tempFlags
    return (
        <div className="flex flex-col md:flex-row gap-4 border-b border-[#ffffff21]">
          {tabsEvents
            .filter(() => {
              if ((mode === 'create')) return true;
              return false;
            })
            .map((tab) => {
            // determine if this tab currently has errors from formState.errors
            // const tabError = (() => {
            //   if (!errors) return false;
            //   const personalKeys = ['numEmployee','birthDate','placeOfBirth','nationality','age', 'sex','ci','maritalStatus','bloodType','email','mobilePhone','homePhone','address'];
            //   const workKeys = ['joinDate','department','subDepartment','position'];
            //   const meruLinkKeys = ['userName', 'userPass'];
            //   if (tab.id === 'personal') return personalKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
            //   if (tab.id === 'work') return workKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
            //   if (tab.id === 'contact') return !!errors.contacts;
            //   if (tab.id === 'meruLink') return meruLinkKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
            //   return false;
            // })();
            // const isTabDisabled = tab.id === 'meruLink' && !event.useMeruLink;
            // const useMeruLinkEnabled = event?.useMeruLink ?? tempFlags.useMeruLink;
            // const isTabDisabled = tab.id === 'meruLink' && !useMeruLinkEnabled;

            return (
              <div key={tab.id} className="flex flex-col items-center sm:items-center"> 
                <button
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 border-b-2 transition-all text-xl font-bold text-white-700 mb-2 p-2
                    ${activeTab === tab.id
                      ? "border-blue-500 text-[#9fd8ff]"
                      : "border-transparent text-gray-400 hover:text-gray-200"}
                  `}
                // ${isTabDisabled ? 'opacity-50 cursor-not-allowed' : ''} 
                //   disabled={isTabDisabled}
                >
                  {tab.label}
                  {/* {tabError && ( <p className="px-2 py-1 rounded-full text-xs font-semibold bg-red-255 text-red-400 hover:text-red-800">Tienes campos erróneos en esta pestaña</p> )} */}
                </button>
              </div>
            );      
          })}
        </div>
    );
}

export default TabButtonsManager;
import React from 'react';
import { tabs } from '../../../utils/tabs-utils';
import TabButtons from '../../Shared/TabButtons';
import { useAuth } from '../../../context/AuthContext';

export default function TabButtonsManager({ activeTab, setActiveTab, errors }) {
    const { user } = useAuth();

    const visibleTabs = tabs.filter((tab) => {
        if (tab.id === 'meruLink') {
            return user?.permissions?.includes('manage-merulink-tab-employees');
        }
        return true;
    });

    return (
        <div className="flex flex-col md:flex-row gap-4 mt-6 border-b border-gray-700">
          {visibleTabs.map((tab) => {

            // Determine if this tab currently has errors from formState.errors
            const tabError = (() => {
              if (!errors) return false;
              
              const personalKeys = ['numEmployee','birthdate','placeOfBirth','nationality','age', 'sex','ci','maritalStatus','bloodType','email','mobilePhone','homePhone','address'];
              const workKeys = ['joinDate','department','subDepartment','position'];
              const meruLinkKeys = ['userName', 'userPass'];
              const lockerAssignKeys = ['lockerAssingId'];
              
              if (tab.id === 'personal') return personalKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              if (tab.id === 'work') return workKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              if (tab.id === 'contact') return !!errors.contacts;
              if (tab.id === 'meruLink') return meruLinkKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              if (tab.id === 'lockerAssign') return lockerAssignKeys.some(k => Object.prototype.hasOwnProperty.call(errors, k));
              
              return false;
            })();

            return (
              <TabButtons 
                key={tab.id} 
                tabId={tab.id} 
                setActiveTab={setActiveTab} 
                activeTab={activeTab} 
                tabLabel={tab.label} 
                tabError={tabError} 
              />
            );

          })}
        </div>
    );
}
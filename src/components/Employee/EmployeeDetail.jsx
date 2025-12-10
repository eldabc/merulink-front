import {React, useState }from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import MeruLinkData from "./tabs/meruLinkData";
import TabButtonsManager from './tabs/TabButtonsManager';
import EmployeeForm from './EmployeeForm';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { useEmployees } from '../../context/EmployeeContext';
import { tabs } from '../../utils/tabs-utils';

const EmployeeDetail = ({ employee, onBack, onUpdate }) => {
  // Obtener toggleEmployeeField del contexto
  const { toggleEmployeeField } = useEmployees();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSave = async (formData) => {
    // Llamar al backend para actualizar aquí (PUT)
    if (onUpdate) onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return <EmployeeForm mode="edit" employee={employee} onSave={handleEditSave} onCancel={() => setIsEditing(false)} />;
  }
  return (
    <div className="md:min-w-5xl overflow-x-auto p-2 rounded-lg">
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        <button onClick={() => setIsEditing(true)} className="buttons-bar-btn flex text-3xl font-semibold" title="Editar">
          <PencilIcon className="w-4 h-4 text-white-500" />
        </button>
        <button 
          onClick={onBack}
          className="buttons-bar-btn flex text-3xl font-semibold" title="Volver">
          <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="w-full flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-26 h-26 text-white" />
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white-800">
             { `${employee.numEmployee} ${employee.firstName} ${employee.lastName}`}
            </h3>
            <p className="text-white-600 mt-1"> Cargo: {employee.position} </p>
            <p className="text-white-600 mt-1"> Departamento: {employee.department} </p>
            <p className="text-white-600 mt-1"></p>
          </div>
          <div>
            <label className="font-semibold">Estatus: </label>
            <span 
              className={`status-tag ${getStatusColor(employee.status)}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleEmployeeField(employee.id, "status");
              }}
              >
             {getStatusName(employee.status)}
            </span>
          </div>
          
        </div>
      
        <TabButtonsManager 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          employee={employee}
          // tabErrors={errors}
        />
        <div className="mt-6">
          {(() => {
            switch (activeTab) {
              case 'personal':
                return <PersonalData employee={employee} />;
              case 'work':
                return <WorkData employee={employee} />;
              case 'contact':
                return <ContactData employee={employee} />;
               case 'meruLink':
                return <MeruLinkData employee={employee} />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

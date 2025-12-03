import {React, useState }from "react";
import { PencilIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import { getStatusColor, getStatusName } from '../../utils/statusColor';

const EmployeeDetail = ({ employee, onBack, onChangeStatus }) => {
  const [activeTab, setActiveTab] = useState("personal");
  
  const tabs = [
    { id: "personal", label: "Datos personales" },
    { id: "work", label: "Datos laborales" },
    { id: "contact", label: "Datos de contactos" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalData employee={employee} />;
      case "work":
        return <WorkData employee={employee} />;
      case "contact":
        return <ContactData employee={employee} />;
      default:
        return null;
    }
  };
  return (
    <div className="p-2 rounded-lg">
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        {/* <button className="buttons-bar-btn flex  font-semibold" title="Cambiar Estatus">
          <CheckBadgeIcon  className={`w-5 h-5 text-9xl ${employee.status === true ? 'text-green-500' : 'text-red-500'}`} />
        </button> */}
        <button className="buttons-bar-btn flex text-3xl font-semibold" title="Editar">
          <PencilIcon className="w-4 h-4 text-white-500" />
        </button>
          <button 
            onClick={onBack}
            className="buttons-bar-btn flex text-3xl font-semibold" title="Volver">
          <ArrowLeft className="w-4 h-4 text-white-500" />
        </button>
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 min-w-230 min-h-150 max-w-230 max-h-150">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21]">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-26 h-26 text-white" />
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white-800">
             { `${employee.numEmployee} ${employee.name} ${employee.lastName}`}
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
                onChangeStatus(employee.id);
              }}
              >
             {getStatusName(employee.status)}
            </span>
          </div>
          
        </div>
      
        <div className="flex gap-4 mt-6 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 border-b-2 transition-all text-xl font-bold text-white-700 mt-6 mb-2 p-2
                ${activeTab === tab.id
                  ? "border-blue-500 text-[#9fd8ff]"
                  : "border-transparent text-gray-400 hover:text-gray-200"}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default EmployeeDetail;

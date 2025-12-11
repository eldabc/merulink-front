import {React, useState }from "react";
import { PencilIcon } from "@heroicons/react/24/solid";
import { ArrowLeft, User } from "lucide-react";
// import TabButtonsManager from './tabs/TabButtonsManager';
import DepartmentForm from './DepartmentForm';
import { getStatusColor, getStatusName } from '../../utils/status-utils';
import { useDepartments } from '../../context/DepartmentContext';

const DepartmentDetail = ({ department, onBack, onUpdate }) => {
  // Obtener toggleDepartmentField del contexto
  const { toggleDepartmentField } = useDepartments();
//   const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSave = async (formData) => {
    // Llamar al backend para actualizar aquí (PUT)
    if (onUpdate) onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return <DepartmentForm mode="edit" department={department} onSave={handleEditSave} onCancel={() => setIsEditing(false)} />;
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
          <div className="w-30 h-30 overflow-hidden flex items-center justify-center ml-2.5">
            {/* <User className="w-26 h-26 text-white" /> */}
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-white-800"> Editar Departamento </h3>
            <p className="text-white-600 mt-1"> Código: {department.code} </p>
            <p className="text-white-600 mt-1"> Departamento: {department.departmentName} </p>
            <p className="text-white-600 mt-1"></p>
          </div>
          <div>
            <label className="font-semibold">Estatus: </label>
            {/* <span 
              className={`status-tag ${getStatusColor(department.status)}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleDepartmentField(department.id, "status");
              }}
              >
             {getStatusName(department.status)}
            </span> */}
          </div>
        </div>
      
        <div className="mt-6">
          
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;

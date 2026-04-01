import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';

import { getDisabledClasses } from '../../utils/global-utils';  
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { employeeValidationSchema } from '../../utils/Validations/employeeValidationSchema';
import { calculateAge } from '../../utils/calculateAge-utils';
import { splitPhone } from '../../utils/StaticData/phoneCodes-utils';
import { newNumEmployee } from '../../utils/Employees/employee-utils';

import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import MeruLinkData from "./tabs/meruLinkData";
import LockerAssign from "./tabs/LockerAssign";
import TabButtonsManager from './tabs/TabButtonsManager';
import FooterFormButtons from '../Shared/FooterFormButtons';
import HeadFormButtons from '../Shared/HeadFormButtons';
import TitleHeader from '../Shared/TitleHeader';
import HeaderEmployeeForm from './HeaderEmployeeForm';
import ConfirmDialog from '../Shared/ConfirmDialog';
import { User } from "lucide-react";
import { tabs } from '../../utils/tabs-utils';
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create' }) {
  
  const { employeeData, toggleEmployeeField, getDepartments, createEmployee, updateEmployee, getLockerAssigns, loadingEmployeeData } = useEmployees();
  
  const { id } = useParams();
  const employee = employeeData.find(e => e.id === Number(id));

  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(employeeValidationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
  });

  const [tempFlags, setTempFlags] = useState({
    useMeruLink: false,
    useHidCard: false,
    useLocker: false,
    useTransport: false
  });

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  
  const [lockerAssigns, setLockerAssigns] = useState([]);
  const [empLockerAssign, setEmpLockerAssign] = useState([]);
  const [positions, setPositions] = useState([]);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [subDepartments, setSubDepartments] = useState([]);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const selectedSex = watch('sex');
  const watchedBirthDate = watch('birthdate');
  const selectedDepartmentId = watch('department');
  const selectedSubDepartmentId = watch('subDepartment');
  const createMode = mode === 'create';
  const editMode = mode === 'edit';
  const viewMode = mode === 'view';
  const statusChangeLabel = employee?.status ? 'Desactivar' : 'Activar';

  let isEmployeeActive;
  (createMode) ? isEmployeeActive = true : ( isEmployeeActive = employee?.status ?? false);
  const disabledClasses = getDisabledClasses(viewMode, !isEmployeeActive);

  useEffect(() => {
    if (loadingEmployeeData) return;
    if (!employeeData.length) return;
    
    const  newNumber = employee?.numEmployee ?? newNumEmployee(employeeData);
    setValue('numEmployee', newNumber);

  }, [employeeData, loadingEmployeeData]);
  
  // calcular edad cuando cambie birthdate
  useEffect(() => {
    calculateAge(watchedBirthDate, setValue);
  }, [watchedBirthDate, setValue]);

  useEffect(() => {
    const loadFormData = async () => {
      setLoadingData(true);
      try {
        const [departmentsData, lockerAssignsData] = await Promise.all([
          getDepartments(),
          getLockerAssigns(),
        ]);

        setAvailableDepartments(departmentsData);
        setLockerAssigns(lockerAssignsData);
          
      } catch (error) {
        console.error("Error cargando dependencias del formulario", error);
      } finally {
        setLoadingData(false);
      }
    };

     loadFormData();
  }, []);
  
  useEffect(() => {    
     const lockerAssignEmp = employee?.assign
            ? [...lockerAssigns, employee.assign]
            : [...lockerAssigns];
     setEmpLockerAssign(lockerAssignEmp);
  }, [lockerAssigns]);

  useEffect(() => {
    reset( employeeReset() );
  }, [empLockerAssign]);

  useEffect (() => {
    
    setValue('subDepartment', '');
    setValue('position', '');
    setPositions([]);

    if(selectedDepartmentId) {  
      const selectedDepartment = availableDepartments.find( d => d.id === Number(selectedDepartmentId) );
      
      if (selectedDepartment?.subDepartments?.length === 0) {
        setPositions(selectedDepartment?.positions);
      }
      setSubDepartments(selectedDepartment?.subDepartments ?? []);
      setSelectedDepartmentData(selectedDepartment);

    }
  }, [selectedDepartmentId, lockerAssigns]);

  useEffect(() => {
    if (selectedSubDepartmentId && selectedDepartmentData?.positions) {

      const positionsBySubDepartment = selectedDepartmentData.positions.filter(
          pos => pos.subDepartment?.id === Number(selectedSubDepartmentId)
      );
      setPositions(positionsBySubDepartment);
    }
  }, [selectedSubDepartmentId])

  const onSubmit = async (data) => {
    // console.log("submit", data);
    let success = false;
    const submissionData = { id: employee?.id ?? null, ...data, };

    console.log('Data submit:', submissionData);

    if (editMode && employee) {
      success = await updateEmployee(submissionData);
    } else {
      success = await createEmployee(submissionData);
    }

    if (success) {
      if (mode === 'create') navigate(-1);
        else navigate(-2);
    }

  };

  const onError = (formErrors) => {
    console.warn('EmployeeForm validation errors:', formErrors);
    if (!formErrors) return;

    // Define which fields belong to each tab (order matters)
    const tabFieldMap = {
      personal: [
        'numEmployee', 'firstName', 'secondName', 'lastName', 'secondLastName',
        'birthdate', 'placeOfBirth', 'nationality', 'age', 'sex', 'ci', 'maritalStatus',
        'bloodType', 'email', 'mobilePhoneCode', 'mobilePhone', 'homePhoneCode', 'homePhone', 'address'
      ],
      work: [ 'joinDate', 'department', 'subDepartment', 'position'],
      meruLink: ['userName', 'userPass' ],
      contact: [ 'contacts' ]
    };

    // Helper to check if errors object has any key for given list
    const hasAnyError = (errs, keys) => {
      if (!errs) return false;
      for (const k of keys) {
        if (k === 'contacts') {
          if (errs.contacts) return true;
          continue;
        }
        if (Object.prototype.hasOwnProperty.call(errs, k)) return true;
      }
      return false;
    };

    // Choose first tab (in order tabs[]) that has errors
    for (const t of tabs) {
      const keyList = tabFieldMap[t.id] || [];
      if (hasAnyError(formErrors, keyList)) {
        setActiveTab(t.id);
        return;
      }
    }

    setActiveTab('personal');
  };

  const employeeReset = () => {
    const fullMobilePhone = employee?.mobilePhone || '';
    const { code: mobileCode, number: mobileNumber } = splitPhone(fullMobilePhone);

    const fullHomePhone = employee?.homePhone || '';
    const { code: homeCode, number: homeNumber } = splitPhone(fullHomePhone);
    const joinDate = employee?.joinDate ?? new Date().toISOString().split('T')[0];
    const birthdate = employee?.birthdate ? new Date(employee.birthdate).toISOString().split('T')[0] : null;

    const employeeDataForm = {
        ci: employee?.ci ?? '',
        firstName: employee?.firstName ?? '',
        secondName: employee?.secondName ?? '',
        lastName: employee?.lastName ?? '',
        secondLastName: employee?.secondLastName ?? '',
        birthdate: birthdate,
        placeOfBirth: employee?.placeOfBirth ?? '',
        nationality: employee?.nationality ?? 'V',
        sex: employee?.sex ?? '',
        maritalStatus: employee?.maritalStatus ?? 'Soltero',
        bloodType: employee?.bloodType ?? 'O+',
        email: employee?.email ?? '',
        mobilePhoneCode: mobileCode || '0414',
        mobilePhone: mobileNumber ?? '',
        homePhoneCode: homeCode ?? '0286',
        homePhone: homeNumber ?? null,
        address: employee?.address ?? '',
        joinDate: joinDate ?? null,
        department: employee?.department.id ?? '',
        subDepartment: employee?.subDepartment.id ?? '',
        position: employee?.position.id ?? '',
        userName: employee?.userName ?? '',
        userPass: employee?.userPass ?? '',
        changePassNextLogin: !!employee?.changePassNextLogin,
        status: createMode ? true : !!employee?.status,
        useMeruLink: !!employee?.useMeruLink,
        useHidCard: !!employee?.useHidCard,
        useLocker: !!employee?.useLocker,
        useTransport: !!employee?.useTransport,
        contacts: employee?.contacts ?? [],
        lockerAssingId: employee?.assign?.id ?? '',
        padlockAssignPass: employee?.assign?.locker?.padlock?.pass ?? '',
        padlockAssignSerial: employee?.assign?.locker?.padlock?.serial ?? '',
        resetInstructions: employee?.assign?.locker?.padlock?.padlockPattern?.resetInstructions ?? '',
        unlockSequence: employee?.assign?.locker?.padlock?.padlockPattern?.unlockSequence ?? [],
    }
    if (createMode) return { ...employeeDataForm, age: '' };

    return employeeDataForm;
  };

  const getActivetab = (activeTab) => {
    switch (activeTab) {
      case 'personal':
        return <PersonalData viewMode={viewMode} register={register} errors={errors} employee={employee} disabledClasses={disabledClasses} />;
      case 'work':
        return <WorkData 
                  createMode={createMode}
                  viewMode={viewMode}
                  isEmployeeActive={isEmployeeActive}
                  disabledClasses={disabledClasses}
                  register={register} 
                  errors={errors} 
                  employee={employee}  
                  availableDepartments={availableDepartments} 
                  loadingData={loadingData}
                  selectedDepartmentId={selectedDepartmentId}
                  subDepartments={subDepartments}
                  positions={positions}
                />;
      case 'contact':
        return <ContactData viewMode={viewMode} register={register} errors={errors} employee={employee} fields={fields} append={append} remove={remove} />;
      case 'meruLink':
        return <MeruLinkData 
                  createMode={createMode} 
                  viewMode={viewMode} 
                  isEmployeeActive={isEmployeeActive} 
                  disabledClasses={disabledClasses} 
                  register={register} 
                  errors={errors} 
                  employee={employee} 
                  tempFlags={tempFlags} 
                  watch={watch}
                  setValue={setValue}
                />;
      case 'lockerAssign':
        return <LockerAssign 
                mode={mode}
                register={register} 
                errors={errors} 
                empLockerAssign={empLockerAssign} 
                selectedSex={selectedSex} 
                setValue={setValue}
                isEmployeeActive={isEmployeeActive}
                watch={watch}
                disabledClasses={disabledClasses}
                unlockSequence={employee?.assign?.locker?.padlock?.padlockPattern?.unlockSequence}
              />;
    }
  };

  const handleChangeStatusClick = (employee) => {
    setIsModalOpen(true);
    setSelectedEmployee(employee);
  };

  const handleConfirmChangeStatus = async () => {
    if (!selectedEmployee) return;

    await toggleEmployeeField(selectedEmployee, 'status');

    setIsModalOpen(false);
    setSelectedEmployee(null);
  };
  // console.log("EMPLOYEES", employee);
  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      
      <div className="aling-items-right">
        {(isEmployeeActive && viewMode) && <HeadFormButtons url={`/empleados/editar/${employee?.id}`} data={[]} /> }{/*TODO: todas las rutas funcionen sin data  */}
      </div>

      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
            <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center md:ml-2.5">
              <User className="w-20 h-20 text-white" />
            </div>
          </div>
          <div>
            <TitleHeader title={editMode ? ( 'Editar Empleado' ):( 'Registrar Empleado')} dinamicClasses="mb-6 md:mb-0" />
            <HeaderEmployeeForm register={register} errors={errors} viewMode={viewMode} disabledClasses={disabledClasses} />
          </div>

          {(editMode || viewMode) && (
            <>
            <div>
              <label className="font-semibold">Estatus: </label>
                <span className={`status-tag ${getStatusColor(employee?.status)}`}  
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeStatusClick(employee);
                  }}>
                  {getStatusName(employee?.status)}
                </span>
            </div>

              <ConfirmDialog 
                isOpen={isModalOpen}
                onClose={() => {
                  setIsModalOpen(false);
                  setSelectedEmployee(null);
                }}
                onConfirm={handleConfirmChangeStatus}
                title={`${statusChangeLabel} Empleado`}
                message={`¿Está seguro que desea ${statusChangeLabel} Empleado "${employee?.firstName} ${employee?.lastName}"?`}
                btnText={`${statusChangeLabel} ahora`}
                warningMessage={true}
                toggleStatusChangeList={statusChangeLabel === 'Activar' ? 'activate' : 'deactivate'}
              />
            </>
          )}
        </div>
      
        <TabButtonsManager 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            employee={employee}
            errors={errors}
            tempFlags={tempFlags}
        />

        <div className="mt-6">
          {getActivetab(activeTab)}     
        </div>
      </div>

      <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />

     </form>
    </div>
  );
}
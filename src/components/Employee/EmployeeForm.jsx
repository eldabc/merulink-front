import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';

import { getDisabledClasses } from '../../utils/global-utils';  
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { employeeValidationSchema } from '../../utils/Validations/employeeValidationSchema';
import { calculateAge } from '../../utils/calculateAge-utils';
import { splitPhone } from '../../utils/global-utils';
import { newNumEmployee } from '../../utils/Employees/employee-utils';
import { formatCI } from '../../utils/text-utils';

import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import MeruLinkData from "./tabs/meruLinkData";
import HidCard from "./tabs/HidCard";
import LockerAssign from "./tabs/LockerAssign";
import TabButtonsManager from './tabs/TabButtonsManager';

import FooterFormButtons from '../Shared/FooterFormButtons';
import HeadFormButtons from '../Shared/HeadFormButtons';
import TitleHeader from '../Shared/TitleHeader';
import HeaderEmployeeForm from './HeaderEmployeeForm';
import ConfirmDialog from '../Shared/ConfirmDialog';
import EmployeeScraperModal from './EmployeeScraperModal';
import { User, Search } from "lucide-react";
import { tabs } from '../../utils/tabs-utils';
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create' }) {
  
  const { employeeData, toggleEmployeeField, getDepartments, createEmployee, updateEmployee, getLockerAssigns, loadingEmployeeData, loadingFieldChange } = useEmployees();
  
  const { id } = useParams();
  const employee = employeeData.find(e => e.id === Number(id));
  const editMode = mode === 'edit';
  const { register, handleSubmit, control, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(employeeValidationSchema({ isEditMode: editMode })),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contacts',
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
  
  const viewMode = mode === 'view';
  const statusChangeLabel = employee?.status ? 'Desactivar' : 'Activar';
  
  // Control del modal de scraping
  const [showScraperModal, setShowScraperModal] = useState(createMode);
  const [scraperKey, setScraperKey] = useState(0);
  
  let isEmployeeActive;
  (createMode) ? isEmployeeActive = true : ( isEmployeeActive = employee?.status ?? false);
  const disabledClasses = getDisabledClasses(viewMode, !isEmployeeActive);

  useEffect(() => {
    if (loadingEmployeeData) return;
    if (!employeeData.length) return;
    
    const  newNumber = employee?.numEmployee ?? newNumEmployee(employeeData);
    setValue('numEmployee', newNumber);

  }, [employeeData, loadingEmployeeData]);
  
  // calcular edad al cambiar birthdate
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
  }, [empLockerAssign, employeeData]);

  useEffect (() => {
    
    setValue('subDepartment', 0);
    setValue('position', '');
    setPositions([]);

    if(selectedDepartmentId) {  
      const selectedDepartment = availableDepartments.find( d => d.id === Number(selectedDepartmentId) );
      
      // Cargos por Departamento
      const positionsByDepartment = selectedDepartment?.positions.filter(
          pos => pos.subDepartment === null
      );

      setPositions(positionsByDepartment);
      setSubDepartments(selectedDepartment?.subDepartments ?? []);
      setSelectedDepartmentData(selectedDepartment);

    }
  }, [selectedDepartmentId, lockerAssigns]);

  useEffect(() => {
    if (!selectedDepartmentData?.positions) return;

    const positionsBySubDepartment = selectedDepartmentData.positions.filter(pos => {
      // Si hay un SubDepartamento seleccionado
      if (Number(selectedSubDepartmentId) > 0) {
        return pos.subDepartment?.id === Number(selectedSubDepartmentId);
      }
      
      // Si no hay selección busca los que no tienen subdepartamento
      return pos.subDepartment === null;
    });

    setPositions(positionsBySubDepartment);
  }, [selectedSubDepartmentId])

  const onSubmit = async (data) => {
    // console.log("submit", data);
    let success = false;
    const submissionData = { id: employee?.id ?? null, ...data, };

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
      contact: [ 'contacts' ],
      lockerAssign: ['lockerAssingId' ],
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
    const { code: mobileCode, number: mobileNumber } = splitPhone(fullMobilePhone, true);

    const fullHomePhone = employee?.homePhone || '';
    const { code: homeCode, number: homeNumber } = splitPhone(fullHomePhone);
    const joinDate = employee?.joinDate ?? new Date().toISOString().split('T')[0];
    const birthdate = employee?.birthdate ? new Date(employee.birthdate).toISOString().split('T')[0] : null;

    const employeeDataForm = {
        ci: formatCI(employee?.ci) ?? '',
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
        subDepartment: employee?.subDepartment.id ?? 0,
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
        return <PersonalData viewMode={viewMode} register={register} errors={errors} disabledClasses={disabledClasses} setValue={setValue} />;
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
        return <ContactData viewMode={viewMode} register={register} errors={errors} fields={fields} append={append} remove={remove} />;
      case 'meruLink':
        return <MeruLinkData 
                  createMode={createMode} 
                  viewMode={viewMode} 
                  isEmployeeActive={isEmployeeActive} 
                  disabledClasses={disabledClasses} 
                  register={register} 
                  errors={errors} 
                  employee={employee}  
                  watch={watch}
                  setValue={setValue}
                />;
      case 'hidCard':
        return <HidCard 
                  createMode={createMode} 
                  viewMode={viewMode} 
                  isEmployeeActive={isEmployeeActive} 
                  disabledClasses={disabledClasses} 
                  register={register} 
                  errors={errors} 
                  employee={employee}  
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

  const handleScraperDataFound = (data) => {
    if (data.first_name) setValue('firstName', data.first_name);
    if (data.second_name) setValue('secondName', data.second_name);
    if (data.last_name) setValue('lastName', data.last_name);
    if (data.second_last_name) setValue('secondLastName', data.second_last_name);
    if (data.ci) setValue('ci', formatCI(data.ci.replace("V-", "")));
    if (data.birthdate) {
      const [d, m, y] = data.birthdate.split('/');
      setValue('birthdate', `${y}-${m}-${d}`);
    }
    if (data.nationality) setValue('nationality', data.nationality);
    if (data.sex) {
      const s = data.sex.toUpperCase();
      if (s === 'FEMENINO' || s === 'F') setValue('sex', 'M');
      else if (s === 'MASCULINO' || s === 'M') setValue('sex', 'H');
    }
    setShowScraperModal(false);
  };

  const handleScraperSkip = () => setShowScraperModal(false);

  // console.log("EMPLOYEES", employee);
  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      
      <div className="aling-items-right">
        {(isEmployeeActive && viewMode) && <HeadFormButtons url={`/empleados/editar/${employee?.id}`} data={[]} /> }{/*TODO: todas las rutas funcionen sin data  */}
      </div>

      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="md:justify-center flex gap-x-34 items-center gap-6 relative  pb-6  flex-wrap">
          <div className="w-full md:w-auto shrink-0 flex justify-center md:justify-start mb-2 md:mb-0">
            <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center md:ml-2.5">
              <User className="w-20 h-20 text-white" />
            </div>
          </div>
          <div className='w-full md:w-auto justify-center md:justify-start'>
            <TitleHeader title={editMode ? ( 'Editar Empleado' ):( 'Registrar Empleado')} dinamicClasses="mb-6 md:mb-3 text-center md:text-left" />
            <HeaderEmployeeForm register={register} errors={errors} viewMode={viewMode} disabledClasses={disabledClasses} />
          </div>
        </div>

          <div className="w-full md:w-auto flex flex-wrap justify-center md:justify-end items-center gap-3 mt-3 md:mt-0 border-b border-[#ffffff21] pb-3">
            {createMode && (
              <Link
                onClick={ (e) => { setShowScraperModal(true); setScraperKey(k => k + 1); }}
                className="flex items-center gap-1 text-sm !text-[#9fd8ff] hover:!text-white transition-colors font-medium mr-5"
              >
               <Search className="w-4 h-4 text-[#9fd8ff]" /> Traer Datos
              </Link>
            )}
            {(editMode || viewMode) && (
              <>
                <span className="text-sm text-gray-400">Estatus:</span>
                  {loadingFieldChange.loading && loadingFieldChange.field === 'status' ? (
                    <span className="text-xs text-gray-500 italic">Cargando...</span>
                  ) : (
                    <span className={`status-tag ${getStatusColor(employee?.status)}`}  
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeStatusClick(employee);
                      }}>
                      {getStatusName(employee?.status)}
                    </span>
                  )}
            

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
        />

        <div className="mt-6">
          {getActivetab(activeTab)}     
        </div>
      </div>

      <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />

     </form>

      {createMode && (
        <EmployeeScraperModal
          key={scraperKey}
          isOpen={showScraperModal}
          onDataFound={handleScraperDataFound}
          onSkip={handleScraperSkip}
        />
      )}
    </div>
  );
}
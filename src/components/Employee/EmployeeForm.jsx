import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployees } from '../../context/EmployeeContext';
import { useGlobalData } from '../../context/GlobalDataContext';

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
import LabelFieldForm from '../Shared/LabelFieldForm';
import TitleHeader from '../Shared/TitleHeader';
import ErrorMessage from '../Shared/ErrorMessage';
import { User } from "lucide-react";
import { tabs } from '../../utils/tabs-utils';
import '../../Tables.css';

export default function EmployeeForm({ mode = 'create' }) {
  
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
  const { departments, globalLoading, loadDepartments } = useGlobalData();
  const { employeeData, toggleEmployeeField, getDepartments, createEmployee, updateEmployee, getLockerAssigns, loadingEmployeeData } = useEmployees();
  const [loadingData, setLoadingData] = useState(false);
  const [subDepartments, setSubDepartments] = useState([]);
  const [selectedDepartmentData, setSelectedDepartmentData] = useState([]);

  const { id } = useParams();
  const employee = employeeData.find(e => e.id === Number(id));
  
  const selectedSex = watch('sex');
  const watchedBirthDate = watch('birthDate');
  const selectedDepartmentId = watch('department');
  const selectedSubDepartmentId = watch('subDepartment');
  const createMode = mode === 'create';
  const editMode = mode === 'edit';
  const viewMode = mode === 'view';

  let isEmployeeActive;
  (createMode) ? isEmployeeActive = true : ( isEmployeeActive = employee?.status ?? false);
  const disabledClasses = getDisabledClasses(viewMode, !isEmployeeActive);

  useEffect(() => {
    if (loadingEmployeeData) return;
    if (!employeeData.length) return;
    
    const  newNumber = employee?.numEmployee ?? newNumEmployee(employeeData);
    setValue('numEmployee', newNumber);

  }, [employeeData, loadingEmployeeData]);
  
  // calcular edad cuando cambie birthDate
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
        console.log("no tiene sub", selectedDepartment)
        setPositions(selectedDepartment?.positions);
      }
      setSubDepartments(selectedDepartment?.subDepartments ?? []);
      setSelectedDepartmentData(selectedDepartment ?? []);
    }
  }, [selectedDepartmentId, lockerAssigns]);

  useEffect(() => {
    if (selectedSubDepartmentId) {
      
      const positionsBySubDepartment = selectedDepartmentData.positions.filter(
          pos => pos.subDepartment?.id === Number(selectedSubDepartmentId)
      );
      console.log("positionsBySubDepartment", positionsBySubDepartment)
      setPositions(positionsBySubDepartment);
    }
  }, [selectedSubDepartmentId])

  const onSubmit = async (data) => {
    // console.log("submit", data);
    let success = false;
    
    const departmentData = availableDepartments.find(item => item.id === Number(data.department));
    const subDepartmentData = subDepartments.find(item => item.id === Number(data.subDepartment));
    const submissionData = { 
                            id: employee?.id ?? null,
                            ...data, 
                            departmentName: departmentData?.departmentName, 
                            subDepartmentName: subDepartmentData?.subDepartmentName ?? 'No Aplica' 
                           };

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
        'birthDate', 'placeOfBirth', 'nationality', 'age', 'sex', 'ci', 'maritalStatus',
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
    const birthDate = employee?.birthDate ? new Date(employee.birthDate).toISOString().split('T')[0] : null;

    return {
        ci: employee?.ci ?? '',
        firstName: employee?.firstName ?? '',
        secondName: employee?.secondName ?? '',
        lastName: employee?.lastName ?? '',
        secondLastName: employee?.secondLastName ?? '',
        birthDate: birthDate,
        placeOfBirth: employee?.placeOfBirth ?? '',
        nationality: employee?.nationality ?? 'V',
        age: employee?.age ?? '',
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
  };

  const getActivetab = (activeTab) => {
    switch (activeTab) {
      case 'personal':
        return <PersonalData viewMode={viewMode} register={register} errors={errors} employee={employee} />;
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
                  cursorNotAllowed={disabledClasses} 
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
  // console.log("fieldsA", employee?.assign?.locker?.padlock?.padlockPattern?.unlockSequence);
  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="aling-items-right">
        {(isEmployeeActive && viewMode) && <HeadFormButtons url={`/empleados/editar/${employee?.id}`} data={[]} /> }{/*TODO: todas las rutas funcionen sin data  */}
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-20 h-20 text-white" />
          </div>

          <div>
            <TitleHeader title={editMode ? ( 'Editar Empleado' ):( 'Registrar Empleado')} />
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
                  <div>
                    <LabelFieldForm field="Primer Nombre" simbol="*" />
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('firstName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${disabledClasses}`}
                    />
                    {errors?.firstName && <ErrorMessage msg={errors.firstName.message} />}  
                  </div>

                  <div>
                    <LabelFieldForm field="Segundo Nombre" />
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('secondName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${disabledClasses}`}
                    />
                    {errors?.secondName && <ErrorMessage msg={errors.secondName.message} />}
                  </div>

                  <div>
                    <LabelFieldForm field="Primer Apellido" simbol="*" />
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('lastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${disabledClasses}`}
                    />
                    {errors?.lastName && <ErrorMessage msg={errors.lastName.message} />}
                  </div>

                  <div>
                    <LabelFieldForm field="Segundo Apellido" />
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('secondLastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${disabledClasses}`}
                    />
                    {errors?.secondLastName && <ErrorMessage msg={errors.secondLastName.message} />}
                  </div>
                  <div>
                    <LabelFieldForm field="No. Empleado" simbol="*" />
                  </div>
                  <div>
                    <input
                      disabled={true}
                      {...register('numEmployee')}
                      className={`w-20 px-2 py-1 text-sm rounded-lg filter-input cursor-not-allowed`}
                    />
                  </div>
                </div>  
          </div>
          {(editMode || viewMode) && (
            <div>
              <label className="font-semibold">Estatus: </label>
                <span className={`status-tag ${getStatusColor(employee?.status)}`}  
                  onClick={(e) => {
                  e.stopPropagation();
                  toggleEmployeeField(employee.id, "status");
                }}>
                  {getStatusName(employee?.status)}
                </span>
            </div>
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
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from "lucide-react";
import { getStatusColor, getStatusName } from '../../utils/status-utils';  
import { employeeValidationSchema } from '../../utils/Validations/employeeValidationSchema';
import PersonalData from "./tabs/PersonalData";
import WorkData from "./tabs/WorkData";
import ContactData from "./tabs/ContactData";
import MeruLinkData from "./tabs/meruLinkData";
import LockerAssign from "./tabs/LockerAssign";
import TabButtonsManager from './tabs/TabButtonsManager';
import { calculateAge } from '../../utils/calculateAge-utils';
import { splitPhone } from '../../utils/StaticData/phoneCodes-utils';
import { useEmployees } from '../../context/EmployeeContext';
import FooterFormButtons from '../Shared/FooterFormButtons';
import HeadFormButtons from '../Shared/HeadFormButtons';
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('personal');
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [lockerAssigns, setLockerAssigns] = useState([]);
  const [empLockerAssign, setEmpLockerAssign] = useState([]);
  const { employeeData, toggleEmployeeField, getDepartments, createEmployee, getLockerAssigns, loadingEmployeeData } = useEmployees();
  const [loadingData, setLoadingData] = useState(false);
  const selectedSex = watch('sex');
  const changedUseLocker = watch('useLocker');
  const watchedBirthDate = watch('birthDate');

  const editMode = mode === 'edit';
  const viewMode = mode === 'view';
  const employee = location.state?.data;
  
  useEffect(() => {
    if (loadingEmployeeData) return;
    if (!employeeData.length) return;
    
    const  newNumber = employee?.numEmployee ?? newNumEmployee();
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
    // if ((viewMode || editMode) && employee){
     const lockerAssignEmp = employee?.assign
            ? [...lockerAssigns, employee.assign]
            : [...lockerAssigns];
     setEmpLockerAssign(lockerAssignEmp);
    // }
  }, [lockerAssigns]);

  useEffect(() => {

    if (employee && (editMode || viewMode)) {
        reset( employeeReset() );
    } else if (mode === 'create') {
        reset(employeeReset() );
    }
  }, [empLockerAssign]); //employee, mode, reset

  const onSubmit = async (data) => {
    // console.log("submit", data);
    let success = false;
    
    const departmentFound = availableDepartments.find(item => item.id === Number(data.department));
    const submissionData = { ...data, departmentName: departmentFound.departmentName };

    console.log('EmployeeForm data final:', submissionData);

    if (editMode && employee) {
      // const dataEdit = {
      //   ...lockerAssign,
      //   padlock: {
      //     ...padlockSelected
      //   },
      //   employee: {
      //     ...employeeSelected
      //   }
      // }
      success = await updateEmployee(submissionData);
    } else {
      success = await createEmployee(submissionData);
    }

    if (success) {
      navigate(-1);
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
        // numEmployee: employee?.numEmployee ?? newNumEmployee(),
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
        department: employee?.department ?? '',
        subDepartment: employee?.subDepartment ?? '',
        position: employee?.position ?? '',
        userName: employee?.userName ?? '',
        userPass: employee?.userPass ?? '',
        changePassNextLogin: !!employee?.changePassNextLogin,
        status: !!employee?.status,
        useMeruLink: !!employee?.useMeruLink,
        useHidCard: !!employee?.useHidCard,
        useLocker: !!employee?.useLocker,
        useTransport: !!employee?.useTransport,
        contacts: employee?.contacts ?? [],
        lockerAssingId: employee?.assign?.id ?? '',
        padlockAssignPass: employee?.assign?.locker?.padlock?.pass ?? ''
    }
  };

  const newNumEmployee = () => {
    // generar número de empleado automáticamente
    const maxNum = Math.max( 0,
      ...employeeData.map(e => {
        const num = parseInt(e.numEmployee) || 0;
        return num;
      })
    );
    return String(maxNum + 1);
  }

  const getActivetab = (activeTab) => {
    switch (activeTab) {
      case 'personal':
        return <PersonalData viewMode={viewMode} register={register} errors={errors} employee={employee} />;
      case 'work':
        return <WorkData 
                  viewMode={viewMode}
                  register={register} 
                  errors={errors} 
                  employee={employee} 
                  tempFlags={tempFlags}
                  setTempFlags={setTempFlags} 
                  availableDepartments={availableDepartments} 
                  loadingData={loadingData} 
                />;
      case 'contact':
        return <ContactData register={register} errors={errors} employee={employee} fields={fields} append={append} remove={remove} />;
      case 'meruLink':
        return <MeruLinkData register={register} errors={errors} employee={employee} />;
      case 'lockerAssign':
        return <LockerAssign 
                mode={mode}
                register={register} 
                errors={errors} 
                empLockerAssign={empLockerAssign} 
                selectedSex={selectedSex} 
                useLocker={changedUseLocker}  
                setValue={setValue}
              />;
    }
  };
  return (
    <div className="md:min-w-7xl overflow-x-auto p-2 rounded-lg">
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <div className="buttons-bar flex gap-2 aling-items-right justify-end">
        {(viewMode) && <HeadFormButtons url="/empleados/editar" data={employee} /> }
      </div>
      <div className="table-container rounded-lg mt-4 shadow-md p-6 w-full overflow-auto">
        <div className="flex gap-x-34 items-center gap-6 relative border-b pb-6 border-[#ffffff21] flex-wrap">
          <div className="w-30 h-30 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center ml-2.5">
            <User className="w-20 h-20 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4 text-white">{mode === 'edit' ? ( 'Editar Empleado' ):( 'Registrar Empleado')}</h3>
              {typeof register === 'function' ? (
                <div className="grid grid-cols-4 md:grid-cols-4 gap-3 w-full">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Nombre: *</label>
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('firstName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors?.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>}  
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Nombre:</label>
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('secondName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondName && <p className="text-red-400 text-xs mt-1">{errors.secondName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Primer Apellido: *</label>
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('lastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Segundo Apellido:</label>
                  </div>
                  <div>
                    <input
                      readOnly={viewMode}
                      {...register('secondLastName')}
                      className={`w-full px-1 py-1 rounded-lg filter-input ${errors?.secondLastName ? 'border-red-500' : ''}`}
                    />
                    {errors?.secondLastName && <p className="text-red-400 text-xs mt-1">{errors.secondLastName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">No. Empleado: *</label>
                  </div>
                  <div>
                    <input
                      disabled={true}
                      {...register('numEmployee')}
                      className={`w-20 px-2 py-1 text-sm rounded-lg filter-input bg-gray-700 cursor-not-allowed`}
                    />
                  </div>
                </div>
              ) : (
                {/* <div>
                <h3 className="text-3xl font-semibold text-white-800">
                  {`${employee?.numEmployee ?? ''} ${employee?.firstName ?? ''} ${employee?.secondName ?? ''} ${employee?.lastName ?? ''} ${employee?.secondLastName ?? ''}`}
                </h3>
                <p className="text-white-600 mt-1"> Cargo: {employee.position} </p>
                <p className="text-white-600 mt-1"> Departamento: {employee.department} </p></div> */}
              )}
            
          </div>
          {mode === 'edit' && (
            <div><label className="font-semibold">Estatus: </label>
                <span className={`status-tag ${getStatusColor(employee.status)}`}  
                  onClick={(e) => {
                  e.stopPropagation();
                  toggleEmployeeField(employee.id, "status");
                }}>
                  {getStatusName(employee.status)}
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
      <div className="mt-6 flex justify-end gap-3">
        <FooterFormButtons isSubmitting={isSubmitting} mode={mode} navigate={navigate} />
      </div>
     </form>
    </div>
  );
}
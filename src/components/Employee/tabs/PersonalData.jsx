import { phoneCodes } from "../../../utils/phoneCodes-utils"; 

export default function PersonalData({ employee = {}, register, errors }) {
  // If register is provided, render form inputs (edit/create). Otherwise render read-only.
  const isForm = typeof register === 'function';

  if (isForm) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 w-full">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento: *</label>
          <input type="date" {...register('birthDate')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${errors.birthDate ? 'border-red-500' : ''}`} />
          {errors.birthDate && <p className="text-red-400 text-xs mt-1">{errors.birthDate.message}</p>}
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-300 mb-1">Lugar de Nacimiento: </label>
            <input {...register('placeOfBirth')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.placeOfBirth ? 'border-red-500' : ''}`} />
          {errors?.placeOfBirth && <p className="text-red-400 text-xs mt-1">{errors.placeOfBirth.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Nacionalidad: </label>
            <select {...register('nationality')} className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.nationality ? 'border-red-500' : ''}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="V">Venezolano/a</option>
              <option className='bg-[#3c4042]' value="E">Extranjero/a</option>
            </select>
          {errors?.nationality && <p className="text-red-400 text-xs mt-1">{errors.nationality.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Cédula: *</label>
             <input {...register('ci')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.ci ? 'border-red-500' : ''}`} />
          {errors?.ci && <p className="text-red-400 text-xs mt-1">{errors.ci.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Edad: </label>
             <input {...register('age')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 cursor-not-allowed ${errors?.age ? 'border-red-500' : ''}`} disabled/>
          {errors?.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sexo: </label>
            <select {...register('sex')} className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.sex ? 'border-red-500' : ''}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="M">Masculino</option>
              <option className='bg-[#3c4042]' value="F">Femenino</option>
          </select>
          {errors?.sex && <p className="text-red-400 text-xs mt-1">{errors.sex.message}</p>}
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-1">Estado Civil: </label>
            <select {...register('maritalStatus')} className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.maritalStatus ? 'border-red-500' : ''}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="Soltero">Soltero/a</option>
              <option className='bg-[#3c4042]' value="Casado">Casado/a</option>
              <option className='bg-[#3c4042]' value="Divorciado">Divorciado/a</option>
              <option className='bg-[#3c4042]' value="Viudo">Viudo/a</option>
              <option className='bg-[#3c4042]' value="UnionLibre">Unión Libre / Concubinato</option>
              <option className='bg-[#3c4042]' value="Separado">Separado/a</option>
            </select>
          {errors?.maritalStatus && <p className="text-red-400 text-xs mt-1">{errors.maritalStatus.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Sangre: </label>
           <select {...register('bloodType')} className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.bloodType ? 'border-red-500' : ''}`}>
                <option className='bg-[#3c4042]' value="">Seleccionar...</option> 
                <option className='bg-[#3c4042]' value="A+">A+</option>
                <option className='bg-[#3c4042]' value="A-">A-</option>
                <option className='bg-[#3c4042]' value="B+">B+</option>
                <option className='bg-[#3c4042]' value="B-">B-</option>
                <option className='bg-[#3c4042]' value="AB+">AB+</option>
                <option className='bg-[#3c4042]' value="AB-">AB-</option>
                <option className='bg-[#3c4042]' value="O+">O+</option>
                <option className='bg-[#3c4042]' value="O-">O-</option>
              </select>
          {errors?.bloodType && <p className="text-red-400 text-xs mt-1">{errors.bloodType.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono Móvil: *</label>
           <div className="flex flex-row">
              <select {...register('mobilePhoneCode')} className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.sex ? 'border-red-500' : ''}`}>
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  <option className='bg-[#3c4042]' value="0414">0414</option>
                  <option className='bg-[#3c4042]' value="0424">0424</option>
                  <option className='bg-[#3c4042]' value="0416">0416</option>
                  <option className='bg-[#3c4042]' value="0426">0426</option>
                  <option className='bg-[#3c4042]' value="0412">0412</option>
                  <option className='bg-[#3c4042]' value="0422">0422</option>
              </select>
              <input {...register('mobilePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.mobilePhone ? 'border-red-500' : ''}`} />
          </div>
          {errors?.mobilePhone && <p className="text-red-400 text-xs mt-1">{errors.mobilePhone.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono Habitación: </label>
           <div className="flex flex-row">
              <select {...register('homePhoneCode')} className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${errors.sex ? 'border-red-500' : ''}`}>
                  {phoneCodes.map(code => (
                    <option key={`phoneHome-${code.id}`} className='bg-[#3c4042]' value={code.areaCode}>
                      {code.areaCode}
                    </option>
                  ))}
              </select>
              <input {...register('homePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.mobilePhone ? 'border-red-500' : ''}`} />
          </div>
          {errors?.homePhone && <p className="text-red-400 text-xs mt-1">{errors.homePhone.message}</p>}
        </div>
        <div className="">
          <label className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico: *</label>
             <input {...register('email')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.email ? 'border-red-500' : ''}`} />
          {errors?.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="md:col-span-2 lg:col-span-3 w-full">
          <label className="block text-sm font-medium text-gray-300 mb-1">Dirección: </label>
           <input {...register('address')} className={`w-full px-3 py-2 rounded-lg filter-input ${errors?.address ? 'border-red-500' : ''}`} />
          {errors?.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
        </div>
      </div>
    );
  }
   return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded border-[#ffffff21] border">
        <div>
          <label className="font-semibold">Lugar de Nacimiento: </label>
            {employee.placeOfBirth}
        </div>

        <div>
          <label className="font-semibold">Nacionalidad: </label>
            {employee.nationality}
        </div>

        <div>
          <label className="font-semibold">Cédula: </label>
            {employee.ci}
        </div>

        <div>
          <label className="font-semibold">Edad: </label>
            {employee.age}
        </div>

        <div>
          <label className="font-semibold">Estado Civil: </label>
          {employee.maritalStatus}
        </div>
        <div>
          <label className="font-semibold">Tipo de Sangre: </label>
          {employee.bloodType}
        </div>
        <div>
          <label className="font-semibold">Teléfono Móvil: </label>
          {employee.mobilePhone}
        </div>
        <div>
          <label className="font-semibold">Teléfono Habitación: </label>
          {employee.homePhone}
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold">Correo Electrónico: </label>
            {employee.email}
        </div>
        <div className="md:col-span-2">
          <label className="font-semibold">Dirección: </label>
          {employee.address}
        </div>
      </div>
    );
   
   
}

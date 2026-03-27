import { phoneCodes } from "../../../utils/StaticData/phoneCodes-utils"; 
import LabelFieldForm from "../../Shared/LabelFieldForm";

export default function PersonalData({ viewMode, employee = {}, register, errors }) {
  const isForm = typeof register === 'function';
  const cursorNotAllowed = viewMode && 'cursor-not-allowed opacity-50';
  
  if (isForm) {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 w-full">
        <div>
          <LabelFieldForm field="Fecha de Nacimiento" />
            <input 
              readOnly={viewMode} type="date" {...register('birthdate')} 
              className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${cursorNotAllowed}`} 
            />
          {errors.birthdate && <p className="text-red-400 text-xs mt-1">{errors.birthdate.message}</p>}
        </div>
        <div className="w-full">
          <LabelFieldForm field="Lugar de Nacimiento" />
            <input readOnly={viewMode} {...register('placeOfBirth')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          {errors?.placeOfBirth && <p className="text-red-400 text-xs mt-1">{errors.placeOfBirth.message}</p>}
        </div>

        <div>
          <LabelFieldForm field="Nacionalidad"/>
            <select 
              disabled= {viewMode} 
              {...register('nationality')}
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}
            >
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="V">Venezolano/a</option>
              <option className='bg-[#3c4042]' value="E">Extranjero/a</option>
            </select>
          {errors?.nationality && <p className="text-red-400 text-xs mt-1">{errors.nationality.message}</p>}
        </div>

        <div>
          <LabelFieldForm field="Cédula" simbol="*"/>
             <input readOnly={viewMode} {...register('ci')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          {errors?.ci && <p className="text-red-400 text-xs mt-1">{errors.ci.message}</p>}
        </div>

        <div>
          <LabelFieldForm field="Edad" simbol="*"/>
             <input readOnly={true} {...register('age')} className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 ${cursorNotAllowed}`} disabled/>
          {errors?.age && <p className="text-red-400 text-xs mt-1">{errors.age.message}</p>}
        </div>
        
        <div>
          <LabelFieldForm field="Sexo" simbol="*"/>
            <select 
              disabled= {viewMode}
              {...register('sex')} 
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="H">Masculino</option>
              <option className='bg-[#3c4042]' value="M">Femenino</option>
          </select>
          {errors?.sex && <p className="text-red-400 text-xs mt-1">{errors.sex.message}</p>}
        </div>
        <div>
           <LabelFieldForm field="Estado Civil" />
            <select 
              disabled= {viewMode}
              {...register('maritalStatus')} 
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}>
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
           <LabelFieldForm field="Tipo de Sangre" />
           <select 
            disabled= {viewMode}
            {...register('bloodType')} 
            className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}>
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
          <LabelFieldForm field="Teléfono Móvil" simbol="*"/>
           <div className="flex flex-row">
              <select 
                disabled= {viewMode}
                {...register('mobilePhoneCode')} 
                className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}>
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  <option className='bg-[#3c4042]' value="0414">0414</option>
                  <option className='bg-[#3c4042]' value="0424">0424</option>
                  <option className='bg-[#3c4042]' value="0416">0416</option>
                  <option className='bg-[#3c4042]' value="0426">0426</option>
                  <option className='bg-[#3c4042]' value="0412">0412</option>
                  <option className='bg-[#3c4042]' value="0422">0422</option>
              </select>
              <input readOnly={viewMode} {...register('mobilePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          </div>
          {errors?.mobilePhone && <p className="text-red-400 text-xs mt-1">{errors.mobilePhone.message}</p>}
        </div>
        <div>
          <LabelFieldForm field="Teléfono Habitación"/>
           <div className="flex flex-row">
              <select 
                disabled= {viewMode}
                {...register('homePhoneCode')} 
                className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${cursorNotAllowed}`}
              >
                {phoneCodes.map(code => (
                  <option key={`phoneHome-${code.id}`} className='bg-[#3c4042]' value={code.areaCode}>
                    {code.areaCode}
                  </option>
                ))}
              </select>
              <input readOnly={viewMode} {...register('homePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          </div>
          {errors?.homePhone && <p className="text-red-400 text-xs mt-1">{errors.homePhone.message}</p>}
        </div>
        <div className="">
          <LabelFieldForm field="Correo Electrónico" simbol="*"/>
             <input readOnly={viewMode} {...register('email')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          {errors?.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="md:col-span-2 lg:col-span-3 w-full">
          <LabelFieldForm field="Dirección" />
           <input readOnly={viewMode} {...register('address')} className={`w-full px-3 py-2 rounded-lg filter-input ${cursorNotAllowed}`} />
          {errors?.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
        </div>
      </div>
    );
  }
   return ( "Por eliminar");
    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded border-[#ffffff21] border">
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
      </div>*/}
   
   
}

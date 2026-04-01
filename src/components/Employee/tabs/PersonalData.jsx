import { phoneCodes } from "../../../utils/StaticData/phoneCodes-utils"; 
import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from "../../Shared/ErrorMessage";

export default function PersonalData({ viewMode, register, errors, disabledClasses }) {
  
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 w-full">

        <div>
          <LabelFieldForm field="Fecha de Nacimiento" />
            <input 
              readOnly={viewMode} type="date" {...register('birthdate')} 
              className={`w-full px-3 py-2 rounded-lg filter-input bg-gray-700 text-gray-300 ${disabledClasses}`} 
            />
          {errors.birthdate && <ErrorMessage msg={errors.birthdate.message} /> }
        </div>
        <div className="w-full">
          <LabelFieldForm field="Lugar de Nacimiento" />
            <input readOnly={viewMode} {...register('placeOfBirth')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          {errors?.placeOfBirth && <ErrorMessage msg={errors.placeOfBirth.message} /> }
        </div>

        <div>
          <LabelFieldForm field="Nacionalidad"/>
            <select 
              disabled= {viewMode} 
              {...register('nationality')}
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
            >
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="V">Venezolano/a</option>
              <option className='bg-[#3c4042]' value="E">Extranjero/a</option>
            </select>
          {errors?.nationality && <ErrorMessage msg={errors.nationality.message} />}
        </div>

        <div>
          <LabelFieldForm field="Cédula" simbol="*"/>
             <input readOnly={viewMode} {...register('ci')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          {errors?.ci && <ErrorMessage msg={errors.ci.message} />}
        </div>

        <div>
          <LabelFieldForm field="Edad" simbol="*"/>
             <input readOnly={true} {...register('age')} className={`w-full px-3 py-2 rounded-lg filter-input cursor-not-allowed ${disabledClasses}`} disabled/>
          {errors?.age && <ErrorMessage msg={errors.age.message} />}
        </div>
        
        <div>
          <LabelFieldForm field="Sexo" simbol="*"/>
            <select 
              disabled= {viewMode}
              {...register('sex')} 
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="H">Masculino</option>
              <option className='bg-[#3c4042]' value="M">Femenino</option>
          </select>
          {errors?.sex && <ErrorMessage msg={errors.sex.message} />}
        </div>

        <div>
           <LabelFieldForm field="Estado Civil" />
            <select 
              disabled= {viewMode}
              {...register('maritalStatus')} 
              className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}>
              <option className='bg-[#3c4042]' value="">Seleccionar...</option>
              <option className='bg-[#3c4042]' value="Soltero">Soltero/a</option>
              <option className='bg-[#3c4042]' value="Casado">Casado/a</option>
              <option className='bg-[#3c4042]' value="Divorciado">Divorciado/a</option>
              <option className='bg-[#3c4042]' value="Viudo">Viudo/a</option>
              <option className='bg-[#3c4042]' value="UnionLibre">Unión Libre / Concubinato</option>
              <option className='bg-[#3c4042]' value="Separado">Separado/a</option>
            </select>
          {errors?.maritalStatus && <ErrorMessage msg={errors.maritalStatus.message} />}
        </div>

        <div>
           <LabelFieldForm field="Tipo de Sangre" />
           <select 
            disabled= {viewMode}
            {...register('bloodType')} 
            className={`w-full px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}>
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
          {errors?.bloodType && <ErrorMessage msg={errors.bloodType.message} />}
        </div>

        <div>
          <LabelFieldForm field="Teléfono Móvil" simbol="*"/>
           <div className="flex flex-row">
              <select 
                disabled= {viewMode}
                {...register('mobilePhoneCode')} 
                className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}>
                  <option className='bg-[#3c4042]' value="">Seleccionar...</option>
                  <option className='bg-[#3c4042]' value="0414">0414</option>
                  <option className='bg-[#3c4042]' value="0424">0424</option>
                  <option className='bg-[#3c4042]' value="0416">0416</option>
                  <option className='bg-[#3c4042]' value="0426">0426</option>
                  <option className='bg-[#3c4042]' value="0412">0412</option>
                  <option className='bg-[#3c4042]' value="0422">0422</option>
              </select>
              <input readOnly={viewMode} {...register('mobilePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          </div>
          {errors?.mobilePhone && <ErrorMessage msg={errors.mobilePhone.message} />}
        </div>

        <div>
          <LabelFieldForm field="Teléfono Habitación"/>
           <div className="flex flex-row">
              <select 
                disabled= {viewMode}
                {...register('homePhoneCode')} 
                className={`w-22 px-3 py-2 rounded-lg filter-input text-gray-300 ${disabledClasses}`}
              >
                {phoneCodes.map(code => (
                  <option key={`phoneHome-${code.id}`} className='bg-[#3c4042]' value={code.areaCode}>
                    {code.areaCode}
                  </option>
                ))}
              </select>
              <input readOnly={viewMode} {...register('homePhone')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          </div>
          {errors?.homePhone && <ErrorMessage msg={errors.homePhone.message} />}
        </div>

        <div className="">
          <LabelFieldForm field="Correo Electrónico" simbol="*"/>
             <input readOnly={viewMode} {...register('email')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          {errors?.email && <ErrorMessage msg={errors.email.message} />}
        </div>

        <div className="md:col-span-2 lg:col-span-3 w-full">
          <LabelFieldForm field="Dirección" />
           <input readOnly={viewMode} {...register('address')} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
          {errors?.address && <ErrorMessage msg={errors.address.message} />}
        </div>
      </div>
    );
   
   
}

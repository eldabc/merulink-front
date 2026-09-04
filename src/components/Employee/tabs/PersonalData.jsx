import { useFormContext } from 'react-hook-form';

import { ciOption } from "../../../utils/text-utils";
import { phoneCodes, mobilePhoneCodes } from "../../../utils/StaticData/phoneCodes-utils"; 

import LabelFieldForm from "../../Shared/LabelFieldForm";
import ErrorMessage from "../../Shared/ErrorMessage";
import InputEmail from "../../Shared/InputEmail";
import PhoneNumber from "../../Shared/PhoneNumber";

export default function PersonalData({ viewMode, disabledClasses }) {
  const { register, setValue, formState: { errors } } = useFormContext();

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
          <LabelFieldForm field="Nacionalidad" simbol="*" />
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
             <input readOnly={viewMode} {...register('ci', ciOption)} className={`w-full px-3 py-2 rounded-lg filter-input ${disabledClasses}`} />
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
            <PhoneNumber 
              type="mobilePhone" 
              disabled={viewMode} 
              register={register} 
              dinamicClasses={disabledClasses} 
              arrayCodes={mobilePhoneCodes}
              setValue={setValue}
            />
          {errors?.mobilePhone && <ErrorMessage msg={errors.mobilePhone.message} />}
        </div>

        <div>
          <LabelFieldForm field="Teléfono Habitación"/>
            <PhoneNumber 
              type="homePhone" 
              disabled={viewMode} 
              register={register} 
              dinamicClasses={disabledClasses} 
              arrayCodes={phoneCodes}
              setValue={setValue}
            />
          {errors?.homePhone && <ErrorMessage msg={errors.homePhone.message} />}
        </div>

        <div className="">
          <LabelFieldForm field="Correo Electrónico" />
            <InputEmail readOnly={viewMode} register={register} disabledClasses={disabledClasses} />
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

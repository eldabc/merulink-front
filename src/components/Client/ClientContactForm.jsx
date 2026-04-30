import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { phoneCodes, mobilePhoneCodes } from "../../utils/StaticData/phoneCodes-utils"; 

import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from "../Shared/ErrorMessage";
import Toggle from "../Shared/Toggle";
import PhoneInput from "../Shared/PhoneInput";
import OptionSelect from "../Shared/OptionSelect";
import InputEmail from "../Shared/InputEmail";
import PhoneNumber from "../Shared/PhoneNumber";
import InputGeneric from "../Shared/InputGeneric";
import ButtonTrash from '../Shared/ButtonTrash';

function ClientContactForm({ viewMode, disabledClasses }) { // register, errors, , setValue, watch 

  // Extrae del contexto global del formulario
  const { register, control, setValue, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "phones", 
  });

  return (
    <div className="w-full div-border"> 
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">                    
        <>
        <LabelFieldForm field="Nombre" simbol="*" />
          <InputGeneric readOnly={viewMode} name="firstName" register={register} dinamicClasses={disabledClasses} />
        {errors?.firstName && <ErrorMessage msg={errors.firstName.message} />}  
        

        <LabelFieldForm field="Apellido" simbol="*" />
          <InputGeneric readOnly={viewMode} name="lastName" register={register} dinamicClasses={disabledClasses} />
        {errors?.lastName && <ErrorMessage msg={errors.lastName.message} />}  

        <LabelFieldForm field="Email" />
        <div>
          <InputEmail readOnly={viewMode} register={register} disabledClasses={disabledClasses} />
          {errors?.email && <ErrorMessage msg={errors.email.message} /> }
        </div>
        
        <div className="md:col-span-4">
          <div className="flex flex-row justify-between bg-[#2f3d44] pt-3 pl-3 pr-3 rounded-t-xl mb-2 hover:bg-[#ffffff21]">
            <LabelFieldForm field="Teléfono Móvil" simbol="*" />
            {!viewMode && (
              <button
                type="button"
                onClick={() => append({ number: "" })}
                className="mb-2 w-10! h-10! flex items-center justify-center text-sm transition-colors mr-2.5"
                title="Añadir Número"
              >
                +
              </button>
            )}
            
          </div>

          <div className="flex flex-col gap-3 pl-3 pr-3">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-start gap-2 animate-fade-in">
                <div className="flex-grow">
                  <PhoneNumber 
                    // name es phones.index.number
                    name={`phones.${index}.number`} 
                    type="mobilePhone" 
                    disabled={viewMode} 
                    register={register} 
                    dinamicClasses={disabledClasses} 
                    arrayCodes={mobilePhoneCodes} 
                    setValue={setValue}
                  />
                  {errors?.phones?.[index]?.number && (
                    <ErrorMessage msg={errors.phones[index].number.message} />
                  )}
                </div>

                {!viewMode && fields.length > 1 && (
                  <ButtonTrash disabled={viewMode} remove={remove} index={index} dinamicClasses={disabledClasses} />
                )}
              </div>
            ))}
          </div>
        </div>
        </>
      </div>  
    </div>
  );
}

export default ClientContactForm;
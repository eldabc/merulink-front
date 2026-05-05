import { useFieldArray } from "react-hook-form";

import { mobilePhoneCodes } from "../../utils/StaticData/phoneCodes-utils";

import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from "../Shared/ErrorMessage";
import InputEmail from "../Shared/InputEmail";
import PhoneNumberEventContact from "../Shared/PhoneNumberEventContact";
import InputGeneric from "../Shared/InputGeneric";
import ButtonTrash from '../Shared/ButtonTrash';

function ContactItem({ index, control, register, setValue, errors, viewMode, disabledClasses, removeContact }) {

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: `contacts.${index}.phones`,
  });

  return (
    <div className="w-full div-border mb-4 relative">
      {!viewMode && (
        <div className="absolute top-2 right-2 z-10">
          <ButtonTrash disabled={viewMode} remove={removeContact} index={index} dinamicClasses={disabledClasses} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-7">

        <LabelFieldForm field="Nombre" simbol="*" />
          <InputGeneric readOnly={viewMode} name={`contacts.${index}.firstName`} register={register} dinamicClasses={disabledClasses} errorIndex={errors?.contacts?.[index]?.firstName}/>
        
        <LabelFieldForm field="Apellido" simbol="*" />
            <InputGeneric readOnly={viewMode} name={`contacts.${index}.lastName`} register={register} dinamicClasses={disabledClasses} errorIndex={errors?.contacts?.[index]?.lastName} />

        <LabelFieldForm field="Email" />
        <div>
          <InputEmail readOnly={viewMode} name={`contacts.${index}.email`} register={register} disabledClasses={disabledClasses} errorIndex={errors?.contacts?.[index]?.email} />
        </div>

        <div className="md:col-span-4">
          <div className="flex flex-row justify-between bg-[#2f3d44] pt-3 pl-3 pr-3 rounded-t-xl mb-2 hover:bg-[#ffffff21]">
            <LabelFieldForm field="Teléfono Móvil" simbol="*" />
            {!viewMode && phoneFields.length < 2 && (
              <button
                type="button"
                onClick={() => appendPhone({ code: mobilePhoneCodes[0]?.code ?? '', number: "" })}
                className="mb-2 w-10! h-10! flex items-center justify-center text-sm transition-colors mr-2.5"
                title="Añadir Número"
              >
                +
              </button>
            )}
            
          </div>

          <div className="flex flex-col gap-3 pl-3 pr-3">
            {phoneFields.map((phoneItem, phoneIndex) => (
              <div key={phoneItem.id} className="flex items-start gap-2 animate-fade-in">
                <div className="flex-grow">
                  <PhoneNumberEventContact
                    codeNumberName={`contacts.${index}.phones.${phoneIndex}.code`}
                    numberName={`contacts.${index}.phones.${phoneIndex}.number`}
                    type="mobilePhone"
                    disabled={viewMode}
                    register={register}
                    control={control}
                    dinamicClasses={disabledClasses}
                    arrayCodes={mobilePhoneCodes}
                    setValue={setValue}
                  />
                  {errors?.contacts?.[index]?.phones?.[phoneIndex]?.number && (
                    <ErrorMessage msg={errors.contacts[index].phones[phoneIndex].number.message} />
                  )}
                </div>

                {!viewMode && phoneFields.length > 1 && (
                  <ButtonTrash disabled={viewMode} remove={removePhone} index={phoneIndex} dinamicClasses={disabledClasses} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactItem;
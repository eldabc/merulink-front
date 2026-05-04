import { useEffect } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

import { phoneCodes, mobilePhoneCodes } from "../../utils/StaticData/phoneCodes-utils"; 

import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from "../Shared/ErrorMessage";
import Toggle from "../Shared/Toggle";
import PhoneInput from "../Shared/PhoneInput";
import OptionSelect from "../Shared/OptionSelect";
import InputEmail from "../Shared/InputEmail";
import PhoneNumberEventContact from "../Shared/PhoneNumberEventContact";
import InputGeneric from "../Shared/InputGeneric";
import ButtonTrash from '../Shared/ButtonTrash';
import ButtonAddContact from '../Shared/ButtonAddContact';
import ContactItem from './ContactItem';

function ClientContactForm({ viewMode, disabledClasses }) { // register, errors, , setValue, watch 

  // Extrae del contexto global del formulario
  const { register, control, setValue, formState: { errors } } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts", 
  });

  const addContacts = fields.length < 3 ? true : false;

  const handleAddContact = () => {
    if (addContacts) {
      append({ firstName: "", lastName: "", email: "", phones: [{ code: mobilePhoneCodes[0]?.code ?? '', number: "" }] });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between bg-[#2f3d44] pt-3 pl-3 pr-3 rounded-t-xl mb-2 hover:bg-[#ffffff21]">
        <LabelFieldForm field="Contacto" />
          <ButtonAddContact disabled={viewMode} handleAddContact={handleAddContact} addContacts={addContacts} dynamicClasses={`${disabledClasses} mb-3`} />
      </div>

      <div className="flex flex-col gap-3">
        {fields.map((item, index) => (
          <ContactItem
            key={item.id}
            index={index}
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            viewMode={viewMode}
            disabledClasses={disabledClasses}
            removeContact={remove}
          />
        ))}
      </div>
    </div>
  );
}

export default ClientContactForm;
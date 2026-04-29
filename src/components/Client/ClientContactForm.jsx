import { phoneCodes, mobilePhoneCodes } from "../../utils/StaticData/phoneCodes-utils"; 

import LabelFieldForm from "../Shared/LabelFieldForm";
import ErrorMessage from "../Shared/ErrorMessage";
import Toggle from "../Shared/Toggle";
import PhoneInput from "../Shared/PhoneInput";
import OptionSelect from "../Shared/OptionSelect";
import InputEmail from "../Shared/InputEmail";
import PhoneNumber from "../Shared/PhoneNumber";

function ClientContactForm({ register, errors, viewMode, disabledClasses, setValue, watch  }) {

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full div-border">                    
      <>
        <LabelFieldForm field="Teléfono Móvil" simbol="*" />
        
          <PhoneNumber 
            type="mobilePhone" 
            disabled={viewMode} 
            register={register} 
            dinamicClasses={disabledClasses} 
            arrayCodes={mobilePhoneCodes} 
            setValue={setValue}
          />

          {errors?.mobilePhone && <ErrorMessage msg={errors.mobilePhone.message} />}  

        <LabelFieldForm field="Email" />
        <div>
          <InputEmail readOnly={viewMode} register={register} disabledClasses={disabledClasses} />
          {errors?.email && <ErrorMessage msg={errors.email.message} /> }
        </div>

        <LabelFieldForm field="Teléfono Fijo" />

          <PhoneNumber 
            type="homePhone" 
            disabled={viewMode} 
            register={register} 
            dinamicClasses={disabledClasses} 
            arrayCodes={phoneCodes} 
          />
        
          {errors?.homePhone && <ErrorMessage msg={errors.homePhone.message} /> }

      </>
    </div>
  );
}

export default ClientContactForm;
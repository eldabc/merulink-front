import { splitPhone } from './global-utils';

export const prepareContactsForForm = (contacts) => {

  return contacts.map(contact => ({
    ...contact,
    // Map teléfonos crudos a objetos con formato para inputs
    phones: contact.phones?.map(p => {
      const { code, number } = splitPhone(p.phoneNumber, true);
      return {
        code,
        number
      };
    }) || []
  }));
};
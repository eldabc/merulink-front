import axios from 'axios';
import { ENV } from '../config/env';

/** Buscar en IVSS (requiere ci + birthdate + nationality) */
export const scrapeIvss = async (ci, birthdate, nationality = 'V') => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { source: 'ivss', ci, birthdate, nationality },
    { timeout: 35000 }
  );
  return response.data;
};

/** Buscar en SENIAT (requiere ci + seniat_code + nationality) */
export const scrapeSeniat = async (ci, seniatCode, nationality = 'V') => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { source: 'seniat', ci, seniat_code: seniatCode, nationality },
    { timeout: 35000 }
  );
  return response.data;
};

/** Obtener imagen captcha del SENIAT */
export const getSeniatCaptcha = async () => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/seniat/captcha`,
    {},
    { timeout: 15000 }
  );
  return response.data;
};

import axios from 'axios';
import { ENV } from '../config/env';

/** Buscar en IVSS (requiere ci + birthdate) */
export const scrapeIvss = async (ci, birthdate) => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { source: 'ivss', ci, birthdate },
    { timeout: 35000 }
  );
  return response.data;
};

/** Buscar en SENIAT (requiere ci + seniat_code) */
export const scrapeSeniat = async (ci, seniatCode) => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { source: 'seniat', ci, seniat_code: seniatCode },
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

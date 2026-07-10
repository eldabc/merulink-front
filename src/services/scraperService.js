import axios from 'axios';
import { ENV } from '../config/env';

export const scrapeEmployeeData = async (ci, birthdate, seniatCode = null) => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { ci, birthdate, seniat_code: seniatCode },
    { timeout: 35000 }
  );
  return response.data;
};

export const getSeniatCaptcha = async () => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/seniat/captcha`,
    {},
    { timeout: 15000 }
  );
  return response.data;
};

import axios from 'axios';
import { ENV } from '../config/env';

export const scrapeEmployeeData = async (ci, birthdate) => {
  const response = await axios.post(
    `${ENV.API_BACK_URL}scrape/employee`,
    { ci, birthdate },
    { timeout: 35000 }
  );
  return response.data;
};

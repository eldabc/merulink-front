import axios from 'axios';
import { ENV } from '../config/env';

export const getDepartments = async () => {
  const response = await axios.get(`${ENV.API_BACK_URL}departments`);
  return await response.data.data;
};

export const getSubDepartments = async () => {
  const response = await axios.get(`${ENV.API_BACK_URL}subdepartments`);
  return await response.data.data;
};
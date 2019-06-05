import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import moment = require('moment');

export const axiosGet = (url: string, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<any>>((resolve, reject) => {
    axios
      .get(url, config)
      .then(value => resolve(value))
      .catch(err => reject(err));
  });

export const axiosPost = (url: string, config?: AxiosRequestConfig) =>
  new Promise<AxiosResponse<any>>((resolve, reject) => {
    axios
      .post(url, config)
      .then(value => resolve(value))
      .catch(err => reject(err));
  });

export const getNow = () => `${moment().format('YYYYMMDD')}000000`;

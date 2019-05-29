import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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

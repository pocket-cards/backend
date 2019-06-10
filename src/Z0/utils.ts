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

export const getNow = () => `${moment().format('YYYYMMDD')}`;

const days = [1, 2, 4, 7, 15, 30, 60, 90];

/** 次回学習時間を計算する */
export const getNextTime = (times: number) => {
  if (times === 0) return getNow();

  const addValue = days[times - 1];

  const nextTime = moment()
    .add(addValue, 'days')
    .format('YYYYMMDD');

  return `${nextTime}`;
};

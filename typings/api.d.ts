import { GroupsItem } from './tables';

export interface Response {
  statusCode: number;
  headers?: {
    [key: string]: string;
  };
  isBase64Encoded: boolean;
  body?: string;
}

export interface C004Request {
  correct: boolean;
  times: number;
}

export interface C004Response {}

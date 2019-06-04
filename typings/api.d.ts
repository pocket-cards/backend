import { GroupsItem } from './tables';

export interface BaseResponse {
  statusCode: number;
  headers?: {
    [key: string]: string;
  };
  isBase64Encoded: boolean;
  body?: string;
}

// ------------------------------
// C004
// ------------------------------
export interface C004Request {
  correct: boolean;
  times: number;
}

export interface C004Response {}

// ------------------------------
// C006
// ------------------------------
export interface C006Request {
  words: string[];
}

export interface C006Item {
  // 単語
  word: string;
  // 発音記号
  pronounce?: string;
  // 語彙（中国語）
  vocChn?: string;
  // 語彙（日本語）
  vocJpn?: string;
  // 音声ファイル
  mp3?: string;
  // 回数
  times: number;
}
export interface C006Response {
  count: number;
  words: C006Item[];
}

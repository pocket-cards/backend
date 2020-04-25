import { GroupInfo } from './types';
import { TGroups } from './tables';

// ------------------------------
// Common
// ------------------------------
export interface BaseResponse {
  statusCode: number;
  headers?: {
    [key: string]: string;
  };
  isBase64Encoded: boolean;
  body?: string;
}

export interface WordItem {
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
// ------------------------------
// A002
// ------------------------------
export interface A002Request {}

export interface A002Response {
  remaining: {
    test: number;
    review: number;
  };
  daily: {
    total: number;
    new: number;
    review: number;
  };
  weekly: number;
  monthly: number;
}

// ------------------------------
// B001
// ------------------------------
export interface B001Request {}

export type B001Response = TGroups[];

// ------------------------------
// B002
// ------------------------------
export interface B002Request {}

export type B002Response = TGroups[];

// ------------------------------
// B003
// ------------------------------
export interface B003Params {
  groupId: string;
}

export interface B003Request {}

export type B003Response = TGroups;

// ------------------------------
// B004
// ------------------------------
export interface B004Params {
  groupId: string;
}

export interface B004Request {
  groupName: string;
  description?: string;
}

export type B004Response = TGroups;

// ------------------------------
// B005
// ------------------------------
export interface B005Request {}

export type B005Response = TGroups[];

// ------------------------------
// C001
// ------------------------------
export interface C001Request {
  words: string[];
}

export interface C001Response {}

// ------------------------------
// C002
// ------------------------------
export interface C002Response {
  word: string;
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
export interface C006Request {}

export interface C006Response {
  count: number;
  words: WordItem[];
}
// ------------------------------
// C007
// ------------------------------
export interface C007Request {}

export interface C007Response {
  count: number;
  words: WordItem[];
}
// ------------------------------
// C008
// ------------------------------
export interface C008Request {}

export interface C008Response {
  count: number;
  words: WordItem[];
}
// ------------------------------
// D001
// ------------------------------
export interface D001Request {
  type: string;
  image: string;
}

export interface D001Response {
  count: number;
  words: string[];
}

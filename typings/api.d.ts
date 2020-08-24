import { TGroups, TWords, TWordMaster } from './tables';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

// ------------------------------------------------------------
// Common
// ------------------------------------------------------------
export interface BaseResponse {
  statusCode: number;
  headers?: {
    [key: string]: string;
  };
  isBase64Encoded: boolean;
  body?: string;
}

export type Callback = (req: Request) => Promise<any>;

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
// ------------------------------------------------------------
// A002
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// B001
// ------------------------------------------------------------
export interface B001Request {
  name: string;
  description?: string;
}

export interface B001Response {
  groupId: string;
}

// ------------------------------------------------------------
// B002
// ------------------------------------------------------------
export interface B002Request {}

export interface B002Response {
  count: number;
  groups: TGroups[];
}

// ------------------------------------------------------------
// B003
// ------------------------------------------------------------
export interface B003Params {
  groupId: string;
}

export interface B003Request {}

export type B003Response = TGroups;

// ------------------------------------------------------------
// B004
// ------------------------------------------------------------
export interface B004Params {
  groupId: string;
}

export interface B004Request {
  name?: string;
  description?: string;
}

// ------------------------------------------------------------
// B005
// ------------------------------------------------------------
export interface B005Params {
  groupId: string;
}

// ------------------------------------------------------------
// C001
// ------------------------------------------------------------
export interface C001Request {
  words: string[];
}

export interface C001Response {}

// ------------------------------------------------------------
// C002
// ------------------------------------------------------------
export interface C002Params extends ParamsDictionary {
  groupId: string;
}

export interface C002ResItem {
  word: string;
  vocabulary?: string;
}

export type C002Response = C002ResItem[];

// ------------------------------------------------------------
// C003
// ------------------------------------------------------------
export interface C003Params extends ParamsDictionary {
  groupId: string;
  word: string;
}

export type C003Response = TWords;

// ------------------------------------------------------------
// C004
// ------------------------------------------------------------
export interface C004Params extends ParamsDictionary {
  groupId: string;
  word: string;
}

export interface C004Request {
  type: string;
  correct?: boolean;
  times?: number;
  newWord?: string;
}

export type C004Response = void;

// ------------------------------------------------------------
// C005
// ------------------------------------------------------------
export interface C005Params extends ParamsDictionary {
  groupId: string;
  word: string;
}

export type C005Response = void;

// ------------------------------------------------------------
// C006
// ------------------------------------------------------------
export interface C006Params extends ParamsDictionary {
  groupId: string;
}

export interface C006Response {
  count: number;
  words: WordItem[];
}
// ------------------------------------------------------------
// C007
// ------------------------------------------------------------
export interface C007Params extends ParamsDictionary {
  groupId: string;
}

export interface C007Response {
  count: number;
  words: WordItem[];
}
// ------------------------------------------------------------
// C008
// ------------------------------------------------------------
export interface C008Params extends ParamsDictionary {
  groupId: string;
}

export interface C008Response {
  count: number;
  words: WordItem[];
}
// ------------------------------------------------------------
// D001
// ------------------------------------------------------------
export interface D001Request {
  content: string;
  language?: string;
}

export interface D001Response {
  count: number;
  words: string[];
}

// ------------------------------------------------------------
// E001
// ------------------------------------------------------------
export interface E001Params extends ParamsDictionary {
  word: string;
}

export type E001Response = TWordMaster;

// ------------------------------------------------------------
// E002
// ------------------------------------------------------------
export interface E002Params extends ParamsDictionary {
  word: string;
}

export interface E002Request extends TWordMaster {}

export type E002Response = void;

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
// C009
// ------------------------------
export interface C009Request {}

export interface C009Response {
  count: number;
  words: WordItem[];
}

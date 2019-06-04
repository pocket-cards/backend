export interface GroupsItem {
  id: string;
  // 単語
  word: string;
  // 次の学習時間
  nextTime: string;
  // 最後の学習時間
  lastTime?: string;
  // 学習回数
  times: number;
}

export interface WordsItem {
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
}

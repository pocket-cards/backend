export interface GroupWordsItem {
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

export interface UsersItem {
  // ユーザID
  id: string;
  // メール
  email: string;
  // 前回ログイン
  lastLogin?: string;
  // 直近ログイン
  login?: string;
}

export interface UserGroupsItem {
  // ユーザID
  userId: string;
  // グループID
  groupId: string;
}

export interface HistoryItem {
  // ユーザID
  userId: string;
  // Timestamp
  timestamp: string;
  // グループID
  groupId?: string;
  // 最後の学習時間
  lastTime?: string;
  // 単語
  word?: string;
  // 学習回数
  times?: number;
}

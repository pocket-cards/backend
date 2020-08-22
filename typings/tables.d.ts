export interface WordKey {
  // 単語
  id: string;
  // グループID
  groupId: string;
}

export interface TWords extends WordKey {
  // 次の学習時間
  nextTime: string;
  // 最後の学習時間
  lastTime?: string;
  // 学習回数
  times: number;
  // 語彙
  vocabulary?: string;
}

export interface TWordMaster {
  // 単語
  id: string;
  // 発音記号
  pronounce?: string;
  // 語彙（中国語）
  vocChn?: string;
  // 語彙（日本語）
  vocJpn?: string;
  // 音声ファイル
  mp3?: string;
}

export interface TUsers {
  // ユーザID
  id: string;
  // ユーザ名
  name?: string;
  // ユーザ ICon
  icon?: string;
  // メール
  email?: string;
  // 前回ログイン
  lastLogin?: string;
  // 直近ログイン
  login?: string;
  // 最後の学習日付
  studyQuery?: string;
}

export interface GroupsKey {
  // グループID
  id: string;
  // ユーザID
  userId?: string;
}

export interface TGroups extends GroupsKey {
  // グループ名
  name?: string;
  // 説明
  description?: string;
}

export interface THistories {
  // ユーザID
  user: string;
  // Timestamp
  timestamp: string;
  // グループID
  group?: string;
  // 単語
  word?: string;
  // 最後の学習時間
  lastTime?: string;
  // 学習回数
  times?: number;
}

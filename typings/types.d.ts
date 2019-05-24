declare module '*.json' {
  const value: any;
  export default value;
}

export interface Words_Item {
  word: string;
}

export interface Groups_Item {
  id: string;
  last_time: string;
  word: string;
}

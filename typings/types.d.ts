declare module '*.json' {
  const value: any;
  export default value;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

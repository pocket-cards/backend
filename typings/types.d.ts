declare module '*.json' {
  const value: any;
  export default value;
}

export interface GroupInfo {
  id: string;
  name: string;
  description?: string;
}

export namespace DynamoDBOptions {
  interface Put {
    ReturnValues: 'NONE' | 'ALL_OLD' | 'UPDATED_OLD' | 'ALL_NEW' | 'UPDATED_NEW' | string;
  }
}

export interface VisionRequest {
  content: string;
  language: string;
}

export type VisionResponse = string[];

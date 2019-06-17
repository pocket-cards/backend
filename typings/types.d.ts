declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'aws-xray-sdk' {
  export function captureAWSClient<T>(client: T): T;

  export function captureAWS<T>(sdk: T): T;
}

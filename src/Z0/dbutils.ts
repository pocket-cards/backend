import { DynamoDB } from 'aws-sdk';
import { dynamoDB } from './clientUtils';

/** Get */
export const get = (input: DynamoDB.DocumentClient.GetItemInput) => {
  console.log(input);

  return dynamoDB().get(input);
};

/** Put */
export const put = (input: DynamoDB.DocumentClient.PutItemInput) => {
  console.log(input);

  return dynamoDB().put(input);
};

/** Put */
export const query = (input: DynamoDB.DocumentClient.QueryInput) => {
  console.log(input);

  return dynamoDB().query(input);
};

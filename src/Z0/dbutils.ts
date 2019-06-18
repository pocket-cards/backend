import { DynamoDB } from 'aws-sdk';
import { dynamoDB } from './clientUtils';

/** Get */
export const get = (input: DynamoDB.DocumentClient.GetItemInput) => {
  console.log(input);

  return dynamoDB().get(input);
};

export const getAsync = async (input: DynamoDB.DocumentClient.GetItemInput) => {
  const result = get(input).promise();

  console.log(result);

  return result;
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

export const queryAsync = async (input: DynamoDB.DocumentClient.QueryInput) => {
  // クエリ実行
  const result = await query(input).promise();

  console.log(result);

  return result;
};

/** Update */
export const update = (input: DynamoDB.DocumentClient.UpdateItemInput) => {
  console.log(input);

  return dynamoDB().update(input);
};

export const updateAsync = async (input: DynamoDB.DocumentClient.UpdateItemInput) => {
  const result = await update(input).promise();

  console.log(result);

  return result;
};

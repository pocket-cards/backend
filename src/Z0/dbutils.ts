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

export const queryAsync = async (input: DynamoDB.DocumentClient.QueryInput) => {
  console.log(input);

  // クエリ実行
  const result = await dynamoDB()
    .query(input)
    .promise();

  console.log(result);

  return result;
};

/** Update */
export const update = (input: DynamoDB.DocumentClient.UpdateItemInput) => {
  console.log(input);

  return dynamoDB().update(input);
};

export const updateAsync = async (input: DynamoDB.DocumentClient.UpdateItemInput) => {
  console.log(input);

  const result = await dynamoDB().update(input);

  console.log(result);

  return result;
};

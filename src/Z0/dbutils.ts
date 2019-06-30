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

export const putAsync = async (input: DynamoDB.DocumentClient.PutItemInput) => {
  const result = put(input).promise();

  console.log(result);

  return result;
};

/** Query */
export const query = (input: DynamoDB.DocumentClient.QueryInput) => {
  console.log(input);

  return dynamoDB().query(input);
};

export const queryAsync = async (input: DynamoDB.DocumentClient.QueryInput) => {
  // クエリ実行
  const result = await query(input).promise();

  // 検索結果出力
  console.log(result);

  // 上限ある場合、そのまま終了
  if (input.Limit && input.Limit === result.Count) {
    return result;
  }

  if (result.LastEvaluatedKey) {
    const lastResult = await queryAsync({ ...input, ExclusiveStartKey: result.LastEvaluatedKey });

    if (result.Items && lastResult.Items) {
      result.Items = result.Items.concat(lastResult.Items);
    }
    if (result.Count && lastResult.Count) {
      result.Count = result.Count + lastResult.Count;
    }
    if (result.ScannedCount && lastResult.ScannedCount) {
      result.ScannedCount = result.ScannedCount + lastResult.ScannedCount;
    }
  }

  // 上限ある場合、そのまま終了
  if (input.Limit && input.Limit === result.Count) {
    return result;
  }

  return result;
};

/** Scan */
export const scan = (input: DynamoDB.DocumentClient.QueryInput) => {
  console.log(input);

  return dynamoDB().scan(input);
};

export const scanAsync = async (input: DynamoDB.DocumentClient.QueryInput) => {
  // クエリ実行
  const result = await scan(input).promise();

  // 検索結果出力
  console.log(result);

  if (result.LastEvaluatedKey) {
    const lastResult = await scanAsync({ ...input, ExclusiveStartKey: result.LastEvaluatedKey });

    if (result.Items && lastResult.Items) {
      result.Items = result.Items.concat(lastResult.Items);
    }
    if (result.Count && lastResult.Count) {
      result.Count = result.Count + lastResult.Count;
    }
    if (result.ScannedCount && lastResult.ScannedCount) {
      result.ScannedCount = result.ScannedCount + lastResult.ScannedCount;
    }
  }

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

/** Delete */
export const deleteItem = (input: DynamoDB.DocumentClient.DeleteItemInput) => {
  console.log(input);

  return dynamoDB().delete(input);
};

export const deleteItemAsync = async (input: DynamoDB.DocumentClient.DeleteItemInput) => {
  const result = await deleteItem(input).promise();

  console.log(result);

  return result;
};

/** TransactWrite */
export const transactWrite = (
  input: DynamoDB.DocumentClient.TransactWriteItemsInput,
  options?: DynamoDB.DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration
) => {
  console.log(input);

  return dynamoDB(options).transactWrite(input);
};

export const transactWriteAsync = async (
  input: DynamoDB.DocumentClient.TransactWriteItemsInput,
  options?: DynamoDB.DocumentClient.DocumentClientOptions & DynamoDB.Types.ClientConfiguration
) => {
  const result = await transactWrite(input, options).promise();

  console.log(result);

  return result;
};

import { Lambda } from 'aws-sdk';
import * as jsyaml from 'js-yaml';
import * as fs from 'fs';

const PROJECT_NAME = process.env.PROJECT_NAME as string;
const FUNCTION_ALIAS = process.env.FUNCTION_ALIAS as string;

const client = new Lambda({
  region: process.env.AWS_DEFAULT_REGION
});
const appspec = {} as any;

const start = async () => {
  // Lambda Function一覧を取得する
  const result = await client.listFunctions().promise();

  // 対象存在しない場合、処理スキップ
  if (!result.Functions) {
    return;
  }

  // 対象外のFunctionを除外する
  const functions = result.Functions.filter(
    item => item.FunctionName && item.FunctionName.startsWith(PROJECT_NAME)
  );

  const resources = [] as any;

  functions.forEach(async item => {
    const { FunctionName: funcName } = item;

    // 必須チェック
    if (!funcName) return;

    const newFunc = await client
      .updateFunctionCode({
        FunctionName: funcName,
        Publish: true,
        ZipFile: fs.createReadStream(funcName.replace(PROJECT_NAME, ''))
      })
      .promise();

    // Version Publish失敗の場合、処理スキップする
    if (!newFunc.Version) return;

    const resouce = {} as any;
    const keyName = funcName.replace('-', '');

    resouce[keyName] = {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Name: funcName,
        Alias: FUNCTION_ALIAS,
        CurrentVersion: 1,
        TargetVersion: newFunc.Version
      }
    };

    resources.push(resouce);
  });

  appspec['version'] = '0.0';
  appspec['Resources'] = resources;

  console.log(appspec);

  fs.writeFileSync(jsyaml.dump(appspec), 'appspec.yml');

  // S3に保存する
  // await s3Client
  //   .upload({
  //     Bucket: process.env.ARTIFACTS_BUCKET as string,
  //     Key: 'appspec.yml',
  //     Body: jsyaml.dump(appspec)
  //   })
  //   .promise();
};

start();

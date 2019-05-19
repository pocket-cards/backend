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

  const proc = functions.map(async item => {
    const { FunctionName: funcName } = item;

    // 必須チェック
    if (!funcName) return {};

    const fileName = `${funcName
      .replace(PROJECT_NAME, '')
      .replace('-', '')}.zip`;

    // 更新用モジュールが存在しない
    if (!fs.existsSync(fileName)) return {};

    console.log('filename', fileName);

    const newFunc = await client
      .updateFunctionCode({
        FunctionName: funcName,
        Publish: true,
        ZipFile: fs.readFileSync(fileName)
      })
      .promise();

    const oldFunc = await client
      .getAlias({
        FunctionName: funcName,
        Name: FUNCTION_ALIAS
      })
      .promise();

    // Version Publish失敗の場合、処理スキップする
    if (!newFunc.Version || !oldFunc.FunctionVersion) return;

    const resouce = {} as any;
    const keyName = funcName.replace('-', '');

    resouce[keyName] = {
      Type: 'AWS::Lambda::Function',
      Properties: {
        Name: funcName,
        Alias: FUNCTION_ALIAS,
        CurrentVersion: Number(oldFunc.FunctionVersion),
        TargetVersion: Number(newFunc.Version)
      }
    };

    return resouce;
  });

  Promise.all(proc).then(values => {
    const resources = values.filter(item => Object.keys(item).length !== 0);

    appspec['version'] = '0.0';
    appspec['Resources'] = resources;

    console.log(appspec);

    fs.writeFileSync('appspec.yml', jsyaml.dump(appspec), {
      encoding: 'utf-8'
    });
  });

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

import { Lambda, CodeDeploy } from 'aws-sdk';
import * as jsyaml from 'js-yaml';
import * as fs from 'fs';

// プロジェクト名
const PROJECT_NAME = process.env.PROJECT_NAME as string;
// 環境名
const FUNCTION_ALIAS = process.env.FUNCTION_ALIAS as string;
// CodeDeploy App名
const APPLICATION_NAME = process.env.APPLICATION_NAME as string;

const SRC_PATH = 'dist';
const LATEST_VERSION = '$LATEST';

// Lambda Client
const client = new Lambda({
  region: process.env.AWS_DEFAULT_REGION,
});
// CodeDeploy Client
const cdClient = new CodeDeploy({
  region: process.env.AWS_DEFAULT_REGION,
});

process.on('unhandledRejection', err => {
  console.log('Error', err);
  process.exit(1);
});

const start = async () => {
  // Lambda Function一覧を取得する
  const listFunctions = await client.listFunctions().promise();

  // 対象存在しない場合、処理スキップ
  if (!listFunctions.Functions) {
    return;
  }

  // 対象外のFunctionを除外する
  const functions = listFunctions.Functions.filter(item => item.FunctionName && item.FunctionName.startsWith(PROJECT_NAME));

  const targets = functions.filter(item => {
    const { FunctionName: fullName } = item;

    // Function名存在しない
    if (!fullName) return false;

    // Zipファイル名
    const fileName = `${getFunctionName(fullName)}.zip`;

    // ファイル存在チェック
    return fs.existsSync(`${SRC_PATH}/${fileName}`);
  });

  // 対象が存在しない
  if (targets.length === 0) return;

  const tasks = targets.map(async item => {
    const { FunctionName: fullName = '' } = item;
    // Zipファイル名
    const fileName = `${SRC_PATH}/${getFunctionName(fullName)}.zip`;

    // 既存のLambda情報を取得する
    const oldFunc = await client
      .getAlias({
        FunctionName: fullName,
        Name: FUNCTION_ALIAS,
      })
      .promise();

    let oldVersion = oldFunc.FunctionVersion;

    console.log(`★★★Before update★★★ Function name: ${fullName}, Version: ${oldVersion}`);

    // Publishなしの場合、新規作成する
    if (oldVersion === LATEST_VERSION) {
      const published = await createPublish(fullName);
      oldVersion = published.Version;
      console.log(`★★★After publish★★★ Function name: ${fullName}, Version: ${oldVersion}`);
    }

    // Lambdaコードを更新する
    const newFunc = await client
      .updateFunctionCode({
        FunctionName: fullName,
        Publish: true,
        ZipFile: fs.readFileSync(fileName),
      })
      .promise();

    console.log(`★★★After  update★★★ Function name: ${fullName}, Version: ${newFunc.Version}`);

    // Version Publish失敗の場合、処理スキップする
    if (!newFunc.Version || !oldVersion) {
      return;
    }

    // $LATESTバージョンの変更なしの場合、新しいバージョンが作成しないため
    // バージョンNoが同じになります
    if (newFunc.Version === oldVersion) {
      console.log(`ソースコード変更なし, Function name: ${fullName}, Version: ${newFunc.Version}`);
      return;
    }

    const appspec = {} as any;
    appspec['version'] = '0.0';
    appspec['Resources'] = [
      {
        [getFunctionName(fullName)]: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Name: fullName,
            Alias: FUNCTION_ALIAS,
            CurrentVersion: Number(oldVersion),
            TargetVersion: Number(newFunc.Version),
          },
        },
      },
    ];

    // appspec['Hooks'] = [
    //   {
    //     BeforeAllowTraffic: 'LambdaFunctionToValidateBeforeTrafficShift',
    //   },
    //   {
    //     AfterAllowTraffic: 'LambdaFunctionToValidateAfterTrafficShift',
    //   },
    // ];

    return appspec;
  });

  // 実行する
  const appspecs = await Promise.all(tasks);

  const deploys = appspecs
    .filter(item => typeof item !== 'undefined')
    .map(item => {
      const groupName = Object.keys(item['Resources'][0])[0];

      return cdClient
        .createDeployment({
          applicationName: APPLICATION_NAME,
          deploymentGroupName: groupName,
          revision: {
            revisionType: 'AppSpecContent',
            appSpecContent: {
              content: jsyaml.safeDump(item),
            },
          },
        })
        .promise();
    });

  // 更新可能なソースがありません
  if (deploys.length === 0) {
    console.log('更新可能なLambdaはありません');
    return;
  }

  // バージョン切替処理を実行する
  await Promise.all(deploys);
};

const createPublish = async (funcName: string) => {
  const func = await client
    .publishVersion({
      FunctionName: funcName,
    })
    .promise();

  // 必須チェック
  if (!func.Version) return func;

  await client
    .updateAlias({
      Name: FUNCTION_ALIAS,
      FunctionName: funcName,
      FunctionVersion: func.Version,
    })
    .promise();

  return func;
};

const getFunctionName = (fullName: string) => fullName.replace(PROJECT_NAME, '').replace('-', '');

start();

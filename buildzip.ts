import { Lambda } from 'aws-sdk';
import { sync } from 'glob';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

const ROOT_PATH = 'build';
const DEST_PATH = 'dist';

const client = new Lambda({
  region: 'ap-northeast-1'
});

/** ビルド処理 */
const build = () => {
  // 出力フォルダを削除
  clear();
  // Zipファイルを生成する
  makezip();
};

const clear = () => {
  // フォルダクリアする
  rimraf.sync(DEST_PATH);
  fs.mkdirSync(DEST_PATH);
};

const appspec = async (functionName: string) => {
  const version = 1;

  const result = await client
    .listVersionsByFunction({
      FunctionName: functionName
    })
    .promise();

  // result.Versions[0].Version;

  return `version: 0.0
  Resources:
    - ${functionName}:
        Type: AWS::Lambda::Function
        Properties:
          Name: ${functionName}
          CurrentVersion: ${version}
          TargetVersion: ${version + 1}
  Hooks:
    - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeTrafficShift"
    - AfterAllowTraffic: "LambdaFunctionToValidateAfterTrafficShift"
  `;
};

const makezip = () => {
  // 元ファイル一覧を取得する
  const targets = sync(`${ROOT_PATH}/**/*.js`);

  targets.forEach(item => {
    const zip = archiver.create('zip', {
      zlib: { level: 9 }
    });

    appspec('pocket-cards-D001').then(value => {
      const folder = item.split(/\//g)[1].split('_')[1];

      // 保存先
      zip.pipe(fs.createWriteStream(`dist/${folder}.zip`));

      // ファイル追加
      zip.append(fs.createReadStream(item), { name: 'index.js' });
      zip.append(value, { name: 'appspec.xml' });

      // ファイル出力
      zip.finalize();
    });
  });
};

// ビルド処理実行
build();

import { Lambda } from 'aws-sdk';
import * as mkdirp from 'mkdirp';
import { sync } from 'glob';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { rejects } from 'assert';

const ROOT_PATH = 'build';
const DEST_PATH = 'dist';
const PROJECT = 'pocket-cards';

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

const mkdir = (dir: string) =>
  new Promise<string>((resolve, reject) =>
    mkdirp(dir, (err, made) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    })
  );

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

  targets.forEach(async item => {
    const zip = archiver.create('zip', {
      zlib: { level: 9 }
    });

    const folder = item.split(/\//g)[1];
    const funcName = folder.split('_')[1];

    const savePath = `${DEST_PATH}/${folder}`;

    // 保存先フォルダ作成
    await mkdir(savePath);

    // 保存先
    zip.pipe(fs.createWriteStream(`${savePath}/${funcName}.zip`));
    // ファイル追加
    zip.append(fs.createReadStream(item), { name: 'index.js' });
    // ファイル出力
    zip.finalize();

    // Lambda用appspec情報を作成する
    const file_text = await appspec(`${PROJECT}-${funcName}`);

    fs.writeFileSync(`${savePath}/appspec.yml`, file_text, {
      encoding: 'utf-8'
    });
  });
};

// ビルド処理実行
build();

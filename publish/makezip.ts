import { sync } from 'glob';
import * as archiver from 'archiver';
import * as fs from 'fs';

const ROOT_PATH = 'build';
const DEST_PATH = 'dist';

/** Appspec.yml ファイルを作成する */
// const appspec = async (functionName: string) => {
//   // Function version一覧を取得する
//   const result = await client
//     .listVersionsByFunction({
//       FunctionName: functionName,
//     })
//     .promise();

//   // Function version is not exists
//   if (!result.Versions) {
//     throw new Error(`Function version is not initialize. Name: ${functionName}`);
//   }

//   // LATEST versionを削除する
//   const versions = result.Versions.filter(value => value.Version !== LATEST_VERSION);

//   // Function version is not exists
//   if (versions.length === 0 || !versions[0].Version) {
//     throw new Error(`Function version is not initialize. Name: ${functionName}`);
//   }

//   const version = versions[0].Version;

//   console.log(version);

//   return `version: 0.0
// Resources:
//   - ${functionName}:
//       Type: AWS::Lambda::Function
//       Properties:
//         Name: ${functionName}
//         Alias: dev
//         CurrentVersion: ${version}
//         TargetVersion: ${Number(version) + 1}
// Hooks:
//   - BeforeAllowTraffic: "LambdaFunctionToValidateBeforeTrafficShift"
//   - AfterAllowTraffic: "LambdaFunctionToValidateAfterTrafficShift"
// `;
// };

const makezip = () => {
  // 元ファイル一覧を取得する
  const targets = sync(`${ROOT_PATH}/**/*.js`);

  targets.forEach(async item => {
    const zip = archiver.create('zip', {
      zlib: { level: 9 },
    });

    const folder = item.split(/\//g)[1];
    const funcName = folder.split('_')[1];

    // 保存先
    zip.pipe(fs.createWriteStream(`${DEST_PATH}/${funcName}.zip`));
    // ファイル追加
    zip.append(fs.createReadStream(item), { name: 'index.js' });
    // ファイル出力
    zip.finalize();

    // Lambda用appspec情報を作成する
    // const file_text = await appspec(`${PROJECT}-${funcName}`);

    // fs.writeFileSync(`${savePath}/appspec.yml`, file_text, {
    //   encoding: 'utf-8',
    // });
  });
};

// ビルド処理実行
makezip();

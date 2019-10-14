import { sync } from 'glob';
import * as archiver from 'archiver';
import * as fs from 'fs';

const ROOT_PATH = 'build';
const DEST_PATH = 'dist';

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
  });
};

// ビルド処理実行
makezip();

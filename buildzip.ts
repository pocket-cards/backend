import { sync } from 'glob';
import * as archiver from 'archiver';
import * as fs from 'fs';
import * as rimraf from 'rimraf';

const ROOT_PATH = 'build';
const DEST_PATH = 'dist';

// フォルダクリアする
rimraf.sync(DEST_PATH);
fs.mkdirSync(DEST_PATH);

// 元ファイル一覧を取得する
const targets = sync(`${ROOT_PATH}/**/*.js`);

targets.forEach(item => {
  const zip = archiver.create('zip', {
    zlib: { level: 9 }
  });

  const folder = item.split(/\//g)[1];

  zip.pipe(fs.createWriteStream(`dist/${folder}.zip`));
  zip.append(fs.createReadStream(item), { name: 'index.js' });
  zip.finalize();
});

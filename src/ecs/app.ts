import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';
import { B001, B002, B003, B004, B005 } from '@src/b0';
import { C001, C002, C003, C004, C005, C006, C007, C008 } from '@src/c0';
import { D001 } from '@src/d0';
import { E001, E002 } from '@src/e0';

import entry from './entry';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.originalUrl}`);
  // console.info('Headers', JSON.stringify(req.headers));
  // console.info('Body', JSON.stringify(req.body));

  next();
});

app.use(BodyParser.json({ limit: '50mb' }));
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

// health check
app.get('/', (_, res) => res.send('v3.1.0'));
// グループ新規
app.put('/groups', express.json(), (req, res) => entry(req, res, B001));
// グループ一覧
app.get('/groups', express.json(), (req, res) => entry(req, res, B002));
// グループ一覧
app.get('/groups/:groupId', express.json(), (req, res) => entry(req, res, B003));
// グループ更新
app.put('/groups/:groupId', express.json(), (req, res) => entry(req, res, B004));
// グループ削除
app.delete('/groups/:groupId', express.json(), (req, res) => entry(req, res, B005));
// 単語一括登録
app.post('/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C001));
// 単語一括取得
app.get('/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C002));
// 単語情報取得
app.get('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C003));
// 単語情報更新
app.put('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C004));
// 単語情報削除
app.delete('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C005));
// 新規学習モード単語一覧
app.get('/groups/:groupId/new', express.json(), (req, res) => entry(req, res, C006));
// テストモード単語一覧
app.get('/groups/:groupId/test', express.json(), (req, res) => entry(req, res, C007));
// 復習モード単語一覧
app.get('/groups/:groupId/review', express.json(), (req, res) => entry(req, res, C008));
// 画像から単語に変換する
app.post('/image2text', express.json(), (req, res) => entry(req, res, D001));
// 単語詳細情報取得
app.get('/words/:word', express.json(), (req, res) => entry(req, res, E001));
// 単語詳細情報取得
app.put('/words/:word', express.json(), (req, res) => entry(req, res, E002));

app.listen(process.env.EXPOSE_PORT || 8080, () => {
  console.log('Started...');
  console.log('Port: ', process.env.EXPOSE_PORT || 8080);
});

// console.log(process.env);

// (async () => {
//   const ngrok = require('ngrok');

//   const url = await ngrok.connect(8080);

//   console.log(url);
// })();

export default app;

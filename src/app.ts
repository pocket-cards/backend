import express from 'express';
import { B002, B003, B004, B005 } from '@src/b0';
import { C001, C003, C005, C006, C007, C008 } from '@src/c0';
import entry from './entry';

const app = express();

// health check
app.get('/', (_, res) => res.send('v3.1.0'));
// グループ一覧
app.get('/groups', express.json(), (req, res) => entry(req, res, B002));
// グループ一覧
app.get('/groups/:groupId', express.json(), async (req, res) => await entry(req, res, B003));
// グループ更新
app.put('/groups/:groupId', express.json(), async (req, res) => await entry(req, res, B004));
// グループ削除
app.delete('/groups/:groupId', express.json(), async (req, res) => await entry(req, res, B005));
// 単語一括登録
app.post('/groups/:groupId/words', express.json(), (req, res) => entry(req, res, C001));
// 単語情報取得
app.get('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C003));
// 単語情報更新
// app.put('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C004));
// 単語情報削除
app.delete('/groups/:groupId/words/:word', express.json(), (req, res) => entry(req, res, C005));
// 新規学習モード単語一覧
app.get('/groups/:groupId/new', express.json(), async (req, res) => await entry(req, res, C006));
// テストモード単語一覧
app.get('/groups/:groupId/test', express.json(), async (req, res) => entry(req, res, C007));
// 復習モード単語一覧
app.get('/groups/:groupId/review', express.json(), async (req, res) => entry(req, res, C008));

app.listen(process.env.PORT || 8080, () => {
  console.log('Started...');
  console.log('Port: ', process.env.PORT || 8080);
});

export default app;

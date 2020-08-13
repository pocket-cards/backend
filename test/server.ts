import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import BodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(BodyParser.json({ limit: '50mb' }));
app.use(BodyParser.urlencoded({ extended: true }));

app.post('/image2words', express.json(), (req, res) => {
  res.send(['First', 'Things', 'Lesson', 'Excuse', 'your', 'possessive', 'adjective', 'handbag', 'very', 'much', 'this', 'book', 'watch', 'dress', 'shirt']);
});

app.get('/ipa', express.json(), (req, res) => {
  const word = req.query['word'];

  res.send({});
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.info(`${req.method} ${req.originalUrl}`);

  next();
});

export default app;

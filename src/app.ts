import express from 'express';
import B002 from '@src/b0/b002';
import entry from './entry';

const app = express();

// health check
app.get('/version', (_, res) => res.send('v3.1.0'));
app.post('/groups', express.json(), (req, res) => entry(req, res, B002));
app.post('/groups', express.json(), (req, res) => entry(req, res, B002));
app.post('/groups', express.json(), (req, res) => entry(req, res, B002));
app.post('/groups', express.json(), (req, res) => entry(req, res, B002));
app.post('/groups', express.json(), (req, res) => entry(req, res, B002));

app.listen(process.env.PORT || 8080);

console.log('started...');

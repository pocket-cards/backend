import App from './server';

before(() => {
  App.listen(9000, () => console.log('test server started...'));
});

after(() => {
  App.removeAllListeners();
});

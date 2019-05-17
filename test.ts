import { sync } from 'glob';

const targets = sync(`build/**/*.js`);

console.log(targets);

import { Configuration, LoaderOptionsPlugin } from 'webpack';
import merge from 'webpack-merge';
import * as path from 'path';
import baseConfig from './webpack.base';

const publish: Configuration = {
  mode: 'production',
  entry: {
    index: './publish/index'
  },
  output: {
    path: path.resolve(__dirname, '../publish')
  },
  plugins: [
    new LoaderOptionsPlugin({
      debug: false
    })
  ]
};

export default merge.strategy({
  entry: 'replace',
  plugins: 'replace'
})(baseConfig, publish);

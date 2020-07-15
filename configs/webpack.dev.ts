import { Configuration, LoaderOptionsPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import Dotenv from 'dotenv-webpack';
import baseConfig from './webpack.base';

const dev: Configuration = {
  mode: 'development',
  plugins: [
    new Dotenv(),
    new LoaderOptionsPlugin({
      debug: false,
    }),
  ],
};

export default merge(baseConfig, dev);

import { Configuration, LoaderOptionsPlugin } from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.base';

const prod: Configuration = {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new LoaderOptionsPlugin({
      debug: false,
    }),
  ],
};

export default merge(baseConfig, prod);

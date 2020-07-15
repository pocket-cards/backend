import { Configuration, LoaderOptionsPlugin } from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';

const ecs: Configuration = {
  mode: 'production',
  plugins: [
    new LoaderOptionsPlugin({
      debug: false,
    }),
  ],
};

export default merge(baseConfig, ecs);

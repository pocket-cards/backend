import { sync } from 'glob';
import * as path from 'path';
import { Configuration, NoEmitOnErrorsPlugin, LoaderOptionsPlugin } from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const SRC_PATH = './src';
const ENTRY_NAME = 'index.ts';

const getEntries = () => {
  const targets = sync(`${SRC_PATH}/**/${ENTRY_NAME}`);
  const entries: { [key: string]: string } = {};

  targets.forEach(item => {
    const key = item
      .replace(`${SRC_PATH}/`, '')
      .replace(/\//g, '_')
      .replace(`_${ENTRY_NAME}`, '/index');

    entries[key] = item;
  });

  return entries;
};

const configs: Configuration = {
  target: 'node',
  entry: getEntries(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@utils': path.resolve(__dirname, '../src/Z0'),
      '@typings': path.resolve(__dirname, '../typings'),
    },
  },
  externals: ['aws-sdk'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new LoaderOptionsPlugin({
      debug: false,
    }),
    new CleanWebpackPlugin(),
  ],
  bail: true,
};

export default configs;

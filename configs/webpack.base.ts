import { sync } from "glob";
import * as path from "path";
import {
  Configuration,
  NoEmitOnErrorsPlugin,
  LoaderOptionsPlugin
} from "webpack";
import * as ZipPlugin from "zip-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";

// const CopyWebpackPlugin = require("copy-webpack-plugin");

const SRC_PATH = "./src";
const ENTRY_NAME = "index.ts";

const getEntries = () => {
  const targets = sync(`${SRC_PATH}/**/${ENTRY_NAME}`);
  const entries: { [key: string]: string } = {};

  targets.forEach(item => {
    const key = item.replace(`${SRC_PATH}/`, "").replace(ENTRY_NAME, "index");

    entries[key] = item;
  });

  return entries;
};

const configs: Configuration = {
  target: "node",
  entry: getEntries(),
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../build"),
    publicPath: "/",
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  externals: ["aws-sdk"],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new LoaderOptionsPlugin({
      debug: false
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: "appspec.yml",
    //     to: "."
    //   }
    // ]),
    new ZipPlugin({
      // OPTIONAL: defaults to the Webpack output path (above)
      // can be relative (to Webpack output path) or absolute
      // path: 'zip',
      // OPTIONAL: defaults to the Webpack output filename (above) or,
      // if not present, the basename of the path
      // filename: "index.zip",
      // OPTIONAL: defaults to 'zip'
      // the file extension to use instead of 'zip'
      // extension: 'ext',
      // OPTIONAL: defaults to the empty string
      // the prefix for the files included in the zip file
      // pathPrefix: 'relative/path',
      // OPTIONAL: defaults to the identity function
      // a function mapping asset paths to new paths
      // pathMapper: function (assetPath) {
      //   // put all pngs in an `images` subdir
      //   if (assetPath.endsWith('.png'))
      //     return path.join(path.dirname(assetPath), 'images', path.basename(assetPath));
      //   return assetPath;
      // },
      // OPTIONAL: defaults to including everything
      // can be a string, a RegExp, or an array of strings and RegExps
      // include: [/\.js$/]
      // OPTIONAL: defaults to excluding nothing
      // can be a string, a RegExp, or an array of strings and RegExps
      // if a file matches both include and exclude, exclude takes precedence
      // exclude: [/\.png$/, /\.html$/],
      // yazl Options
      // OPTIONAL: see https://github.com/thejoshwolfe/yazl#addfilerealpath-metadatapath-options
      // fileOptions: {
      //   mtime: new Date(),
      //   mode: 0o100664,
      //   compress: true,
      //   forceZip64Format: false,
      // },
      // OPTIONAL: see https://github.com/thejoshwolfe/yazl#endoptions-finalsizecallback
      // zipOptions: {
      //   forceZip64Format: false,
      // },
    })
  ],
  bail: true
};

export default configs;

/* global module:true, require:true __dirname */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    'parent-demo': ["./src/parent-view.tsx"],
    'client-demo': ["./src/client-view.tsx"],
    'iframe-demo': ["./src/iframe-demo.ts"]
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".webpack.js", ".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: "./tsconfig.json"}
        },
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "src/*.html",  flatten: "true"}
    ])
  ]
};

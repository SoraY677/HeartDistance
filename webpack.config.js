const webpack = require("webpack");
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const fs = require('fs');

module.exports = {
	entry: {
		app: ["./script.js"]
	},
	output: {
    path: path.join(__dirname, 'build'),
		filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: {
        //   presets: ['es2015']
        // }
      }
    ]
  },
  target:"web",
  externals: [nodeExternals()]
};

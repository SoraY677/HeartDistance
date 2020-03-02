const webpack = require("webpack");
const path = require('path');
const fs = require('fs');
const Dotenv = require('dotenv-webpack');

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
        use:{
        loader: 'babel-loader'
        },
        
      }
    ]
  },
  plugins: [
    new Dotenv()
  ],
  target:"node"
};

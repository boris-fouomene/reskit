// webpack.config.js
const path = require('path');
const { TamaguiPlugin } = require('tamagui-loader')
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for production builds
  entry: './App.tsx', // Adjust the entry point as necessary
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json','.web.tsx',
  '.web.ts',
  '.web.js',
  '.ts',
  '.tsx',
  '.js',],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader', // Use ts-loader for TypeScript files
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'], // For CSS files
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource', // For image files
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Use 'static' instead of 'contentBase'
    },
    compress: true,
    port: 3000, // Change to your preferred port
    historyApiFallback: true,
  },
  plugins : [
    new webpack.DefinePlugin({
      process: {
        env: {
          DEV: process.env.NODE_ENV === 'development' ? 'true' : 'false',
          //NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your HTML template
    }),
  ]
};

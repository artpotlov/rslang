const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV,
  devtool: isDevMode && 'inline-source-map',
  devServer: {
    port: 5000,
  },
  module: {
    rules: [
      {
        test: /.(hbs|handlebars)$/i,
        use: 'handlebars-loader',
      },
      {
        test: /.s?css$/i,
        use: [
          isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,  
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ].concat(isDevMode ? [new ESLintWebpackPlugin()] : [new MiniCssExtractPlugin()]),
};

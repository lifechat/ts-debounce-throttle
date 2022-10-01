const path = require('path')

module.exports = {
  mode: 'production',
  entry: ['./src/index'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: `ts-debounce-throttle.min.js`,
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', 'jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  optimization: {
    nodeEnv: 'production',
  },
}

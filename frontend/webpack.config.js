const path = require('path');

module.exports = {
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      loader: 'style!css'
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015']
      }
    }, {
      test: /\.(woff|woff2)$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf$/,
      loader: "file-loader"
    }, {
      test: /\.eot$/,
      loader: "file-loader"
    }, {
      test: /\.svg$/,
      loader: "file-loader"
    }, {
      test: /\/bootstrap\/js\//,
      loader: 'imports?jQuery=jquery'
    }]
  },
  devServer: {
    contentBase: __dirname,
    port: 3000,
    inline: true,
    historyApiFallback: true,
    stats: {
      colors: true
    },
    /*hot: true,
    proxy: {
      '*': 'http://127.0.0.1:3001',
    }*/
  },
};

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ChunkManifestPlugin = require('webpack-chunk-manifest-plugin');

const extractSass = new ExtractTextPlugin("public/style.css");

module.exports = {
  entry: {
    main: "./client/js/index.js",
    
  },
  output: {
    filename: 'public/client.js'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                // use style-loader in development
                fallback: "style-loader"
            })
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'env', 'react', 'stage-3'],
            plugins: ["transform-class-properties"]
          }
        }
      }
    ],
    loaders: [
        { test: /\.json$/, loader: 'json-loader' }
      ]
  },
  plugins: [
    //new ExtractTextPlugin({filename: "./css/style.css", allChunks: true}),
    extractSass,
    new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        inlineManifest: true,
        manifestVariable: 'webpackManifest'
      }),
       new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        // In case you imported plugins individually, you must also require them here:
        Util: "exports-loader?Util!bootstrap/js/dist/util",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown"
      }),
      new webpack.optimize.UglifyJsPlugin()
        ]
};

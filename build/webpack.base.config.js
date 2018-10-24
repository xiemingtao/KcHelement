const path = require('path')
const os = require('os')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HappyPack = require('happypack')
var happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
})

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  entry: {
    main: '@/main.js',
    'vender-base': '@/vendors/vendors.base.js',
    'vender-exten': '@/vendors/vendors.exten.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist/static')
    // path: path.resolve(__dirname, '../dist/dist')
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            css: 'vue-style-loader!css-loader',
            less: 'vue-style-loader!css-loader!less-loader'
          },
          postLoaders: {
            html: 'babel-loader'
          }
        }
      },
      {
        test: /iview\/.*?js$/,
        loader: 'happypack/loader?id=happybabel',
        exclude: /node_modules/,
        // include: [ resolve('node_modules/vue-calendar-component/lib/calendar.js')],
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happybabel',
        // include: [resolve('node_modules/vue-calendar-component/lib/calendar.js')],
        exclude: /node_modules/
      },
      {
        test: /\.js[x]?$/,
        include: [resolve('src'), resolve('test'), resolve('node_modules/vue-calendar-component/lib/calendar.js')],
        exclude: /node_modules/,
        loader: 'happypack/loader?id=happybabel'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'autoprefixer-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=1024'
      },
      {
        test: /\.(html|tpl)$/,
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'happybabel',
      loaders: [{
        loader: 'babel-loader?cacheDirectory=true',
      }],
      threadPool: happyThreadPool,
      verbose: true
    })
  ],
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm.js',
      '@': resolve('../src'),
      api: resolve('../src/api')
    }
  },
  externals: {
    IMAP: 'IMAP'
  }
}
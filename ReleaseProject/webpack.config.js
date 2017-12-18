var path = require('path');
var webpack = require('webpack');
var values = require('postcss-modules-values');
var CompressionWebpackPlugin = require('compression-webpack-plugin');
// CleanWebpackPlugin
var NODE_DIR = path.resolve(__dirname, 'node_modules');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin"); // 提取公共模块
var CleanWebpackPlugin = require('clean-webpack-plugin');
var babelrc = {
    "presets": [
        "react",
        ["es2015", {loose: true}]
    ],
};
var myConfig =  {dev:false};
    //webpack sourcemap 打包模式
    devtool = false;
    entry = {
        spa:[
            'console-polyfill',
            'es5-shim',
            'es5-shim/es5-sham',
            './../react_page/index.js',
        ],
    };

    plugins = [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),

        new webpack.optimize.UglifyJsPlugin({
            output: {
                comments: false,  // remove all comments
            },
            compress: {
                warnings: false
            }
        }),
        new CleanWebpackPlugin(['project'],
            {
                root:path.join(__dirname, '../public'),//一个根的绝对路径.
                verbose: true,
                dry: false,
                exclude: []////排除不删除的目录，主要用于避免删除公用的文件
            }),
        //在 plugin 中添加
        new CompressionWebpackPlugin({ //gzip 压缩
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(js|css)$'    //压缩 js 与 css
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    ];

var jsLoader = 'babel-loader?'+JSON.stringify(babelrc).trim();
console.log("资源打包中:"+(myConfig.dev?"开发":"生产")+"模式");


module.exports = {
    // or devtool: 'eval' to debug issues with compiled output:
    // cheap-module-eval-source-map
    devtool: devtool,
    entry: entry,
    output: {
        path: path.join(__dirname, '../public/project'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        //加这个！
        chunkFilename: '[name].[chunkhash:5].chunk.js',
        publicPath: '/project/'
    },
    plugins: plugins,
    postcss: [
    values
],
    module: {
        loaders: [

            {
                test: /\.js$/,
                exclude: /node_modules/,

                loader: jsLoader,
                include: path.join(__dirname, '../react_page')
            },


            {
                test: /\.css/,
                loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!'
            },
            {
                test: /^(?!.*?(\\|\/)react_page(\\|\/)).*less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /(.*?(\\|\/)react_page(\\|\/)).*less$/,
                loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!less-loader'
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader?limit=1&name=img/[hash:8].[name].[ext]'
            },
        ]

    }
};

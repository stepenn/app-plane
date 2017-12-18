var path = require('path');
var webpack = require('webpack');
var values = require('postcss-modules-values');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var babelrc = {
	presets: [
		"react",
		["es2015", {loose: true}]
	],
};
devtool = "cheap-module-eval-source-map";
entry = {
	main:[
		// necessary for hot reloading with IE:
		'eventsource-polyfill',
		// listen to code updates emitted by hot middleware:
		'webpack-hot-middleware/client',
		// your code:
		'./react_page/index.js'
	],
};
plugins = [
	new webpack.HotModuleReplacementPlugin(),

	// NoErrorsPlugin is deprecated
	// new webpack.NoErrorsPlugin(),
	new CleanWebpackPlugin(['project'],
		{
			root:path.join(__dirname, './public'),//一个根的绝对路径.
			verbose: true,
			dry: false,
			exclude: []////排除不删除的目录，主要用于避免删除公用的文件
		}),
	
	// below options for webpack >= 2
	new webpack.LoaderOptionsPlugin({
		options: {
			context:__dirname,
			postcss:[values]
		}
	}),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.optimize.ModuleConcatenationPlugin(),
]
babelrc["env"] = {
	"development": {
		"presets": [
			"react-hmre"
		]
	}
};


// var jsLoader = 'babel-loader?'+JSON.stringify(babelrc).trim();
console.log("资源打包中:开发模式");
module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	// cheap-module-eval-source-map
	devtool: devtool,
	entry: entry,
	output: {
		path: path.join(__dirname, 'public/project'),
		filename: 'spa.js',
		publicPath: '/project/'
	},
	plugins: plugins,

	/* in webpack >=2, custom loader options is
	* no longer support in configuration moved to new webpack.LoaderOptionsPlugin()*/
	// postcss: [values],
	resolve: {
		extensions:['.js','.css','.less']
	},
	module: {
		/*loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,

				loader: jsLoader,
				include: path.join(__dirname, './react_page')
			},


			{
				test: /\.css/,
				loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!'
			},

			{
				test: /(.*?(\\|\/)react_page(\\|\/)).*less$/,
				loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]!less-loader'
			},
			// {
			//     test: /\.(png|jpg|gif|webp)$/,
			//     loader: 'url-loader?limit=1&name=img/[hash:8].[name].[ext]'
			// },
		]*/
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: babelrc["presets"],
					env: babelrc["env"]
				}
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							localIdentName: '[path][name]---[local]---[hash:base64:5]'
						}
					},
				]
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						options: {
							modules: true,
							localIdentName: '[path][name]---[local]---[hash:base64:5]',
						}
					},
					{
						loader: "less-loader",
						options: {
						}
					}
				]
			}
		]
	}
};
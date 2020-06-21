const HtmlWebPackPlugin = require("html-webpack-plugin");
var nodeExternals = require('webpack-node-externals');
const path = require('path')

module.exports = [

	{
		"mode": "production",
		entry: {
			server: './app/server.js',
		},
		output: {
			path: path.resolve(__dirname, 'dist/backend')
		},
		target: 'node',
		node: {
			__dirname: false
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					loader: 'shebang-loader'
				}
			]
		},
		//,externals: [nodeExternals()]
		externals: { uws: "uws", emitter: "emitter", "browser-sync/lib/server/utils": "browser-sync/lib/server/utils" }
	},
	{
		"mode": "production",
		entry: {
			main: './web/js/main.jsx',
		},
		output: {
			path: path.resolve(__dirname, 'dist/frontend')
		},
		devtool: false,
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: "babel-loader"
				}, {
					test: /\.css$/,
					loader: [
						'style-loader',
						'css-loader',
					]
				},
				{
					test: /\.html$/,
					loader: "html-loader"
				}
			]
		},
		plugins: [
			new HtmlWebPackPlugin({
				template: "./web/index.html",
				filename: "./index.html"
			})
		]
	}
];
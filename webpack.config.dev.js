const HtmlWebPackPlugin = require("html-webpack-plugin");
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path')

module.exports =
{
	"mode": "development",
	entry: {
		main: './web/js/main.jsx',
	},
	output: {
		path: path.resolve(__dirname, 'dist/frontend')
	},
	devtool: "inline-source-map",
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,

				// https://github.com/webpack/webpack/issues/11467
				resolve: {
					fullySpecified: false
				},

				//exclude: path.resolve(__dirname, "node_modules"),
				use: ["babel-loader"]
			}, {
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
				]
			},
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			{
				test: /\.svg$/,
				loader: "@svgr/webpack"
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./web/index.html",
			filename: "./index.html"
		}),
		new NodemonPlugin({
			nodeArgs: ["--trace-warnings"],
			watch: './app',
			verbose: true,
			script: './app/server.js',
			args: ['--verbose', '--mode', 'development']
		})
	]
};
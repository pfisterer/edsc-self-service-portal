const HtmlWebPackPlugin = require("html-webpack-plugin");
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
					use: 'babel-loader',
					// https://github.com/webpack/webpack/issues/11467
					resolve: {
						fullySpecified: false
					},
					exclude: path.resolve(__dirname, 'node_modules')
				}
			]
		},
		externals: { uws: "uws", emitter: "emitter", "browser-sync": "browser-sync" }
	},
	{
		"mode": "production",
		entry: {
			main: './web/js/main.jsx',
		},
		output: {
			path: path.resolve(__dirname, 'dist/frontend')
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					// https://github.com/webpack/webpack/issues/11467
					resolve: {
						fullySpecified: false
					},
					use: "babel-loader",
				},
				{
					test: /\.css$/,
					use: [
						'style-loader',
						'css-loader',
					],
				},
				{
					test: /\.html$/,
					use: "html-loader",
				},
				{
					test: /\.svg$/,
					use: "@svgr/webpack",
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

// webpack.config.js
const webpack = require('webpack');
const path    = require('path');
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;

const rootDir = __dirname;

module.exports = {

	devtool: 'source-map',

	entry: {
		chat: [ path.resolve(rootDir, 'Angular', 'main')],
		vendor: [ path.resolve(rootDir, 'Angular', 'vendor')]
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(rootDir, 'public', 'bundle')
	},
	module: {
		loaders: [
		{
			test: /\.ts$/,
			loader: 'ts-loader!angular2-template-loader',
			exclude: /node_modules/
		}
		,{
			test: /\.js$/,
			loader: 'babel-loader',
			query: {
				presets: ['es2015']
			}
		},
		{
			test: /\.json$/,
			loader: 'json-loader'
		},
		{
			loader: 'raw-loader',
			test: /\.(css|html)$/,
			include: [
				path.resolve(rootDir, 'Angular', 'Component')
			]
		},
		{
			test: /\.css$/,
			loader: 'style-loader!css-loader',
			exclude: [
				path.resolve(rootDir, 'Angular', 'Component')
			]
		},
		{
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file?name=public/bundle/fonts/[name].[ext]'
		}]
	},
	plugins: [
		new ChunkWebpack({
			filename: 'vendor.bundle.js',
			name: 'vendor'
		})
	],
	resolve: {
		extensions: ['.js', '.ts']
	}
};

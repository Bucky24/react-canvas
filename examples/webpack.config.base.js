var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (dirname) => {
	return {
		mode: "development",
		entry: path.resolve(dirname, './index.js'),
		output: {
			path: path.resolve(dirname, 'build'),
			filename: 'main.bundle.js'
		},
		resolve: {
			alias: {
				'react-canvas': path.resolve(dirname, '../../src/index.js')
			}
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								require.resolve('@babel/preset-env'),
								'@babel/preset-react'
							],
							plugins: [
                                "@babel/plugin-proposal-class-properties",
                                ["@babel/transform-runtime", {
                                  "helpers": false,
                                  "regenerator": true,
                                }],
                            ],
						},
					},
				},
				{
					test: /\.css$/,
					loader: 'style-loader'
				},
				{
					test: /\.css$/,
					loader: 'css-loader',
                    options: {
                        modules: {
                            localIdentName: "[path][name]__[local]--[hash:base64:5]",
                        },
                    },
				},
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: {
                        loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                        options: {
                            loader: 'image-webpack-loader',
                            options: {
                                optipng: {
                                    optimizationLevel: 4,
                                }
                            }
                        }
                    }
                }
			]
		},
		stats: {
			colors: true
		},
		devtool: 'source-map',
		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(dirname, 'index.tmpl.html')
			})
		]
	};
};

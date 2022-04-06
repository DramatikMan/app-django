const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path');


module.exports = (env) => {
    const config = {
        entry: path.resolve(__dirname, './dist/index.js'),
        module: {
            rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }],
        },
        output: {
            path: path.resolve(__dirname, './dist'),
            filename: env.production ? '[name].[contenthash].js' : '[name].js',
            clean: env.production
        },
        plugins: [
            new HtmlWebpackPlugin({template: 'src/index.html'})
        ]
    }

    if (env.production) {
        config.optimization = {
            minimize: true,
            splitChunks: {chunks: 'all'}
        }
    }

    return config;
}

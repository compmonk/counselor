const path = require("path");

module.exports = {
    entry: './src/components/index.js',
    output: {
        path: path.resolve('./public/js'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
};
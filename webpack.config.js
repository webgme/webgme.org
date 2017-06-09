const webpack = require('webpack'),
    path = require('path');

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: {
        main: [
            './src/client/main.js'
            ]
        },
    output: {
        path: path.join(__dirname, '/public/') ,
        filename: '[name].js',
        chunkFilename: "[id].js",
        sourceMapFilename: "[name].map"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, use: [
                { loader: "babel-loader",
                    options: {
                        minified: [true],
                        compact: [true],
                        sourceMaps: ['inline'],
                        "presets": [
                          "es2015"
                        ]
                    }
                 }
            ]},
            // required to write "require('./style.scss')"
            { test: /\.scss$/, use: [
                { loader: "style-loader" },
                { loader: "css-loader" },
                { loader: "sass-loader" }
            ]},
            { test: /\.css$/,  use: [
                { loader: "style-loader" },
                { loader: "css-loader" }
            ]}
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     filename: "vendor.js"
        // }),
    ]
};

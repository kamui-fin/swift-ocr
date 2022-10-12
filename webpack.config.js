const webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin,
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    WriteFilePlugin = require("write-file-webpack-plugin");

// load the secrets
let alias = {};

const secretsPath = path.join(__dirname, "secrets." + env.NODE_ENV + ".js");

const fileExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "eot",
    "otf",
    "svg",
    "ttf",
    "woff",
    "woff2",
];

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

let options = {
    mode: process.env.NODE_ENV || "development",
    entry: {
        popup: path.join(__dirname, "src", "js", "popup.js"),
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
                exclude: /node_modules/,
            },
            {
                test: new RegExp(".(" + fileExtensions.join("|") + ")$"),
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "name=[name].[ext]",
                        },
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: alias,
    },
    plugins: [
        // clean the build folder
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
        new CopyWebpackPlugin(
            {
                patterns: [
                {
                    from: "src/manifest.json",
                    transform: function (content, path) {
                        // generates the manifest file using the package.json informations
                        return Buffer.from(
                            JSON.stringify({
                                description: process.env.npm_package_description,
                                version: process.env.npm_package_version,
                                ...JSON.parse(content.toString()),
                            })
                        );
                    },
                }
                ]
            }
        ),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            filename: "popup.html",
            chunks: ["popup"],
        }),
        new WriteFilePlugin(),
    ],
};

if (env.NODE_ENV === "development") {
    options.devtool = "eval-source-map";
}

module.exports = options;

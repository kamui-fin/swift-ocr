const WebpackDevServer = require("webpack-dev-server"),
    webpack = require("webpack"),
    config = require("../webpack.config"),
    env = require("./env"),
    path = require("path");

var options = config.chromeExtensionBoilerplate || {};
var excludeEntriesToHotReload = options.notHotReload || [];

for (var entryName in config.entry) {
    if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
        config.entry[entryName] = [
            "webpack-dev-server/client?http://localhost:" + env.PORT,
            "webpack/hot/dev-server",
        ].concat(config.entry[entryName]);
    }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(
    config.plugins || []
);

delete config.chromeExtensionBoilerplate;

var compiler = webpack(config);

var server = new WebpackDevServer(
    {
        hot: true,
        static: {
            directory: path.join(__dirname, "../build"),
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        devMiddleware: {
            writeToDisk: true
        } 
    },
    compiler
);

server.listen(env.PORT);

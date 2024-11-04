const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    stream: path.resolve(__dirname, "node_modules/stream-browserify"),
    buffer: path.resolve(__dirname, "node_modules/buffer"),
    util: path.resolve(__dirname, "node_modules/util"),
    assert: path.resolve(__dirname, "node_modules/assert"),
    crypto: path.resolve(__dirname, "node_modules/crypto-browserify"),
    http: path.resolve(__dirname, "node_modules/stream-http"),
    https: path.resolve(__dirname, "node_modules/https-browserify"),
    os: path.resolve(__dirname, "node_modules/os-browserify/browser"),
    url: path.resolve(__dirname, "node_modules/url"),
  })
);

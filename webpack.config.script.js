"use strict";
import path from "path";
import { fileURLToPath } from "url";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default (env, argv) => {
  const config = {
    entry: {
      main: "./src/js/main.js",
    },
    output: {
      path: `${__dirname}/docs`,
      filename: "[name].js",
    },
    resolve: {
      extensions: [".js", ".webpack.js", ".web.js", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.scss/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                url: false,
                importLoaders: 2,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sassOptions: {
                  includePaths: ["node_modules/purecss/build"],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({}),
      new HtmlWebpackPlugin({
        inject: true,
        filename: "index.html",
        template: "src/index.html",
        chunks: ["main"],
      }),
    ],
  };
  if (argv.mode !== "production") {
    config.devtool = "inline-source-map";
  }

  return config;
};

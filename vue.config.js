module.exports = {
  publicPath: "/",
  devServer: {
    compress: true,
    hot: true,
    open: false,
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081/",
        changeOrigin: true,
        pathRewrite: { "^/api/": "" },
      },
    },
  },
};

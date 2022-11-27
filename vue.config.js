module.exports = {
  devServer: {
    open: false,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8081/",
        changeOrigin: true,
        pathRewrite: { "^/api/": "" },
      },
    },
  },
};

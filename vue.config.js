module.exports = {
  chainWebpack: config => {
    config.module
          .rule('svg')
          .use('file-loader')
          .loader('vue-svg-loader')
  }
}
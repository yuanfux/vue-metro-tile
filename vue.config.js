module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/vue-metro-tile/' : '/',
  chainWebpack: config => {
    config.module
          .rule('svg')
          .use('file-loader')
          .loader('vue-svg-loader')
  }
}
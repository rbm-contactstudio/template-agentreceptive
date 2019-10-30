var pathRelative = __dirname.split('/');
var appName = pathRelative[pathRelative.length-1];

module.exports = {
  configureWebpack: {
    devServer: {
      proxy: {
        '^/csapi': {
          target: 'http://172.20.1.196/'
        },
        '^/apps/FrontEnd/images': {
          target: 'http://172.20.1.196/'
        },
        '^/resources': {
          target: 'http://172.20.1.196/'
        },
        '^/dist': {
          target: 'http://172.20.1.196/'
        }
      }
    }
  },
  filenameHashing: false,
  productionSourceMap: false,
  outputDir: process.env.NODE_ENV === 'production'
    ? 'dist/'+appName+'/'
    : 'dist/',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/dist/'+appName+'/'
    : '/'
};


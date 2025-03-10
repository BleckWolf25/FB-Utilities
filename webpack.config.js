module.exports = {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'postcss-loader'],
        },
        {
          test: /\.jsx?$/,
          use: ['babel-loader'],
        },
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader', options: { inline: 'no-fallback' } }
        }
      ]
    }
  }
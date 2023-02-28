module.exports = {
  images: {
    unoptimized: true
},
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: [{ loader: '@svgr/webpack', options: { icon: true } }],
    });
    return config;
  },
};

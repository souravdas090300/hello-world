module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Add any JavaScript-specific plugins here if needed
    ],
  };
};

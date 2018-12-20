const { injectBabelPlugin } = require('react-app-rewired');

module.exports = function override(config, env) {
  config = injectBabelPlugin(
    [
      'import',
      { libraryName: 'antd', libraryDirectory: 'es', style: 'css' },
      'antd',
    ],
    config,
  );
  config = injectBabelPlugin(
    [
      'import',
      {
        libraryName: 'ant-design-pro',
        libraryDirectory: 'lib',
        style: true,
        camel2DashComponentName: false,
      },
      'ant-design-pro',
    ],
    config,
  );
  return config;
};

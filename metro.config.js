const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  ...defaultConfig,
  watchFolders: [__dirname],
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // SVG 파일 지원 설정 추가
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'), // SVG 파일 제외
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'], // SVG를 소스 확장자로 추가
  },
  server: {
    enhanceMiddleware: (middleware) => {
      const enhanced = (req, res, next) => {
        req.setTimeout(0); // Disable request timeout
        middleware(req, res, next);
      };
      return enhanced;
    },
  },
};


module.exports = mergeConfig(defaultConfig, config);


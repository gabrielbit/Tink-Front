const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Añadir configuración para asegurar que se utilice el tipo MIME correcto
defaultConfig.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];
defaultConfig.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Configuración MIME explícita
defaultConfig.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true,
  },
};

module.exports = defaultConfig; 
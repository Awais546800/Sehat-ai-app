const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ADD THIS SPECIFIC LINE BELOW:
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
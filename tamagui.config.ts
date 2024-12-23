/* eslint-disable @typescript-eslint/no-empty-object-type */
import { config as tamaguiDefaultConfig } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

// Modify the light theme's background
const modifiedLightTheme = {
  ...tamaguiDefaultConfig.themes.light, // Clone the default light theme
  background: '#ffffff', // Set the background to white
  onPressStyle: "#D9D9D9"
};

const modifiedDarkTheme = {
  ...tamaguiDefaultConfig.themes.dark, // Clone the default light theme
  onPressStyle: "#333333"
};

// Extend the existing themes with the modified light theme
const extendedThemes = {
  ...tamaguiDefaultConfig.themes,
  light: modifiedLightTheme, // Replace the light theme with the modified version
  dark: modifiedDarkTheme
};


// Create the updated Tamagui configuration
const appConfig = createTamagui({
  ...tamaguiDefaultConfig,
  themes: extendedThemes, // Use the updated themes
});

export type AppConfig = typeof appConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default appConfig;

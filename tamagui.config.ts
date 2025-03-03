/* eslint-disable @typescript-eslint/no-empty-object-type */
import { config as tamaguiDefaultConfig } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';

// Modify the light theme's background
const modifiedLightTheme = {
  ...tamaguiDefaultConfig.themes.light, // Clone the default light theme
  background: '#ffffff', // Set the background to whiter
  onPressStyle: "#D9D9D9",
  danger: "#e00b19",
  linkBlue: "#007aff",
  section: "#f3f3f3",
  calendarSelectedRange: "#f3f3f3",
  calendarSelected: "rgb(220, 219, 219)",
  overlay: "rgba(243, 242, 246, 0.9)",
  tameOverlay: "rgba(243, 242, 246, 0.6)",
  orangeRed: "#fc2803",
  accent: "#4e149c",
  secondaryAccent: "#7a26eb",
  tertiaryAccent: "#8d3afc",
};

const modifiedDarkTheme = {
  ...tamaguiDefaultConfig.themes.dark, // Clone the default light theme
  onPressStyle: "#333333",
  danger: "#ab0c16",
  linkBlue: "#007aff",
  background: '#000000', // Set the background to black
  section: "#1c1c1e",
  calendarSelectedRange: "rgba(64, 64, 64,0.9)",
  calendarSelected: "rgb(64, 64, 64)",
  overlay: "rgba(0, 0, 0, 0.8)",
  tameOverlay: "rgba(0, 0, 0, 0.5)",
  orangeRed: "#fc2803",
  accent: "#330670",
  secondaryAccent: "#4e149c",
  tertiaryAccent: "#8d3afc",
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

import Lara from '@primeuix/themes/lara';
import { definePreset } from '@primeuix/themes';

export const MyPreset = definePreset(Lara, {
  primitive: {
    primary: {
      50: '#ffe5e5',
      100: '#ffc6c6',
      200: '#ffa3a3',
      300: '#ff7f7f',
      400: '#ff5c5c',
      500: '#f76c6c',
      600: '#e65b5b',
      700: '#cc4c4c',
      800: '#b03d3d',
      900: '#993333',
      950: '#7a2727'
    },
    secondary: {
      50: '#e6e8f5',
      100: '#c8cee9',
      200: '#a8b3dd',
      300: '#8698d1',
      400: '#657cc5',
      500: '#374785',
      600: '#2f3b6d',
      700: '#273256',
      800: '#1f2740',
      900: '#171c29',
      950: '#0f1220'
    },
    surface: {
      50: '#d3e8f6',
      100: '#a8d0e6',
      200: '#7fb7d5',
      300: '#569ec4',
      400: '#2d86b3',
      500: '#2d86b4',
      600: '#246c99',
      700: '#1c5478',
      800: '#143c57',
      900: '#0c2436',
      950: '#06121b'
    },
    onsurface: {
      500: '#374785',
      700: '#273256'
    }
  },
  semantic: {
    primary: '{primary}',
    secondary: '{secondary}',
    surface: '{surface}',
    onSurface: '{onsurface}',
    background: '{surface}'
  }
});

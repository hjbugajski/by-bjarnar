import { type TailwindConfig, pixelBasedPreset } from 'react-email';
import defaultTheme from 'tailwindcss/defaultTheme';

export const tailwindEmailConfig: TailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    fontFamily: {
      sans: ['Instrument Sans', 'sans-serif', ...defaultTheme.fontFamily.sans],
    },
  },
};

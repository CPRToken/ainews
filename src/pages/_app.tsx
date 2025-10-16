import 'src/global.css';
import type { AppProps } from 'next/app';

import ThemeProvider from 'src/theme';
import { LocalizationProvider } from 'src/locales';

import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: 'light',
          themeDirection: 'ltr',
          themeColorPresets: 'default',
        }}
      >
        <ThemeProvider>
          <MotionLazy>

            <SettingsDrawer />
            <Component {...pageProps} />
          </MotionLazy>
        </ThemeProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}

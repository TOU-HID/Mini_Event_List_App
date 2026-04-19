import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {useColorScheme} from 'react-native';
import {MMKV} from 'react-native-mmkv';

const lightColors = {
  background: '#f5f5f5',
  surface: '#ffffff',
  surfaceAlt: '#f9f9f9',
  border: '#dddddd',
  text: '#222222',
  textSecondary: '#555555',
  textMuted: '#888888',
  primary: '#1A73E8',
  primarySoft: '#E8F0FE',
  skeleton: '#e0e0e0',
  success: '#1A73E8',
};

const darkColors = {
  background: '#111316',
  surface: '#1a1d21',
  surfaceAlt: '#242830',
  border: '#303640',
  text: '#f1f3f5',
  textSecondary: '#c9ced6',
  textMuted: '#98a1ad',
  primary: '#62A2FF',
  primarySoft: '#1F3657',
  skeleton: '#2b3038',
  success: '#62A2FF',
};

export type ThemeColors = typeof lightColors;

export interface AppTheme {
  isDark: boolean;
  colors: ThemeColors;
}

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  theme: AppTheme;
}

const THEME_MODE_KEY = 'theme_mode';
const themeStorage = new MMKV({id: 'app-settings'});

const ThemeContext = createContext<ThemeContextValue | null>(null);

const readStoredMode = (): ThemeMode => {
  const stored = themeStorage.getString(THEME_MODE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
};

export const getTheme = (isDark: boolean): AppTheme => ({
  isDark,
  colors: isDark ? darkColors : lightColors,
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const systemIsDark = useColorScheme() === 'dark';
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);

  const setMode = useCallback((nextMode: ThemeMode) => {
    setModeState(nextMode);
    themeStorage.set(THEME_MODE_KEY, nextMode);
  }, []);

  const toggleMode = useCallback(() => {
    const order: ThemeMode[] = ['system', 'light', 'dark'];
    const index = order.indexOf(mode);
    const nextMode = order[(index + 1) % order.length];
    setMode(nextMode);
  }, [mode, setMode]);

  const isDark = mode === 'system' ? systemIsDark : mode === 'dark';
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  const value = useMemo(
    () => ({mode, setMode, toggleMode, theme}),
    [mode, setMode, toggleMode, theme],
  );

  return React.createElement(ThemeContext.Provider, {value}, children);
};

const useThemeContext = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('Theme hooks must be used inside ThemeProvider');
  }
  return context;
};

export const useAppTheme = (): AppTheme => {
  return useThemeContext().theme;
};

export const useThemeMode = () => {
  const {mode, setMode, toggleMode} = useThemeContext();
  return {mode, setMode, toggleMode};
};

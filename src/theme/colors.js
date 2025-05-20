export const lightColors = {
  primary: '#2E86C1',
  primaryDark: '#1A5276',
  primaryLight: '#5DADE2',
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#333333',
  textSecondary: '#666666',
  border: '#E0E0E0',
  notification: '#E74C3C',
  success: '#28B463',
  error: '#E74C3C',
  warning: '#F39C12',
};

export const darkColors = {
  primary: '#3498DB',
  primaryDark: '#2E86C1',
  primaryLight: '#5DADE2',
  background: '#121212',
  card: '#1E1E1E',
  text: '#ECF0F1',
  textSecondary: '#BDC3C7',
  border: '#424242',
  notification: '#E74C3C',
  success: '#58D68D',
  error: '#E74C3C',
  warning: '#F5B041',
};

export const getThemeColors = (isDark) => isDark ? darkColors : lightColors;
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#102f53',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#145DA0',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e1e1e',
      secondary: '#4a4a4a',
    },
    warning: {
      main: '#f4b400',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;

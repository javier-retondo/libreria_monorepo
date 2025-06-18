import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import theme from './theme.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);

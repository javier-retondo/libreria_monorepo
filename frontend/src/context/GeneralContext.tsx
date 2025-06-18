import { createContext, useState } from 'react';
import type { GeneralContextProps } from '../types/Props';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';

const GeneralContext = createContext<GeneralContextProps>(
  {} as GeneralContextProps,
);

export const GeneralProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [navbarText, setNavbarText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snacks, setSnacks] = useState<
    { index: number; message: string; type: 'error' | 'success' | 'info' }[]
  >([]);

  const alert = (message: string, type: 'error' | 'success' | 'info') => {
    setSnacks((prevSnacks) => [
      ...prevSnacks,
      { index: prevSnacks.length, message, type },
    ]);
    setTimeout(() => {
      setSnacks((prevSnacks) => prevSnacks.slice(1));
    }, 5000);
  };

  return (
    <GeneralContext.Provider
      value={{ navbarText, setNavbarText, alert, setLoading }}
    >
      {snacks.map((snack) => (
        <Snackbar open={true} autoHideDuration={6000} key={snack.index}>
          <Alert
            severity={snack.type}
            variant="filled"
            sx={{
              width: '100%',
              position: 'fixed',
              bottom: 20,
              left: '50%',
              right: '50%',
              transform: 'translateX(50%)',
            }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      ))}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.6)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={80} color="primary" />
        </Box>
      )}
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;

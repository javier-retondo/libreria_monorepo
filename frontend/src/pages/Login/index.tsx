import { ArrowBack } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComp from './components/login';
import RegisterComp from './components/register';
import ForgotPasswordComp from './components/forgotPass';
import ChangePassword from './components/changePassword';

export type loginCases =
  | 'login'
  | 'register'
  | 'forgotPassword'
  | 'changePassword';

export default function AuthPage() {
  const theme = useTheme();
  const [loginCase, setLoginCase] = useState<loginCases>('login');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const renderForm = () => {
    switch (loginCase) {
      case 'login':
        return (
          <LoginComp
            form={form}
            handleChange={handleChange}
            setLoginCase={setLoginCase}
          />
        );
      case 'register':
        return (
          <RegisterComp
            form={form}
            handleChange={handleChange}
            setLoginCase={setLoginCase}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordComp
            form={form}
            handleChange={handleChange}
            setLoginCase={setLoginCase}
          />
        );
      case 'changePassword':
        return <ChangePassword setLoginCase={setLoginCase} />;
      default:
        return null;
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: '#f9f9f9',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 4,
            backgroundColor: '#fff',
          }}
        >
          {renderForm()}
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              <Button
                variant="text"
                onClick={() => navigate(-1)}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                }}
              >
                <ArrowBack sx={{ mr: 1 }} />
                Volver
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

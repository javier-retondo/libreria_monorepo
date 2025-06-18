import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import theme from '../../../theme';
import { loginEP } from '../../../api/Auth';
import type { loginCases } from '..';
import { useContext, useEffect, useState } from 'react';
import LoginContext from '../../../context/LoginContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GeneralContext from '../../../context/GeneralContext';
import { useNavigate } from 'react-router-dom';

type LoginProps = {
  form: {
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoginCase: (caseType: loginCases) => void;
};

const LoginComp = ({ form, handleChange, setLoginCase }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, logout } = useContext(LoginContext);
  const { alert, setLoading } = useContext(GeneralContext);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginEP(form.email, form.password)
      .then((response) => {
        const { token, user } = response;
        login(user, token);
        if (user.pass_provisional) {
          alert('Por favor, cambie su contraseña temporal.', 'success');
          setLoginCase('changePassword');
        } else {
          alert('Inicio de sesión exitoso.', 'success');
          if (user.rol === 'administrador') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }
      })
      .catch((error) => {
        alert(
          error?.message ||
            'Error al iniciar sesión. Por favor, intente nuevamente.',
          'error',
        );
        console.error('Error al iniciar sesión:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    logout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Iniciar Sesión
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Correo electrónico"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Contraseña"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1 }}
        >
          Iniciar Sesión
        </Button>
      </form>

      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          ¿No tenés cuenta?{' '}
          <Button
            variant="text"
            onClick={() => setLoginCase('register')}
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
            }}
          >
            Registrate
          </Button>
        </Typography>
      </Box>
      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          <Button
            variant="text"
            onClick={() => setLoginCase('forgotPassword')}
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
            }}
          >
            Olvidé mi Contraseña
          </Button>
        </Typography>
      </Box>
    </>
  );
};

export default LoginComp;

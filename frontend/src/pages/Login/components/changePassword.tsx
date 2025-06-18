import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import type { loginCases } from '..';
import { useContext, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import theme from '../../../theme';
import { changePasswordEP } from '../../../api/Auth';
import GeneralContext from '../../../context/GeneralContext';

type ChangePassProps = {
  setLoginCase: (caseType: loginCases) => void;
};

const ChangePassword = ({ setLoginCase }: ChangePassProps) => {
  const [passwords, setPPasswords] = useState<{
    password_1: string;
    password_2: string;
  }>({
    password_1: '',
    password_2: '',
  });
  const [showPassword, setShowPassword] = useState<{
    password_1: boolean;
    password_2: boolean;
  }>({ password_1: false, password_2: false });

  const { alert, setLoading } = useContext(GeneralContext);

  const handleClickShowPassword = (field: 'password_1' | 'password_2') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.password_1 !== passwords.password_2) {
      alert('Las contraseñas no coinciden', 'error');
      return;
    }
    if (!isPasswordSecure(passwords.password_1)) {
      alert(
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.',
        'error',
      );
      return;
    }
    setLoading(true);
    await changePasswordEP(passwords.password_1)
      .then((response) => {
        alert(response.message, 'success');
        setLoginCase('login');
      })
      .catch((error) => {
        console.error('Error al cambiar la contraseña:', error);
        alert(
          'Error al cambiar la contraseña. Inténtalo de nuevo más tarde.',
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // haceme una funcion que compare con un regex si la contraseña es segura
  const isPasswordSecure = (password: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Cambiar Contraseña
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          fullWidth
          label="Nueva Contraseña"
          name="newPassword"
          type={showPassword.password_1 ? 'text' : 'password'}
          autoComplete="new-password"
          value={passwords.password_1}
          onChange={(e) =>
            setPPasswords((prev) => ({
              ...prev,
              password_1: e.target.value,
            }))
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleClickShowPassword('password_1')}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword.password_1 ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="normal"
          fullWidth
          label="Confirmar Nueva Contraseña"
          name="confirmPassword"
          type={showPassword.password_2 ? 'text' : 'password'}
          autoComplete="new-password"
          value={passwords.password_2}
          onChange={(e) =>
            setPPasswords((prev) => ({
              ...prev,
              password_2: e.target.value,
            }))
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleClickShowPassword('password_2')}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword.password_2 ? <Visibility /> : <VisibilityOff />}
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
          Cambiar Contraseña
        </Button>
      </form>
      <Box mt={3} textAlign="center">
        <Typography variant="body2">
          <Button
            variant="text"
            onClick={() => setLoginCase('login')}
            sx={{
              textTransform: 'none',
              color: theme.palette.primary.main,
            }}
          >
            Iniciar Sesión
          </Button>
        </Typography>
      </Box>
    </>
  );
};

export default ChangePassword;

import { Box, Button, TextField, Typography } from '@mui/material';
import theme from '../../../theme';
import type { loginCases } from '..';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import GeneralContext from '../../../context/GeneralContext';
import { resetPasswordEP } from '../../../api/Auth';

type ForgotPasswordProps = {
  form: {
    email: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setLoginCase: (caseType: loginCases) => void;
};

const ForgotPasswordComp = ({
  form,
  handleChange,
  setLoginCase,
}: ForgotPasswordProps) => {
  const navigate = useNavigate();
  const { alert, setLoading } = useContext(GeneralContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await resetPasswordEP(form.email)
      .then((response) => {
        alert(response.message, 'success');
        setLoginCase('login');
        navigate('/login');
      })
      .catch((error) => {
        alert(
          error.response?.data?.message || 'Error al enviar el correo',
          'error',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Recuperar Contraseña
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
          required
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, py: 1 }}
        >
          Enviar Nueva Contraseña
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

export default ForgotPasswordComp;

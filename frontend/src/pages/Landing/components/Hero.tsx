import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        backgroundImage:
          'url(https://images.unsplash.com/photo-1512820790803-83ca734da794)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          top: 0,
          left: 0,
        }}
      />
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            fontSize: { xs: '2rem', md: '3rem' },
            mb: 2,
          }}
        >
          Bienvenido a la Librería Online
        </Typography>

        <Typography
          variant="h6"
          component="p"
          sx={{ mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}
        >
          Descubrí miles de libros para todos los gustos, edades y pasiones.
        </Typography>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/catalogo"
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 500,
            fontSize: '1rem',
            ':hover': {
              color: 'white',
              backgroundColor: '#d32f2f',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease-in-out',
              textDecoration: 'none',
            },
          }}
        >
          Explorar catálogo
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;

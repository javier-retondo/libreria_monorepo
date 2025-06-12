import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ backgroundColor: '#333', color: '#fff', py: 6, mt: 10 }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Tienda de Libros
            </Typography>
            <Typography variant="body2">
              Tu lugar para descubrir y disfrutar de la lectura. Envíos a todo
              el país.
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Navegación
            </Typography>
            <Box>
              <Link href="/" color="inherit" underline="hover" display="block">
                Inicio
              </Link>
              <Link
                href="/catalogo"
                color="inherit"
                underline="hover"
                display="block"
              >
                Catálogo
              </Link>
              <Link
                href="/contacto"
                color="inherit"
                underline="hover"
                display="block"
              >
                Contacto
              </Link>
              <Link
                href="/login"
                color="inherit"
                underline="hover"
                display="block"
              >
                Mi cuenta
              </Link>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" gutterBottom>
              Seguinos
            </Typography>
            <Box>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
              >
                <XIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} Tienda de Libros. Todos los
            derechos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

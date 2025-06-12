import { Box, Container, Typography, Grid, Avatar, Paper } from '@mui/material';

const testimonials = [
  {
    name: 'María Gómez',
    role: 'Lectora apasionada',
    message:
      'La variedad de libros es excelente y los envíos son rapidísimos. ¡Súper recomendada!',
    image: 'https://i.pravatar.cc/150?img=47',
  },
  {
    name: 'Carlos Ruiz',
    role: 'Profesor de Literatura',
    message:
      'Muy buena curaduría de títulos y atención personalizada. Ideal para docentes.',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Lucía Fernández',
    role: 'Estudiante',
    message:
      'Pude encontrar todos los libros para la facultad a muy buen precio. Gracias!',
    image: 'https://i.pravatar.cc/150?img=32',
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ bgcolor: '#f5f5f5', py: 8 }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          Lo que dicen nuestros lectores
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={2}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={3}
                sx={{ p: 4, textAlign: 'center', height: '100%' }}
              >
                <Avatar
                  src={testimonial.image}
                  alt={testimonial.name}
                  sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }}
                />
                <Typography variant="body1" sx={{ mb: 2 }}>
                  "{testimonial.message}"
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {testimonial.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {testimonial.role}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;

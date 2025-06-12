import { Box, Grid, Typography, Paper } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const benefits = [
  {
    title: 'Envíos a todo el país',
    description: 'Recibí tus libros estés donde estés, rápido y seguro.',
    icon: <LocalShippingIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Gran variedad de títulos',
    description: 'Desde clásicos hasta novedades editoriales.',
    icon: <MenuBookIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Atención personalizada',
    description: 'Te ayudamos a elegir el libro perfecto para vos.',
    icon: <SupportAgentIcon fontSize="large" color="primary" />,
  },
];

const Benefits = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h4" align="center" gutterBottom>
        ¿Por qué elegirnos?
      </Typography>
      <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
        {benefits.map((benefit, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>{benefit.icon}</Box>
              <Typography variant="h6">{benefit.title}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {benefit.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Benefits;

import { Box, Typography, Grid } from '@mui/material';
import { BookComponent } from '../../../components/Book';
import books from '../../../api/mock/books.json';

const featuredBooks = books.slice(0, 6);

const FeaturedBooks = () => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Libros Destacados
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {featuredBooks.map((book, key) => (
          <BookComponent
            key={key}
            book={book}
            onClick={(book) => console.log('Agregar al carrito:', book)}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturedBooks;

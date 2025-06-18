import { Box, Typography, Grid } from '@mui/material';
import { BookComponent } from '../../../components/Book';
import { useContext, useEffect, useState } from 'react';
import GeneralContext from '../../../context/GeneralContext';
import { getLibros } from '../../../api/Books';
import type { Book } from '../../../types/Entities';

const FeaturedBooks = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  const { alert, setLoading } = useContext(GeneralContext);

  const handleGetFeaturedBooks = async () => {
    setLoading(true);
    try {
      await getLibros(
        { page: 1, pageSize: 6, sortBy: 'titulo', sortOrder: 'ASC' },
        {},
      ).then((response) => {
        setFeaturedBooks(response.rows);
      });
    } catch (error) {
      alert('Error al obtener los libros destacados', 'error');
      console.error('Error fetching featured books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFeaturedBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

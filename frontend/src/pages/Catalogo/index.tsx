import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { useContext, useState } from 'react';
import books from '../../api/mock/books.json';
import { BookComponent } from '../../components/Book';
import GeneralContext from '../../context/general';
import Pagination from '@mui/material/Pagination';

const Catalog = () => {
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [page, setPage] = useState(1);

  const { search } = useContext(GeneralContext);

  const categories = Array.from(
    new Set(books.flatMap((b) => b.categorias.map((c) => c.nombre))),
  );

  const authors = Array.from(new Set(books.map((b) => b.autor.nombre)));

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.titulo.toLowerCase().includes(search.toLowerCase()) ||
      book.autor.nombre.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category
      ? book.categorias.some((c) => c.nombre === category)
      : true;

    const matchesAuthor = author ? book.autor.nombre === author : true;

    return matchesSearch && matchesCategory && matchesAuthor;
  });

  const booksPerPage = 6;
  const pageCount = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // opcional
  };

  const paginatedBooks = filteredBooks.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage,
  );

  return (
    <Box>
      <Grid container spacing={2} sx={{ mb: 4, p: 3 }}>
        <Typography
          variant="h4"
          mb={3}
          textAlign={'center'}
          width="100%"
          sx={{
            backgroundColor: '#102f53',
            p: 2,
            borderRadius: 2,
            color: 'white',
          }}
        >
          Catálogo de Libros
        </Typography>
      </Grid>
      <Grid container spacing={4}>
        <Grid size={{ xs: 6, md: 4 }}>
          <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 75 }}>
            <Typography variant="h6" mb={2}>
              Filtrar
            </Typography>

            <TextField
              select
              label="Categoría"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="">Todas</MenuItem>
              {categories.map((nombre) => (
                <MenuItem key={nombre} value={nombre}>
                  {nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Autor"
              fullWidth
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            >
              <MenuItem value="">Todos</MenuItem>
              {authors.map((a) => (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, md: 8 }}>
          <Grid container spacing={4}>
            {paginatedBooks.map((book, key) => (
              <Grid key={key} size={{ xs: 12, sm: 6, md: 4 }}>
                <BookComponent book={book} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Box
          mt={4}
          display="flex"
          justifyContent="right"
          width="100%"
          position={'sticky'}
          bottom={0}
          bgcolor="white"
          zIndex={1}
          p={1}
        >
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Grid>
    </Box>
  );
};

export default Catalog;

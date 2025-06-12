import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from '@mui/material';
import type { Book } from '../types';

interface Props {
  book: Book;
  onClick?: (book: Book) => void;
}

export const BookComponent = ({ book, onClick }: Props) => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        transition: '0.2s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        image={book.imagen_url}
        alt={book.titulo}
        sx={{ height: 220, objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {book.titulo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.autor.nombre}
        </Typography>
        <Typography variant="h6" color="primary" mt={1}>
          ${book.precio}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2 }}>
        <Button fullWidth variant="contained" onClick={() => onClick?.(book)}>
          Agregar al carrito
        </Button>
      </CardActions>
    </Card>
  );
};

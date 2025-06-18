import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import type { Book } from '../types/Entities';
import CartContext from '../context/CartContext';
import { useContext } from 'react';
import GeneralContext from '../context/GeneralContext';

interface Props {
  book: Book;
  onClick?: (book: Book) => void;
}

const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

export const BookComponent = ({ book }: Props) => {
  const { cart, addToCart, removeFromCart, setCart } = useContext(CartContext);
  const { alert } = useContext(GeneralContext);

  const cartItem = cart.find((item) => item.book.id === book.id);

  const increment = () => {
    if (cartItem) {
      const updated = cart.map((item) =>
        item.book.id === book.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCart(updated);
      alert(`Se ha agregado ${book.titulo} al carrito`, 'success');
    } else {
      addToCart({ book, quantity: 1 });
      alert(`Se ha agregado ${book.titulo} al carrito`, 'success');
    }
  };

  const decrement = () => {
    if (cartItem && cartItem.quantity > 1) {
      const updated = cart.map((item) =>
        item.book.id === book.id
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      );
      setCart(updated);
      alert(
        `Se ha reducido la cantidad de ${book.titulo} en el carrito`,
        'success',
      );
    } else {
      if (book && book.id) removeFromCart(book.id);
    }
  };

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
        image={apiUrl + book.imagen_url}
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
        {!cartItem ? (
          <Button
            fullWidth
            variant="contained"
            onClick={increment}
            color="primary"
          >
            Agregar al carrito
          </Button>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="100%"
            gap={1}
          >
            <IconButton color="primary" onClick={decrement}>
              <RemoveIcon />
            </IconButton>
            <Typography>{cartItem.quantity}</Typography>
            <IconButton color="primary" onClick={increment}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

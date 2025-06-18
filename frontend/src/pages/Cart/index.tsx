import {
  Box,
  Typography,
  Paper,
  Divider,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LoginContext from '../../context/LoginContext';
import CartContext from '../../context/CartContext';
import GeneralContext from '../../context/GeneralContext';
import { createOrder } from '../../api/Order';

const apiUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001';

const CartPage = () => {
  const [form, setForm] = useState({
    provincia: '',
    direccion: '',
    detalles: '',
  });

  const { cart, setCart, removeFromCart, clearCart } = useContext(CartContext);
  const { isLoggedIn, userRole } = useContext(LoginContext);
  const { setLoading, alert } = useContext(GeneralContext);

  const navigate = useNavigate();

  const updateQuantity = (bookId: number, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) =>
          item.book.id === bookId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0);
    });
  };

  const total = cart.reduce(
    (acc, item) => acc + item.book.precio * item.quantity,
    0,
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!form.provincia || !form.direccion) {
      alert('Completá la provincia y dirección para continuar', 'error');
      return;
    }

    try {
      setLoading(true);
      const items = cart.map((item) => ({
        libro_id: item.book.id,
        cantidad: item.quantity,
        precio: item.book.precio,
      }));

      await createOrder(items, form);
      clearCart();
      alert('Pedido realizado con éxito', 'success');
      navigate('/user/dashboard');
    } catch (e) {
      alert('Error al generar el pedido', 'error');
      console.error('Checkout error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} sx={{ minHeight: '60vh' }}>
      <Typography variant="h4" mb={3}>
        Carrito de Compras
      </Typography>

      {cart.length === 0 ? (
        <Typography variant="body1">El carrito está vacío.</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          {cart.map((item) => (
            <Box
              key={item.book.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={2}
            >
              <Box display="flex" gap={2} alignItems="center">
                <img
                  src={apiUrl + item.book.imagen_url}
                  alt={item.book.titulo}
                  style={{ height: 80, width: 60, objectFit: 'cover' }}
                />
                <Box>
                  <Typography fontWeight={600}>{item.book.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.book.autor.nombre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${item.book.precio} x {item.quantity} = $
                    {(item.book.precio * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => updateQuantity(item.book.id, -1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton onClick={() => updateQuantity(item.book.id, 1)}>
                  <AddIcon />
                </IconButton>
                <Button
                  onClick={() => removeFromCart(item.book.id)}
                  color="error"
                >
                  Quitar
                </Button>
              </Box>
              <Divider sx={{ width: '100%' }} />
            </Box>
          ))}

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Box>
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Datos de Envío
            </Typography>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                required
                name="provincia"
                label="Provincia"
                value={form.provincia}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                required
                name="direccion"
                label="Dirección"
                value={form.direccion}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                name="detalles"
                label="Detalles (opcional)"
                value={form.detalles}
                onChange={handleInputChange}
                fullWidth
                multiline
                minRows={2}
              />
            </Box>
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => clearCart()}>
              Vaciar carrito
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              disabled={!isLoggedIn || userRole !== 'usuario'}
            >
              Finalizar Compra
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CartPage;

import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralContext from '../../context/GeneralContext';
import type { Order } from '../../types/Entities';
import { getOrders } from '../../api/Order';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { alert, setLoading } = useContext(GeneralContext);

  const [pendientes, setPendientes] = useState<Order[]>([]);
  const [libros, setLibros] = useState<Record<string, number>>({});

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const resCompletados = await getOrders(
        { page: 1, pageSize: 50, sortBy: 'fecha', sortOrder: 'DESC' },
        { estado: 'completado' },
      );
      const resPendientes = await getOrders(
        { page: 1, pageSize: 50, sortBy: 'fecha', sortOrder: 'DESC' },
        { estado: 'pendiente' },
      );
      setPendientes(resPendientes.rows);
      const res = resCompletados.rows.concat(resPendientes.rows);
      const comprados: Record<string, number> = {};
      res.forEach((pedido) => {
        pedido.items?.forEach((item) => {
          const key = `Libro ${item.libro_id}`;
          comprados[key] = (comprados[key] || 0) + item.cantidad;
        });
      });
      setLibros(comprados);
    } catch (error: unknown) {
      console.error('Error al obtener pedidos:', error);
      alert(
        'Error al obtener datos del usuario: ' + (error as Error).message,
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Mi Panel
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Bienvenido/a. Aquí podés gestionar tus pedidos y ver tu actividad.
      </Typography>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Accesos Rápidos
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <ShoppingBagIcon fontSize="large" color="primary" />
              <Typography variant="subtitle1" gutterBottom>
                Comprar Libros
              </Typography>
              <Button variant="contained" onClick={() => navigate('/catalogo')}>
                Ir al Catalogo
              </Button>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
              <HistoryIcon fontSize="large" color="primary" />
              <Typography variant="subtitle1" gutterBottom>
                Historial de Pedidos
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/user/orders')}
              >
                Ver Historial
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Pedidos Pendientes
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {pendientes.length === 0 ? (
          <Typography color="text.secondary">
            No tenés pedidos pendientes.
          </Typography>
        ) : (
          <List dense>
            {pendientes.map((p) => (
              <ListItem key={p.id}>
                <PendingActionsIcon
                  fontSize="small"
                  color="warning"
                  sx={{ mr: 1 }}
                />
                <ListItemText
                  primary={`Pedido #${p.id} - ${new Date(
                    p.fecha,
                  ).toLocaleDateString()}`}
                  secondary={`${p.direccion}, ${p.provincia}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Libros Comprados
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {Object.keys(libros).length === 0 ? (
          <Typography color="text.secondary">
            Todavía no compraste libros.
          </Typography>
        ) : (
          <List dense>
            {Object.entries(libros).map(([libro, cantidad]) => (
              <ListItem key={libro}>
                <LibraryBooksIcon fontSize="small" sx={{ mr: 1 }} />
                <ListItemText
                  primary={libro}
                  secondary={`Cantidad: ${cantidad}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}

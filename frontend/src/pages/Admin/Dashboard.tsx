import { Box, Typography, Grid, Paper, Button, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import GeneralContext from '../../context/GeneralContext';
import type { JSX } from '@emotion/react/jsx-runtime';
import { getLibros } from '../../api/Books';
import { getOrders } from '../../api/Order';
import { getUsers } from '../../api/User';

const MetricCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
}) => (
  <Paper
    elevation={3}
    sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}
  >
    {icon}
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h6">{value}</Typography>
    </Box>
  </Paper>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { alert, setLoading } = useContext(GeneralContext);

  const [pedidosHoy, setPedidosHoy] = useState(0);
  const [librosActivos, setLibrosActivos] = useState(0);
  const [usuarios, setUsuarios] = useState(0);
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);

        const [pedidosHoyData, librosData, usuariosData, pendientesData] =
          await Promise.all([
            getOrders(
              {
                page: 1,
                pageSize: 1000,
                sortBy: 'fecha',
                sortOrder: 'DESC',
              },
              { date: new Date() },
            ),
            getLibros(
              {
                page: 1,
                pageSize: 10000,
                sortBy: 'id',
                sortOrder: 'DESC',
              },
              {},
            ),
            getUsers(
              {
                page: 1,
                pageSize: 1000,
                sortBy: 'id',
                sortOrder: 'DESC',
              },
              {},
            ),
            getOrders(
              {
                page: 1,
                pageSize: 10000,
                sortBy: 'fecha',
                sortOrder: 'DESC',
              },
              { estado: 'pendiente' },
            ),
          ]);

        setPedidosHoy(pedidosHoyData.pagination.totalCount);
        setLibrosActivos(librosData.pagination.totalCount);
        setUsuarios(usuariosData.pagination.totalCount);
        setPedidosPendientes(pendientesData.pagination.totalCount);
      } catch (error) {
        alert('Error al cargar métricas', 'error');
        console.error('Dashboard Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metrics = [
    {
      title: 'Pedidos hoy',
      value: pedidosHoy,
      icon: <ShoppingCartIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Libros activos',
      value: librosActivos,
      icon: <MenuBookIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Usuarios registrados',
      value: usuarios,
      icon: <GroupIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Pedidos pendientes',
      value: pedidosPendientes,
      icon: <LocalShippingIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard Administrativo
      </Typography>

      <Grid container spacing={2}>
        {metrics.map((m, idx) => (
          <Grid size={{ sm: 6, md: 3 }} key={idx}>
            <MetricCard {...m} />
          </Grid>
        ))}
      </Grid>

      <Box mt={5}>
        <Typography variant="h6" gutterBottom>
          Accesos Rápidos
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/admin/pedidos')}
            >
              Gestionar Pedidos
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/admin/libros')}
            >
              Gestionar Libros
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/admin/usuarios')}
            >
              Gestionar Usuarios
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

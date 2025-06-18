import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState, useContext } from 'react';
import type { Order, User } from '../../../types/Entities';
import GeneralContext from '../../../context/GeneralContext';
import { getOrders, updateOrderStatus } from '../../../api/Order';
import { getUsers } from '../../../api/User';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [usuarioFiltro, setUsuarioFiltro] = useState<number | ''>('');
  const [estadoFiltro, setEstadoFiltro] = useState<
    'pendiente' | 'completado' | 'cancelado' | ''
  >('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Order | null>(
    null,
  );
  const [nuevoEstado, setNuevoEstado] = useState<
    'cancelado' | 'completado' | null
  >(null);

  const { alert, setLoading } = useContext(GeneralContext);

  const estados = ['pendiente', 'completado', 'cancelado'];

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const filtros = {
        usuario_id: usuarioFiltro || undefined,
        estado: estadoFiltro || undefined,
      };
      const res = await getOrders(
        { page, pageSize: 5, sortBy: 'id', sortOrder: 'DESC' },
        filtros,
      );
      setPedidos(res.rows);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      alert('Error al obtener pedidos', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await getUsers(
        {
          page: 1,
          pageSize: 1000,
          sortBy: 'id',
          sortOrder: 'ASC',
        },
        { rol: 'usuario' },
      );
      setLoading(false);
      setUsuarios(data.rows);
    } catch (error: unknown) {
      console.error('Error al obtener usuarios:', (error as Error).message);
    }
  };

  const cambiarEstado = async (
    id: number,
    estado: 'completado' | 'cancelado',
  ) => {
    try {
      setLoading(true);
      await updateOrderStatus(id, estado);
      alert('Estado actualizado correctamente', 'success');
      fetchPedidos();
    } catch (error: unknown) {
      alert('Error al actualizar estado: ' + (error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPedidos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, usuarioFiltro, estadoFiltro]);

  return (
    <>
      <Box p={3}>
        <Typography variant="h5" mb={2}>
          Gestión de Pedidos
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por Usuario</InputLabel>
                <Select
                  value={usuarioFiltro}
                  label="Filtrar por Usuario"
                  onChange={(e) => {
                    setUsuarioFiltro(e.target.value as number);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {usuarios.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Filtrar por Estado</InputLabel>
                <Select
                  value={estadoFiltro}
                  label="Filtrar por Estado"
                  onChange={(e) => {
                    setEstadoFiltro(
                      e.target.value as
                        | 'pendiente'
                        | 'completado'
                        | 'cancelado'
                        | '',
                    );
                    setPage(1);
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {estados.map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {pedidos.length === 0 ? (
          <Typography>No hay pedidos con los filtros seleccionados.</Typography>
        ) : (
          <>
            {pedidos.map((pedido) => (
              <Accordion key={pedido.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600} width="100%">
                    Pedido #{pedido.id} -{' '}
                    {new Date(pedido.fecha).toLocaleDateString()} - Estado:{' '}
                    <strong>{pedido.estado}</strong>
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography mb={1}>
                    <strong>Usuario:</strong>{' '}
                    {usuarios.find((u) => u.id === pedido.usuario_id)?.nombre ||
                      `ID ${pedido.usuario_id}`}
                  </Typography>
                  <Typography>
                    <strong>Dirección:</strong> {pedido.direccion},{' '}
                    {pedido.provincia}
                  </Typography>
                  <Typography mb={1}>
                    <strong>Detalles:</strong>{' '}
                    {pedido.detalles || 'Sin detalles'}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  {pedido.items?.map((item) => (
                    <Box
                      key={item.id}
                      display="flex"
                      justifyContent="space-between"
                      py={0.5}
                    >
                      <Typography>
                        Libro: {item.libro?.titulo} - Cantidad: {item.cantidad}
                      </Typography>
                      <Typography>${item.precio.toFixed(2)}</Typography>
                    </Box>
                  ))}
                  <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setPedidoSeleccionado(pedido);
                        setNuevoEstado('cancelado');
                        setDialogOpen(true);
                      }}
                      disabled={pedido.estado !== 'pendiente'}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setPedidoSeleccionado(pedido);
                        setNuevoEstado('completado');
                        setDialogOpen(true);
                      }}
                      disabled={pedido.estado !== 'pendiente'}
                    >
                      Marcar como Enviado
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirmar cambio de estado</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que querés marcar el pedido #
            {pedidoSeleccionado?.id} como <strong>{nuevoEstado}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button
            color={nuevoEstado === 'cancelado' ? 'error' : 'primary'}
            variant="contained"
            onClick={async () => {
              if (pedidoSeleccionado?.id && nuevoEstado) {
                await cambiarEstado(pedidoSeleccionado.id, nuevoEstado);
                setDialogOpen(false);
                setPedidoSeleccionado(null);
                setNuevoEstado(null);
              }
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminPedidos;

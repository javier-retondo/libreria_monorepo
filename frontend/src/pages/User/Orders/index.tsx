import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState, useContext } from 'react';
import { getOrders } from '../../../api/Order';
import GeneralContext from '../../../context/GeneralContext';
import type { Order } from '../../../types/Entities';

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { setLoading, alert } = useContext(GeneralContext);

  const fetchPedidos = async (currentPage: number = 1) => {
    try {
      setLoading(true);
      const res = await getOrders(
        { page: currentPage, pageSize: 5, sortBy: 'id', sortOrder: 'DESC' },
        {},
      );
      setPedidos(res.rows);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      alert('Error al obtener los pedidos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Historial de Pedidos
      </Typography>

      {pedidos.length === 0 ? (
        <Typography>No hay pedidos registrados.</Typography>
      ) : (
        <>
          {pedidos.map((pedido) => (
            <Accordion key={pedido.id} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={600}>
                  Pedido #{pedido.id} -{' '}
                  {new Date(pedido.fecha).toLocaleDateString()} - Estado:{' '}
                  <strong>{pedido.estado}</strong>
                  <Typography
                    sx={{
                      ml: 1,
                      fontWeight: 'bold',
                      mt: 2,
                      fontSize: '1.075rem',
                    }}
                  >
                    Total: ${' '}
                    {pedido.items
                      ?.reduce((acc, item) => acc + item.precio, 0)
                      .toFixed(2)}
                  </Typography>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={1}>
                  <Typography>
                    <strong>Dirección:</strong> {pedido.direccion},{' '}
                    {pedido.provincia}
                  </Typography>
                  <Typography>
                    <strong>Detalles:</strong>{' '}
                    {pedido.detalles || 'Sin detalles'}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="subtitle1">Items:</Typography>
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
  );
};

export default HistorialPedidos;

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import type { Book } from '../../../../types/Entities';
import { useContext, useState } from 'react';
import { deleteLibro } from '../../../../api/Books';
import GeneralContext from '../../../../context/GeneralContext';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Props {
  libros: Book[];
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rowsPerPage: number) => void;
  totalCount: number;
  setOpenForm: (open: boolean) => void;
  setLibroUpdated: (libro: Book | undefined) => void;
  fetchLibros: (clean?: boolean) => Promise<void>;
}

export default function LibrosTable({
  libros,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  totalCount,
  setOpenForm,
  setLibroUpdated,
  fetchLibros,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState<Book | undefined>(
    undefined,
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLibro, setSelectedLibro] = useState<Book | undefined>(
    undefined,
  );

  const { alert, setLoading } = useContext(GeneralContext);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteLibro = async (id: number) => {
    try {
      setLoading(true);
      await deleteLibro(id);
      alert('Libro eliminado correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      alert('Error al eliminar el libro', 'error');
    } finally {
      setConfirmDelete(undefined);
      setLoading(false);
      await fetchLibros(true);
    }
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    libro: Book,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedLibro(libro);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedLibro(undefined);
  };

  return (
    <>
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Categorías</TableCell>
                <TableCell>Fecha Ingreso</TableCell>
                <TableCell align="right">...</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {libros.map((libro) => (
                <TableRow key={libro.id} hover>
                  <TableCell>{libro.titulo}</TableCell>
                  <TableCell>{libro.autor?.nombre || '-'}</TableCell>
                  <TableCell>${libro.precio.toFixed(2)}</TableCell>
                  <TableCell>
                    {libro.categorias?.map((c) => c.nombre).join(', ') || '-'}
                  </TableCell>
                  <TableCell>
                    {(libro.createdAt &&
                      new Date(libro.createdAt).toLocaleDateString()) ||
                      '-'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(e) => handleMenuClick(e, libro)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              setLibroUpdated(selectedLibro);
              setOpenForm(true);
              handleMenuClose();
            }}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => {
              setConfirmDelete(selectedLibro);
              handleMenuClose();
            }}
          >
            Eliminar
          </MenuItem>
        </Menu>
        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </Paper>
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(undefined)}
      >
        <DialogTitle>¿Confirmar eliminación?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que querés eliminar este libro:{' '}
            {confirmDelete?.titulo}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(undefined)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (confirmDelete?.id) {
                handleDeleteLibro(confirmDelete.id);
              }
              setConfirmDelete(undefined);
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

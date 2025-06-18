import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  IconButton,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import GeneralContext from '../../../context/GeneralContext';
import type { User } from '../../../types/Entities';
import { deleteUser, getUsers } from '../../../api/User';

export default function AdminUsuarios() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [rol, setRol] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { alert, setLoading } = useContext(GeneralContext);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(
        {
          page: page + 1,
          pageSize: rowsPerPage,
          sortBy: 'id',
          sortOrder: 'ASC',
        },
        {
          search,
        },
      );
      setUsers(res.rows);
    } catch (error) {
      alert('Error al obtener usuarios:' + error, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, rol: 'usuario' | 'administrador') => {
    if (rol === 'administrador') {
      alert('No puedes eliminar un usuario administrador', 'error');
      return;
    }
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    try {
      setLoading(true);
      await deleteUser(id);
      alert('Usuario eliminado', 'success');
      fetchUsers();
    } catch (error) {
      alert('Error al eliminar usuario:' + error, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let filteredList = users;
    if (search)
      filteredList = filteredList.filter((u) =>
        u.nombre.toLowerCase().includes(search.toLowerCase()),
      );
    if (rol) filteredList = filteredList.filter((u) => u.rol === rol);

    setFiltered(filteredList);
    setPage(0);
  }, [search, rol, users]);

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Buscar por nombre"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Select
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              displayEmpty
              fullWidth
            >
              <MenuItem value="">Todos los roles</MenuItem>
              <MenuItem value="usuario">Usuario</MenuItem>
              <MenuItem value="administrador">Administrador</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Creado</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.nombre}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.rol}</TableCell>
                    <TableCell>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(u.id, u.rol)}
                        disabled={u.rol === 'administrador'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) =>
            setRowsPerPage(parseInt(e.target.value, 10))
          }
        />
      </Paper>
    </Box>
  );
}

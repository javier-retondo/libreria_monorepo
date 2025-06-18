import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect, useContext } from 'react';
import { getLibros, getAutores, getCategorias } from '../../../api/Books';
import type { Book, Author, Category } from '../../../types/Entities';
import LibrosTable from './components/LibrosTable';
import LibroFormModal from './components/FormLibro';
import GeneralContext from '../../../context/GeneralContext';

export default function AdminLibros() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [libros, setLibros] = useState<Book[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [precioDesde, setPrecioDesde] = useState<number | ''>('');
  const [precioHasta, setPrecioHasta] = useState<number | ''>('');
  const [autores, setAutores] = useState<Author[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [autorFiltro, setAutorFiltro] = useState<number[]>([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number[]>([]);
  const [libroUpdated, setLibroUpdated] = useState<Book | undefined>(undefined);
  const [openForm, setOpenForm] = useState(false);

  const { alert, setLoading } = useContext(GeneralContext);

  const fetchLibros = async (clean: boolean = false) => {
    const pagination = {
      page: page + 1,
      pageSize: rowsPerPage,
      sortBy: 'titulo' as keyof Book,
      sortOrder: 'ASC' as 'ASC' | 'DESC',
    };
    const filters = !clean
      ? {
          search,
          precio_desde: precioDesde || undefined,
          precio_hasta: precioHasta || undefined,
          autor_id: autorFiltro.length ? autorFiltro : undefined,
          categorias: categoriaFiltro.length ? categoriaFiltro : undefined,
        }
      : {};
    setLoading(true);
    await getLibros(pagination, filters)
      .then((res) => {
        setLibros(res.rows);
        setTotalCount(res.pagination.totalCount);
      })
      .catch((error) => {
        alert('Error al obtener los libros', 'error');
        console.error('Error fetching books:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cleanFilters = () => {
    setSearch('');
    setPrecioDesde('');
    setPrecioHasta('');
    setAutorFiltro([]);
    setCategoriaFiltro([]);
    setPage(0);
    fetchLibros(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await getAutores().then((res) => setAutores(res));
        await getCategorias().then((res) => setCategorias(res));
      } catch (error) {
        alert('Error fetching data', 'error');
        console.error('Error fetching data:', error);
        setAutores([]);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
      fetchLibros();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openForm]);

  useEffect(() => {
    fetchLibros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Gestión de Libros
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Buscar por título"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              label="Precio desde"
              type="number"
              value={precioDesde}
              onChange={(e) => setPrecioDesde(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <TextField
              fullWidth
              label="Precio hasta"
              type="number"
              value={precioHasta}
              onChange={(e) => setPrecioHasta(Number(e.target.value))}
            />
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Autores</InputLabel>
              <Select
                multiple
                value={autorFiltro}
                onChange={(e) => setAutorFiltro(e.target.value as number[])}
                input={<OutlinedInput label="Autores" />}
                renderValue={(selected) =>
                  selected
                    .map((id) => autores.find((a) => a.id === id)?.nombre || id)
                    .join(', ')
                }
              >
                {autores.map((autor) => (
                  <MenuItem key={autor.id} value={autor.id}>
                    <Checkbox checked={autorFiltro.includes(autor.id)} />
                    <ListItemText primary={autor.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, sm: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Categorías</InputLabel>
              <Select
                multiple
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value as number[])}
                input={<OutlinedInput label="Categorías" />}
                renderValue={(selected) =>
                  selected
                    .map(
                      (id) => categorias.find((c) => c.id === id)?.nombre || id,
                    )
                    .join(', ')
                }
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    <Checkbox checked={categoriaFiltro.includes(cat.id)} />
                    <ListItemText primary={cat.nombre} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 6, sm: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => fetchLibros(false)}
            >
              Aplicar filtros
            </Button>
          </Grid>
          <Grid size={{ xs: 6, sm: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                cleanFilters();
              }}
            >
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Nuevo Libro
        </Button>
      </Box>

      <LibrosTable
        libros={libros}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalCount={totalCount}
        setOpenForm={setOpenForm}
        setLibroUpdated={setLibroUpdated}
        fetchLibros={fetchLibros}
      />

      <LibroFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        autores={autores}
        categorias={categorias}
        onCreated={fetchLibros}
        libro={libroUpdated}
      />
    </Box>
  );
}

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import { createCategory, deleteCategory } from '../../../../../api/Books';
import type { Category } from '../../../../../types/Entities';
import GeneralContext from '../../../../../context/GeneralContext';

type CategoriesComponentProps = {
  initialCategorias: { id: number; nombre: string; descripcion: string }[];
  selectedCats: number[];
  setSelectedCats: (cats: number[]) => void;
};

const CategoriesComponent = ({
  initialCategorias,
  selectedCats,
  setSelectedCats,
}: CategoriesComponentProps) => {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [newCategoria, setNewCategoria] = useState({
    nombre: '',
    descripcion: '',
  });
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const { alert, setLoading } = useContext(GeneralContext);

  const handleAddCategoria = async () => {
    if (!newCategoria.nombre || !newCategoria.descripcion) {
      alert('Todos los campos de la categoría son obligatorios', 'error');
      return;
    }
    if (categorias.some((c) => c.nombre === newCategoria.nombre)) {
      alert('Ya existe una categoría con ese nombre', 'error');
      return;
    }
    setLoading(true);
    try {
      const createdCategory = await createCategory(newCategoria);
      setCategorias([...categorias, createdCategory]);
      setSelectedCats([...selectedCats, createdCategory.id]);
      setNewCategoria({ nombre: '', descripcion: '' });
      setIsNewCategory(false);
      alert('Categoría creada exitosamente', 'success');
    } catch (error) {
      console.error('Error al crear categoría:', error);
      alert('Error al crear la categoría', 'error');
    }
    setLoading(false);
  };

  const handleDeleteCategoria = async (id: number) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      setCategorias(categorias.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      alert('Error al eliminar la categoría', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    setCategorias(initialCategorias);
  }, [initialCategorias]);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        border="1px solid #102f53"
        borderRadius={2}
        p={2}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid
            size={{
              xs: 12,
              sm: 8,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Categorías</InputLabel>
              <Select
                multiple
                value={selectedCats}
                required
                onChange={(e) => setSelectedCats(e.target.value as number[])}
                input={<OutlinedInput label="Categorías" />}
                renderValue={(selected) =>
                  (selected as number[])
                    .map((id) => categorias.find((c) => c.id === id)?.nombre)
                    .join(', ')
                }
              >
                {categorias.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={selectedCats.includes(c.id)} />
                    <ListItemText primary={c.nombre} />
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete({ id: c.id, nombre: c.nombre });
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
            display="flex"
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              onClick={() => {
                setIsNewCategory(!isNewCategory);
                setNewCategoria({ nombre: '', descripcion: '' });
              }}
            >
              {isNewCategory ? 'Cancelar' : 'Agregar Nueva Categoría'}
            </Button>
          </Grid>
        </Grid>

        {isNewCategory && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nombre Categoría"
                value={newCategoria.nombre}
                onChange={(e) =>
                  setNewCategoria({
                    ...newCategoria,
                    nombre: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Descripción"
                value={newCategoria.descripcion}
                onChange={(e) =>
                  setNewCategoria({
                    ...newCategoria,
                    descripcion: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end">
              <Button onClick={handleAddCategoria} variant="outlined">
                Agregar
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>¿Confirmar eliminación?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que querés eliminar esta categoría:{' '}
            {confirmDelete?.nombre}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (confirmDelete) {
                handleDeleteCategoria(confirmDelete.id);
              }
              setConfirmDelete(null);
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CategoriesComponent;

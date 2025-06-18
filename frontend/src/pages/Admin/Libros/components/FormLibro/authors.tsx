import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext, useEffect, useState } from 'react';
import type { Author } from '../../../../../types/Entities';
import GeneralContext from '../../../../../context/GeneralContext';
import { createAuthor, deleteAuthor } from '../../../../../api/Books';

type AuthorsComponentProps = {
  initialAutores: Author[];
  selectedAutor: number | null;
  setSelectedAutor: (id: number | null) => void;
};

const AuthorsComponent = ({
  initialAutores,
  selectedAutor,
  setSelectedAutor,
}: AuthorsComponentProps) => {
  const [autores, setAutores] = useState<Author[]>([]);
  const [newAutor, setNewAutor] = useState({
    nombre: '',
    biografia: '',
    fecha_nacimiento: '',
    nacionalidad: '',
  });
  const [isNewAuthor, setIsNewAuthor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{
    id: number;
    nombre: string;
  } | null>(null);

  const { alert, setLoading } = useContext(GeneralContext);

  const handleAddAutor = async () => {
    if (
      !newAutor.nombre ||
      !newAutor.biografia ||
      !newAutor.fecha_nacimiento ||
      !newAutor.nacionalidad
    ) {
      alert('Todos los campos del autor son obligatorios', 'error');
      return;
    }
    if (autores.some((a) => a.nombre === newAutor.nombre)) {
      alert('Ya existe un autor con ese nombre', 'error');
      return;
    }
    setLoading(true);
    try {
      const nuevo = await createAuthor(newAutor);
      setAutores([...autores, nuevo]);
      setNewAutor({
        nombre: '',
        biografia: '',
        fecha_nacimiento: '',
        nacionalidad: '',
      });
      setIsNewAuthor(false);
      setSelectedAutor(nuevo.id);
      alert('Autor creado exitosamente', 'success');
    } catch (error) {
      console.error('Error al crear autor:', error);
      alert('Error al crear el autor', 'error');
    }
    setLoading(false);
    setIsNewAuthor(false);
    setNewAutor({
      nombre: '',
      biografia: '',
      fecha_nacimiento: '',
      nacionalidad: '',
    });
  };

  const handleDeleteAutor = async (id: number) => {
    setLoading(true);
    try {
      await deleteAuthor(id);
      setAutores(autores.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Error al eliminar autor:', error);
      alert('Error al eliminar el autor', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    setAutores(initialAutores);
  }, [initialAutores]);

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
              <InputLabel>Autor</InputLabel>
              <Select
                value={selectedAutor}
                name="autor_id"
                onChange={(e) => setSelectedAutor(Number(e.target.value))}
                input={<OutlinedInput label="Autor" />}
                required
              >
                {autores.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.nombre}
                    <IconButton
                      edge="end"
                      onClick={() =>
                        setConfirmDelete({ id: a.id, nombre: a.nombre })
                      }
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
                setIsNewAuthor(!isNewAuthor);
                setNewAutor({
                  nombre: '',
                  biografia: '',
                  fecha_nacimiento: '',
                  nacionalidad: '',
                });
              }}
            >
              {isNewAuthor ? 'Cancelar' : 'Agregar Nuevo Autor'}
            </Button>
          </Grid>
        </Grid>

        {isNewAuthor && (
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                label="Nombre del Autor"
                value={newAutor.nombre}
                onChange={(e) =>
                  setNewAutor({ ...newAutor, nombre: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                label="Biografía"
                value={newAutor.biografia}
                onChange={(e) =>
                  setNewAutor({ ...newAutor, biografia: e.target.value })
                }
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={newAutor.fecha_nacimiento}
                onChange={(e) =>
                  setNewAutor({
                    ...newAutor,
                    fecha_nacimiento: e.target.value,
                  })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <TextField
                label="Nacionalidad"
                value={newAutor.nacionalidad}
                onChange={(e) =>
                  setNewAutor({
                    ...newAutor,
                    nacionalidad: e.target.value,
                  })
                }
                fullWidth
              />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 2,
              }}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Button onClick={handleAddAutor} variant="outlined">
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
            ¿Estás seguro de que querés eliminar este autor:{' '}
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
                handleDeleteAutor(confirmDelete.id);
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

export default AuthorsComponent;

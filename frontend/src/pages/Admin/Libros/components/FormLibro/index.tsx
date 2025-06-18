import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createLibro, updateLibro } from '../../../../../api/Books';
import type { Author, Book, Category } from '../../../../../types/Entities';
import CategoriesComponent from './categories';
import AuthorsComponent from './authors';

interface Props {
  open: boolean;
  onClose: () => void;
  autores: Author[];
  categorias: Category[];
  onCreated: () => void;
  libro?: Book;
}

export default function LibroFormModal({
  open,
  onClose,
  autores: initialAutores,
  categorias: initialCategorias,
  onCreated,
  libro,
}: Props) {
  const [form, setForm] = useState(
    libro
      ? {
          titulo: libro.titulo,
          descripcion: libro.descripcion,
          precio: libro.precio,
          autor_id: libro.autor_id || 0,
        }
      : {
          titulo: '',
          descripcion: '',
          precio: 0,
          autor_id: 0,
        },
  );
  const [selectedCats, setSelectedCats] = useState<number[]>([]);
  const [selectedAutor, setSelectedAutor] = useState<number | null>(null);
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'precio' ? Number(value) : value });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('titulo', form.titulo);
    formData.append('descripcion', form.descripcion);
    formData.append('precio', form.precio.toString());
    if (selectedAutor) {
      formData.append('autor_id', selectedAutor.toString());
    }
    selectedCats.forEach((id) =>
      formData.append('categorias_id', id.toString()),
    );
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }
    if (libro && libro.id) {
      await updateLibro(libro.id, formData);
    } else {
      await createLibro(formData);
    }
    onCreated();
    onClose();
  };

  useEffect(() => {
    setForm({
      titulo: '',
      descripcion: '',
      precio: 0,
      autor_id: 0,
    });
    setSelectedCats([]);
    setSelectedAutor(null);
    setImagenFile(null);
  }, [open]);

  useEffect(() => {
    if (libro) {
      setForm({
        titulo: libro.titulo,
        descripcion: libro.descripcion,
        precio: libro.precio,
        autor_id: libro.autor_id || 0,
      });
      setSelectedCats(libro.categorias?.map((c) => c.id) || []);
      setSelectedAutor(libro.autor_id || null);
    }
  }, [libro]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nuevo Libro</DialogTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <DialogContent>
          <Box mt={1} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Título"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Descripción"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              minRows={3}
              required
            />
            <TextField
              label="Precio"
              name="precio"
              type="number"
              required
              value={form.precio}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
                inputProps: { min: 0 },
              }}
            />

            <Button variant="outlined" component="label">
              Subir Imagen
              <input
                type="file"
                hidden
                required
                name="imagen"
                id="imagen"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImagenFile(e.target.files[0]);
                  }
                }}
              />
            </Button>
            <Typography variant="body2" color="text.secondary">
              {imagenFile?.name || 'Ninguna imagen seleccionada'}
            </Typography>

            <AuthorsComponent
              initialAutores={initialAutores}
              selectedAutor={selectedAutor}
              setSelectedAutor={setSelectedAutor}
            />

            <CategoriesComponent
              initialCategorias={initialCategorias}
              selectedCats={selectedCats}
              setSelectedCats={setSelectedCats}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" type="submit">
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import GeneralContext from '../context/general';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { search, setSearch } = useContext(GeneralContext);

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{ bgcolor: '#fff', color: '#333' }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon color="primary" />
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}
          >
            Librería Online
          </Typography>
        </Box>
        {!isMobile && (
          <TextField
            size="small"
            placeholder="Buscar libros o autores..."
            sx={{ width: '40ch' }}
            InputProps={{
              value: search,
              onChange: (e) => setSearch(e.target.value),
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button component={Link} to="/catalogo" color="inherit">
            Catálogo
          </Button>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <IconButton component={Link} to="/cart" color="inherit">
            <ShoppingCartIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

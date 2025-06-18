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
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import GeneralContext from '../context/GeneralContext';
import LoginContext from '../context/LoginContext';
import type { User } from '../types/Entities';
import CartContext from '../context/CartContext';
import Badge from '@mui/material/Badge';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { navbarText, setNavbarText } = useContext(GeneralContext);
  const { userInfo, logout } = useContext(LoginContext);
  const { cart } = useContext(CartContext);

  const navigate = useNavigate();

  const goToCatalog = () => {
    if (navbarText.trim() !== '') {
      navigate(`/catalogo?search=${encodeURIComponent(navbarText)}`);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const goTo = (path: string) => {
    navigate(path);
    handleClose();
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  useEffect(() => {
    if (cart.length > 0) {
      setAnimateCart(true);
      const timeout = setTimeout(() => setAnimateCart(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [cart.length]);

  const userOptions = (userInfo: User) => (
    <>
      <IconButton onClick={handleMenu} color="inherit">
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
          {userInfo.nombre?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Typography sx={{ ml: 1 }}>{userInfo.nombre}</Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem
          onClick={() =>
            goTo(
              userInfo.rol === 'administrador'
                ? '/admin/dashboard'
                : '/user/dashboard',
            )
          }
        >
          Panel
        </MenuItem>
        <MenuItem onClick={() => setOpen(true)}>Mis Datos</MenuItem>
        <MenuItem onClick={handleLogout}>Salir</MenuItem>
      </Menu>
      {userInfo && userData(userInfo)}
    </>
  );

  const userData = (userInfo: User) => (
    <Dialog open={open} onClose={() => setOpen(!open)} maxWidth="sm" fullWidth>
      <DialogTitle>Mis Datos</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="subtitle2">Nombre:</Typography>
          <Typography>{userInfo.nombre}</Typography>
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle2">Correo:</Typography>
          <Typography>{userInfo.email}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(!open)} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );

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
            Librería Aurora
          </Typography>
        </Box>
        {!isMobile && (
          <TextField
            size="small"
            placeholder="Buscar libros o autores..."
            sx={{ width: '40ch' }}
            InputProps={{
              value: navbarText,
              onChange: (e) => setNavbarText(e.target.value),
              onKeyDown: (e) => {
                if (e.key === 'Enter') {
                  goToCatalog();
                }
              },
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            component={Link}
            to="/"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Inicio
          </Button>
          <Button
            component={Link}
            to="/catalogo"
            color="inherit"
            sx={{ textTransform: 'none' }}
          >
            Cátalogo
          </Button>
          {userInfo ? (
            userOptions(userInfo)
          ) : (
            <Button
              component={Link}
              to="/login"
              color="inherit"
              sx={{ textTransform: 'none' }}
            >
              Ingresar
            </Button>
          )}

          <IconButton component={Link} to="/cart" color="inherit">
            <Badge
              badgeContent={cart.length}
              color="primary"
              classes={{ badge: animateCart ? 'badge-animate' : '' }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

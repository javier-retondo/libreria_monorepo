import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const UserLayout = () => {
  const navigate = useNavigate();

  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/user/dashboard' },
    { text: 'Historial', icon: <HistoryIcon />, path: '/user/orders' },
    {
      text: 'Volver al sitio',
      icon: <MenuBookIcon color="primary" />,
      path: '/',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Aurora Usuario
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;

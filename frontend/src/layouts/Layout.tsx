import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container } from '@mui/material';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default Layout;

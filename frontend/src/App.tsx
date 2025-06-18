import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './layouts/Layout';
import Catalog from './pages/Catalogo';
import Login from './pages/Login';
import { GlobalProvider } from './context';
import { ProtectedRoute } from './routes/ProtectedRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import UserDashboard from './pages/User/Dashboard';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminLibros from './pages/Admin/Libros';
import CartPage from './pages/Cart';
import AdminUsuarios from './pages/Admin/Usuarios';
import HistorialPedidos from './pages/User/Orders';
import AdminPedidos from './pages/Admin/Pedidos';

const App = () => {
  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="login" element={<Login />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="*" element={<Landing />} />
          </Route>
          <Route path="/user" element={<UserLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="usuario">
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute requiredRole="usuario">
                  <HistorialPedidos />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredRole="administrador">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="libros"
              element={
                <ProtectedRoute requiredRole="administrador">
                  <AdminLibros />
                </ProtectedRoute>
              }
            />
            <Route
              path="usuarios"
              element={
                <ProtectedRoute requiredRole="administrador">
                  <AdminUsuarios />
                </ProtectedRoute>
              }
            />
            <Route
              path="pedidos"
              element={
                <ProtectedRoute requiredRole="administrador">
                  <AdminPedidos />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};

export default App;

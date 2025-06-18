import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import LoginContext from '../context/LoginContext';
import type { JSX } from '@emotion/react/jsx-runtime';

interface Props {
  children: JSX.Element;
  requiredRole?: 'administrador' | 'usuario';
}

export const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { isLoggedIn, userRole } = useContext(LoginContext);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" />;

  return children;
};

import { createContext, useEffect, useState } from 'react';
import type { LoginContextProps } from '../types/Props';
import type { User } from '../types/Entities';

const LoginContext = createContext<LoginContextProps>({} as LoginContextProps);

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'administrador' | 'usuario' | null>(
    null,
  );
  const [userInfo, setUserInfo] = useState<User | null>(null);

  const login = (user: User, token: string) => {
    setIsLoggedIn(true);
    setUserInfo(user);
    setUserRole(user.rol);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserInfo(null);
    setUserRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsLoggedIn(true);
      setUserInfo(JSON.parse(user));
      setUserRole(JSON.parse(user).rol);
    }
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, userInfo, userRole, login, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContext;

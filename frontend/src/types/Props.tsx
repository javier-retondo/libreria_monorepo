import type { CartItem, User } from './Entities';

export interface LoginContextProps {
  isLoggedIn: boolean;
  userInfo: User | null;
  userRole: 'administrador' | 'usuario' | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export interface CartContextProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export interface GeneralContextProps {
  navbarText: string;
  setNavbarText: (text: string) => void;
  alert: (message: string, type: 'error' | 'success') => void;
  setLoading: (loading: boolean) => void;
}

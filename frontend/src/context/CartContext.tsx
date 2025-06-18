import { createContext, useState } from 'react';
import type { CartContextProps } from '../types/Props';
import type { CartItem } from '../types/Entities';

const CartContext = createContext<CartContextProps>({} as CartContextProps);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.book.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, setCart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

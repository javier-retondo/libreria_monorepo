import { LoginProvider } from './LoginContext';
import { CartProvider } from './CartContext';
import { GeneralProvider } from './GeneralContext';

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => (
  <LoginProvider>
    <CartProvider>
      <GeneralProvider>{children}</GeneralProvider>
    </CartProvider>
  </LoginProvider>
);

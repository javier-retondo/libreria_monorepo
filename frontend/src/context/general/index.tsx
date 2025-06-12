import { createContext } from 'react';

type GeneralContextType = {
  search: string;
  setSearch: (value: string) => void;
};

const GeneralContext = createContext<GeneralContextType>({
  search: '',
  setSearch: () => {
    throw new Error('setSearch debe usarse dentro de <GeneralContextProvider>');
  },
});

export default GeneralContext;

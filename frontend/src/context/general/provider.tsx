import { useState } from 'react';
import GeneralContext from './';

const GeneralContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [search, setSearch] = useState<string>('');

  return (
    <GeneralContext.Provider value={{ search, setSearch }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;

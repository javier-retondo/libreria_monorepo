import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Landing from './pages/Landing';
import Layout from './pages/Layout';
import Catalog from './pages/Catalogo';
import GeneralContextProvider from './context/general/provider';

const App = () => {
  return (
    <BrowserRouter>
      <GeneralContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="catalogo" element={<Catalog />} />
          </Route>
        </Routes>
      </GeneralContextProvider>
    </BrowserRouter>
  );
};

export default App;

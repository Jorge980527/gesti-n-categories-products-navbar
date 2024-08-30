import React from 'react';  // Importa React para poder usar JSX.
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';  // Importa componentes de react-router-dom para manejar rutas y navegación.
import Categories from './componente-categories/categories';  // Importa el componente Categories que se mostrará en una ruta específica.
import Product from './componente-products/products';  // Importa el componente Products que se mostrará en otra ruta específica.

import './App.css';
const App: React.FC = () => {
  return (
    <Router> {/* Envuelve el contenido de la aplicación con el componente Router para habilitar el enrutamiento */}
      <div>
        {/* Menú de navegación */}
        <nav>
          <ul>
            <li>
              {/* Enlace a la página de categorías */}
              <Link to="/categories">Categorías</Link>
            </li>
            <li>
              {/* Enlace a la página de productos */}
              <Link to="/products">Productos</Link>
            </li>
          </ul>
        </nav>

        {/* Rutas de la aplicación */}
        <Routes>
          {/* Ruta para el componente de Categorías */}
          <Route path="/categories" element={<Categories />} />
          {/* Ruta para el componente de Productos */}
          <Route path="/products" element={<Product />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;  // Exporta el componente App para que pueda ser usado en otros archivos.


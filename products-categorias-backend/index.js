const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

const categoriesRouter = require('./routes/categories');
const productsRouter = require('./routes/products');

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos form-url-encoded
app.use(express.urlencoded({ extended: true }));

// Middleware para manejar CORS
app.use(cors());

// Rutas
app.use('/api/categories', categoriesRouter);
app.use('/api/products', productsRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



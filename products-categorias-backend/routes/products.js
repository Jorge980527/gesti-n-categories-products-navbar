const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const { name, categoryId } = req.body;
  db.query('INSERT INTO products (name, category_id) VALUES (?, ?)', [name, categoryId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, name, categoryId });
  });
});

// Editar un producto
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;
  db.query('UPDATE products SET name = ?, category_id = ? WHERE id = ?', [name, categoryId, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product updated successfully.' });
  });
});

// Eliminar un producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product deleted successfully.' });
  });
});

module.exports = router;    

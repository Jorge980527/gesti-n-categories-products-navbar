const express = require('express');
const router = express.Router();
const db = require('../db'); // Importa la conexión a la base de datos desde db.js

// Endpoint para obtener todas las categorías
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Endpoint para crear una nueva categoría
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
  }

  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, name });
  });
});

// Endpoint para editar una categoría
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
  }

  db.query('UPDATE categories SET name = ? WHERE id = ?', [name, id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Categoría actualizada exitosamente.' });
  });
});

// Endpoint para eliminar una categoría
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // Verifica si el ID es válido
  if (!id) {
    return res.status(400).json({ error: 'El ID es necesario para eliminar una categoría.' });
  }

  db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Categoría eliminada exitosamente.' });
  });
});

module.exports = router;


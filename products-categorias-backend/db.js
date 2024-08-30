const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',   // Reemplaza con tu usuario de MySQL
  password: '980527', // Reemplaza con tu contraseña de MySQL
  database: 'gestion_productos_categorias'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;

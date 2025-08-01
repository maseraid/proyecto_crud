const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1104264112',
  database: 'empleados_crud'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});
app.use(cors());
app.use(express.json());
// REGISTRAR
app.post('/api/empleados', (req, res) => {
  const { nombres, edad, pais, ocupacion, anios } = req.body;
  const query = 'INSERT INTO empleados (nombres, edad, pais, ocupacion, anios) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombres, edad, pais, ocupacion, anios], (err, result) => {
    if (err) {
      console.error('Error al insertar empleado:', err);
      res.status(500).send('Error al insertar empleado');
      return;
    }
    res.status(201).send('Empleado insertado con éxito');
  });
});

// GET ALL EMPLEADOS
app.get('/api/empleados', (req, res) => {
  const query = 'SELECT * FROM empleados';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener empleados:', err);
      res.status(500).send('Error al obtener empleados');
      return;
    }
    res.json(results);
  });
});

// DELETE EMPLEADO
app.delete('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM empleados WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar empleado:', err);
      res.status(500).send('Error al eliminar empleado');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }
    res.send('Empleado eliminado con éxito');
  });
});
// UPDATE EMPLEADO
app.post('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, edad, pais, ocupacion, anios } = req.body;
  const query = 'UPDATE empleados SET nombres = ?, edad = ?, pais = ?, ocupacion = ?, anios = ? WHERE id = ?';
  db.query(query, [nombres, edad, pais, ocupacion, anios, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar empleado:', err);
      res.status(500).send('Error al actualizar empleado');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }
    res.send('Empleado actualizado con éxito');
  });
});

app.put('/api/empleados/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, edad, pais, ocupacion, anios } = req.body;
  const query = 'UPDATE empleados SET nombres = ?, edad = ?, pais = ?, ocupacion = ?, anios = ? WHERE id = ?';
  db.query(query, [nombres, edad, pais, ocupacion, anios, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar empleado:', err);
      res.status(500).send('Error al actualizar empleado');
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('Empleado no encontrado');
      return;
    }
    res.send('Empleado actualizado con éxito');
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${port}`);
});
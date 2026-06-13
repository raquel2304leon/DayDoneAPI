// Importar dependencias
const express = require('express');
const mysql = require('mysql2');

const app = express();

// Permitir recibir datos en formato JSON
app.use(express.json());

// ── CONEXION A MYSQL ──────────────────────────────────────
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'daydone'
});

// Conectar a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error al conectar a MySQL:', error);
    } else {
        console.log('Conexion exitosa a MySQL');
    }
});

// ── GET /tareas ───────────────────────────────────────────
// Obtener todas las tareas
app.get('/tareas', (req, res) => {
    const sql = 'SELECT * FROM tareas';
    conexion.query(sql, (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al obtener tareas' });
        }
        res.status(200).json(resultados);
    });
});

// ── GET /tareas/:id ───────────────────────────────────────
// Obtener una tarea por ID
app.get('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM tareas WHERE id = ?';
    conexion.query(sql, [id], (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al obtener la tarea' });
        }
        if (resultados.length === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json(resultados[0]);
    });
});

// ── POST /tareas ──────────────────────────────────────────
// Crear una tarea nueva
app.post('/tareas', (req, res) => {
    const { titulo, descripcion, fecha, prioridad, estado } = req.body;

    // Validar que el titulo no este vacio
    if (!titulo) {
        return res.status(400).json({ mensaje: 'Error: el titulo es requerido' });
    }

    const sql = 'INSERT INTO tareas (titulo, descripcion, fecha, prioridad, estado) VALUES (?, ?, ?, ?, ?)';
    conexion.query(sql, [titulo, descripcion, fecha, prioridad, estado], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al crear la tarea' });
        }
        res.status(201).json({
            mensaje: 'Tarea creada exitosamente',
            id: resultado.insertId
        });
    });
});

// ── PUT /tareas/:id ───────────────────────────────────────
// Actualizar una tarea existente
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha, prioridad, estado } = req.body;

    const sql = 'UPDATE tareas SET titulo=?, descripcion=?, fecha=?, prioridad=?, estado=? WHERE id=?';
    conexion.query(sql, [titulo, descripcion, fecha, prioridad, estado, id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al actualizar la tarea' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json({ mensaje: 'Tarea actualizada exitosamente' });
    });
});

// ── DELETE /tareas/:id ────────────────────────────────────
// Eliminar una tarea por ID
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tareas WHERE id=?';
    conexion.query(sql, [id], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al eliminar la tarea' });
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Tarea no encontrada' });
        }
        res.status(200).json({ mensaje: 'Tarea eliminada exitosamente' });
    });
});

// Iniciar el servidor en el puerto 3001
const PUERTO = 3001;
app.listen(PUERTO, () => {
    console.log(`Servidor DayDoneAPI corriendo en http://localhost:${PUERTO}`);
});
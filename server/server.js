const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    database: 'todolist' 
});

// Connect to the database
db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// API to get all todo items
app.get('/todos', (req, res) => {
    const sql = 'SELECT * FROM todos';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// API to add a new todo item
app.post('/todos', (req, res) => {
    const { todo } = req.body;
    const sql = 'INSERT INTO todos (todo) VALUES (?)';
    db.query(sql, [todo], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Todo added', id: result.insertId });
    });
});

// API to delete a todo item by ID
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM todos WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) throw err;
        res.send({ message: 'Todo deleted' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

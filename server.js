const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Azure SQL Config
const config = {
    user: 'azureuser',
    password: 'StrongPassword@123',
    server: 'studentserver07.database.windows.net',
    database: 'studentdb',
    options: {
        encrypt: true
    }
};

// Add Student API
app.post('/addStudent', async (req, res) => {
    try {
        await sql.connect(config);

        const { name, age, course } = req.body;

        await sql.query`
            INSERT INTO Students (name, age, course)
            VALUES (${name}, ${age}, ${course})
        `;

        res.send("Student Added Successfully");
    } catch (err) {
        res.send(err.message);
    }
});

// View Students API
app.get('/students', async (req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query`SELECT * FROM Students`;

        res.json(result.recordset);
    } catch (err) {
        res.send(err.message);
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
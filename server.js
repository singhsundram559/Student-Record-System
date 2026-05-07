const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Serve frontend files
app.use(express.static('public'));

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

// Home Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

        const result = await sql.query`
            SELECT * FROM Students
        `;

        res.json(result.recordset);

    } catch (err) {

        res.send(err.message);

    }

});

// Azure Port Fix
const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');

const app = express();
app.use(cors()); 
app.use(express.json());


app.get('/api/courses', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Courses');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
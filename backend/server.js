const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');
const sql = require("mssql");


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


// app.get("/api/student/me", async (req, res) => {
//     try {

//         const rollNo = req.query.rollNo;

//         if (!rollNo) {
//             return res.status(400).json({
//                 message: "Roll Number is required"
//             });
//         }

//         const pool = await poolPromise;

//         const result = await pool
//             .request()
//             .input("rollNo", sql.VarChar, rollNo)
//             .query(`
// SELECT
//     s.RollNo,
//     s.StudentName,
//     s.ProgramName, 
//     s.TotalEarnedCredits,
//     s.CPI,
//     m.MandatoryCourseCredits,
//     d.Semester,
//     p.ProgramID
// FROM ACADEMICS.dbo.VW_SP_StudentCPIDetails s
// INNER JOIN ACADEMICS.dbo.ProgramMaster p
//     ON s.ProgramName = p.ProgramName
// INNER JOIN ACADEMICS.dbo.MandatoryCourseCredits m
//     ON p.ProgramID = m.ProgramID
// INNER JOIN ACADEMICS.dbo.VW_StudentDetails d
//     ON s.RollNo = d.RollNo
// WHERE d.RollNo = @rollNo
// AND d.Semester = 08
// AND d.Batch=m.Batch
// AND (s.TotalEarnedCredits - m.MandatoryCourseCredits) >= 0
// `);

//         if (result.recordset.length === 0) {
//             return res.status(404).json({
//                 message: "Student not found"
//             });
//         }

//         res.json(result.recordset);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: err.message });
//     }
// });




app.get("/api/student/me", async (req, res) => {
    try {
        const rollNo = req.query.rollNo;  

        if (!rollNo) {
            return res.status(400).json({
                message: "Roll Number is required"
            });
        }

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .query(`
    SELECT
    s.RollNo,
    s.StudentName,
    s.ProgramName,
    s.TotalEarnedCredits,
    s.CPI,
    m.MandatoryCourseCredits,
    d.Semester,
    p.ProgramID
FROM ACADEMICS.dbo.VW_SP_StudentCPIDetails s
INNER JOIN ACADEMICS.dbo.ProgramMaster p
    ON s.ProgramName = p.ProgramName
INNER JOIN ACADEMICS.dbo.MandatoryCourseCredits m
    ON p.ProgramID = m.ProgramID
INNER JOIN ACADEMICS.dbo.VW_StudentDetails d
    ON s.RollNo = d.RollNo
WHERE d.RollNo = @rollNo
AND d.Semester = 08
AND d.Batch=m.Batch
AND (s.TotalEarnedCredits - m.MandatoryCourseCredits) >= 0
  `);

        console.log("DB Result:", result.recordset);

        res.json(result.recordset);   // VERY IMPORTANT
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});


app.get("/api/electives", async (req, res) => {
    try {

        const rollNo = req.query.rollNo;

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .query(`
      SELECT 
    CourseCode,
    CourseName,
    Credits,
    ElectiveType
FROM VW_SP_StudentRegisteredCourseDetails
WHERE RollNo = @rollNo
AND ElectiveType NOT IN ('Core Courses', 'Audit Courses');
    `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});




// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running on port ${PORT}`);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

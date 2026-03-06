const express = require('express');
const cors = require('cors');
const { poolPromise } = require('./config/db');
const sql = require("mssql");
// const authenticateUser = require("./middleware/authenticateUser");

const app = express();
app.use(cors());
app.use(express.json());
// app.use(authenticateUser);

app.get('/api/students', async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query(`
            SELECT 
                vs.StudentMasterID,
                vs.RollNo,
                vs.DisplayName,
                vs.DegreeName,
                vs.Semester AS CurrentSemester,
                vsp.RegSemester AS RegisteredSemester,
                vsp.CourseName,
                vsp.Credits
            FROM VW_StudentDetails vs
            LEFT JOIN VW_SP_StudentRegisteredCourseDetails vsp
                ON vs.StudentMasterID = vsp.StudentMasterID
                AND vsp.RegSemester BETWEEN 1 AND 8
            WHERE 
                vs.DegreeName = 'BTech'
                AND vs.Semester = 8
            ORDER BY 
                vs.RollNo,
                vsp.RegSemester;
        `);

        res.json(result.recordset);

    } catch (err) {
        console.error("Error fetching students:", err);
        res.status(500).send(err.message);
    }
});

// app.get("/api/student/me", async (req, res) => {
//     try {
//         const pool = await poolPromise;

//         const result = await pool.request().query(`
//              const student = await db.query(
//     "SELECT DisplayName FROM VW_StudentDetails WHERE RollNo = ?",
//     [RollNo]`
//         );

//         res.json(result.student[0]);
//     }catch (err) {
//         console.error("Error fetching students:", err);
//         res.status(500).send(err.message);
//     }
// });


app.get("/api/student/me", async (req, res) => {
    try {
        const rollNo = "CS22BT004"; // test roll

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
    d.Semester
FROM ACADEMICS..VW_SP_StudentCPIDetails s
INNER JOIN ProgramMaster p
    ON s.ProgramName = p.ProgramName
INNER JOIN MandatoryCourseCredits m
    ON p.ProgramID = m.ProgramID
INNER JOIN VW_StudentDetails d
    ON s.RollNo = d.RollNo
WHERE s.RollNo = 'CS22BT004'
AND d.Semester = 08
AND (s.TotalEarnedCredits - m.MandatoryCourseCredits) >= 0
  `);

        console.log("DB Result:", result.recordset);

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


app.get("/api/electives", async (req, res) => {
    try {

        const rollNo = "CS22BT004";

        const pool = await poolPromise;

        const result = await pool.request().query(`
      SELECT 
    CourseCode,
    CourseName,
    Credits,
    ElectiveType
FROM VW_SP_StudentRegisteredCourseDetails
WHERE RollNo = 'CS22BT004'
AND ElectiveType NOT IN ('Core Courses', 'Audit Courses');
    `);

        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


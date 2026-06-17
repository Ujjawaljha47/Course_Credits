const express = require('express');
const axios = require("axios"); // add this at top
const cors = require('cors');
const { poolPromise } = require('./config/db');
const sql = require("mssql");
const degreeRoutes = require("./routes/degreeCertificateRoutes");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/degree", degreeRoutes);

function findRollNo(obj) {
  if (!obj || typeof obj !== "object") return null;

  if ("RollNo" in obj) return obj.RollNo;

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const result = findRollNo(obj[key]);
      if (result) return result;
    }
  }

  return null;
}

app.get("/api/current-user", async (req, res) => {
    console.log("Query received:", req.query); 
    console.log("serviceInputs:", req.query.serviceInputs); 
  try {
    const portalResponse = await axios.post(
      "http://10.195.250.128/iProofService/api/RemoteGateway/GetSlotByUserMapId",
      {
        serviceName: "GetSlotByUserMapId",
        serviceInputs: req.query.serviceInputs
      },
      {
        headers: { Cookie: req.headers.cookie }, // forward user cookies
      }
    );

    // Recursively search for RollNo
    const rollNo = findRollNo(portalResponse.data);

    if (!rollNo) return res.status(404).json({ message: "Roll number not found" });

    res.json({ rollNo });
  } catch (err) {
    console.error("Error fetching roll number:", err.message);
    res.status(500).json({ error: "Cannot fetch roll number" });
  }
});

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



app.get('/test-accounts', (req, res) => {
    res.json([
        {
            Name: "Rahul Kumar",
            "Roll No": "IIT001",
            Branch: "CSE",
            Period: "2025-26",
            Amount: "50000",
            "Paid Amount": "20000",
            "Due Date": "15-06-2026",
            "Transaction No": "TXN1001",
            "Payment done By": "UPI",
            "Order No": "ORD001"
        },
        {
            Name: "Priya Sharma",
            "Roll No": "IIT002",
            Branch: "ECE",
            Period: "2025-26",
            Amount: "45000",
            "Paid Amount": "20000",
            "Due Date": "20-06-2026",
            "Transaction No": "",
            "Date of Payment": "",
            "Payment done By": "",
            "Order No": "ORD002"
        }
    ]);
});

app.get('/test-sw', (req, res) => {
    res.json([
        {
            Name: "Rahul Kumar",
            "Roll No": "IIT001",
            Branch: "CSE",
            Period: "2025-26",
            Amount: "50000",
            "Paid Amount": "20000",
            "Is Paid?": "Yes",
            "Verify By": "Admin",
            "Verify On": "27-05-2026"
        },
        {
            Name: "Priya Sharma",
            "Roll No": "IIT002",
            Branch: "ECE",
            Period: "2025-26",
            Amount: "45000",
            "Paid Amount": "25000",
            "Is Paid?": "No",
            "Verify By": "Admin",
            "Verify On": '27-05-2026'
        }
    ]);
});

app.get('/test-academic', (req, res) => {
    res.json([
        {
            Name: "Rahul Kumar",
            "Roll No": "IIT001",
            'Batch': 2023,
            'Program Name': 'CSE',
            'Amount': 50000,
            'Paid Amount': 30000,
            'Date': '12-04-2026',
        }
    ]);
});



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
AND (s.TotalEarnedCredits - m.MandatoryCourseCredits) >= 30
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


app.get("/api/student/eligibility", async (req, res) => {
    try {
        const rollNo = req.query.rollNo;

        if (!rollNo) {
            return res.status(400).json({ message: "Roll Number is required" });
        }

        const pool = await poolPromise;

        const result = await pool
            .request()
            .input("rollNo", sql.VarChar, rollNo)
            .query(`
                SELECT
                    s.RollNo,
                    s.TotalEarnedCredits,
                    m.MandatoryCourseCredits,
                    (s.TotalEarnedCredits - m.MandatoryCourseCredits) AS ExtraEarnedCredits
                FROM ACADEMICS.dbo.VW_SP_StudentCPIDetails s
                INNER JOIN ACADEMICS.dbo.ProgramMaster p
                    ON s.ProgramName = p.ProgramName
                INNER JOIN ACADEMICS.dbo.MandatoryCourseCredits m
                    ON p.ProgramID = m.ProgramID
                INNER JOIN ACADEMICS.dbo.VW_StudentDetails d
                    ON s.RollNo = d.RollNo
                WHERE d.RollNo = @rollNo
                AND d.Semester = 08
                AND d.Batch = m.Batch
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ eligible: false, message: "Student not found" });
        }

        const extra = result.recordset[0].ExtraEarnedCredits;

        res.json({
            eligible: extra >= 30,
            extraEarnedCredits: extra
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


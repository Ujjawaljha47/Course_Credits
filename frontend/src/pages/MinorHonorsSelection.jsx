// import React, { useEffect, useState } from "react";
// import "./MinorHonorsSelection.css";
// import { FaTrash } from "react-icons/fa";
// import { API_URL } from "../config/apiConfig";

// const MinorHonorsSelection = () => {
//     const [student, setStudent] = useState(null);
//     const [electiveType, setElectiveType] = useState("Minor");
//     const [courses, setCourses] = useState([]);
//     const [selectedCourse, setSelectedCourse] = useState("");
//     const [addedCourses, setAddedCourses] = useState([]);

//     const rollNo = "EP22BT008"; // hardcoded


// useEffect(() => {
//     fetch(`${API_URL}/api/student/me?rollNo=${rollNo}`)
//         .then(async res => {

//             const data = await res.json();

//             if (!res.ok) {
//                 alert(data.message);   //backend
//                 return;
//             }

//             if (!data || data.length === 0) {
//                 alert("No student data found");  
//                 return;
//             }

//             setStudent(data[0]);
//         })
//         .catch(err => {
//             console.error(err);
//             alert("Error fetching student data");
//         });

// }, []);



//     // Fetch electives
//     useEffect(() => {
//         fetch(`${API_URL}/api/electives?rollNo=${rollNo}`)
//             .then(res => {
//                 if (!res.ok) {
//                     throw new Error("Server error while fetching electives");
//                 }
//                 return res.json();
//             })
//             .then(data => {
//                 // console.log("Electives:", data);
//                 setCourses(data);
//             })
//             .catch(err => console.error(err));
//     }, []);


//     const handleAdd = () => {
//         const course = courses.find(c => c.CourseCode === selectedCourse);
//         if (!course) return;

//         const newTotalCredits = totalCredits + course.Credits;

//         if (newTotalCredits > extraEarnedCredits) {
//             alert("⚠️Credits exceed your Extra Earned Credits limit. Select accordingly.");
//             return;
//         }

//         if (!addedCourses.some(c => c.CourseCode === course.CourseCode)) {

//             const newCourse = {
//                 ...course,
//                 selectedCategory: electiveType
//             };

//             setAddedCourses([...addedCourses, newCourse]);
//         }
//     };

//     const totalCredits = addedCourses.reduce(
//         (sum, c) => sum + c.Credits,
//         0
//     );

//     const handleDelete = (courseCode) => {
//         const updatedCourses = addedCourses.filter(
//             c => c.CourseCode !== courseCode
//         );
//         setAddedCourses(updatedCourses);
//     };

//     const handleCancel = () => {
//         setAddedCourses([]);
//     };

//     const handleSubmit = () => {

//         alert("Submitted for Approval ✅");
//     };

//     const extraEarnedCredits =
//         student
//             ? Number(student.TotalEarnedCredits) -
//             Number(student.MandatoryCourseCredits)
//             : 0;

//     return (
//         <>
//             <div className="page-header"></div> 
//             <div className="page-wrapper">
//                 <div className="minor-container">
//                     <h1 className="page-title">Minor or Honors Selection</h1>

//                     {/* ---------------- STUDENT PROFILE ---------------- */}
//                     <div className="card">
//                         <h2>Student Profile & Academic Standing</h2>

//                         {student && (
//                             <div className="student-info">

//                                 <div className="info-item">
//                                     <label>Roll No</label>
//                                     <div className="info-box">
//                                         <p>{student?.RollNo}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Student Name</label>
//                                     <div className="info-box">
//                                         <p>{student?.StudentName}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Program</label>
//                                     <div className="info-box">
//                                         <p>{student?.ProgramName}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Mandatory Credits</label>
//                                     <div className="info-box">
//                                         <p>{student?.MandatoryCourseCredits}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Total Earned Credits</label>
//                                     <div className="info-box">
//                                         <p>{student?.TotalEarnedCredits}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Extra Earned Credits</label>
//                                     <div className="info-box">
//                                         <p>{extraEarnedCredits}</p>
//                                     </div>
//                                 </div>

//                                 <div className="info-item">
//                                     <label>Over All CPI</label>
//                                     <div className="info-box">
//                                         <p>{student?.CPI}</p>
//                                     </div>
//                                 </div>

//                             </div>
//                         )}
//                     </div>








//             {/* <div className="card">
//                 <h2>Student Profile & Academic Standing</h2>


//                 {student && (
//                     <div className="student-info">
//                         <div className="info-box">
//                             <label>Roll No</label>
//                             <p>{student?.RollNo}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Student Name</label>
//                             <p>{student?.StudentName}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Program</label>
//                             <p>{student?.ProgramName}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Mandatory Credits</label>
//                             <p>{student?.MandatoryCourseCredits}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Total Earned Credits</label>
//                             <p>{student?.TotalEarnedCredits}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Extra Earned Credits</label>
//                             <p>{extraEarnedCredits}</p>
//                         </div>

//                         <div className="info-box">
//                             <label>Over All CPI</label>
//                             <p>{student?.CPI}</p>
//                         </div>
//                     </div>
//                 )}
//             </div> */}

//                     {/* ---------------- COURSE MAPPING ---------------- */}
//                     <div className="card">
//                         <h2>Minor or Honor Course Mapping</h2>

//                         <div className="radio-group">
//                             <p className="radio-title">Select Required Option *</p>

//                             <div className="radio-group">
//                                 <label className="radio-option">
//                                     <input
//                                         type="radio"
//                                         value="Minor"
//                                         checked={electiveType === "Minor"}
//                                         onChange={(e) => setElectiveType(e.target.value)}
//                                     />
//                                     Minor
//                                 </label>

//                                 <label className="radio-option">
//                                     <input
//                                         type="radio"
//                                         value="Honors"
//                                         checked={electiveType === "Honors"}
//                                         onChange={(e) => setElectiveType(e.target.value)}
//                                     />
//                                     Honors
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="dropdown-section">
//                             <select
//                                 value={selectedCourse}
//                                 onChange={(e) => setSelectedCourse(e.target.value)}
//                             >
//                                 <option value="">Select Course</option>

//                                 {courses
//                                     .filter(c => c.ElectiveType !== "Core courses" && c.ElectiveType !== "Audit Courses" && 
//                                         !addedCourses.some(a => a.CourseCode === c.CourseCode)
//                                     )
//                                     .map(course => {
//                                         const text = `${course.CourseCode} - ${course.CourseName}`;
//                                         const paddedText = text.padEnd(40, " "); // spacing
//                                         return (
//                                             <option key={course.CourseCode} value={course.CourseCode}>
//                                                 {`${course.CourseCode} - ${course.CourseName} (${course.Credits} Credits)`}
//                                             </option>
//                                         );
//                                     })}
//                             </select>

//                             <button className="add-btn" onClick={handleAdd}>
//                                 Add
//                             </button>
//                         </div>

//                         {/* ---------------- TABLE ---------------- */}
//                         <h3>Minor/Honor Course Details</h3>
//                         <div className="table-wrapper">
//                             <table>
//                                 <thead>
//                                     <tr>
//                                         <th>Course Code</th>
//                                         <th>Course Name</th>
//                                         <th>Credits</th>
//                                         <th>Elective Type</th>
//                                         <th>Selected Category</th>
//                                         <th>Action</th> 
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {addedCourses.map(course => (
//                                         <tr key={course.CourseCode}>
//                                             <td>{course.CourseCode}</td>
//                                             <td>{course.CourseName}</td>
//                                             <td>
//                                                 <span className="credit-badge">
//                                                     {course.Credits}
//                                                 </span>
//                                             </td>
//                                             <td>{course.ElectiveType}</td>

//                                             <td>{course.selectedCategory}</td>

//                                             <td>
//                                                 <button
//                                                     className="delete-icon-btn"
//                                                     onClick={() => handleDelete(course.CourseCode)}
//                                                 >
//                                                     <FaTrash />
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* ---------------- TOTAL & BUTTONS ---------------- */}
//                         <div className="footer-section">
//                             {/* {totalCredits > extraEarnedCredits && (
//                                 <div className="credit-warning">
//                                     ⚠️ Total credits exceed Extra Earned Credits
//                                 </div>
//                             )} */}

//                             <div>
//                                 <label>Total Credits Added</label>
//                                 <input value={totalCredits} readOnly />
//                             </div>

//                             <div className="action-buttons">
//                                 <button className="cancel-btn" onClick={handleCancel}>
//                                     Cancel
//                                 </button>
//                                 <button
//                                     className="submit-btn"
//                                     onClick={handleSubmit}
//                                     disabled={totalCredits > extraEarnedCredits}
//                                 >
//                                     Submit
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default MinorHonorsSelection;


import React, { useEffect, useState } from "react";
import "./MinorHonorsSelection.css";
import { FaTrash } from "react-icons/fa";
import { API_URL } from "../config/apiConfig";

const MINOR_COURSES = [
    { CourseName: "Minor in Data Science and Artificial Intelligence" },
    { CourseName: "Minor in Energy and Environment" },
    { CourseName: "Minor in Computer Science and Engineering" },
    { CourseName: "Minor in Smart Systems" },
    { CourseName: "Minor in Mathematics" },
];

const MinorHonorsSelection = () => {
    const [student, setStudent] = useState(null);
    const [electiveType, setElectiveType] = useState("Minor");
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [addedCourses, setAddedCourses] = useState([]);
    const [selectedMinorCourse, setSelectedMinorCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = new URLSearchParams(window.location.search);


    // Fetch electives
    const [rollNo, setRollNo] = useState("");

    // 1️⃣ Fetch current logged-in user's roll number
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const slotResult = params.get("GetSlotByUserMapIdResult");

        console.log("slotResult from URL:", slotResult);

        if (!slotResult) {
            alert("Session not found. Please open this form from CIMS.");
            return;
        }

        fetch(`${API_URL}/api/current-user?serviceInputs=${encodeURIComponent(slotResult)}`, {
            credentials: "include"  
})
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    alert(data.message || "Error fetching current user");
                    return;
                }
                setRollNo(data.rollNo);
            })
            .catch((err) => {
                console.error(err);
                alert("Error fetching current user");
            });
    }, []);

    // 2️⃣ Fetch student profile once rollNo is available
    useEffect(() => {
        if (!rollNo) return;

        fetch(`${API_URL}/api/student/me?rollNo=${rollNo}`)
            .then(async (res) => {
                const data = await res.json();
                if (!res.ok) {
                    alert(data.message);
                    return;
                }
                if (!data || data.length === 0) {
                    alert("No student data found");
                    return;
                }
                setStudent(data[0]);
            })
            .catch(err => {
                console.error(err);
                alert("Error fetching student data");
            });
    }, [rollNo]);


    useEffect(() => {
        if (!rollNo) return;

        fetch(`${API_URL}/api/electives?rollNo=${rollNo}`)
            .then(res => {
                if (!res.ok) throw new Error("Server error while fetching electives");
                return res.json();
            })
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, [rollNo]);

    const totalCredits = addedCourses.reduce((sum, c) => sum + c.Credits, 0);

    const extraEarnedCredits = student
        ? Number(student.TotalEarnedCredits) - Number(student.MandatoryCourseCredits)
        : 0;

    const handleAdd = () => {
        const course = courses.find((c) => c.CourseCode === selectedCourse);

        if (!course) {
            alert("Please select a course first.");
            return;
        }

        if (totalCredits + course.Credits > extraEarnedCredits) {
            alert("⚠️ Credits exceed your Extra Earned Credits limit.");
            return;
        }

        if (!addedCourses.some(c => c.CourseCode === course.CourseCode)) {
            setAddedCourses([...addedCourses, { ...course, selectedCategory: electiveType }]);
        }

        const newCourse = {
            ...course,
            selectedCategory: electiveType,
        };

        setAddedCourses((prev) => [...prev, newCourse]);
        setSelectedCourse(""); // reset dropdown after adding
    };

    const handleDelete = (courseCode) => {
        setAddedCourses(addedCourses.filter(c => c.CourseCode !== courseCode));
    };

    const handleCancel = () => {
        setAddedCourses([]);
        setSelectedMinorCourse(null);
    };

    const handleSubmit = () => {
        // Enforce minor course selection when Minor is chosen
        if (electiveType === "Minor" && !selectedMinorCourse) {
            alert("⚠️ Please select one Minor course before submitting.");
            return;
        }

        const payload = {
            rollNo: student?.RollNo,
            electiveType,
            selectedMinorCourse: electiveType === "Minor" ? selectedMinorCourse : null,
            addedCourses,
        };

        console.log("Submitting:", payload);
        // TODO: Replace with your actual API POST call when ready
        alert("Submitted for Approval ✅");
    };



    // Still loading
    if (loading) {
        return (
            <div className="page-wrapper" style={{ textAlign: "center", paddingTop: "80px" }}>
                <p>Checking eligibility...</p>
            </div>
        );
    }

    // Not eligible
    if (extraEarnedCredits < 30) {
        return (
            <div className="page-wrapper">
                <div className="minor-container">
                    <h1 className="page-title">Minor or Honors Selection</h1>
                    <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🚫</div>
                        <h2 style={{ color: "#c0392b", marginBottom: "12px" }}>Not Eligible</h2>
                        <p style={{ fontSize: "15px", color: "#555", maxWidth: "480px", margin: "0 auto" }}>
                            You need a minimum of <strong>30 Extra Earned Credits</strong> to access this form.
                        </p>
                        <p style={{ marginTop: "12px", fontSize: "15px", color: "#555" }}>
                            Your current Extra Earned Credits:{" "}
                            <strong style={{ color: "#c0392b" }}>{extraEarnedCredits}</strong>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Eligible — full form
    return (
        <>
            <div className="page-header"></div>
            <div className="page-wrapper">
                <div className="minor-container">
                    <h1 className="page-title">Minor or Honors Selection</h1>

                    {/* ---------------- STUDENT PROFILE ---------------- */}
                    <div className="card">
                        <h2>Student Profile & Academic Standing</h2>
                        {student && (
                            // <div className="student-info">
                            //     <div className="info-item">
                            //         <label>Roll No</label>
                            //         <div className="info-box"><p>{student?.RollNo}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Student Name</label>
                            //         <div className="info-box"><p>{student?.StudentName}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Program</label>
                            //         <div className="info-box"><p>{student?.ProgramName}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Mandatory Credits</label>
                            //         <div className="info-box"><p>{student?.MandatoryCourseCredits}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Total Earned Credits</label>
                            //         <div className="info-box"><p>{student?.TotalEarnedCredits}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Extra Earned Credits</label>
                            //         <div className="info-box"><p>{extraEarnedCredits}</p></div>
                            //     </div>
                            //     <div className="info-item">
                            //         <label>Over All CPI</label>
                            //         <div className="info-box"><p>{student?.CPI}</p></div>
                            //     </div>
                            // </div>

                            <div className="student-info">
                                {["RollNo", "StudentName", "ProgramName", "MandatoryCourseCredits", "TotalEarnedCredits", "CPI"].map(key => (
                                    <div className="info-item" key={key}>
                                        <label>{key.replace(/([A-Z])/g, ' $1')}</label>
                                        <div className="info-box">
                                            <p>{key === "TotalEarnedCredits" ? student[key] : student[key]}</p>
                                        </div>
                                    </div>
                                ))}
                                <div className="info-item">
                                    <label>Extra Earned Credits</label>
                                    <div className="info-box">
                                        <p>{extraEarnedCredits}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h2>Minor or Honor Course Mapping</h2>

                        <div className="radio-group">
                            <p className="radio-title">Select Required Option *</p>
                            <div className="radio-group">
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        value="Minor"
                                        checked={electiveType === "Minor"}
                                        onChange={(e) => setElectiveType(e.target.value)}
                                    />
                                    Minor
                                </label>
                                <label className="radio-option">
                                    <input
                                        type="radio"
                                        value="Honors"
                                        checked={electiveType === "Honors"}
                                        onChange={(e) => setElectiveType(e.target.value)}
                                    />
                                    Honors
                                </label>
                            </div>
                        </div>

                        {/* ── Select One Minor Course ── */}
                        {electiveType === "Minor" && (
                            <div style={{ marginTop: "20px" }}>
                                <p style={{ fontWeight: "600", marginBottom: "10px" }}>
                                    Select One Minor Course <span style={{ color: "red" }}>*</span>
                                </p>
                                {!selectedMinorCourse ? (
                                    <div className="table-wrapper">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Select</th>
                                                    <th>Course Name</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {MINOR_COURSES.map((course) => (
                                                    <tr key={course.CourseName}>
                                                        <td>
                                                            <input
                                                                type="radio"
                                                                name="minorCourse"
                                                                onChange={() => setSelectedMinorCourse(course)}
                                                            />
                                                        </td>
                                                        <td>{course.CourseName}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "16px",
                                        padding: "12px 16px",
                                        backgroundColor: "#f3e8ff",
                                        border: "1px solid #9026e7",
                                        borderRadius: "8px",
                                        width: "fit-content",
                                    }}>
                                        <span style={{ fontWeight: "600", color: "#9026e7" }}>
                                            ✅ {selectedMinorCourse.CourseName}
                                        </span>
                                        <button
                                            onClick={() => setSelectedMinorCourse(null)}
                                            style={{
                                                background: "none",
                                                border: "1px solid #9026e7",
                                                borderRadius: "5px",
                                                color: "#9026e7",
                                                cursor: "pointer",
                                                padding: "3px 10px",
                                                fontSize: "13px",
                                            }}
                                        >
                                            Change
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Dropdown + Add ── */}
                        <div className="dropdown-section" style={{ marginTop: "10px" }}>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                            >
                                <option value="">Select Course</option>
                                {courses
                                    .filter((c) =>
                                        c.ElectiveType !== "Core courses" &&
                                        c.ElectiveType !== "Audit Courses" &&
                                        !addedCourses.some((a) => a.CourseCode === c.CourseCode)
                                    )
                                    .map((course) => (
                                        <option key={course.CourseCode} value={course.CourseCode}>
                                            {`${course.CourseCode} - ${course.CourseName} (${course.Credits} Credits)`}
                                        </option>
                                    ))}
                            </select>
                            <button className="add-btn" onClick={handleAdd}>Add</button>
                        </div>

                        {/* ── Table ── */}
                        <h3>Minor/Honor Course Details</h3>
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Credits</th>
                                        <th>Elective Type</th>
                                        <th>Selected Category</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {addedCourses.map(course => (
                                        <tr key={course.CourseCode}>
                                            <td>{course.CourseCode}</td>
                                            <td>{course.CourseName}</td>
                                            <td><span className="credit-badge">{course.Credits}</span></td>
                                            <td>{course.ElectiveType}</td>
                                            <td>{course.selectedCategory}</td>
                                            <td>
                                                <button
                                                    className="delete-icon-btn"
                                                    onClick={() => handleDelete(course.CourseCode)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Footer ── */}
                        <div className="footer-section">
                            <div>
                                <label>Total Credits Added</label>
                                <input value={totalCredits} readOnly />
                            </div>
                            <div className="action-buttons">
                                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                <button
                                    className="submit-btn"
                                    onClick={handleSubmit}
                                    disabled={totalCredits > extraEarnedCredits}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </>
    );   
};

export default MinorHonorsSelection;


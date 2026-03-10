// import React, { useEffect, useState } from "react";
// import "./CourseSelection.css";

// const CourseSelection = () => {
//   const [groupedData, setGroupedData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const studentsPerPage = 7;

//   // Fetch data
//   useEffect(() => {
//     fetch("http://localhost:5000/api/students")
//       .then((res) => res.json())
//       .then((data) => {
//         groupByStudent(data);
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   // Group students by RollNo
//   const groupByStudent = (data) => {
//     const grouped = {};

//     data.forEach((item) => {
//       const roll = item.RollNo;

//       if (!grouped[roll]) {
//         grouped[roll] = {
//           name: item.DisplayName,
//           currentSem: item.CurrentSemester,
//           degreeName: item.DegreeName,
//           semesters: {},
//         };
//       }

//       if (item.RegisteredSemester && item.CourseName) {
//         if (!grouped[roll].semesters[item.RegisteredSemester]) {
//           grouped[roll].semesters[item.RegisteredSemester] = [];
//         }

//         grouped[roll].semesters[item.RegisteredSemester].push({
//           course: item.CourseName,
//           credits: item.Credits,
//         });
//       }
//     });

//     setGroupedData(grouped);
//     setCurrentPage(1); // Reset to first page after data load
//   };

//   // Convert object to array
//   const studentEntries = Object.entries(groupedData);

//   // Pagination calculations
//   const totalPages = Math.ceil(studentEntries.length / studentsPerPage);

//   const indexOfLastStudent = currentPage * studentsPerPage;
//   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

//   const currentStudents = studentEntries.slice(
//     indexOfFirstStudent,
//     indexOfLastStudent
//   );

//   // Prevent invalid page
//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(1);
//     }
//   }, [totalPages]);

//   // ===== Limited Pagination (3 Buttons Only) =====
//   const maxButtons = 3;

//   let startPage = currentPage - 1;
//   if (startPage < 1) startPage = 1;
//   if (startPage > totalPages - 2)
//     startPage = Math.max(1, totalPages - 2);

//   let endPage = Math.min(startPage + maxButtons - 1, totalPages);

//   return (
//     <div className="container">
//       <h2>Course Selection - 8th Semester BTech Students</h2>

//       {/* Loading */}
//       {studentEntries.length === 0 ? (
//         <p>Loading students...</p>
//       ) : (
//         currentStudents.map(([roll, student]) => {
//           const semesters = Object.keys(student.semesters).sort(
//             (a, b) => a - b
//           );

//           return (
//             <div key={roll} className="student-card">
//               <h3>
//                 Name: {student.name} <br />
//                 Roll No.: {roll}
//               </h3>

//               <p>
//                 Current Semester: {student.currentSem} <br />
//                 Degree: {student.degreeName}
//               </p>

//               {semesters.length === 0 ? (
//                 <p className="no-course">
//                   No course registrations found.
//                 </p>
//               ) : (
//                 semesters.map((sem) => {
//                   const totalCredits = student.semesters[sem].reduce(
//                     (sum, c) => sum + (c.credits || 0),
//                     0
//                   );

//                   return (
//                     <div key={sem} className="semester-block">
//                       <h4>Semester {sem}</h4>
//                       <ul>
//                         {student.semesters[sem].map((course, index) => (
//                           <li key={index}>
//                             {course.course} ({course.credits} Credits)
//                           </li>
//                         ))}
//                       </ul>
//                       <strong>Total Credits: {totalCredits}</strong>
//                     </div>
//                   );
//                 })
//               )}
//             </div>
//           );
//         })
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="pagination">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//           >
//             Previous
//           </button>

//           {Array.from(
//             { length: endPage - startPage + 1 },
//             (_, index) => {
//               const pageNumber = startPage + index;

//               return (
//                 <button
//                   key={pageNumber}
//                   className={
//                     currentPage === pageNumber ? "active-page" : ""
//                   }
//                   onClick={() => setCurrentPage(pageNumber)}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             }
//           )}

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CourseSelection;



// // import React, { useEffect, useState } from "react";
// // import "./CourseSelection.css";

// // const CourseSelection = () => {
// //   const [groupedData, setGroupedData] = useState({});
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const studentsPerPage = 10;

// //   // Fetch data
// //   useEffect(() => {
// //     fetch("http://localhost:5000/api/students")
// //       .then((res) => res.json())
// //       .then((data) => {
// //         groupByStudent(data);
// //       })
// //       .catch((err) => console.error(err));
// //   }, []);

// //   // Group students by RollNo
// //   const groupByStudent = (data) => {
// //     const grouped = {};

// //     data.forEach((item) => {
// //       const roll = item.RollNo;

// //       if (!grouped[roll]) {
// //         grouped[roll] = {
// //           name: item.DisplayName,
// //           currentSem: item.CurrentSemester,
// //           degreeName: item.DegreeName,
// //           semesters: {},
// //         };
// //       }

// //       if (item.RegisteredSemester && item.CourseName) {
// //         if (!grouped[roll].semesters[item.RegisteredSemester]) {
// //           grouped[roll].semesters[item.RegisteredSemester] = [];
// //         }

// //         grouped[roll].semesters[item.RegisteredSemester].push({
// //           course: item.CourseName,
// //           credits: item.Credits,
// //         });
// //       }
// //     });

// //     setGroupedData(grouped);
// //     setCurrentPage(1); // Reset to page 1 after data loads
// //   };

// //   // Convert object → array
// //   const studentEntries = Object.entries(groupedData);

// //   // Pagination logic
// //   const indexOfLastStudent = currentPage * studentsPerPage;
// //   const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

// //   const currentStudents = studentEntries.slice(
// //     indexOfFirstStudent,
// //     indexOfLastStudent
// //   );

// //   const totalPages = Math.ceil(studentEntries.length / studentsPerPage);

// //   return (
// //     <div className="container">
// //       <h2>Course Selection - 8th Semester BTech Students</h2>

// //       {currentStudents.length === 0 ? (
// //         <p>Loading students...</p>
// //       ) : (
// //         currentStudents.map(([roll, student]) => {
// //           const semesters = Object.keys(student.semesters).sort(
// //             (a, b) => a - b
// //           );

// //           return (
// //             <div key={roll} className="student-card">
// //               <h3>
// //                 Name: {student.name} <br />
// //                 Roll No.: {roll}
// //               </h3>

// //               <p>
// //                 Current Semester: {student.currentSem} <br />
// //                 Degree: {student.degreeName}
// //               </p>

// //               {semesters.length === 0 ? (
// //                 <p className="no-course">
// //                   No course registrations found.
// //                 </p>
// //               ) : (
// //                 semesters.map((sem) => {
// //                   const totalCredits = student.semesters[sem].reduce(
// //                     (sum, c) => sum + (c.credits || 0),
// //                     0
// //                   );

// //                   return (
// //                     <div key={sem} className="semester-block">
// //                       <h4>Semester {sem}</h4>
// //                       <ul>
// //                         {student.semesters[sem].map((course, index) => (
// //                           <li key={index}>
// //                             {course.course} ({course.credits} Credits)
// //                           </li>
// //                         ))}
// //                       </ul>
// //                       <strong>Total Credits: {totalCredits}</strong>
// //                     </div>
// //                   );
// //                 })
// //               )}
// //             </div>
// //           );
// //         })
// //       )}

// //       {/* Pagination Controls */}
// //       {totalPages > 1 && (
// //         <div className="pagination">
// //           <button
// //             disabled={currentPage === 1}
// //             onClick={() => setCurrentPage(currentPage - 1)}
// //           >
// //             Previous
// //           </button>

// //           {Array.from({ length: totalPages }, (_, index) => (
// //             <button
// //               key={index}
// //               className={currentPage === index + 1 ? "active-page" : ""}
// //               onClick={() => setCurrentPage(index + 1)}
// //             >
// //               {index + 1}
// //             </button>
// //           ))}

// //           <button
// //             disabled={currentPage === totalPages}
// //             onClick={() => setCurrentPage(currentPage + 1)}
// //           >
// //             Next
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CourseSelection;



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseSelection.css";
import { API_URL } from "../config/apiConfig";
import '@fortawesome/fontawesome-free/css/all.min.css';

const CourseSelection = () => {
  const [groupedData, setGroupedData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState({});

  const navigate = useNavigate();

  const studentsPerPage = 10;

  // Fetch Data
  useEffect(() => {
    fetch(`${API_URL}/api/students`)
      .then((res) => res.json())
      .then((data) => {
        groupByStudent(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Group Students by RollNo
  const groupByStudent = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const roll = item.RollNo;

      if (!grouped[roll]) {
        grouped[roll] = {
          name: item.DisplayName,
          currentSem: item.CurrentSemester,
          degreeName: item.DegreeName,
          semesters: {},
        };
      }

      if (item.RegisteredSemester && item.CourseName) {
        if (!grouped[roll].semesters[item.RegisteredSemester]) {
          grouped[roll].semesters[item.RegisteredSemester] = [];
        }

        grouped[roll].semesters[item.RegisteredSemester].push({
          course: item.CourseName,
          credits: item.Credits,
        });
      }
    });

    setGroupedData(grouped);
    setCurrentPage(1); // reset page after load
  };

  // Convert object to array
  const studentEntries = Object.entries(groupedData);

  // Pagination calculations
  const totalPages = Math.ceil(studentEntries.length / studentsPerPage);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  const currentStudents = studentEntries.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Prevent invalid page
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages]);

  // ===== Limited Pagination (3 Buttons Only) =====
  const maxButtons = 3;

  let startPage = currentPage - 1;
  if (startPage < 1) startPage = 1;
  if (startPage > totalPages - 2)
    startPage = Math.max(1, totalPages - 2);

  let endPage = Math.min(startPage + maxButtons - 1, totalPages);

  return (
    <div className="container">
      <h2>Course Selection - 8th Semester BTech Students</h2>

      {/* Loading */}
      {studentEntries.length === 0 ? (
        <p>Loading students...</p>
      ) : (
        currentStudents.map(([roll, student]) => {
          const semesters = Object.keys(student.semesters).sort(
            (a, b) => a - b
          );

          return (
            <div key={roll} className="student-card">
              <h3>
                Name: {student.name} <br />
                Roll No.: {roll}
              </h3>

              <p>
                Current Semester: {student.currentSem} <br />
                Degree: {student.degreeName}
              </p>

              {/* Semester Buttons */}
              <div style={{ marginTop: "10px" }}>
                {semesters.map((sem) => (
                  <button
                    key={sem}
                    style={{
                      marginRight: "8px",
                      padding: "6px 12px",
                      backgroundColor:
                        selectedSemester[roll] === sem
                          ? "#4fd34a"
                          : "#9026e7",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setSelectedSemester((prev) => ({
                        ...prev,
                        [roll]: sem,
                      }))
                    }
                  >
                    Semester {sem}
                  </button>
                ))}
              </div>

              {/* Show Selected Semester Courses */}
              {selectedSemester[roll] && (
                <div className="semester-block" style={{ marginTop: "15px" }}>
                  <h4>Semester {selectedSemester[roll]}</h4>

                  <ul>
                    {student.semesters[selectedSemester[roll]].map(
                      (course, index) => (
                        <li key={index}>
                          {course.course} ({course.credits} Credits)
                        </li>
                      )
                    )}
                  </ul>

                  <strong>
                    Total Credits:{" "}
                    {student.semesters[selectedSemester[roll]].reduce(
                      (sum, c) => sum + (c.credits || 0),
                      0
                    )}
                  </strong>
                </div>
              )}
            </div>
          );
        })
      )}

      <h2><button
        onClick={() => navigate("/")}
        style={{
          marginBottom: "5px",
          padding: "4px 5px",
          backgroundColor: "#9026e7",
          color: "white",
          textSize:"5px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        <i className="fas fa-arrow-left"></i>
      </button></h2>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {Array.from(
            { length: endPage - startPage + 1 },
            (_, index) => {
              const pageNumber = startPage + index;

              return (
                <button
                  key={pageNumber}
                  className={
                    currentPage === pageNumber ? "active-page" : ""
                  }
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseSelection;
import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { getStudents, getStudentDetails } from "../../../Services/degreeCertificateService";

import "./DegreeStudentListPage.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function DegreeStudentListPage() {

  const [showExportMenu, setShowExportMenu] = useState(false);
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(3);
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / pageSize);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const {
    convocation,
    batch,
    departmentName,
    degreeName,
    specializationName
  } = location.state || {};

  const convocationNumber =
    convocation?.split(" ")[0] || "";

  const convocationDate =
    convocation?.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "";

  const filters = location.state;

  const handleFilterChange = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  useEffect(() => {

    if (filters) {
      loadStudents();
    }

  }, [filters, page]);

  const loadStudents = async () => {
    try {
      const response = await getStudents({
        ...filters,
        page,
        pageSize
      });

      setStudents(response.data.students);
      setTotalRecords(response.data.totalRecords);

    } catch (error) {
      console.error(error);
    }
  };

  const handleStudentClick = async (
    studentMasterId
  ) => {

    console.log(
      "Clicked Student:",
      studentMasterId
    );

    try {

      const response =
        await getStudentDetails(
          studentMasterId
        );

      console.log(
        "Student Details:",
        response.data
      );

      setSelectedStudent(
        response.data
      );

      setShowModal(true);

    } catch (error) {

      console.error(
        "Student Details Error:",
        error
      );

    }
  };

  const exportToExcel = () => {

    const exportData = students.map(
      (student, index) => ({
        "S.No": index + 1,
        "Roll No": student.RollNo,
        "Name (English)": student.DisplayName,
        "Name (Hindi)": student.NameinHindi,
        "Honours": student.Honor || "",
        "Minor": student.Minor || "",
        "Degree": student.DegreeName,
        "Department": student.DepartmentName,
        "Specialization":
          student.SpecializationName || "",
        "Course Completion Date":
          student.CourseCompletionDate
            ? new Date(
              student.CourseCompletionDate
            ).toLocaleDateString()
            : "",
        "Online Convocation Form":
          student.OnlineConvocationFormFilled
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer =
      XLSX.write(
        workbook,
        {
          bookType: "xlsx",
          type: "array"
        }
      );

    const fileData =
      new Blob(
        [excelBuffer],
        {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      );

    saveAs(
      fileData,
      "DegreeCertificateStudents.xlsx"
    );
  };

  const exportToCSV = () => {

    const exportData = students.map(
      (student, index) => ({
        "S.No": index + 1,
        "Roll No": student.RollNo,
        "Name (English)": student.DisplayName,
        "Name (Hindi)": student.NameinHindi,
        "Honours": student.Honor || "",
        "Minor": student.Minor || "",
        "Degree": student.DegreeName,
        "Department": student.DepartmentName,
        "Specialization":
          student.SpecializationName || "",
        "Course Completion Date":
          student.CourseCompletionDate
            ? new Date(
              student.CourseCompletionDate
            ).toLocaleDateString()
            : "",
        "Online Convocation Form":
          student.OnlineConvocationFormFilled
      })
    );

    const worksheet =
      XLSX.utils.json_to_sheet(
        exportData
      );

    const csv =
      XLSX.utils.sheet_to_csv(
        worksheet
      );

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;"
        }
      );

    saveAs(
      blob,
      "DegreeCertificateStudents.csv"
    );
  };


  return (
    <div className="degree-student-page">

      <div className="dc-page-header">

        <h2>Degree Certificate Generation</h2>

        <p>
          Review selected filters and generate
          student degree certificates.
        </p>

      </div>

      <div className="dc-summary-card">

        <div className="dc-summary-title">
          Review Degree Certificate Details
        </div>

        <div className="dc-summary-grid">

          <div className="dc-summary-item">
            <label>Convocation Number</label>
            <span>{convocationNumber}</span>
          </div>

          <div className="dc-summary-item">
            <label>Convocation Date</label>
            <span>{convocationDate}</span>
          </div>

          <div className="dc-summary-item">
            <label>Batch Year</label>
            <span>{batch}</span>
          </div>

          <div className="dc-summary-item">
            <label>Program</label>
            <span>{degreeName}</span>
          </div>

          <div className="dc-summary-item">
            <label>Specialization</label>
            <span>{specializationName || "None"}</span>
          </div>

        </div>

      </div>

      <div className="dc-student-header">

        <h4>Student List</h4>

        <div className="dc-header-actions">

          <div className="dc-record-count">
            Total Records: {totalRecords}
          </div>

          <div className="dc-export-wrapper">

            <button
              className="dc-export-btn"
              onClick={() =>
                setShowExportMenu(
                  !showExportMenu
                )
              }
            >
              Export ▼
            </button>

            {showExportMenu && (

              <div className="dc-export-menu">

                <button
                  onClick={exportToExcel}
                >
                  Export Excel
                </button>

                <button
                  onClick={exportToCSV}
                >
                  Export CSV
                </button>

              </div>

            )}

          </div>

        </div>

      </div>
      <div className="dc-table-wrapper">

        <table className="dc-table">

          <thead>
            <tr>
              <th>S.No</th>
              <th>Roll No</th>
              <th>Name (English)</th>
              <th>Name (Hindi)</th>
              <th>Honours</th>
              <th>Minor</th>
              <th>Program</th>
              <th>Department</th>
              <th>Completion Date</th>
              <th>Convocation Form Filled</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {students.map((student, index) => (

              <tr key={student.StudentMasterID}>

                <td>
                  {(page - 1) * pageSize + index + 1}
                </td>

                <td>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    handleStudentClick(student.StudentMasterID);
                  }}
                  >
                    {student.RollNo}
                  </a>
                </td>

                <td>{student.DisplayName}</td>

                <td>{student.NameinHindi}</td>

                <td>{student.Honor || "-"}</td>

                <td>{student.Minor || "-"}</td>

                <td>{student.DegreeName}</td>

                <td>{student.DepartmentName}</td>

                <td>
                  {student.CourseCompletionDate
                    ? new Date(
                      student.CourseCompletionDate
                    ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <span
                    className={
                      student.OnlineConvocationFormFilled ===
                        "YES"
                        ? "status-yes"
                        : "status-no"
                    }
                  >
                    {student.OnlineConvocationFormFilled}
                  </span>
                </td>

                <td>
                  <button className="dc-preview-btn">
                    Preview
                  </button>
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {showModal && (
        <div className="student-modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <h4>
                Student Details
              </h4>

              <button
                className="close-btn"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>

            {selectedStudent && (

              <table className="table table-bordered">

                <tbody>

                  <tr>
                    <th>Roll No</th>
                    <td>
                      {selectedStudent.RollNo}
                    </td>
                  </tr>

                  <tr>
                    <th>Name</th>
                    <td>
                      {selectedStudent.DisplayName}
                    </td>
                  </tr>

                  <tr>
                    <th>Name In Hindi</th>
                    <td>
                      {selectedStudent.NameinHindi}
                    </td>
                  </tr>

                  <tr>
                    <th>Degree</th>
                    <td>
                      {selectedStudent.DegreeName}
                    </td>
                  </tr>

                  <tr>
                    <th>Department</th>
                    <td>
                      {selectedStudent.DepartmentName}
                    </td>
                  </tr>

                  <tr>
                    <th>Specialization</th>
                    <td>
                      {selectedStudent.SpecializationName}
                    </td>
                  </tr>

                  <tr>
                    <th>Course Completion</th>
                    <td>
                      {selectedStudent.CourseCompletionDate}
                    </td>
                  </tr>

                </tbody>

              </table>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default DegreeStudentListPage;
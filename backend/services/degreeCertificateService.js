const sql = require("mssql");
const poolPromise = require("../config/db").poolPromise;

exports.getConvocations = async () => {

  const pool = await poolPromise;

  const result = await pool.request()
    .query(`
      SELECT DISTINCT Convocation
      FROM StudentAcademicDetails
      WHERE Convocation IS NOT NULL
      ORDER BY Convocation DESC
    `);

  return result.recordset;
};

exports.getBatches = async () => {

  const pool = await poolPromise;

  const result = await pool.request()
    .query(`
      SELECT DISTINCT Batch
      FROM StudentAcademicDetails
      WHERE Batch IS NOT NULL
      ORDER BY Batch DESC
    `);

  return result.recordset;
};

exports.getDepartments = async () => {

  const pool = await poolPromise;

  const result = await pool.request()
    .query(`
      SELECT DISTINCT
             DepartmentID,
             DepartmentName
      FROM VW_StudentDetails
      WHERE DepartmentID IS NOT NULL
      ORDER BY DepartmentName
    `);

  return result.recordset;
};

exports.getDegrees = async () => {

  const pool = await poolPromise;

  const result = await pool.request()
    .query(`
      SELECT DISTINCT
             DegreeID,
             DegreeName
      FROM VW_StudentDetails
      WHERE DegreeID IS NOT NULL
      ORDER BY DegreeName
    `);

  return result.recordset;
};

exports.getSpecializations = async () => {
  const pool = await poolPromise;

  const result = await pool.request()
    .query(`
      SELECT DISTINCT
             SpecializationID,
             SpecializationName
      FROM VW_StudentDetails
      WHERE SpecializationID IS NOT NULL
      ORDER BY SpecializationName
    `);

  return result.recordset;
};



exports.getStudents = async (
  filters,
  page,
  pageSize
) => {

  const pool = await poolPromise;

  page = page || 1;
  pageSize = pageSize || 20;

  const request = pool.request();
  const countRequest = pool.request();

  // STUDENT QUERY
  

  let query = `
    SELECT
        V.StudentMasterID,
        V.RollNo,
        V.DisplayName,
        CRF.NameinHindi,
        CRF.Honor,
        CRF.Minor,
        V.DegreeName,
        V.DepartmentName,
        V.SpecializationName,
        A.CourseCompletionDate,
        A.Convocation,

        CASE
            WHEN CRF.ApplicationStatus = 'Submitted'
            THEN 'YES'
            ELSE 'NO'
        END AS OnlineConvocationFormFilled

    FROM VW_StudentDetails V

    LEFT JOIN Academics..StudentAcademicDetails A
        ON V.StudentMasterID = A.StudentMasterID

    LEFT JOIN ConvocationRegistrationForm CRF
        ON V.RollNo = CRF.RollNo

    WHERE 1 = 1
      AND A.CourseCompletionDate IS NOT NULL
  `;

  
  // COUNT QUERY
  

  let countQuery = `
    SELECT COUNT(*) AS TotalRecords

    FROM VW_StudentDetails V

    LEFT JOIN Academics..StudentAcademicDetails A
        ON V.StudentMasterID = A.StudentMasterID

    LEFT JOIN ConvocationRegistrationForm CRF
        ON V.RollNo = CRF.RollNo

    WHERE 1 = 1
      AND A.CourseCompletionDate IS NOT NULL
  `;

  // CONVOCATION
  

  if (filters.convocation) {

    query += ` AND A.Convocation = @Convocation`;
    countQuery += ` AND A.Convocation = @Convocation`;

    request.input(
      "Convocation",
      sql.VarChar,
      filters.convocation
    );

    countRequest.input(
      "Convocation",
      sql.VarChar,
      filters.convocation
    );
  }


  // BATCH
  

  if (filters.batch) {

    query += ` AND V.Batch = @Batch`;
    countQuery += ` AND V.Batch = @Batch`;

    request.input(
      "Batch",
      sql.VarChar,
      filters.batch
    );

    countRequest.input(
      "Batch",
      sql.VarChar,
      filters.batch
    );
  }


  // DEPARTMENT


  if (filters.departmentId) {

    query += ` AND V.DepartmentID = @DepartmentID`;
    countQuery += ` AND V.DepartmentID = @DepartmentID`;

    request.input(
      "DepartmentID",
      sql.UniqueIdentifier,
      filters.departmentId
    );

    countRequest.input(
      "DepartmentID",
      sql.UniqueIdentifier,
      filters.departmentId
    );
  }


  // DEGREE
 

  if (filters.degreeId) {

    query += ` AND V.DegreeID = @DegreeID`;
    countQuery += ` AND V.DegreeID = @DegreeID`;

    request.input(
      "DegreeID",
      sql.UniqueIdentifier,
      filters.degreeId
    );

    countRequest.input(
      "DegreeID",
      sql.UniqueIdentifier,
      filters.degreeId
    );
  }

  // SPECIALIZATION
  

  if (filters.specializationId) {

    query += ` AND V.SpecializationID = @SpecializationID`;
    countQuery += ` AND V.SpecializationID = @SpecializationID`;

    request.input(
      "SpecializationID",
      sql.UniqueIdentifier,
      filters.specializationId
    );

    countRequest.input(
      "SpecializationID",
      sql.UniqueIdentifier,
      filters.specializationId
    );
  }

  // PAGINATION
 

  query += `
    ORDER BY V.RollNo
    OFFSET (@Page - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY
  `;

  request.input("Page", sql.Int, page);
  request.input("PageSize", sql.Int, pageSize);

  // ==========================
  // EXECUTE QUERIES
  // ==========================

  const result = await request.query(query);

  const countResult =
    await countRequest.query(countQuery);

  return {
    students: result.recordset,
    totalRecords:
      countResult.recordset[0].TotalRecords,
    page,
    pageSize
  };
};

//Student Basic Detaila
exports.getStudentDetails = async (
    studentMasterId
) => {

    const pool = await poolPromise;

    const result =
        await pool.request()
            .input(
                "StudentMasterID",
                sql.VarChar,
                studentMasterId
            )
            .query(`
                SELECT
                    V.RollNo,
                    V.DisplayName,
                    CRF.NameinHindi,
                    V.DepartmentName,
                    V.DegreeName,
                    V.SpecializationName,
                    A.Batch,
                    A.Semester,
                    A.CourseCompletionDate
                FROM VW_StudentDetails V

                LEFT JOIN Academics..StudentAcademicDetails A
                    ON V.StudentMasterID =
                       A.StudentMasterID

                LEFT JOIN ConvocationRegistrationForm CRF
                    ON V.RollNo = CRF.RollNo

                WHERE V.StudentMasterID =
                      @StudentMasterID
            `);

    return result.recordset[0];
};

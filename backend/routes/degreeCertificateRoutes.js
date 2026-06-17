const express = require("express");
const router = express.Router();

const {
  getConvocations,
  getBatches,
  getDepartments,
  getDegrees,
  getSpecializations,
  getStudents,
  getStudentDetails
} = require("../controllers/degreeCertificateController");

router.get("/convocations", getConvocations);

router.get("/batches", getBatches);

router.get("/departments", getDepartments);

router.get("/degrees", getDegrees);

router.get("/specializations",getSpecializations);

router.post("/students",getStudents);

router.get("/student/:studentMasterId",getStudentDetails);

module.exports = router;
const degreeService = require("../services/degreeCertificateService");

exports.getConvocations = async (req, res) => {
  try {
    const result = await degreeService.getConvocations();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBatches = async (req, res) => {
  try {

    const result = await degreeService.getBatches();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
        success: false,
      message: error.message
    });

  }
};


exports.getDepartments = async (req, res) => {
  try {

    const result = await degreeService.getDepartments();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getDegrees = async (req, res) => {
  try {

    const result =
      await degreeService.getDegrees();

    res.status(200).json(result);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const result = await degreeService.getSpecializations(
      req.body
    );

    res.status(200).json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
};


exports.getStudents = async (req, res) => {

    const {
        page = 1,
        pageSize = 3,
        ...filters
    } = req.body;

    const result =
        await degreeService.getStudents(filters, page, pageSize);

    res.json(result);
};

exports.getStudentDetails = async (req, res) => {

    const result =
        await degreeService.getStudentDetails(
            req.params.studentMasterId
        );

    res.json(result);
};
const { validations } = require("../middlewares/validations");
const { check } = require("express-validator");

const validateTreatment = [
  check("name", "name is required").not().isEmpty(),
  check("total", "total is required").not().isEmpty(),
  validations
];

module.exports = validateTreatment;
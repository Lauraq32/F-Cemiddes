const { validations } = require("../middlewares/validations");
const { check } = require("express-validator");

const validateLogin = [
  check("email", "email is required").isEmail(),
  check("password", "password is required").not().isEmpty(),
  validations
];

module.exports = validateLogin;
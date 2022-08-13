const { check } = require("express-validator");

const checkId = () => check('id', 'is not a valid ID').isMongoId();

module.exports = checkId;
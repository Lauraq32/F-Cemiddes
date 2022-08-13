const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { validations } = require("../middlewares/validations");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const UserController = require("../controllers/UserController");
const validateSignup = require("../validators/validateSignup");

// base path: api/users
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/:id", checkId(), UserController.get);

// write operations
router.put("/:id", checkAdminRoleAndId(), validateSignup, UserController.put);
router.delete("/:id", checkAdminRoleAndId(), UserController.delete);

router.use(validations);

module.exports = router;
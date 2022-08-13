const { Router } = require("express");
const { validations } = require("../middlewares/validations");
const UserController = require("../controllers/UserController");
const validateSignup = require("../validators/validateSignup");
const validateLogin = require("../validators/validateLogin");

// base path: api/users
const router = Router();

// write operations
router.post("/signup", validateSignup, UserController.post);
router.post("/login", validateLogin, UserController.login);

router.use(validations);

module.exports = router;

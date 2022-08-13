const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const PatientController = require("../controllers/PatientController");
const validatePatient = require("../validators/validatePatient");

// base path: api/patients
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", PatientController.getAll);
router.get("/:id", checkId(), PatientController.get);

// write operations
router.post("/", validatePatient, PatientController.post);
router.put("/:id", checkAdminRoleAndId(), validatePatient, PatientController.put);
router.delete("/:id", checkAdminRoleAndId(), PatientController.delete);

module.exports = router;

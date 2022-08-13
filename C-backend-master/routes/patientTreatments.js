const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { validations } = require("../middlewares/validations");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const PatientTreatmentController = require("../controllers/PatientTreatmentController");

// base path: api/doctors
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", PatientTreatmentController.getAll);
router.get("/:id", checkId(), PatientTreatmentController.get);

// write operations
router.post("/", PatientTreatmentController.post);
router.put("/:id", checkAdminRoleAndId(), PatientTreatmentController.put);
router.delete("/:id", checkAdminRoleAndId(), PatientTreatmentController.delete);

router.use(validations);

module.exports = router;
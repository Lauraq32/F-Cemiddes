const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const TreatmentController = require("../controllers/TreatmentController");
const validateTreatment = require("../validators/validateTreatment");

// base path: api/treatment
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", TreatmentController.getAll);
router.get("/:id", checkId(), TreatmentController.get);

// write operations
router.post("/", validateTreatment, TreatmentController.post);
router.put("/:id", checkAdminRoleAndId(), validateTreatment, TreatmentController.put);
router.delete("/:id", checkAdminRoleAndId(), TreatmentController.delete);

module.exports = router;
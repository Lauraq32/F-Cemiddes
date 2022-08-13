const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const DoctorController = require("../controllers/DoctorController");
const validateDoctor = require("../validators/validateDoctor");

// base path: api/doctors
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", DoctorController.getAll);
router.get("/:id", checkId(), DoctorController.get);

// write operations
router.post("/", validateDoctor, DoctorController.post);
router.put("/:id", checkAdminRoleAndId(), validateDoctor, DoctorController.put);
router.delete("/:id", checkAdminRoleAndId(), DoctorController.delete);

module.exports = router;
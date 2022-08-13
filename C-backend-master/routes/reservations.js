const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const ReservationController = require("../controllers/ReservationController");
const validateReservation = require("../validators/validateReservation");

// base path: api/reservations
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", ReservationController.getAll);
router.get("/:id", checkId(), ReservationController.getClientByTreatment);
router.get("/date", ReservationController.getReservationByDate);
router.get("/earnings/:id", ReservationController.getEarningsByDate);

// write operations
router.post("/", validateReservation, ReservationController.post);
router.put("/:id", checkAdminRoleAndId(), validateReservation, ReservationController.put);
router.delete("/:id", checkAdminRoleAndId(), ReservationController.delete);

module.exports = router;
const { Router } = require("express");
const checkId = require("../middlewares/checkId");
const { AdminRole } = require("../middlewares/role-validation");
const { jwtValidations } = require("../middlewares/jwt-validations");
const ProductController = require("../controllers/ProductController");
const validateProduct = require("../validators/validateProduct");

// base path: api/products
const router = Router();

router.use(jwtValidations);

const checkAdminRoleAndId = () => [AdminRole, checkId()];

// read operations
router.get("/", ProductController.getAll);
router.get("/:id", checkId(), ProductController.get);

// write operations
router.post("/", validateProduct, ProductController.post);
router.put("/:id", checkAdminRoleAndId(), validateProduct, ProductController.put);
router.delete("/:id", checkAdminRoleAndId(), ProductController.delete);

module.exports = router;
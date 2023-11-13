const { Router } = require("express");
const {
  getUserMe,
  getUsersByRole,
  deleteUserMe,
  updateUserPassword,
  editUser,
} = require("../controllers/user.controller");
const { validateJWT } = require("../middlewares/validateJWT");

const router = Router();

router.get("/:email", validateJWT, getUserMe);

router.get("/role/:role", validateJWT, getUsersByRole);

router.delete("/:email", validateJWT, deleteUserMe);

router.put("/:email", validateJWT, updateUserPassword);

router.put("/update/:email", validateJWT, editUser);

module.exports = router;

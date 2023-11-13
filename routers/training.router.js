const { Router } = require("express");
const { validateJWT } = require("../middlewares/validateJWT");
const {
  getTrainingByName,
  getTrainings,
  getTrainers,
  deleteTraining,
  addTraining,
} = require("../controllers/training.controller");

const router = Router();

router.get("/", validateJWT, getTrainings);

router.get("/search/:name", validateJWT, getTrainingByName);

router.get("/trainers/:studentEmail", validateJWT, getTrainers);

router.post("/", validateJWT, addTraining);

router.delete("/:id", validateJWT, deleteTraining);

module.exports = router;

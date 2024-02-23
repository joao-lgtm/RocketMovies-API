const { Router } = require("express");

const MovieController = require("../controllers/MovieController");
const ensureAutheticated = require("../middleware/ensureAutheticated");
const movieRoutes = Router();

const movieController = new MovieController()

movieRoutes.get("/",ensureAutheticated, movieController.index);
movieRoutes.post("/:id", ensureAutheticated,movieController.create);
movieRoutes.get("/:id",ensureAutheticated, movieController.show);
movieRoutes.delete("/:id",ensureAutheticated ,movieController.delete);



module.exports = movieRoutes;
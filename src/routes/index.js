const { Router } = require("express");

const userRoutes = require("./user.routes");
const movieRoutes = require("./movie.routes")



const routes = Router();
routes.use("/users",userRoutes);
routes.use("/movie", movieRoutes);


module.exports = routes;
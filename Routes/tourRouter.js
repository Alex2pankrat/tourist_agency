const express = require("express");
const tourController = require("../Controllers/tourController.js");
//==================================================================

const tourRouter = express.Router();

tourRouter.use("/addTour", tourController.addTour);
tourRouter.use("/postAddTour", tourController.postAddTour);

tourRouter.use("/editTour/:TourID", tourController.editTour);
tourRouter.use("/postEditTour", tourController.postEditTour);

tourRouter.post("/deleteTour/:TourID", tourController.deleteTour);

tourRouter.use("/", tourController.getTours);

// Экспортирование объекта tourRouter
module.exports = tourRouter;
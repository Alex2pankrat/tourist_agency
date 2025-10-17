const express = require("express");
const saleController = require("../Controllers/saleController.js");
//================================================================

const saleRouter = express.Router();

saleRouter.use("/addToCart/:TourId", saleController.addToCart);
saleRouter.use("/getCart", saleController.getCart);

saleRouter.use("/cartToHistory", saleController.cartToHistory);
saleRouter.use("/getHistory/:ClientId", saleController.getHistory);

// Экспортирование объекта saleRouter
module.exports = saleRouter;
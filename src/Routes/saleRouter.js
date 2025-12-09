const express = require("express");
const saleController = require("../Controllers/saleController.js");
const saleRouter = express.Router();

saleRouter.use("/addToCart/:TourID", saleController.addToCart);
saleRouter.use("/removeFromCart/:TourID", saleController.removeFromCart);
saleRouter.use("/getCart", saleController.getCart);

saleRouter.use("/cartToHistory", saleController.cartToHistory);
saleRouter.use("/getHistory/:ClientID", saleController.getHistory);

module.exports = saleRouter;

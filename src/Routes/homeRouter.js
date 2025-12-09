const express = require("express");
const homeController = require("../controllers/homeController.js");
//================================================================
// Создание объекта маршрутизации
const homeRouter = express.Router();

// Определение функций маршрутов
homeRouter.get("/about", homeController.about);
homeRouter.get("/", homeController.index);

// Экспортирование объекта homeRouter
module.exports = homeRouter;
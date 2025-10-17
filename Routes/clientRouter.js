const express = require("express");
const clientController = require("../Controllers/clientController.js");
//================================================================

const clientRouter = express.Router();

clientRouter.use("/addClient", clientController.addClient);
clientRouter.use("/postAddClient", clientController.postAddClient);

clientRouter.use("/editClient/:ClientId", clientController.editClient);
clientRouter.use("/postEditClient", clientController.postEditClient);

clientRouter.use("/", clientController.getClients);

// Экспортирование объекта clientRouter
module.exports = clientRouter;
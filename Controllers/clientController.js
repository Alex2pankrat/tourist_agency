const connectController = require("../Controllers/connectController.js");
const pool = connectController.pool;

//========================================
// Чтение таблицы Clients
//========================================
exports.getClients = function (req, res) {
    pool.query("SELECT * FROM clients", function (err, clients) {
        if (err) return console.log(err);

        // Передача данных на представление
        res.render("../Views/Clients/Clients.hbs", {
            Clients: clients
        });
    });
};


//=============================================
// Добавление Нового клиента
//=============================================
exports.addClient = function (req, res) {
    res.render("../Views/Clients/addClient.hbs");
};

//-----------------------------------------------
// Вызывается при нажатии на кнопку Отправить
//-----------------------------------------------
exports.postAddClient = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const LastName = req.body.LastName;
    const FirstName = req.body.FirstName;
    const Phone = req.body.Phone;
    const Email = req.body.Email;

    pool.query("INSERT INTO clients (LastName, FirstName, Phone, Email) VALUES (?, ?, ?, ?)",
        [LastName, FirstName, Phone, Email], function (err, client) {
            if (err) return console.log(err);

            res.redirect("/clients");
        });
};

//=========================================
// Редактирование записи
//=========================================
exports.editClient = function (req, res) {
    const ClientID = req.params.ClientID;
    pool.query("SELECT * FROM clients WHERE ClientID=?", [ClientID], function (err, clients) {
        if (err) return console.log(err);

        res.render("../Views/Clients/editClient.hbs", {
            client: clients[0]
        });
    });
};


//-----------------------------------------------
// Вызывается при нажатии на кнопку Отправить
//-----------------------------------------------
exports.postEditClient = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const LastName = req.body.LastName;
    const FirstName = req.body.FirstName;
    const Phone = req.body.Phone;
    const Email = req.body.Email;
    const ClientID = req.body.ClientID;

    pool.query("UPDATE clients SET LastName=?, FirstName=?, Phone=?, Email=? WHERE ClientID=?",
        [LastName, FirstName, Phone, Email, ClientID], function (err, client) {
            if (err) return console.log(err);

            res.redirect("/clients");
        });
};
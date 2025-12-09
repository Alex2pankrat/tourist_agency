const connectController = require("../Controllers/connectController.js");
const pool = connectController.pool;

console.log("Imported pool object in tourController:", pool);

//==============================================
// Чтение таблицы Tours
//==============================================
exports.getTours = function (req, res) {
    // Основа SQL-запроса для таблицы Tours
    let query = "SELECT * FROM tours";
    let filters = []; // Условие фильтрации
    let params = [];  // Параметры SQL-запроса

    let countryId = req.query.countryId;
    let typeId = req.query.typeId;

    if (countryId == 0) countryId = undefined;
    if (typeId == 0) typeId = undefined;

    if (countryId) {
        filters.push("CountryID = ?");
        params.push(countryId);
    }

    if (typeId) {
        filters.push("TypeID = ?");
        params.push(typeId);
    }

    if (filters.length) {
        query += " WHERE " + filters.join(" AND ");
    }

    pool.query(query, params, function (err, tours) {
        if (err) return console.log(err);

        pool.query("SELECT * FROM countries", function (err, countries) {
            if (err) return console.log(err);

            pool.query("SELECT * FROM tourtypes", function (err, tourtypes) {
                if (err) return console.log(err);

                cartLen = connectController.cart.length;
                res.render("../Views/Tours/Tours.hbs", {
                    Tours: tours,
                    Countries: countries,
                    TourTypes: tourtypes,
                    curCountryId: countryId,
                    curTypeId: typeId,
                    cartLen: cartLen
                });
            });
        });
    });
};


//=============================================
// Добавление Нового тура
//=============================================
exports.addTour = function (req, res) {
    res.render("../Views/Tours/addTour.hbs");
};

//-----------------------------------------------
// Вызывается при нажатии на кнопку Отправить
//-----------------------------------------------
exports.postAddTour = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const TourName = req.body.TourName;
    const Price = req.body.Price;
    const SeatsAvailable = req.body.SeatsAvailable;
    const CountryID = req.body.CountryID;
    const TypeID = req.body.TypeID;
    const StartDate = req.body.StartDate;
    const EndDate = req.body.EndDate;
    const Description = req.body.Description;


    pool.query("INSERT INTO tours (TourName, Price, SeatsAvailable, CountryID, TypeID, StartDate, EndDate, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [TourName, Price, SeatsAvailable, CountryID, TypeID, StartDate, EndDate, Description], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/tours");
    });
 
};

//=========================================
// Редактирование записи
//=========================================
exports.editTour = function (req, res) {
    const TourID = req.params.TourID;
    pool.query("SELECT * FROM tours WHERE TourID=?", [TourID], function (err, tours) {
        if (err) return console.log(err);

        res.render("../Views/Tours/editTour.hbs", {
            tour: tours[0]
        });
    });
};


//-----------------------------------------------
// Вызывается при нажатии на кнопку Отправить
//-----------------------------------------------
exports.postEditTour = function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const TourID = req.body.TourID;
    const TourName = req.body.TourName;
    const Price = req.body.Price;
    const SeatsAvailable = req.body.SeatsAvailable;

    pool.query("UPDATE tours SET TourName=?, Price=?, SeatsAvailable=? WHERE TourID=?",
        [TourName, Price, SeatsAvailable, TourID], function (err, data) {
            if (err) return console.log(err);
            res.redirect("/tours");
        });
};


//===========================================
// Удаление записи
//===========================================
exports.deleteTour = function (req, res) {
    const TourID = req.params.TourID;
    pool.query("DELETE FROM tours WHERE TourID=?", [TourID], function (err, data) {
        if (err) return console.log(err);
        res.redirect("/tours");
    });
};
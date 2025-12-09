const mysql = require("mysql2");

const pool = mysql.createPool({
   		connectionLimit: 5,
   		host: "localhost",
    	user: "root",
    	//password: process.env.DB_PASSWORD,
   	 	database: "tourist_agency"
        //authPlugin: 'mysql_native_password'
})

module.exports.pool = pool;

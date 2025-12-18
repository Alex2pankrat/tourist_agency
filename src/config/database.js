const mysql = require('mysql2/promise');
require('dotenv').config();

class Database {
    constructor() {
        this.pool = null;
    }

    async connect() {
        try {
            this.pool = mysql.createPool({
                host: process.env.DB_HOST || 'localhost',
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'tourist_agency',
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });

            const connection = await this.pool.getConnection();
            console.log(`✅ db ${process.env.DB_NAME || 'tour_agency'}`);
            connection.release();
            return true;
        } catch (error) {
            console.error('❌ db', error.message);
            throw error;
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ db', error.message);
            console.error('SQL:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    async getConnection() {
        return await this.pool.getConnection();
    }
}

module.exports = new Database();
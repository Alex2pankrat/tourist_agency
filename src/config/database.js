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

            // Проверяем подключение
            const connection = await this.pool.getConnection();
            console.log(`✅ База данных: ${process.env.DB_NAME || 'tour_agency'}`);
            connection.release();
            return true;
        } catch (error) {
            console.error('❌ Ошибка подключения к базе данных:', error.message);
            console.log('Проверьте:');
            console.log('1. Запущен ли MySQL сервер');
            console.log('2. Правильные ли данные в .env файле');
            console.log('3. Существует ли база данных tour_agency');
            throw error;
        }
    }

    async query(sql, params = []) {
        try {
            const [rows] = await this.pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('❌ Database query error:', error.message);
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
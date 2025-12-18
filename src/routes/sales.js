const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const sales = await db.query(`
            SELECT s.*, 
                   c.FirstName, c.LastName, c.Email,
                   t.Name as TourName, t.price
            FROM sales s
            LEFT JOIN clients c ON s.clientID = c.ID
            LEFT JOIN tours t ON s.tourID = t.ID
            ORDER BY s.CreatedAt DESC
        `);
        
        const clients = await db.query('SELECT ID, FirstName, LastName FROM clients');
        const tours = await db.query('SELECT ID, Name, price, seatsAvailable FROM tours');
        
        res.render('sales', {
            title: 'Продажи',
            sales: sales,
            clients: clients,
            tours: tours
        });
    } catch (error) {
        console.error('Ошибка загрузки продаж:', error);
        res.status(500).send('Ошибка загрузки продаж: ' + error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { clientID, tourID, seats, status } = req.body;
        
        console.log('Добавление продажи:', { clientID, tourID, seats, status });
        
        if (!clientID || !tourID || !seats) {
            throw new Error('Не все обязательные поля заполнены');
        }
        
        const seatsNum = parseInt(seats);
        if (seatsNum <= 0) {
            throw new Error('Количество мест должно быть больше 0');
        }
        
        const tourResult = await db.query('SELECT seatsAvailable FROM tours WHERE ID = ?', [tourID]);
        
        console.log('Результат запроса тура:', tourResult);
        console.log('Тур найден:', tourResult && tourResult[0]);
        
        if (!tourResult || tourResult.length === 0) {
            throw new Error('Тур не найден');
        }
        
        const tour = tourResult[0];
        console.log('Доступно мест в туре:', tour.seatsAvailable);
        
        if (tour.seatsAvailable < seatsNum) {
            throw new Error(`Недостаточно мест. Доступно: ${tour.seatsAvailable}`);
        }
        
        await db.query(
            'INSERT INTO sales (clientID, tourID, seats, status) VALUES (?, ?, ?, ?)',
            [clientID, tourID, seatsNum, status || 'pending']
        );
        
        await db.query(
            'UPDATE tours SET seatsAvailable = seatsAvailable - ? WHERE ID = ?',
            [seatsNum, tourID]
        );
        
        console.log('Продажа успешно добавлена');
        res.redirect('/sales');
        
    } catch (error) {
        console.error('Ошибка добавления продажи:', error.message);
        
        try {
            const clients = await db.query('SELECT ID, FirstName, LastName FROM clients ORDER BY LastName');
            const tours = await db.query('SELECT ID, Name, price, seatsAvailable FROM tours ORDER BY Name');
            const sales = await db.query(`
                SELECT s.*, 
                       c.FirstName, c.LastName, c.Email,
                       t.Name as TourName, t.price
                FROM sales s
                LEFT JOIN clients c ON s.clientID = c.ID
                LEFT JOIN tours t ON s.tourID = t.ID
                ORDER BY s.CreatedAt DESC
            `);
            
            res.render('sales', {
                title: 'Продажи',
                sales: sales,
                clients: clients,
                tours: tours,
                error: error.message,
                formData: req.body
            });
        } catch (err) {
            console.error('Ошибка при восстановлении данных:', err);
            res.status(500).send('Ошибка добавления продажи: ' + error.message);
        }
    }
});

router.post('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!status) {
            throw new Error('Статус не указан');
        }
        
        await db.query(
            'UPDATE sales SET status = ? WHERE ID = ?',
            [status, req.params.id]
        );
        
        res.redirect('/sales');
    } catch (error) {
        console.error('Ошибка обновления статуса:', error);
        res.status(500).send('Ошибка обновления статуса: ' + error.message);
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        const saleResult = await db.query('SELECT tourID, seats FROM sales WHERE ID = ?', [req.params.id]);
        
        console.log('Результат запроса продажи для удаления:', saleResult);
        
        if (saleResult && saleResult[0]) {
            const sale = saleResult[0];
            console.log('Возвращаем места:', sale.seats, 'для тура:', sale.tourID);
            
            await db.query(
                'UPDATE tours SET seatsAvailable = seatsAvailable + ? WHERE ID = ?',
                [sale.seats, sale.tourID]
            );
        }
        
        await db.query('DELETE FROM sales WHERE ID = ?', [req.params.id]);
        res.redirect('/sales');
    } catch (error) {
        console.error('Ошибка удаления продажи:', error);
        res.status(500).send('Ошибка удаления продажи: ' + error.message);
    }
});

module.exports = router;
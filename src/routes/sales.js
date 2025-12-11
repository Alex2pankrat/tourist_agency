const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Список всех продаж
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
        
        const clients = await db.query('SELECT ID, FirstName, LastName FROM clients ORDER BY LastName');
        const tours = await db.query('SELECT ID, Name, price, seatsAvailable FROM tours ORDER BY Name');
        
        res.render('sales', {
            title: 'Продажи',
            sales: sales,
            clients: clients,
            tours: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка загрузки продаж' });
    }
});

// Добавление новой продажи
router.post('/', async (req, res) => {
    try {
        const { clientID, tourID, seats, status } = req.body;
        
        // Проверяем доступность мест
        const [tour] = await db.query('SELECT seatsAvailable FROM tours WHERE ID = ?', [tourID]);
        
        if (tour[0].seatsAvailable < seats) {
            return res.status(400).render('error', { 
                message: `Недостаточно мест. Доступно: ${tour[0].seatsAvailable}` 
            });
        }
        
        await db.query(
            'INSERT INTO sales (clientID, tourID, seats, status) VALUES (?, ?, ?, ?)',
            [clientID, tourID, parseInt(seats), status]
        );
        
        // Обновляем доступные места
        await db.query(
            'UPDATE tours SET seatsAvailable = seatsAvailable - ? WHERE ID = ?',
            [parseInt(seats), tourID]
        );
        
        res.redirect('/sales');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка добавления продажи' });
    }
});

// Обновление статуса продажи
router.post('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        await db.query(
            'UPDATE sales SET status = ? WHERE ID = ?',
            [status, req.params.id]
        );
        
        res.redirect('/sales');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка обновления статуса' });
    }
});

// Удаление продажи
router.post('/:id/delete', async (req, res) => {
    try {
        // Возвращаем места обратно в тур
        const [sale] = await db.query('SELECT tourID, seats FROM sales WHERE ID = ?', [req.params.id]);
        
        if (sale[0]) {
            await db.query(
                'UPDATE tours SET seatsAvailable = seatsAvailable + ? WHERE ID = ?',
                [sale[0].seats, sale[0].tourID]
            );
        }
        
        await db.query('DELETE FROM sales WHERE ID = ?', [req.params.id]);
        res.redirect('/sales');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка удаления продажи' });
    }
});

module.exports = router;
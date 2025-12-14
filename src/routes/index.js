const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const clientCountResult = await db.query('SELECT COUNT(*) as count FROM clients');
        const tourCountResult = await db.query('SELECT COUNT(*) as count FROM tours');
        const saleCountResult = await db.query('SELECT COUNT(*) as count FROM sales');
        const totalRevenueResult = await db.query(`
            SELECT SUM(t.price * s.seats) as total 
            FROM sales s 
            JOIN tours t ON s.tourID = t.ID 
            WHERE s.status = 'completed'
        `);

        const clientCount = clientCountResult[0] ? clientCountResult[0].count : 0;
        const tourCount = tourCountResult[0] ? tourCountResult[0].count : 0;
        const saleCount = saleCountResult[0] ? saleCountResult[0].count : 0;
        const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

        console.log('Статистика:', {
            clients: clientCount,
            tours: tourCount,
            sales: saleCount,
            revenue: totalRevenue
        });

        res.render('home', {
            title: 'Главная',
            stats: {
                clients: clientCount,
                tours: tourCount,
                sales: saleCount,
                revenue: totalRevenue
            }
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        res.render('home', {
            title: 'Главная',
            stats: { clients: 0, tours: 0, sales: 0, revenue: 0 }
        });
    }
});

router.use('/clients', require('./clients'));
router.use('/countries', require('./countries'));
router.use('/tours', require('./tours'));
router.use('/sales', require('./sales'));

module.exports = router;

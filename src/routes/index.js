const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const clientCountResult = await db.query('SELECT COUNT(*) as count FROM clients');
        const tourCountResult = await db.query('SELECT COUNT(*) as count FROM tours');
        const saleCountResult = await db.query('SELECT COUNT(*) as count FROM sales');
        const countryCountResult = await db.query('SELECT COUNT(*) as count FROM countries');
        const totalRevenueResult = await db.query(`
            SELECT COALESCE(SUM(t.price * s.seats), 0) as total 
            FROM sales s 
            JOIN tours t ON s.tourID = t.ID 
            WHERE s.status = 'completed'
        `);

        const stats = {
            clients: clientCountResult[0]?.count || 0,
            tours: tourCountResult[0]?.count || 0,
            sales: saleCountResult[0]?.count || 0,
            countries: countryCountResult[0]?.count || 0,
            revenue: totalRevenueResult[0]?.total || 0
        };

        console.log('Статистика:', stats);

        res.render('home', {
            title: 'Главная',
            stats: stats
        });
    } catch (error) {
        console.error('Ошибка при получении статистики:', error);
        res.render('home', {
            title: 'Главная',
            stats: { clients: 0, tours: 0, sales: 0, countries: 0, revenue: 0 }
        });
    }
});

router.use('/clients', require('./clients'));
router.use('/countries', require('./countries'));
router.use('/tours', require('./tours'));
router.use('/sales', require('./sales'));

module.exports = router;
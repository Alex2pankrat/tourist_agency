const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Список всех стран
router.get('/', async (req, res) => {
    try {
        const countries = await db.query('SELECT * FROM countries ORDER BY Name');
        res.render('countries', {
            title: 'Страны',
            countries: countries
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка загрузки стран' });
    }
});

// Добавление новой страны
router.post('/', async (req, res) => {
    try {
        const { Name, Visa } = req.body;
        const visaValue = Visa === 'on' ? 1 : 0;
        
        await db.query(
            'INSERT INTO countries (Name, Visa) VALUES (?, ?)',
            [Name, visaValue]
        );
        
        res.redirect('/countries');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка добавления страны' });
    }
});

// Удаление страны
router.post('/:id/delete', async (req, res) => {
    try {
        await db.query('DELETE FROM countries WHERE ID = ?', [req.params.id]);
        res.redirect('/countries');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка удаления страны' });
    }
});

module.exports = router;
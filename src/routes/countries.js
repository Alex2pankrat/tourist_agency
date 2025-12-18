const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const countries = await db.query('SELECT * FROM countries ORDER BY Name');
        res.render('countries', {
            title: 'Страны',
            countries: countries
        });
    } catch (error) {
        console.error('Ошибка загрузки стран:', error);
        res.status(500).send('Ошибка загрузки стран: ' + error.message);
    }
});

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
        console.error('Ошибка добавления страны:', error);
        res.status(500).send('Ошибка добавления страны: ' + error.message);
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await db.query('DELETE FROM countries WHERE ID = ?', [req.params.id]);
        res.redirect('/countries');
    } catch (error) {
        console.error('Ошибка удаления страны:', error);
        res.status(500).send('Ошибка удаления страны: ' + error.message);
    }
});

router.get('/:id/edit', async (req, res) => {
    try {
        const countryId = req.params.id;
        const rows = await db.query('SELECT * FROM countries WHERE ID = ?', [countryId]);
        
        if (rows.length === 0) {
            return res.status(404).send('Страна не найдена');
        }
        
        res.render('country_edit', {
            title: 'Редактирование страны',
            country: rows[0]
        });
    } catch (error) {
        console.error('Ошибка загрузки страны:', error);
        res.status(500).send('Ошибка загрузки страны: ' + error.message);
    }
});

router.post('/:id/update', async (req, res) => {
    try {
        const countryId = req.params.id;
        const { Name, Visa } = req.body;
        const visaValue = Visa === 'on' ? 1 : 0;
        
        await db.query(
            'UPDATE countries SET Name = ?, Visa = ? WHERE ID = ?',
            [Name, visaValue, countryId]
        );
        
        res.redirect('/countries');
    } catch (error) {
        console.error('Ошибка обновления страны:', error);
        res.status(500).send('Ошибка обновления страны: ' + error.message);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const tours = await db.query('SELECT * FROM tours ORDER BY Name');
        res.render('tours', {
            title: 'Туры',
            tours: tours
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка загрузки туров' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { Name, tourType, description, price, seatsAvailable } = req.body;
        
        await db.query(
            `INSERT INTO tours (Name, tourType, description, price, seatsAvailable) 
             VALUES (?, ?, ?, ?, ?)`,
            [Name, parseInt(tourType), description, parseFloat(price), parseInt(seatsAvailable)]
        );
        
        res.redirect('/tours');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка добавления тура' });
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await db.query('DELETE FROM tours WHERE ID = ?', [req.params.id]);
        res.redirect('/tours');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка удаления тура' });
    }
});

module.exports = router;

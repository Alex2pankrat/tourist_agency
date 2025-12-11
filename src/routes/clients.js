const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Список всех клиентов
router.get('/', async (req, res) => {
    try {
        const clients = await db.query('SELECT * FROM clients ORDER BY CreatedAt DESC');
        res.render('clients', {
            title: 'Клиенты',
            clients: clients
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка загрузки клиентов' });
    }
});

// Добавление нового клиента
router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Phone, Email } = req.body;
        
        await db.query(
            'INSERT INTO clients (FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?)',
            [FirstName, LastName, Phone, Email]
        );
        
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка добавления клиента' });
    }
});

// Удаление клиента
router.post('/:id/delete', async (req, res) => {
    try {
        await db.query('DELETE FROM clients WHERE ID = ?', [req.params.id]);
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка удаления клиента' });
    }
});

// Форма редактирования клиента
router.get('/:id/edit', async (req, res) => {
    try {
        const [client] = await db.query('SELECT * FROM clients WHERE ID = ?', [req.params.id]);
        
        if (!client) {
            return res.status(404).render('error', { message: 'Клиент не найден' });
        }
        
        res.render('client_edit', {
            title: 'Редактирование клиента',
            client: client[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка загрузки клиента' });
    }
});

// Обновление клиента
router.post('/:id/update', async (req, res) => {
    try {
        const { FirstName, LastName, Phone, Email } = req.body;
        
        await db.query(
            'UPDATE clients SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?',
            [FirstName, LastName, Phone, Email, req.params.id]
        );
        
        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Ошибка обновления клиента' });
    }
});

module.exports = router;
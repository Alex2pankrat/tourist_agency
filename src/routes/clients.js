const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', async (req, res) => {
    try {
        const clients = await db.query('SELECT * FROM clients ORDER BY ID');
        res.render('clients', {
            title: 'Клиенты',
            clients: clients
        });
    } catch (error) {
        console.error('Ошибка загрузки клиентов:', error);
        res.status(500).send('Ошибка загрузки клиентов: ' + error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const { FirstName, LastName, Phone, Email } = req.body;
        
        await db.query(
            'INSERT INTO clients (FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?)',
            [FirstName, LastName, Phone, Email]
        );
        
        res.redirect('/clients');
    } catch (error) {
        console.error('Ошибка добавления клиента:', error);
        res.status(500).send('Ошибка добавления клиента: ' + error.message);
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await db.query('DELETE FROM clients WHERE ID = ?', [req.params.id]);
        res.redirect('/clients');
    } catch (error) {
        console.error('Ошибка удаления клиента:', error);
        res.status(500).send('Ошибка удаления клиента: ' + error.message);
    }
});

// Форма редактирования клиента - ИСПРАВЛЕНО!
router.get('/:id/edit', async (req, res) => {
    try {
        const clientId = req.params.id;
        console.log('Получение клиента для редактирования, ID:', clientId);
        
        // Выполняем запрос
        const result = await db.query('SELECT * FROM clients WHERE ID = ?', [clientId]);
        
        // Добавляем отладку
        console.log('Результат запроса:', result);
        console.log('Длина результата:', result.length);
        
        if (!result || result.length === 0) {
            console.log('Клиент не найден');
            return res.status(404).send('Клиент не найден');
        }
        
        const client = result[0]; // Берем первую запись
        console.log('Данные клиента:', client);
        
        res.render('client_edit', {
            title: 'Редактирование клиента',
            client: client // передаем объект клиента
        });
    } catch (error) {
        console.error('Ошибка загрузки клиента:', error);
        res.status(500).send('Ошибка загрузки клиента: ' + error.message);
    }
});

// Обновление клиента
router.post('/:id/update', async (req, res) => {
    try {
        const clientId = req.params.id;
        const { FirstName, LastName, Phone, Email } = req.body;
        
        console.log('Обновление клиента ID:', clientId);
        console.log('Новые данные:', { FirstName, LastName, Phone, Email });
        
        await db.query(
            'UPDATE clients SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?',
            [FirstName, LastName, Phone, Email, clientId]
        );
        
        res.redirect('/clients');
    } catch (error) {
        console.error('Ошибка обновления клиента:', error);
        res.status(500).send('Ошибка обновления клиента: ' + error.message);
    }
});

module.exports = router;
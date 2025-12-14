const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Список всех туров
router.get('/', async (req, res) => {
    try {
        const tours = await db.query('SELECT * FROM tours');
        res.render('tours', {
            title: 'Туры',
            tours: tours
        });
    } catch (error) {
        console.error('Ошибка загрузки туров:', error);
        res.status(500).send('Ошибка загрузки туров: ' + error.message);
    }
});

// Добавление нового тура
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
        console.error('Ошибка добавления тура:', error);
        res.status(500).send('Ошибка добавления тура: ' + error.message);
    }
});

// Удаление тура - ИСПРАВЛЕНО!
router.post('/:id/delete', async (req, res) => {
    try {
        const tourId = req.params.id;
        
        // Проверяем, есть ли связанные продажи - БЕЗ ДЕСТРУКТУРИЗАЦИИ
        const salesResult = await db.query('SELECT COUNT(*) as count FROM sales WHERE tourID = ?', [tourId]);
        
        console.log('Результат проверки продаж:', salesResult);
        console.log('Количество связанных продаж:', salesResult[0]?.count);
        
        if (salesResult && salesResult[0] && salesResult[0].count > 0) {
            return res.status(400).send(`
                <div style="padding: 20px; text-align: center; max-width: 600px; margin: 50px auto; background: #f8d7da; border-radius: 8px;">
                    <h2 style="color: #721c24;">❌ Нельзя удалить тур</h2>
                    <p style="font-size: 1.1rem; margin: 20px 0; color: #721c24;">
                        У этого тура есть связанные продажи (${salesResult[0].count} шт.). 
                        Сначала удалите все продажи этого тура в разделе "Продажи".
                    </p>
                    <div style="margin-top: 30px;">
                        <a href="/tours" style="display: inline-block; padding: 10px 20px; background: #6c757d; color: white; text-decoration: none; border-radius: 4px; margin-right: 10px;">
                            ← Назад к турам
                        </a>
                        <a href="/sales?tour=${tourId}" style="display: inline-block; padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 4px;">
                            Перейти к продажам
                        </a>
                    </div>
                </div>
            `);
        }
        
        // Если связанных продаж нет, удаляем тур
        await db.query('DELETE FROM tours WHERE ID = ?', [tourId]);
        console.log('Тур успешно удален, ID:', tourId);
        res.redirect('/tours');
        
    } catch (error) {
        console.error('Ошибка удаления тура:', error);
        res.status(500).send(`
            <div style="padding: 20px; text-align: center;">
                <h2>Ошибка удаления тура</h2>
                <p>${error.message}</p>
                <a href="/tours">Назад к турам</a>
            </div>
        `);
    }
});

// Форма редактирования тура
router.get('/:id/edit', async (req, res) => {
    try {
        const tourId = req.params.id;
        const rows = await db.query('SELECT * FROM tours WHERE ID = ?', [tourId]);
        
        if (rows.length === 0) {
            return res.status(404).send('Тур не найден');
        }
        
        res.render('tour_edit', {
            title: 'Редактирование тура',
            tour: rows[0]
        });
    } catch (error) {
        console.error('Ошибка загрузки тура:', error);
        res.status(500).send('Ошибка загрузки тура: ' + error.message);
    }
});

// Обновление тура
router.post('/:id/update', async (req, res) => {
    try {
        const tourId = req.params.id;
        const { Name, tourType, description, price, seatsAvailable } = req.body;
        
        // Валидация данных
        if (!Name || !tourType || !description || !price || !seatsAvailable) {
            throw new Error('Все поля обязательны для заполнения');
        }
        
        const priceNum = parseFloat(price);
        const seatsNum = parseInt(seatsAvailable);
        
        if (priceNum <= 0) {
            throw new Error('Цена должна быть больше 0');
        }
        
        if (seatsNum < 0) {
            throw new Error('Количество мест не может быть отрицательным');
        }
        
        await db.query(
            `UPDATE tours SET 
                Name = ?, 
                tourType = ?, 
                description = ?, 
                price = ?, 
                seatsAvailable = ? 
             WHERE ID = ?`,
            [Name, parseInt(tourType), description, priceNum, seatsNum, tourId]
        );
        
        res.redirect('/tours');
    } catch (error) {
        console.error('Ошибка обновления тура:', error);
        res.status(500).send('Ошибка обновления тура: ' + error.message);
    }
});

module.exports = router;
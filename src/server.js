require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// В настройках Handlebars добавьте хелперы:
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: {
        if_eq: function(a, b, opts) {
            return a == b ? opts.fn(this) : opts.inverse(this);
        },
        formatDate: function(date) {
            return new Date(date).toLocaleDateString('ru-RU');
        },
        formatNumber: function(num) {
            return num ? num.toLocaleString('ru-RU') : '0';
        },
        multiply: function(a, b) {
            return (a * b).toLocaleString('ru-RU');
        },
        calculateTotal: function(sales) {
            let total = 0;
            sales.forEach(sale => {
                total += sale.price * sale.seats;
            });
            return total.toLocaleString('ru-RU');
        },
        getFlagEmoji: function(countryName) {
            const flagEmojis = {
                'Россия': '🇷🇺',
                'Турция': '🇹🇷',
                'Таиланд': '🇹🇭',
                'Египет': '🇪🇬',
                'Испания': '🇪🇸',
                'Италия': '🇮🇹',
                'Франция': '🇫🇷',
                'Германия': '🇩🇪',
                'Греция': '🇬🇷',
                'Китай': '🇨🇳',
                'Япония': '🇯🇵',
                'США': '🇺🇸',
                'Канада': '🇨🇦',
                'Австралия': '🇦🇺',
                'Бразилия': '🇧🇷',
                'Мексика': '🇲🇽',
                'Индия': '🇮🇳',
                'Вьетнам': '🇻🇳',
                'Индонезия': '🇮🇩',
                'Мальдивы': '🇲🇻',
                'ОАЭ': '🇦🇪',
                'Швейцария': '🇨🇭',
                'Хорватия': '🇭🇷',
                'Черногория': '🇲🇪',
                'Болгария': '🇧🇬',
                'Кипр': '🇨🇾',
                'Израиль': '🇮🇱',
                'Грузия': '🇬🇪',
                'Азербайджан': '🇦🇿',
                'Армения': '🇦🇲',
                'Казахстан': '🇰🇿',
                'Беларусь': '🇧🇾',
                'Узбекистан': '🇺🇿',
                'Киргизия': '🇰🇬',
                'Абхазия': '🇦🇧',
                'Южная Осетия': '🇴🇸',
                'Шри-Ланка': '🇱🇰',
                'Малайзия': '🇲🇾',
                'Сингапур': '🇸🇬',
                'Филиппины': '🇵🇭',
                'Южная Корея': '🇰🇷',
                'Куба': '🇨🇺',
                'Доминикана': '🇩🇴'
            };
            return flagEmojis[countryName] || '🌍';
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Подключаем базу данных
const db = require('./config/database');

// Подключаем роуты
const routes = require('./routes');
app.use('/', routes);

// После настройки роутов добавьте:
app.use((req, res, next) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 - Страница не найдена</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div style="text-align: center; padding: 50px;">
                <h1>404 - Страница не найдена</h1>
                <p>Запрашиваемая страница не существует.</p>
                <a href="/" style="color: #3498db;">Вернуться на главную</a>
            </div>
        </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>500 - Ошибка сервера</title>
            <link rel="stylesheet" href="/css/style.css">
        </head>
        <body>
            <div style="text-align: center; padding: 50px;">
                <h1>500 - Ошибка сервера</h1>
                <p>${err.message}</p>
                <a href="/" style="color: #3498db;">Вернуться на главную</a>
            </div>
        </body>
        </html>
    `);
});

// Запуск сервера
async function startServer() {
    try {
        // Подключаемся к базе данных
        await db.connect();
        console.log('✅ Подключение к базе данных установлено');

        app.listen(PORT, () => {
            console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
            console.log('📋 Доступные страницы:');
            console.log(`   http://localhost:${PORT}/ - Главная`);
            console.log(`   http://localhost:${PORT}/clients - Клиенты`);
            console.log(`   http://localhost:${PORT}/countries - Страны`);
            console.log(`   http://localhost:${PORT}/tours - Туры`);
            console.log(`   http://localhost:${PORT}/sales - Продажи`);
        });
    } catch (error) {
        console.error('❌ Не удалось запустить сервер:', error);
        process.exit(1);
    }
}

startServer();
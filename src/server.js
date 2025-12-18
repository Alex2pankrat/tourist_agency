require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    helpers: {
        gt: function(a, b) {
            return a > b;
        },
        if_eq: function(a, b, opts) {
            return a == b ? opts.fn(this) : opts.inverse(this);
        },
        formatDate: function(date) {
            if (!date) return '';
            return new Date(date).toLocaleDateString('ru-RU');
        },
        formatNumber: function(num) {
            if (!num) return '0';
            return num.toLocaleString('ru-RU');
        },
        multiply: function(a, b) {
            if (!a || !b) return '0';
            return (a * b).toLocaleString('ru-RU');
        },
        calculateTotal: function(sales) {
            if (!sales || !Array.isArray(sales)) return '0';
            let total = 0;
            sales.forEach(sale => {
                if (sale.price && sale.seats) {
                    total += sale.price * sale.seats;
                }
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
                'Доминикана': '🇩🇴',
                'Тунис': '🇹🇳',
                'Марокко': '🇲🇦',
                'Великобритания': '🇬🇧',
                'Ирландия': '🇮🇪',
                'Нидерланды': '🇳🇱',
                'Бельгия': '🇧🇪',
                'Португалия': '🇵🇹',
                'Польша': '🇵🇱',
                'Чехия': '🇨🇿',
                'Словакия': '🇸🇰',
                'Венгрия': '🇭🇺',
                'Румыния': '🇷🇴',
                'Сербия': '🇷🇸',
                'Словения': '🇸🇮',
                'Хорватия': '🇭🇷',
                'Босния и Герцеговина': '🇧🇦',
                'Албания': '🇦🇱',
                'Северная Македония': '🇲🇰',
                'Черногория': '🇲🇪',
                'Косово': '🇽🇰',
                'Молдова': '🇲🇩',
                'Украина': '🇺🇦',
                'Эстония': '🇪🇪',
                'Латвия': '🇱🇻',
                'Литва': '🇱🇹',
                'Финляндия': '🇫🇮',
                'Швеция': '🇸🇪',
                'Норвегия': '🇳🇴',
                'Дания': '🇩🇰',
                'Исландия': '🇮🇸'
            };
            return flagEmojis[countryName] || '🌍';
        },
        stringify: function(obj) {
            if (!obj) return '{}';
            try {
                return JSON.stringify(obj, null, 2);
            } catch (e) {
                return '{}';
            }
        }
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

const db = require('./config/database');

const routes = require('./routes');
app.use('/', routes);

async function startServer() {
    try {
        await db.connect();
        console.log('✅ db');

        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌', error);
        process.exit(1);
    }
}

startServer();
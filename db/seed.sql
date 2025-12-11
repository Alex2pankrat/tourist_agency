USE tour_agency;

-- Добавление тестовых клиентов
INSERT INTO clients (FirstName, LastName, Phone, Email) VALUES
('Иван', 'Иванов', '+79991112233', 'ivan@example.com'),
('Мария', 'Петрова', '+79994445566', 'maria@example.com'),
('Алексей', 'Сидоров', '+79997778899', 'alex@example.com');

-- Добавление стран
INSERT INTO countries (Name, Visa) VALUES
('Турция', 0),
('Египет', 1),
('Таиланд', 1),
('Швейцария', 1),
('Россия', 0);

-- Добавление туров
INSERT INTO tours (Name, tourType, description, price, seatsAvailable) VALUES
('Отдых в Анталии', 1, 'Пляжный отдых на берегу Средиземного моря', 45000.00, 20),
('Горнолыжный курорт', 2, 'Катание на лыжах в Альпах', 80000.00, 15),
('Лечебные воды', 3, 'Оздоровительный тур на курорте', 55000.00, 30),
('Экскурсии по Москве', 2, 'Знакомство с достопримечательностями столицы', 25000.00, 40);

-- Добавление продаж
INSERT INTO sales (clientID, tourID, seats, status) VALUES
(1, 1, 2, 'confirmed'),
(2, 3, 1, 'completed'),
(3, 2, 3, 'pending');
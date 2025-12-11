CREATE DATABASE IF NOT EXISTS tour_agency;
USE tour_agency;

-- Создание таблицы clients
CREATE TABLE IF NOT EXISTS clients (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Phone VARCHAR(20) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы countries
CREATE TABLE IF NOT EXISTS countries (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL UNIQUE,
    Visa BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы tours
CREATE TABLE IF NOT EXISTS tours (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(200) NOT NULL,
    tourType INT NOT NULL COMMENT '1: пляжный, 2: горный, 3: лечебный',
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    seatsAvailable INT NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы sales
CREATE TABLE IF NOT EXISTS sales (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    clientID INT NOT NULL,
    tourID INT NOT NULL,
    seats INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clientID) REFERENCES clients(ID) ON DELETE CASCADE,
    FOREIGN KEY (tourID) REFERENCES tours(ID) ON DELETE CASCADE
);

-- Добавление индексов для улучшения производительности
CREATE INDEX idx_clients_email ON clients(Email);
CREATE INDEX idx_sales_client ON sales(clientID);
CREATE INDEX idx_sales_tour ON sales(tourID);
CREATE INDEX idx_sales_status ON sales(status);
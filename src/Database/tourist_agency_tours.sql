-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tourist_agency
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tours`
--

DROP TABLE IF EXISTS `tours`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tours` (
  `TourID` int NOT NULL AUTO_INCREMENT,
  `TourName` varchar(200) NOT NULL,
  `CountryID` int NOT NULL,
  `TypeID` int NOT NULL,
  `Description` text,
  `Price` decimal(10,2) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date NOT NULL,
  `SeatsAvailable` int DEFAULT '0',
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TourID`),
  KEY `idx_country` (`CountryID`),
  KEY `idx_type` (`TypeID`),
  KEY `idx_dates` (`StartDate`,`EndDate`),
  KEY `idx_price` (`Price`),
  CONSTRAINT `tours_ibfk_1` FOREIGN KEY (`CountryID`) REFERENCES `countries` (`CountryID`) ON DELETE RESTRICT,
  CONSTRAINT `tours_ibfk_2` FOREIGN KEY (`TypeID`) REFERENCES `tourtypes` (`TypeID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tours`
--

LOCK TABLES `tours` WRITE;
/*!40000 ALTER TABLE `tours` DISABLE KEYS */;
INSERT INTO `tours` VALUES (1,'Анталия, отель 5*',1,1,'Все включено, собственный пляж',85000.00,'2024-07-01','2024-07-14',13,1,'2025-09-29 16:06:10','2025-11-20 13:25:06'),(2,'Шарм-эль-Шейх, отель 4*',2,1,'Все включено, дайвинг',92000.00,'2024-06-15','2024-06-29',11,1,'2025-09-29 16:06:10','2025-11-12 16:25:26'),(3,'Барселона, экскурсионный',3,2,'Обзорная экскурсия по городу',112000.00,'2024-08-01','2024-08-08',10,1,'2025-09-29 16:06:10','2025-11-06 11:12:47'),(4,'Рим + Флоренция',4,2,'Экскурсии по историческим местам',98000.00,'2024-09-10','2024-09-17',17,1,'2025-09-29 16:06:10','2025-11-06 11:12:47'),(5,'Крит, отель 50',5,1,'Все включено, бассейн с подогревом',76000.00,'2024-07-20','2024-08-03',29,1,'2025-09-29 16:06:10','2025-11-20 13:25:06');
/*!40000 ALTER TABLE `tours` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09 22:57:49

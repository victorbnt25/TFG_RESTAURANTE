-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: tfg_restaurante
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `alergeno`
--

LOCK TABLES `alergeno` WRITE;
/*!40000 ALTER TABLE `alergeno` DISABLE KEYS */;
INSERT INTO `alergeno` VALUES (1,'GLUTEN'),(2,'CRUSTACEOS'),(3,'HUEVOS'),(4,'PESCADO'),(5,'CACAHUETES'),(6,'SOJA'),(7,'LACTEOS'),(8,'FRUTOS_DE_CASCARA'),(9,'APIO'),(10,'MOSTAZA'),(11,'SESAMO'),(12,'SULFITOS'),(13,'ALTRAMUZ'),(14,'MOLUSCOS');
/*!40000 ALTER TABLE `alergeno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Entrantes','Para empezar',1),(2,'Hamburguesas','Nuestras burgers',1),(3,'Postres','El final perfecto',1),(4,'Bebidas','Para acompañar',1);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20260313142801','2026-04-21 17:17:19',831),('DoctrineMigrations\\Version20260412163438','2026-04-21 17:17:20',236),('DoctrineMigrations\\Version20260421171819','2026-04-21 17:18:32',305);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ingredientes_alergenos`
--

LOCK TABLES `ingredientes_alergenos` WRITE;
/*!40000 ALTER TABLE `ingredientes_alergenos` DISABLE KEYS */;
/*!40000 ALTER TABLE `ingredientes_alergenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `lineas_pedido`
--

LOCK TABLES `lineas_pedido` WRITE;
/*!40000 ALTER TABLE `lineas_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `lineas_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mesas`
--

LOCK TABLES `mesas` WRITE;
/*!40000 ALTER TABLE `mesas` DISABLE KEYS */;
/*!40000 ALTER TABLE `mesas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pagos`
--

LOCK TABLES `pagos` WRITE;
/*!40000 ALTER TABLE `pagos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `platos`
--

LOCK TABLES `platos` WRITE;
/*!40000 ALTER TABLE `platos` DISABLE KEYS */;
INSERT INTO `platos` VALUES (1,'Nachos completos','Nachos con queso, guacamole y salsa especial',8.50,'ENTRANTE','DISPONIBLE',1,'/fotos/nachos.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',1),(2,'Tequeños','Tequeños crujientes con salsa',7.00,'ENTRANTE','DISPONIBLE',1,'/fotos/tequenos.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',1),(3,'Burger clásica','Carne, queso, lechuga y salsa de la casa',11.90,'PRINCIPAL','DISPONIBLE',1,'/fotos/burger-clasica.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',2),(4,'Burger bacon','Hamburguesa con bacon crujiente y cheddar',13.50,'PRINCIPAL','DISPONIBLE',1,'/fotos/burger-bacon.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',2),(5,'Tarta de queso','Tarta cremosa con base de galleta',5.90,'POSTRE','DISPONIBLE',1,'/fotos/tarta-queso.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',3),(6,'Coca-Cola','Refresco frío',2.80,'BEBIDA','DISPONIBLE',1,'/fotos/cocacola.jpg','2026-04-21 17:19:23','2026-04-21 17:19:23',4);
/*!40000 ALTER TABLE `platos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `platos_alergenos`
--

LOCK TABLES `platos_alergenos` WRITE;
/*!40000 ALTER TABLE `platos_alergenos` DISABLE KEYS */;
/*!40000 ALTER TABLE `platos_alergenos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `platos_ingredientes`
--

LOCK TABLES `platos_ingredientes` WRITE;
/*!40000 ALTER TABLE `platos_ingredientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `platos_ingredientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reserva_mesa`
--

LOCK TABLES `reserva_mesa` WRITE;
/*!40000 ALTER TABLE `reserva_mesa` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva_mesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reservas`
--

LOCK TABLES `reservas` WRITE;
/*!40000 ALTER TABLE `reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Victor','victor@sonsofburger.com','$2y$13$PP1myz3JPhp4NE4W.qD6oeT.dnTCv1aGH3HzZEP043iTSLAKcNDh6','ADMIN','ACTIVO','2026-04-21 17:19:24','2026-04-21 17:19:24',NULL),(2,'Ruben','ruben@sonsofburger.com','$2y$13$GrsSwXmqmmyFvcp9MAToYeIN0TMcHzWpwGPRBjLI7y.XJgXVAMV6m','ADMIN','ACTIVO','2026-04-21 17:19:24','2026-04-21 17:19:24',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-21 17:36:07

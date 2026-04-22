-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: localhost    Database: tfg_restaurante
-- ------------------------------------------------------
-- Server version	8.0.44

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
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20260313142801','2026-04-07 14:05:00',6408),('DoctrineMigrations\\Version20260412163438','2026-04-12 16:34:50',868);
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
INSERT INTO `lineas_pedido` VALUES (1,1,11.55,1,17),(2,1,3.50,1,24),(3,1,11.55,2,17),(4,1,3.50,2,24),(5,1,13.75,2,16),(6,1,3.50,2,25),(7,1,6.00,3,20);
/*!40000 ALTER TABLE `lineas_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `mesas`
--

LOCK TABLES `mesas` WRITE;
/*!40000 ALTER TABLE `mesas` DISABLE KEYS */;
INSERT INTO `mesas` VALUES (4,'M-1',2,'SALA','DISPONIBLE',1,'2026-04-09 10:52:52','2026-04-09 10:53:23'),(5,'M-2',2,'SALA','DISPONIBLE',1,'2026-04-09 10:53:08','2026-04-09 10:53:08'),(6,'M-3',2,'SALA','DISPONIBLE',1,'2026-04-09 10:53:32','2026-04-09 10:53:32'),(7,'M-4',2,'SALA','DISPONIBLE',1,'2026-04-09 10:53:39','2026-04-09 10:53:39'),(8,'M-5',2,'SALA','DISPONIBLE',1,'2026-04-09 10:53:50','2026-04-09 10:53:50'),(9,'M-6',4,'SALA','DISPONIBLE',1,'2026-04-09 10:53:58','2026-04-09 10:53:58'),(10,'M-7',4,'SALA','DISPONIBLE',1,'2026-04-09 10:54:07','2026-04-09 10:54:07'),(11,'M-8',4,'SALA','DISPONIBLE',1,'2026-04-09 10:54:14','2026-04-09 10:54:14'),(12,'M-9',4,'SALA','DISPONIBLE',1,'2026-04-09 10:54:22','2026-04-09 10:54:22'),(13,'M-10',4,'SALA','DISPONIBLE',1,'2026-04-09 10:54:31','2026-04-09 10:54:31'),(14,'M-11',8,'SALA','DISPONIBLE',1,'2026-04-09 10:54:58','2026-04-09 10:54:58'),(15,'M-12',8,'SALA','DISPONIBLE',1,'2026-04-09 10:55:07','2026-04-09 10:55:07'),(16,'M-13',8,'SALA','DISPONIBLE',1,'2026-04-09 10:55:14','2026-04-09 10:55:14'),(17,'M-14',8,'SALA','DISPONIBLE',1,'2026-04-09 10:55:29','2026-04-09 10:55:29'),(18,'M-15',8,'SALA','DISPONIBLE',1,'2026-04-09 10:55:38','2026-04-09 10:55:38'),(19,'M-16',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:56:22','2026-04-09 10:56:22'),(20,'M-17',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:56:41','2026-04-09 10:56:56'),(21,'M-18',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:57:09','2026-04-09 10:57:20'),(22,'M-19',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:57:26','2026-04-09 10:57:26'),(23,'M-20',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:57:40','2026-04-09 10:57:40'),(24,'M-21',4,'Terraza','DISPONIBLE',1,'2026-04-09 10:57:59','2026-04-09 10:57:59');
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
INSERT INTO `pedidos` VALUES (1,'PENDIENTE',15.05,'2026-04-12 17:22:43','2026-04-12 17:22:43',NULL,NULL),(2,'PENDIENTE',32.30,'2026-04-12 19:55:28','2026-04-12 19:55:28',NULL,NULL),(3,'PENDIENTE',6.00,'2026-04-14 08:18:58','2026-04-14 08:18:58',NULL,NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `platos`
--

LOCK TABLES `platos` WRITE;
/*!40000 ALTER TABLE `platos` DISABLE KEYS */;
INSERT INTO `platos` VALUES (2,'Tequeños','Tequeños crujientes con salsa',7.00,'ENTRANTE','DISPONIBLE',1,'/uploads/plato_69d76566cddaa.webp','2026-04-07 14:05:29','2026-04-09 08:37:58',1),(5,'Tarta de queso','Tarta cremosa con base de galleta',5.90,'POSTRE','DISPONIBLE',1,'/fotos/tarta-queso.jpg','2026-04-07 14:05:29','2026-04-07 14:05:29',3),(7,'Penas y Glorias','Carne de vacuno a la parrilla, queso fundido y crujiente bacon, con nuestra salsa especial en pan brioche tostado.',12.10,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d76180e2b4d.webp','2026-04-09 08:21:14','2026-04-09 08:21:21',2),(9,'Carne de cañon','Carne de vacuno acompañada de pulled pork desmenuzado, salsa barbacoa y cebolla caramelizada en pan brioche.',13.20,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d7620b2a2c8.webp','2026-04-09 08:23:36','2026-04-09 08:23:39',2),(10,'First Class','Carne de buey con rúcula fresca, queso curado y mayonesa suave, en pan artesanal.',14.30,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d76233555e0.webp','2026-04-09 08:24:16','2026-04-09 08:24:19',2),(11,'Nosotros','Hamburguesa clásica de vacuno con queso, ketchup y mostaza en pan tostado.',10.45,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d7626166adb.webp','2026-04-09 08:25:02','2026-04-09 08:25:05',2),(12,'Hijos de la Capital','Carne de vacuno con queso fundido, bacon, cebolla caramelizada y salsa de la casa en pan brioche.',13.75,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d762c948baa.webp','2026-04-09 08:25:36','2026-04-09 08:26:49',2),(13,'Pierdo el control','Doble carne de vacuno con doble queso, bacon crujiente y salsa especial en pan brioche.',15.40,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d762adcc2a9.webp','2026-04-09 08:25:55','2026-04-09 08:26:21',2),(14,'Bajo Zero','Doble filete de pollo crujiente con lechuga, queso y mayonesa en pan suave.',12.65,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d762edd559b.webp','2026-04-09 08:27:22','2026-04-09 08:27:25',2),(15,'La Trampa','Carne de vacuno con huevo a la plancha, queso fundido y bacon, acompañada de nuestra salsa especial.',12.10,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d7637087cd9.webp','2026-04-09 08:28:01','2026-04-09 08:29:36',2),(16,'Sudores Frios','Carne de vacuno con crema de Lotus, queso y bacon, combinando sabores dulces y salados en pan brioche.',13.75,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d7635bd99b1.webp','2026-04-09 08:28:50','2026-04-09 08:29:15',2),(17,'Caja Negra','Filete de pollo crujiente con lechuga, tomate y mayonesa en pan suave.',11.55,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d763b72ef67.webp','2026-04-09 08:30:18','2026-04-09 08:30:47',2),(18,'Muerto en Vida','Carne smash a la plancha con queso fundido, pepinillos y salsa especial en pan brioche.',12.65,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d763ddc5af5.webp','2026-04-09 08:31:22','2026-04-09 08:31:25',2),(19,'Moltisanti','Carne de vacuno con queso, salsa de trufa y cebolla caramelizada en pan brioche.',15.95,'PRINCIPAL','DISPONIBLE',1,'/uploads/plato_69d7640fc5c29.webp','2026-04-09 08:31:51','2026-04-09 08:32:15',2),(20,'Alitas de pollo','Deliciosas alitas de pollo con salsa barbacoa',6.00,'ENTRANTE','DISPONIBLE',1,'/uploads/plato_69d764edc7829.webp','2026-04-09 08:35:54','2026-04-09 08:35:57',1),(21,'Fingers de Pollo','Deliciosos fingers de pollo empanados.',5.50,'ENTRANTE','DISPONIBLE',1,'/uploads/plato_69d765a4de23a.webp','2026-04-09 08:36:36','2026-04-09 08:39:00',1),(22,'Nachos con Queso','Nachos con salsa de queso cheddar ',5.00,'ENTRANTE','DISPONIBLE',1,'/uploads/plato_69d76578bd127.webp','2026-04-09 08:37:22','2026-04-09 08:38:16',1),(23,'Patatas Cheddar Bachon','Patatas fritas con salsa de queso cheddar y taquitos de bacon.',8.75,'ENTRANTE','DISPONIBLE',1,'/uploads/plato_69d76610857ab.webp','2026-04-09 08:39:50','2026-04-09 08:40:48',1),(24,'Patatas fritas','',3.50,'GUARNICION','DISPONIBLE',1,'/uploads/plato_69d77a09242a0.webp','2026-04-09 10:05:58','2026-04-09 10:06:01',1),(25,'Patatas Gajo','',3.50,'GUARNICION','DISPONIBLE',1,'/uploads/plato_69d77a642cee7.webp','2026-04-09 10:07:29','2026-04-09 10:07:32',1),(26,'Batata','',3.00,'GUARNICION','DISPONIBLE',1,'/uploads/plato_69d77a7c796d7.webp','2026-04-09 10:07:53','2026-04-09 10:07:56',1),(27,'Coca-Cola 33cl','',2.80,'BEBIDA','DISPONIBLE',1,'/uploads/plato_69d77d7bc61ab.webp','2026-04-09 10:20:40','2026-04-09 10:20:43',4),(28,'Coca-Cola Zero 33cl','',2.80,'BEBIDA','DISPONIBLE',1,'/uploads/plato_69d77d9ad2b8f.webp','2026-04-09 10:21:11','2026-04-09 10:21:14',4),(29,'Coca-Cola Zero Zero 33cl','',2.80,'BEBIDA','DISPONIBLE',1,'/uploads/plato_69d77db68ee96.webp','2026-04-09 10:21:39','2026-04-09 10:21:42',4),(30,'Fanta Naranja','',2.80,'BEBIDA','DISPONIBLE',1,'/uploads/plato_69d77dcdbb812.webp','2026-04-09 10:22:02','2026-04-09 10:22:05',4),(32,'Fanta Limón','',2.80,'BEBIDA','DISPONIBLE',1,'/uploads/plato_69d77e36b02c6.webp','2026-04-09 10:23:47','2026-04-09 10:23:50',4);
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
INSERT INTO `usuarios` VALUES (1,'Victor','victor@sonsofburger.com','$2y$13$vp1ttg5cssFjm4fz8VbXC.TSVPZC6P.6DenJl6fJuZg.GJw9dU2Ay','ADMIN','ACTIVO','2026-04-07 14:05:31','2026-04-07 14:05:31',NULL),(2,'Ruben','ruben@sonsofburger.com','$2y$13$yZ4x9DQR.14sAI0V7DIzS.QGo2UXhvAUEjteFER4KA3DdSclhc3R6','ADMIN','ACTIVO','2026-04-07 14:05:31','2026-04-07 14:05:31',NULL),(3,'Victor','victor.benito.millan@gmail.com','$2y$13$wcL/ZEz4i9NsUI8syW18VO/zGkpaLOdTr7PAuMaw1k3wXuTQFF772','CLIENTE','ACTIVO','2026-04-07 14:47:29','2026-04-07 14:47:29',NULL),(4,'Victor Benito','victor@gmail.com','$2y$13$ZGtcQXDmsDQyzSia30wme.V.osMsTEymGRCdyfdVtWuupQbZ6Dhu2','CLIENTE','ACTIVO','2026-04-08 10:34:21','2026-04-08 10:34:21',NULL),(5,'pepe','usuariodeprueba@gmail.com','$2y$13$6BPpWgZTUOz3A.7uCFjFP.CJ3AUgyW4l/Ucx8UinEikMIYxEGM/RO','CLIENTE','ACTIVO','2026-04-08 14:00:57','2026-04-08 14:00:57','123456789');
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

-- Dump completed on 2026-04-22  9:40:38

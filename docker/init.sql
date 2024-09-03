CREATE DATABASE  IF NOT EXISTS `dbvendelo` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dbvendelo`;
-- MySQL dump 10.13  Distrib 8.0.36, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: dbvendelo
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `articulo`
--

DROP TABLE IF EXISTS `articulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `articulo` (
  `idarticulo` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) NOT NULL,
  `precio` decimal(13,2) NOT NULL,
  `peso` int DEFAULT NULL,
  `estado` varchar(2) NOT NULL,
  `idproveedor` int NOT NULL,
  `fecha_insert` date DEFAULT NULL,
  `fecha_upd` date DEFAULT NULL,
  `idusuario_upd` varchar(100) DEFAULT NULL,
  `img` longblob,
  PRIMARY KEY (`idarticulo`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciudad` (
  `idciudad` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) NOT NULL,
  `estado` varchar(2) NOT NULL,
  PRIMARY KEY (`idciudad`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(45) NOT NULL,
  `ruc` varchar(45) NOT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `lat` varchar(45) DEFAULT NULL,
  `long` varchar(45) DEFAULT NULL,
  `img` longblob,
  `idciudad` int NOT NULL,
  `tipo_cli` varchar(2) NOT NULL,
  `sexo` varchar(2) DEFAULT NULL,
  `fecha_insert` date DEFAULT NULL,
  `fecha_upd` date DEFAULT NULL,
  `idusuario_upd` varchar(100) DEFAULT NULL,
  `comision` decimal(13,2) DEFAULT NULL,
  PRIMARY KEY (`idcliente`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `comisiones`
--

DROP TABLE IF EXISTS `comisiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comisiones` (
  `idventa` int NOT NULL,
  `idusuario` int NOT NULL,
  `estado` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`idventa`,`idusuario`),
  KEY `fk_venta_has_usuario_usuario1_idx` (`idusuario`),
  KEY `fk_venta_has_usuario_venta1_idx` (`idventa`),
  CONSTRAINT `fk_venta_has_usuario_usuario1` FOREIGN KEY (`idusuario`) REFERENCES `usuario` (`idusuario`),
  CONSTRAINT `fk_venta_has_usuario_venta1` FOREIGN KEY (`idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `config_datos_set`
--

DROP TABLE IF EXISTS `config_datos_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config_datos_set` (
  `idconfig_datos_set` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(200) DEFAULT NULL,
  `ruc` varchar(100) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `timbrado` varchar(150) DEFAULT NULL,
  `nro_factura_desde` int DEFAULT NULL,
  `nro_factura_hasta` int DEFAULT NULL,
  `nro_factura_usado` int DEFAULT NULL,
  `idusuario_upd` int DEFAULT NULL,
  `fecha_desde` date DEFAULT NULL,
  `fecha_hasta` date DEFAULT NULL,
  `fecha_insert` date DEFAULT NULL,
  `fecha_upd` date DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `idsucursal` int NOT NULL,
  PRIMARY KEY (`idconfig_datos_set`),
  KEY `fk_config_datos_set_sucursal1_idx` (`idsucursal`),
  CONSTRAINT `fk_config_datos_set_sucursal1` FOREIGN KEY (`idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `det_inventario`
--

DROP TABLE IF EXISTS `det_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `det_inventario` (
  `iddet_inventario` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `fecha_insert` date NOT NULL,
  `estado` varchar(2) NOT NULL,
  `idinventario` int NOT NULL,
  `fecha_upd` date DEFAULT NULL,
  `idusuario_upd` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`iddet_inventario`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `det_venta`
--

DROP TABLE IF EXISTS `det_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `det_venta` (
  `idventa` int NOT NULL,
  `idproducto_final` int NOT NULL,
  `estado` varchar(2) NOT NULL,
  `cantidad` int NOT NULL,
  `descuento` decimal(13,2) DEFAULT NULL,
  `subtotal` decimal(13,2) NOT NULL,
  PRIMARY KEY (`idventa`,`idproducto_final`,`estado`),
  KEY `fk_det_venta_venta1_idx` (`idventa`),
  KEY `fk_det_venta_producto_final1_idx` (`idproducto_final`,`estado`),
  CONSTRAINT `fk_det_venta_producto_final1` FOREIGN KEY (`idproducto_final`, `estado`) REFERENCES `producto_final` (`idproducto_final`, `estado`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_det_venta_venta1` FOREIGN KEY (`idventa`) REFERENCES `venta` (`idventa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `factura_cab`
--

DROP TABLE IF EXISTS `factura_cab`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura_cab` (
  `idfactura_cab` int NOT NULL AUTO_INCREMENT,
  `nro_factura` varchar(100) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `idconfig_datos_set` int NOT NULL,
  `idventa` int NOT NULL,
  `fecha` date DEFAULT NULL,
  `timbrado` varchar(150) DEFAULT NULL,
  `nro_caja` varchar(45) DEFAULT NULL,
  `total5` decimal(13,2) DEFAULT NULL,
  `total10` decimal(13,2) DEFAULT NULL,
  `idsucursal` int NOT NULL,
  `tipo_venta` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`idfactura_cab`),
  KEY `fk_facturacion_config_datos_set1_idx` (`idconfig_datos_set`),
  KEY `fk_facturacion_venta1_idx` (`idventa`),
  KEY `fk_factura_cab_sucursal1_idx` (`idsucursal`),
  CONSTRAINT `fk_factura_cab_sucursal1` FOREIGN KEY (`idsucursal`) REFERENCES `sucursal` (`idsucursal`),
  CONSTRAINT `fk_facturacion_config_datos_set1` FOREIGN KEY (`idconfig_datos_set`) REFERENCES `config_datos_set` (`idconfig_datos_set`),
  CONSTRAINT `fk_facturacion_venta1` FOREIGN KEY (`idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `idinventario` int NOT NULL AUTO_INCREMENT,
  `idsucursal` int NOT NULL,
  `idarticulo` int NOT NULL,
  `cantidad_total` int NOT NULL,
  `estado` varchar(2) NOT NULL,
  `cantidad_ven` int DEFAULT NULL,
  `notificar` int DEFAULT NULL,
  PRIMARY KEY (`idinventario`,`idsucursal`,`idarticulo`),
  KEY `fk_inventario_sucursal1_idx` (`idsucursal`),
  KEY `fk_inventario_producto1_idx` (`idarticulo`),
  CONSTRAINT `fk_inventario_producto1` FOREIGN KEY (`idarticulo`) REFERENCES `articulo` (`idarticulo`),
  CONSTRAINT `fk_inventario_sucursal1` FOREIGN KEY (`idsucursal`) REFERENCES `sucursal` (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `idpago` int NOT NULL AUTO_INCREMENT,
  `vencimiento` date DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `monto_pago` decimal(13,2) DEFAULT NULL,
  `idventa` int DEFAULT NULL,
  `cuota` int DEFAULT NULL,
  `monto_mora` decimal(13,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `pagado` decimal(13,2) DEFAULT NULL,
  `idusuario_upd` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idpago`),
  KEY `fk_venta_pago` (`idventa`),
  CONSTRAINT `fk_venta_pago` FOREIGN KEY (`idventa`) REFERENCES `venta` (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_insert_pago` AFTER INSERT ON `pago` FOR EACH ROW BEGIN
  INSERT INTO pago_log (idpago, monto_pago, monto_mora, fecha_pago)
  VALUES (NEW.idpago, NEW.monto_pago, NEW.monto_mora, NEW.fecha_pago);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_insert_update_pago` AFTER UPDATE ON `pago` FOR EACH ROW BEGIN
  INSERT INTO pago_log (idpago, monto_pago, monto_mora, fecha_pago)
  VALUES (NEW.idpago, NEW.monto_pago, NEW.monto_mora, NEW.fecha_pago);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_delete_pago` AFTER DELETE ON `pago` FOR EACH ROW BEGIN
  INSERT INTO pago_log (idpago, monto_pago, monto_mora, fecha_pago)
  VALUES (OLD.idpago, OLD.monto_pago, OLD.monto_mora, OLD.fecha_pago);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `pago_log`
--

DROP TABLE IF EXISTS `pago_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `idpago` int NOT NULL,
  `monto_pago` decimal(13,2) DEFAULT NULL,
  `monto_mora` decimal(13,2) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `parametros`
--

DROP TABLE IF EXISTS `parametros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametros` (
  `idparametros` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) NOT NULL,
  `charval` varchar(45) DEFAULT NULL,
  `intval` int DEFAULT NULL,
  `decimalval` decimal(13,2) DEFAULT NULL,
  `dateval1` date DEFAULT NULL,
  `dateval2` date DEFAULT NULL,
  `estado` varchar(2) NOT NULL,
  PRIMARY KEY (`idparametros`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `idpersona` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `documento` varchar(45) NOT NULL,
  `nacimiento` date NOT NULL,
  `sexo` varchar(2) NOT NULL,
  `est_civil` varchar(2) DEFAULT NULL,
  `direccion` varchar(200) NOT NULL,
  `estado` varchar(2) NOT NULL,
  `tipo_doc` varchar(2) NOT NULL,
  `nacionalidad` varchar(2) DEFAULT NULL,
  `idciudad` int NOT NULL,
  `correo` varchar(45) DEFAULT NULL,
  `telefono` varchar(45) NOT NULL,
  `fecha_insert` date DEFAULT NULL,
  `fecha_upd` date DEFAULT NULL,
  `idusuario_upd` int DEFAULT NULL,
  PRIMARY KEY (`idpersona`),
  UNIQUE KEY `documento_UNIQUE` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `preg_seguridad`
--

DROP TABLE IF EXISTS `preg_seguridad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preg_seguridad` (
  `idpreg_seguridad` int NOT NULL AUTO_INCREMENT,
  `pregunta` varchar(45) NOT NULL,
  `respuesta` varchar(45) NOT NULL,
  `idusuario` int NOT NULL,
  PRIMARY KEY (`idpreg_seguridad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `producto_final`
--

DROP TABLE IF EXISTS `producto_final`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_final` (
  `idproducto_final` int NOT NULL AUTO_INCREMENT,
  `estado` varchar(2) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `costo` decimal(13,2) DEFAULT NULL,
  `tipo_iva` int DEFAULT NULL,
  `img` longblob,
  PRIMARY KEY (`idproducto_final`,`estado`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `idproveedor` int NOT NULL AUTO_INCREMENT,
  `razon_social` varchar(45) NOT NULL,
  `ruc` varchar(45) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `fecha_insert` date DEFAULT NULL,
  `fecha_upd` date DEFAULT NULL,
  `idusuario_upd` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idproveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `receta`
--

DROP TABLE IF EXISTS `receta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receta` (
  `idarticulo` int NOT NULL,
  `receta_estado` varchar(2) DEFAULT NULL,
  `idproducto_final` int NOT NULL,
  `estado` varchar(2) NOT NULL,
  `cantidad` int DEFAULT NULL,
  PRIMARY KEY (`idarticulo`,`idproducto_final`,`estado`),
  KEY `fk_producto_has_producto_final_producto1_idx` (`idarticulo`),
  KEY `fk_receta_producto_final1_idx` (`idproducto_final`,`estado`),
  CONSTRAINT `fk_producto_has_producto_final_producto1` FOREIGN KEY (`idarticulo`) REFERENCES `articulo` (`idarticulo`),
  CONSTRAINT `fk_receta_producto_final1` FOREIGN KEY (`idproducto_final`, `estado`) REFERENCES `producto_final` (`idproducto_final`, `estado`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seq_comprobante`
--

DROP TABLE IF EXISTS `seq_comprobante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seq_comprobante` (
  `nro_comprobante` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sucursal`
--

DROP TABLE IF EXISTS `sucursal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sucursal` (
  `idsucursal` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `ruc` varchar(45) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `idciudad` int NOT NULL,
  `numero` int DEFAULT NULL,
  PRIMARY KEY (`idsucursal`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sys_config`
--

DROP TABLE IF EXISTS `sys_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sys_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  `valor` varchar(255) NOT NULL,
  `estado` enum('AC','IN') NOT NULL DEFAULT 'AC',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbl_procesos`
--

DROP TABLE IF EXISTS `tbl_procesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_procesos` (
  `idtbl_procesos` int NOT NULL AUTO_INCREMENT,
  `idproceso` int NOT NULL,
  `proceso` varchar(50) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `idusuario` varchar(100) DEFAULT NULL,
  `observacion` varchar(100) DEFAULT NULL,
  `estado` varchar(10) DEFAULT NULL,
  `tabla` varchar(60) DEFAULT NULL,
  `intval` int DEFAULT NULL,
  `stringval` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idtbl_procesos`,`idproceso`)
) ENGINE=InnoDB AUTO_INCREMENT=9085 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idusuario` int NOT NULL AUTO_INCREMENT,
  `nivel` int NOT NULL,
  `estado` varchar(2) NOT NULL,
  `nick` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `idpersona` int NOT NULL,
  `idsucursal` int NOT NULL,
  PRIMARY KEY (`idusuario`),
  UNIQUE KEY `nick_UNIQUE` (`nick`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `idventa` int NOT NULL AUTO_INCREMENT,
  `idcliente` int NOT NULL,
  `idusuario` varchar(100) NOT NULL,
  `nro_comprobante` int NOT NULL,
  `fecha` date NOT NULL,
  `iva_total` decimal(13,2) DEFAULT NULL,
  `total` decimal(13,2) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `costo_envio` decimal(13,2) DEFAULT NULL,
  `fecha_upd` datetime DEFAULT NULL,
  `idusuario_upd` int DEFAULT NULL,
  `idusuario_insert` int DEFAULT NULL,
  `idsucursal` int DEFAULT NULL,
  `tipo_venta` varchar(2) DEFAULT NULL,
  `cuotas` int DEFAULT NULL,
  PRIMARY KEY (`idventa`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vw_cliente`
--

DROP TABLE IF EXISTS `vw_cliente`;

create or replace view vw_cliente as 
select p.*,c.descripcion as ciudad 
from cliente p 
join ciudad c 
  on c.idciudad=p.idciudad;

--
-- Temporary view structure for view `vw_config_datos_set`
--

DROP TABLE IF EXISTS `vw_config_datos_set`;
create or replace view vw_config_datos_set as 
with datos_set as (
SELECT
    cds.*,
    RANK() OVER (PARTITION BY cds.idsucursal ORDER BY cds.fecha_hasta DESC ) ranking
FROM config_datos_set cds
) 
select 
  ds.*,
    case 
    when length(ds.nro_factura_desde+ds.nro_factura_usado)=6 then concat(suc.numero,'-','001','-','0',(ds.nro_factura_desde+ds.nro_factura_usado+1))
        when length(ds.nro_factura_desde+ds.nro_factura_usado)=5 then concat(suc.numero,'-','001','-','00',(ds.nro_factura_desde+ds.nro_factura_usado+1))
        when length(ds.nro_factura_desde+ds.nro_factura_usado)=4 then concat(suc.numero,'-','001','-','000',(ds.nro_factura_desde+ds.nro_factura_usado+1))
        when length(ds.nro_factura_desde+ds.nro_factura_usado)=3 then concat(suc.numero,'-','001','-','0000',(ds.nro_factura_desde+ds.nro_factura_usado+1))
        when length(ds.nro_factura_desde+ds.nro_factura_usado)=2 then concat(suc.numero,'-','001','-','00000',(ds.nro_factura_desde+ds.nro_factura_usado+1))
        when length(ds.nro_factura_desde+ds.nro_factura_usado)=1 then concat(suc.numero,'-','001','-','000000',(ds.nro_factura_desde+ds.nro_factura_usado+1))
  end as nro_factura,
  '001' as caja,
  suc.numero as sucursal
from datos_set ds 
join sucursal suc 
  on suc.idsucursal=ds.idsucursal 
where ranking=1;

--
-- Temporary view structure for view `vw_deuda`
--

DROP TABLE IF EXISTS `vw_deuda`;

create or replace view vw_deuda as 
select 
    cl.idcliente,
    cl.razon_social,
    cl.ruc,
    v.idventa,
    v.fecha,
    v.total
from cliente cl 
join venta v on cl.idcliente=v.idcliente
where exists (
  select 
    cl1.idcliente
  from pago pa
  join venta v1 on v1.idventa=pa.idventa
  join cliente cl1 on cl1.idcliente=v1.idcliente
  where pa.estado!='PA'
    and cl1.idcliente=cl.idcliente
        and v1.idventa=v.idventa
);

--
-- Temporary view structure for view `vw_persona`
--

DROP TABLE IF EXISTS `vw_persona`;

create or replace view vw_persona as 
select p.*,c.descripcion as ciudad 
from persona p 
join ciudad c 
  on c.idciudad=p.idciudad;

--
-- Temporary view structure for view `vw_sucursal`
--

DROP TABLE IF EXISTS `vw_sucursal`;

create or replace view vw_sucursal as
select suc.*,ciu.descripcion as ciudad
from sucursal suc 
join ciudad ciu 
  on ciu.idciudad=suc.idciudad;

--
-- Temporary view structure for view `vw_venta`
--

DROP TABLE IF EXISTS `vw_venta`;

create or replace view vw_venta as 
with c_producto as (
select r.idarticulo,r.idproducto_final,(r.cantidad*p.peso) as peso_total
from receta r 
join articulo p 
  on r.idarticulo=p.idarticulo
group by r.idarticulo,r.idproducto_final
)
select 
    v.idventa,
    v.idcliente,
    v.idusuario,
    v.nro_comprobante,
    v.fecha,
    v.iva_total,
    v.total,
    v.estado,
    v.costo_envio,
    v.fecha_upd,
    v.idusuario_upd,
    v.idusuario_insert,
    v.idsucursal,
        v.tipo_venta,
    sum(p.peso_total) as peso_total,
    case when fc.idfactura_cab is not null then 
      'Si'
      else 
      'No'
    end as factura,
    suc.numero as sucursal
from venta v 
join det_venta dv 
  on dv.idventa=v.idventa
join c_producto p
  on p.idproducto_final=dv.idproducto_final
left join factura_cab fc 
  on fc.idventa=v.idventa
join sucursal suc 
  on suc.idsucursal=v.idsucursal
group by v.idventa,v.idcliente,v.idusuario,v.nro_comprobante,v.fecha,v.iva_total,v.total,v.estado,v.costo_envio,v.fecha_upd,v.idusuario_upd,v.idusuario_insert,suc.numero;

--
-- Temporary view structure for view `vw_venta_prod_stock`
--

DROP VIEW IF EXISTS `vw_venta_prod_stock`;

CREATE OR REPLACE VIEW `vw_venta_prod_stock` AS 
WITH existe AS (
    SELECT 
        rc.idproducto_final,
        inv.cantidad_total,
        'STOCK' AS obs,
        MIN(ROUND(inv.cantidad_total/rc.cantidad)) AS cant_prod_posible,
        inv.idsucursal
    FROM inventario inv
    JOIN receta rc ON inv.idarticulo = rc.idarticulo
    WHERE inv.cantidad_total >= rc.cantidad
    GROUP BY rc.idproducto_final, inv.idsucursal
),
no_existe AS (
    SELECT 
        rc.idproducto_final,
        inv.cantidad_total,
        'NO STOCK' AS obs,
        MIN(ROUND(inv.cantidad_total/rc.cantidad)) AS cant_prod_posible,
        inv.idsucursal
    FROM inventario inv
    JOIN receta rc ON inv.idarticulo = rc.idarticulo
    WHERE inv.cantidad_total < rc.cantidad
    GROUP BY rc.idproducto_final, inv.idsucursal
),
validreceta AS (
    SELECT * FROM existe e 
    WHERE NOT EXISTS (SELECT 1 FROM no_existe ne WHERE ne.idproducto_final = e.idproducto_final AND ne.idsucursal = e.idsucursal)
    UNION ALL 
    SELECT * FROM no_existe
)
SELECT 
    pf.*,
    vr.obs,
    vr.cant_prod_posible,
    vr.idsucursal
FROM producto_final pf 
JOIN validreceta vr ON pf.idproducto_final = vr.idproducto_final
WHERE pf.estado = 'AC';


--
-- Dumping events for database 'dbvendelo'
--

--
-- Dumping routines for database 'dbvendelo'
--
/*!50003 DROP FUNCTION IF EXISTS `fseq_comprobante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `fseq_comprobante`() RETURNS int
BEGIN
   DECLARE vnro_comprobante INT;

	SET vnro_comprobante = 0;
	CALL aumenta_nro_comprobante(@a);
	select nro_comprobante into vnro_comprobante from seq_comprobante;
   
   RETURN vnro_comprobante;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `addventainventario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `addventainventario`(
				in vidproducto_final int,
        in voperacion varchar(10),
        in vidusuario varchar(100),
        in idsucursal_get int,
        in vtotalprod int,
        out res int)
BEGIN
  DECLARE vidinventario INT;
  DECLARE vidsucursal INT;
  DECLARE vcantidad INT;
  DECLARE vintval INT;
  DECLARE done INT DEFAULT FALSE;
  DECLARE cursor_i CURSOR FOR 
  SELECT 
				inv.idinventario,
        re.cantidad,
        IFNULL(p.intval, 0) AS intval,
        inv.idsucursal
  FROM receta re
  join inventario inv 
	on inv.idarticulo=re.idarticulo
  left join tbl_procesos p 
	on p.idproceso=idinventario 
    and p.estado='PE' 
    and p.idusuario=vidusuario
  where idproducto_final=vidproducto_final
	and inv.idsucursal=idsucursal_get;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
	if (voperacion="venta") then 
			OPEN cursor_i;
				read_loop: LOOP
				FETCH cursor_i INTO vidinventario, vcantidad,vintval,vidsucursal;
				IF done THEN
				  LEAVE read_loop;
				END IF;
				update inventario set cantidad_total=(cantidad_total-(vcantidad*vtotalprod)) where idinventario=vidinventario and idsucursal=vidsucursal;

				insert into tbl_procesos (proceso, fecha, idusuario, observacion, estado, idproceso, tabla, intval, stringval) 
				values (voperacion,sysdate(),vidusuario,'VENTA','PE',vidinventario,'inventario',(vcantidad*vtotalprod),concat('sucursal: ',vidsucursal) );
				commit;
				END LOOP;
			CLOSE cursor_i;
	end if;
    
    if (voperacion="procesado") then 
    SET SQL_SAFE_UPDATES = 0;
			OPEN cursor_i;
			  read_loop: LOOP
				FETCH cursor_i INTO vidinventario, vcantidad,vintval,vidsucursal;
				IF done THEN
				  LEAVE read_loop;
				END IF;
				update tbl_procesos set estado='PR',observacion='Venta Procesada'  where idproceso=vidinventario and estado='PE' and idusuario=vidusuario and stringval=concat('sucursal: ',vidsucursal);
				commit;
			  END LOOP;
			CLOSE cursor_i;
	end if;
    
    if (voperacion="retorno") then 
    SET SQL_SAFE_UPDATES = 0;
			OPEN cursor_i;
			  read_loop: LOOP
				FETCH cursor_i INTO vidinventario, vcantidad,vintval,vidsucursal;
				IF done THEN
				  LEAVE read_loop;
				END IF;
                SET SQL_SAFE_UPDATES = 0;
				update inventario set cantidad_total=(cantidad_total+vintval) where idinventario=vidinventario  and idsucursal=vidsucursal;
				update tbl_procesos set estado='PR',observacion='Devolucion'  where idproceso=vidinventario and estado='PE' and idusuario=vidusuario;
				commit;
			  END LOOP;
			CLOSE cursor_i;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `aumenta_nro_comprobante` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `aumenta_nro_comprobante`(out res int)
BEGIN
	update seq_comprobante set nro_comprobante = (nro_comprobante+1);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `cargaInventarioCab` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `cargaInventarioCab`(out res int)
BEGIN
	insert into inventario (cantidad_total, estado, cantidad_ven, idarticulo, idsucursal)
	select 
			0,
			'AC',
			0,
			art.idarticulo, 
			suc.idsucursal
		from articulo art
		join sucursal suc
			on suc.estado='AC'
		where art.estado='AC'
		and not exists (
						select 1 from inventario inv 
						where inv.idarticulo=art.idarticulo
						and inv.idsucursal=suc.idsucursal
						);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `inactivapedidoventa` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `inactivapedidoventa`(
        in vidventa int,
        in vidusuario int,
        out res int)
BEGIN
  DECLARE vidproducto_final INT;
  DECLARE vidsucursal INT;
  DECLARE vidproducto INT;
  DECLARE vcantidad INT;
  DECLARE done INT DEFAULT FALSE;
  DECLARE cursor_i CURSOR FOR 
	  SELECT dv.idproducto_final,
             (dv.cantidad*rc.cantidad) as cantidad,
             rc.idproducto,
             u.idsucursal
	  FROM venta v 
      join det_venta dv
		on dv.idventa=v.idventa
	  join producto_final pf 
		on pf.idproducto_final=dv.idproducto_final 
	  join receta rc 
		on rc.idproducto_final=pf.idproducto_final
	  join usuario u 
		on u.idusuario=v.idusuario
	  where v.idventa=vidventa
      and u.idusuario=vidusuario;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
	update venta set estado='DV' where idventa=vidventa;
    commit;
	
	OPEN cursor_i;
	  read_loop: LOOP
		FETCH cursor_i INTO vidproducto_final,vcantidad,vidproducto,vidsucursal;
		IF done THEN
		  LEAVE read_loop;
		END IF;        
		update inventario set cantidad_total=(cantidad_total+vcantidad) 
        where idsucursal=vidsucursal and idproducto=vidproducto;
		commit;
	  END LOOP;
	  CLOSE cursor_i;
      
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `verificaProcesos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = '' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `verificaProcesos`(
        in vidusuario varchar(100),
        in vtabla varchar(50),
        out res int)
BEGIN
  DECLARE vidproceso INT;
  DECLARE vintval INT;
  DECLARE done INT DEFAULT FALSE;
  DECLARE cursor_i CURSOR FOR 
	  SELECT pr.idproceso,pr.intval
	  FROM tbl_procesos pr
	  join inventario inv 
		on inv.idinventario=pr.idproceso
	  where idusuario=vidusuario
			and pr.estado='PE';
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  
	if (vtabla="inventario") then 
	OPEN cursor_i;
	  read_loop: LOOP
		FETCH cursor_i INTO vidproceso,vintval;
		IF done THEN
		  LEAVE read_loop;
		END IF;
		update inventario set cantidad_total=(cantidad_total+vintval) where idinventario=vidproceso;
		update tbl_procesos set estado='PR',observacion='Devolucion por error' where idproceso=vidproceso;
		commit;
	  END LOOP;
	  CLOSE cursor_i;
	end if;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `vw_cliente`
--

/*!50001 DROP VIEW IF EXISTS `vw_cliente`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_cliente` AS select `p`.`idcliente` AS `idcliente`,`p`.`razon_social` AS `razon_social`,`p`.`ruc` AS `ruc`,`p`.`telefono` AS `telefono`,`p`.`direccion` AS `direccion`,`p`.`estado` AS `estado`,`p`.`correo` AS `correo`,`p`.`lat` AS `lat`,`p`.`long` AS `long`,`p`.`img` AS `img`,`p`.`idciudad` AS `idciudad`,`p`.`tipo_cli` AS `tipo_cli`,`p`.`sexo` AS `sexo`,`p`.`fecha_insert` AS `fecha_insert`,`p`.`fecha_upd` AS `fecha_upd`,`p`.`idusuario_upd` AS `idusuario_upd`,`c`.`descripcion` AS `ciudad` from (`cliente` `p` join `ciudad` `c` on((`c`.`idciudad` = `p`.`idciudad`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_config_datos_set`
--

/*!50001 DROP VIEW IF EXISTS `vw_config_datos_set`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_config_datos_set` AS with `datos_set` as (select `cds`.`idconfig_datos_set` AS `idconfig_datos_set`,`cds`.`razon_social` AS `razon_social`,`cds`.`ruc` AS `ruc`,`cds`.`telefono` AS `telefono`,`cds`.`direccion` AS `direccion`,`cds`.`correo` AS `correo`,`cds`.`timbrado` AS `timbrado`,`cds`.`nro_factura_desde` AS `nro_factura_desde`,`cds`.`nro_factura_hasta` AS `nro_factura_hasta`,`cds`.`nro_factura_usado` AS `nro_factura_usado`,`cds`.`idusuario_upd` AS `idusuario_upd`,`cds`.`fecha_desde` AS `fecha_desde`,`cds`.`fecha_hasta` AS `fecha_hasta`,`cds`.`fecha_insert` AS `fecha_insert`,`cds`.`fecha_upd` AS `fecha_upd`,`cds`.`estado` AS `estado`,`cds`.`idsucursal` AS `idsucursal`,rank() OVER (PARTITION BY `cds`.`idsucursal` ORDER BY `cds`.`fecha_hasta` desc )  AS `ranking` from `config_datos_set` `cds`) select `ds`.`idconfig_datos_set` AS `idconfig_datos_set`,`ds`.`razon_social` AS `razon_social`,`ds`.`ruc` AS `ruc`,`ds`.`telefono` AS `telefono`,`ds`.`direccion` AS `direccion`,`ds`.`correo` AS `correo`,`ds`.`timbrado` AS `timbrado`,`ds`.`nro_factura_desde` AS `nro_factura_desde`,`ds`.`nro_factura_hasta` AS `nro_factura_hasta`,`ds`.`nro_factura_usado` AS `nro_factura_usado`,`ds`.`idusuario_upd` AS `idusuario_upd`,`ds`.`fecha_desde` AS `fecha_desde`,`ds`.`fecha_hasta` AS `fecha_hasta`,`ds`.`fecha_insert` AS `fecha_insert`,`ds`.`fecha_upd` AS `fecha_upd`,`ds`.`estado` AS `estado`,`ds`.`idsucursal` AS `idsucursal`,`ds`.`ranking` AS `ranking`,(case when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 6) then concat(`suc`.`numero`,'-','001','-','0',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 5) then concat(`suc`.`numero`,'-','001','-','00',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 4) then concat(`suc`.`numero`,'-','001','-','000',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 3) then concat(`suc`.`numero`,'-','001','-','0000',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 2) then concat(`suc`.`numero`,'-','001','-','00000',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) when (length((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`)) = 1) then concat(`suc`.`numero`,'-','001','-','000000',((`ds`.`nro_factura_desde` + `ds`.`nro_factura_usado`) + 1)) end) AS `nro_factura`,'001' AS `caja`,`suc`.`numero` AS `sucursal` from (`datos_set` `ds` join `sucursal` `suc` on((`suc`.`idsucursal` = `ds`.`idsucursal`))) where (`ds`.`ranking` = 1) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_deuda`
--

/*!50001 DROP VIEW IF EXISTS `vw_deuda`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_deuda` AS select `cl`.`idcliente` AS `idcliente`,`cl`.`razon_social` AS `razon_social`,`cl`.`ruc` AS `ruc`,`v`.`idventa` AS `idventa`,`v`.`fecha` AS `fecha`,`v`.`total` AS `total` from (`cliente` `cl` join `venta` `v` on((`cl`.`idcliente` = `v`.`idcliente`))) where exists(select `cl1`.`idcliente` from ((`pago` `pa` join `venta` `v1` on((`v1`.`idventa` = `pa`.`idventa`))) join `cliente` `cl1` on((`cl1`.`idcliente` = `v1`.`idcliente`))) where ((`pa`.`estado` <> 'PA') and (`cl1`.`idcliente` = `cl`.`idcliente`) and (`v1`.`idventa` = `v`.`idventa`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_persona`
--

/*!50001 DROP VIEW IF EXISTS `vw_persona`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_persona` AS select `p`.`idpersona` AS `idpersona`,`p`.`nombre` AS `nombre`,`p`.`apellido` AS `apellido`,`p`.`documento` AS `documento`,`p`.`nacimiento` AS `nacimiento`,`p`.`sexo` AS `sexo`,`p`.`est_civil` AS `est_civil`,`p`.`direccion` AS `direccion`,`p`.`estado` AS `estado`,`p`.`tipo_doc` AS `tipo_doc`,`p`.`nacionalidad` AS `nacionalidad`,`p`.`idciudad` AS `idciudad`,`p`.`correo` AS `correo`,`p`.`telefono` AS `telefono`,`c`.`descripcion` AS `ciudad` from (`persona` `p` join `ciudad` `c` on((`c`.`idciudad` = `p`.`idciudad`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_sucursal`
--

/*!50001 DROP VIEW IF EXISTS `vw_sucursal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_sucursal` AS select `suc`.`idsucursal` AS `idsucursal`,`suc`.`descripcion` AS `descripcion`,`suc`.`ruc` AS `ruc`,`suc`.`direccion` AS `direccion`,`suc`.`estado` AS `estado`,`suc`.`idciudad` AS `idciudad`,`ciu`.`descripcion` AS `ciudad` from (`sucursal` `suc` join `ciudad` `ciu` on((`ciu`.`idciudad` = `suc`.`idciudad`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_venta`
--

/*!50001 DROP VIEW IF EXISTS `vw_venta`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_venta` AS with `c_producto` as (select `r`.`idarticulo` AS `idarticulo`,`r`.`idproducto_final` AS `idproducto_final`,(`r`.`cantidad` * `p`.`peso`) AS `peso_total` from (`receta` `r` join `articulo` `p` on((`r`.`idarticulo` = `p`.`idarticulo`))) group by `r`.`idarticulo`,`r`.`idproducto_final`) select `v`.`idventa` AS `idventa`,`v`.`idcliente` AS `idcliente`,`v`.`idusuario` AS `idusuario`,`v`.`nro_comprobante` AS `nro_comprobante`,`v`.`fecha` AS `fecha`,`v`.`iva_total` AS `iva_total`,`v`.`total` AS `total`,`v`.`estado` AS `estado`,`v`.`costo_envio` AS `costo_envio`,`v`.`fecha_upd` AS `fecha_upd`,`v`.`idusuario_upd` AS `idusuario_upd`,`v`.`idusuario_insert` AS `idusuario_insert`,`v`.`idsucursal` AS `idsucursal`,`v`.`tipo_venta` AS `tipo_venta`,sum(`p`.`peso_total`) AS `peso_total`,(case when (`fc`.`idfactura_cab` is not null) then 'Si' else 'No' end) AS `factura`,`suc`.`numero` AS `sucursal` from ((((`venta` `v` join `det_venta` `dv` on((`dv`.`idventa` = `v`.`idventa`))) join `c_producto` `p` on((`p`.`idproducto_final` = `dv`.`idproducto_final`))) left join `factura_cab` `fc` on((`fc`.`idventa` = `v`.`idventa`))) join `sucursal` `suc` on((`suc`.`idsucursal` = `v`.`idsucursal`))) group by `v`.`idventa`,`v`.`idcliente`,`v`.`idusuario`,`v`.`nro_comprobante`,`v`.`fecha`,`v`.`iva_total`,`v`.`total`,`v`.`estado`,`v`.`costo_envio`,`v`.`fecha_upd`,`v`.`idusuario_upd`,`v`.`idusuario_insert`,`suc`.`numero` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_venta_prod_stock`
--

/*!50001 DROP VIEW IF EXISTS `vw_venta_prod_stock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_venta_prod_stock` AS with `existe` as (select `rc`.`idproducto_final` AS `idproducto_final`,`inv`.`cantidad_total` AS `cantidad_total`,'STOCK' AS `obs`,min(round((`inv`.`cantidad_total` / `rc`.`cantidad`),0)) AS `cant_prod_posible`,`inv`.`idsucursal` AS `idsucursal` from (`inventario` `inv` join `receta` `rc` on((`inv`.`idarticulo` = `rc`.`idarticulo`))) where (`inv`.`cantidad_total` >= `rc`.`cantidad`) group by `rc`.`idproducto_final`,`inv`.`idsucursal`), `no_existe` as (select `rc`.`idproducto_final` AS `idproducto_final`,`inv`.`cantidad_total` AS `cantidad_total`,'NO STOCK' AS `obs`,min(round((`inv`.`cantidad_total` / `rc`.`cantidad`),0)) AS `cant_prod_posible`,`inv`.`idsucursal` AS `idsucursal` from (`inventario` `inv` join `receta` `rc` on((`inv`.`idarticulo` = `rc`.`idarticulo`))) where (`inv`.`cantidad_total` < `rc`.`cantidad`) group by `rc`.`idproducto_final`,`inv`.`idsucursal`), `validreceta` as (select `e`.`idproducto_final` AS `idproducto_final`,`e`.`cantidad_total` AS `cantidad_total`,`e`.`obs` AS `obs`,`e`.`cant_prod_posible` AS `cant_prod_posible`,`e`.`idsucursal` AS `idsucursal` from `existe` `e` where exists(select 1 from `no_existe` `ne` where ((`ne`.`idproducto_final` = `e`.`idproducto_final`) and (`ne`.`idsucursal` = `e`.`idsucursal`))) is false union all select `ne`.`idproducto_final` AS `idproducto_final`,`ne`.`cantidad_total` AS `cantidad_total`,`ne`.`obs` AS `obs`,`ne`.`cant_prod_posible` AS `cant_prod_posible`,`ne`.`idsucursal` AS `idsucursal` from `no_existe` `ne`) select `pf`.`idproducto_final` AS `idproducto_final`,`pf`.`estado` AS `estado`,`pf`.`nombre` AS `nombre`,`pf`.`descripcion` AS `descripcion`,`pf`.`costo` AS `costo`,`pf`.`tipo_iva` AS `tipo_iva`,`pf`.`img` AS `img`,`vr`.`obs` AS `obs`,`vr`.`cant_prod_posible` AS `cant_prod_posible`,`vr`.`idsucursal` AS `idsucursal` from (`producto_final` `pf` join `validreceta` `vr` on((`pf`.`idproducto_final` = `vr`.`idproducto_final`))) where (`pf`.`estado` = 'AC') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-01 20:56:45

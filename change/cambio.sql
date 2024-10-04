--
-- Table structure for table `reportes`
--

DROP TABLE IF EXISTS `reportes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reportes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `sql_query` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reportes`
--

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;
INSERT INTO `reportes` VALUES (1,'venta','SELECT * FROM venta WHERE fecha BETWEEN :fromDate AND :toDate;','2024-10-04 14:02:34'),(2,'Ganancias por fecha','select sum(a.precio*dv.cantidad) as Costo,sum(dv.subtotal) as Venta,sum(dv.subtotal-(a.precio*dv.cantidad)) as Ganancia,v.fecha as Fecha\nfrom venta v \njoin det_venta dv on dv.idventa=v.idventa\njoin producto_final pf on pf.idproducto_final=dv.idproducto_final\njoin receta r on r.idproducto_final=pf.idproducto_final\njoin articulo a on a.idarticulo= r.idarticulo\nWHERE fecha BETWEEN :fromDate AND :toDate\ngroup by v.fecha;','2024-10-04 15:54:35'),(3,'Ingresos generales','select sum(a.precio*dv.cantidad) as Costo,sum(dv.subtotal) as Venta,sum(dv.subtotal-(a.precio*dv.cantidad)) as Ganancia\nfrom venta v \njoin det_venta dv on dv.idventa=v.idventa\njoin producto_final pf on pf.idproducto_final=dv.idproducto_final\njoin receta r on r.idproducto_final=pf.idproducto_final\njoin articulo a on a.idarticulo= r.idarticulo;','2024-10-04 15:56:42');
/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
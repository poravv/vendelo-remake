const express = require('express');
const rutas = express()

const ciudad = require('./servicios/ciudad')
const comisiones = require('./servicios/comisiones')
const cliente = require('./servicios/cliente')
const sucursal = require('./servicios/sucursal')
const persona = require('./servicios/persona')
const usuario = require('./servicios/usuario');
const proveedor = require('./servicios/proveedor');
const articulo = require('./servicios/articulo');
const producto_final = require('./servicios/producto_final');
const inventario = require('./servicios/inventario');
const detinventario = require('./servicios/detinventario');
const venta = require('./servicios/venta');
const detventa = require('./servicios/detventa');
const receta = require('./servicios/receta');
const config_datos_set = require('./servicios/config_datos_set');
const factura = require('./servicios/factura')

rutas.use('/sisweb/api/ciudad',ciudad);
rutas.use('/sisweb/api/comisiones',comisiones);
rutas.use('/sisweb/api/cliente',cliente);
rutas.use('/sisweb/api/sucursal',sucursal);
rutas.use('/sisweb/api/persona',persona)
rutas.use('/sisweb/api/usuario',usuario)
rutas.use('/sisweb/api/proveedor',proveedor)
rutas.use('/sisweb/api/articulo',articulo)
rutas.use('/sisweb/api/producto_final',producto_final)
rutas.use('/sisweb/api/inventario',inventario)
rutas.use('/sisweb/api/detinventario',detinventario)
rutas.use('/sisweb/api/venta',venta)
rutas.use('/sisweb/api/receta',receta)
rutas.use('/sisweb/api/detventa',detventa)
rutas.use('/sisweb/api/config_datos_set',config_datos_set)
rutas.use('/sisweb/api/factura',factura)

module.exports = rutas;
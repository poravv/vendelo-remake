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
const pago = require('./servicios/pago')
const reportes = require('./servicios/reportes')

rutas.use('/vendelo/api/ciudad',ciudad);
rutas.use('/vendelo/api/comisiones',comisiones);
rutas.use('/vendelo/api/cliente',cliente);
rutas.use('/vendelo/api/sucursal',sucursal);
rutas.use('/vendelo/api/persona',persona)
rutas.use('/vendelo/api/usuario',usuario)
rutas.use('/vendelo/api/proveedor',proveedor)
rutas.use('/vendelo/api/articulo',articulo)
rutas.use('/vendelo/api/producto_final',producto_final)
rutas.use('/vendelo/api/inventario',inventario)
rutas.use('/vendelo/api/detinventario',detinventario)
rutas.use('/vendelo/api/venta',venta)
rutas.use('/vendelo/api/receta',receta)
rutas.use('/vendelo/api/detventa',detventa)
rutas.use('/vendelo/api/config_datos_set',config_datos_set)
rutas.use('/vendelo/api/factura',factura)
rutas.use('/vendelo/api/pago',pago)
rutas.use('/vendelo/api/reportes',reportes)

module.exports = rutas;
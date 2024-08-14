const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const factura_cab = require("../model/model_factura_cab")
const det_factura = require("../model/model_det_factura")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const verificaToken = require('../middleware/token_extractor')
require("dotenv").config()
let fechaActual = new Date();

routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const facturas = await database.query('select * from factura_cab order by descripcion asc', { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: facturas
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})


routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const facturas = await factura_cab.findAll({ include: [{ model: det_factura }] });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                res.json({
                    estado: "successfully",
                    body: facturas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/getidventa/:idventa', verificaToken, async (req, res) => {

    try {
        const facturas = await factura_cab.findOne({ 
            include: [{ model: det_factura }],
            where: { idventa: req.params.idventa, estado:'AC' },
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                res.json({
                    estado: "successfully",
                    body: facturas
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/:idfactura_cab', verificaToken, async (req, res) => {
    try {

        const facturas = await factura_cab.findByPk(req.params.idfactura_cab)
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                res.json({
                    estado: "successfully",
                    body: facturas
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    
    //console.log(req.body)
    const tcab = await database.transaction();
    const tdet = await database.transaction();
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                //Aqui realiza la captura del ultimo numero de factura
                const idsucursal = authData?.rsusuario?.idsucursal;
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha = strFecha;
                req.body.idsucursal = idsucursal;

                const config_datos_sets = await database.query(`select * from vw_config_datos_set where idsucursal=${idsucursal}`, { type: QueryTypes.SELECT })

                if (config_datos_sets) {
                    await database.query(`CALL aumenta_nro_factura(${config_datos_sets[0].idconfig_datos_set},@a)`);
                    req.body.nro_factura = config_datos_sets[0]?.nro_factura;
                }
                
                const facturas = await factura_cab.create(req.body, {
                    transaction: tcab
                }).then(async (cab) => {
                    //console.log(cab)
                    req.body.lst_detalle.map(async (det) => {
                        //console.log(det)
                        det.idfactura_cab = cab.idfactura_cab;
                        await det_factura.create(det, {
                            transaction: tdet
                        });
                        return true;
                    });
                    await tcab.commit();
                    await tdet.commit();
                });
                
                res.json({
                    estado: "successfully",
                    mensaje: 'Registro almacenado correctamente',
                    body: facturas
                })
            }
        })
    } catch (error) {
        await tcab.rollback();
        await tdet.rollback();
        res.json({ estado: "error", mensaje: error, });
    }
})

routes.put('/put/:idfactura_cab', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const facturas = await factura_cab.update(req.body, { where: { idfactura_cab: req.params.idfactura_cab } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                t.commit();
                res.json({
                    estado: 'successfully',
                    mensaje: "Registro actualizado correctamente",
                    authData: authData,
                    body: facturas
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.delete('/del/:idfactura_cab', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const facturas = await factura_cab.destroy({ where: { idfactura_cab: req.params.idfactura_cab } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: facturas
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})


module.exports = routes;
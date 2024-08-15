const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const factura_cab = require("../model/model_factura_cab")
const det_factura = require("../model/model_det_factura")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const { keycloak } = require('../middleware/keycloak_validate');
require("dotenv").config()
let fechaActual = new Date();

routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await database.query('select * from factura_cab order by descripcion asc', { type: QueryTypes.SELECT })
        .then((response) => {
            res.json({
                mensaje: "successfully",
                authData: authData,
                body: response
            });
        }).catch(error => {
            res.json({
                mensaje: "error",
                error: error,
                detmensaje: `Error en el servidor, ${error}`
            });
        });
})


routes.get('/get/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
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

routes.get('/getidventa/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        const facturas = await factura_cab.findOne({
            include: [{ model: det_factura }],
            where: { idventa: req.params.idventa, estado: 'AC' },
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

routes.get('/get/:idfactura_cab', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await factura_cab.findByPk(req.params.idfactura_cab).then((response) => {
        res.json({
            mensaje: "successfully",
            authData: authData,
            body: response
        });
    }).catch(error => {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    });
})

routes.post('/post/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const tcab = await database.transaction();
    const tdet = await database.transaction();
    try {
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

        t.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro almacenado satisfactoriamente",
            authData: authData,
            body: facturas
        });

    } catch (error) {
        await tcab.rollback();
        await tdet.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})

routes.put('/put/:idfactura_cab', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        const facturas = await factura_cab.update(req.body, { where: { idfactura_cab: req.params.idfactura_cab } }, {
            transaction: t
        });

        t.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro eliminado satisfactoriamente",
            authData: authData,
            body: facturas
        });

    } catch (error) {
        t.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})

routes.delete('/del/:idfactura_cab', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        const facturas = await factura_cab.destroy({ where: { idfactura_cab: req.params.idfactura_cab } }, {
            transaction: t
        });

        t.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro eliminado satisfactoriamente",
            authData: authData,
            body: facturas
        });

    } catch (error) {
        t.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})


module.exports = routes;
const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const config_datos_set = require("../model/model_config_datos_set")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor');
const { QueryTypes } = require('sequelize');
let fechaActual = new Date();
require("dotenv").config()

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

routes.get('/getsql/', verificaToken, async (req, res) => {
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                const idsucursal = authData?.rsusuario?.idsucursal;
                const config_datos_sets = await database.query(`select * from vw_config_datos_set where idsucursal=${idsucursal}`, { type: QueryTypes.SELECT })
                
                res.json({
                    estado: "successfully",
                    body: config_datos_sets
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})


routes.get('/likeCliente/:ruc', verificaToken, async (req, res) => {
    try {
        const rsconfig_datos_sets = await config_datos_set.findAll({
            where: {
                ruc: {
                    [Op.like]: `${req.params.ruc}%`
                }
            }
        })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error });;
            } else {
                res.json({
                    estado: "successfully",
                    body: rsconfig_datos_sets
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const config_datos_sets = await config_datos_set.findAll();

        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: config_datos_sets
                })
            }
        });
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/get/:idconfig_datos_set', verificaToken, async (req, res) => {
    const config_datos_sets = await config_datos_set.findByPk(req.params.idconfig_datos_set)
    jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
        if (error) res.json({ estado: "error", mensaje: error, })
        res.json({
            estado: "successfully",
            body: config_datos_sets
        })
    })
})

routes.post('/post/', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_insert = strFecha;
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                req.body.idsucursal = authData?.rsusuario?.idsucursal;
                const config_datos_sets = await config_datos_set.create(req.body, {
                    transaction: t
                });
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro almacenado correctamente",
                    body: config_datos_sets
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
        t.rollback();
    }

})

routes.put('/put/:idconfig_datos_set', verificaToken, async (req, res) => {

    const t = await database.transaction();
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
                req.body.fecha_upd = strFecha;
                req.body.idusuario_upd = authData?.rsusuario?.idusuario;
                const config_datos_sets = await config_datos_set.update(req.body, { where: { idconfig_datos_set: req.params.idconfig_datos_set } }, {
                    transaction: t
                });
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro actualizado correctamente",
                    body: config_datos_sets
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
        t.rollback();
    }

})

routes.delete('/del/:idconfig_datos_set', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const config_datos_sets = await config_datos_set.destroy({ where: { idconfig_datos_set: req.params.idconfig_datos_set } }, {
            transaction: t
        });
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: "Registro eliminado",
                    body: config_datos_sets
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
        t.rollback();
    }

})

module.exports = routes;
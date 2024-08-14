const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const comisiones = require("../model/model_comisiones")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const verificaToken = require('../middleware/token_extractor');
const usuario = require('../model/model_usuario');
const persona = require('../model/model_persona');
require("dotenv").config()

routes.get('/getsql/', verificaToken, async (req, res) => {
    try {
        const rscomisiones = await database.query('select * from comisiones', { type: QueryTypes.SELECT })
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, })
            } else {
                res.json({
                    estado: "successfully",
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})


routes.get('/get/', verificaToken, async (req, res) => {

    try {
        const rscomisiones = await comisiones.findAll();
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                res.json({
                    estado: "successfully",
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.get('/getidventa/:idventa', verificaToken, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                const rscomisiones = await comisiones.findAll({
                    where: { idventa: req.params.idventa },
                    include: [
                        { model: usuario, include: [{ model: persona }] },
                    ]
                },
                );
                res.json({
                    estado: "successfully",
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error, })
    }
})


routes.get('/get/:idcomisiones', verificaToken, async (req, res) => {
    try {

        const rscomisiones = await comisiones.findByPk(req.params.idcomisiones)
        jwt.verify(req.token, process.env.CLAVESECRETA, (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                res.json({
                    estado: "successfully",
                    body: rscomisiones
                });
            }
        })
    } catch (error) {
        res.json({ estado: "error", mensaje: error });
    }
})

routes.post('/post/', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {

        jwt.verify(req.token, process.env.CLAVESECRETA, async (error, authData) => {
            if (error) {
                res.json({ estado: "error", mensaje: error, });
            } else {
                const rscomisiones = await comisiones.create(req.body, {
                    transaction: t
                });
                t.commit();
                res.json({
                    estado: "successfully",
                    mensaje: 'Registro almacenado correctamente',
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, });
    }
})

routes.put('/put/:idcomisiones', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const rscomisiones = await comisiones.update(req.body, { where: { idcomisiones: req.params.idcomisiones } }, {
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
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})

routes.delete('/del/:idcomisiones', verificaToken, async (req, res) => {
    const t = await database.transaction();
    try {
        const rscomisiones = await comisiones.destroy({ where: { idcomisiones: req.params.idcomisiones } }, {
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
                    body: rscomisiones
                })
            }
        })
    } catch (error) {
        t.rollback();
        res.json({ estado: "error", mensaje: error, })
    }
})


module.exports = routes;
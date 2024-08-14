const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const comisiones = require("../model/model_comisiones")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const { keycloak } = require('../middleware/keycloak_validate');
const usuario = require('../model/model_usuario');
const persona = require('../model/model_persona');
require("dotenv").config()

routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    await database.query('select * from comisiones', { type: QueryTypes.SELECT }).then((response) => {
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
    await comisiones.findAll().then((response) => {
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

routes.get('/getidventa/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await comisiones.findAll({
        where: { idventa: req.params.idventa },
        include: [
            { model: usuario, include: [{ model: persona }] },
        ]
    },
    ).then((response) => {
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


routes.get('/get/:idcomisiones', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await comisiones.findByPk(req.params.idcomisiones).then((response) => {
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
    const t = await database.transaction();
    try {
        await comisiones.create(req.body, {
            transaction: t
        }).then(response => {
            t.commit();
            res.json({
                mensaje: "successfully",
                detmensaje: "Registro almacenado satisfactoriamente",
                authData: authData,
                body: response
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})

routes.put('/put/:idcomisiones', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await comisiones.update(req.body, { where: { idcomisiones: req.params.idcomisiones } }, {
            transaction: t
        }).then(response => {
            t.commit();
            res.json({
                mensaje: "successfully",
                detmensaje: "Registro actualizado satisfactoriamente",
                authData: authData,
                body: response
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})

routes.delete('/del/:idcomisiones', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await comisiones.destroy({ where: { idcomisiones: req.params.idcomisiones } }, {
            transaction: t
        }).then(response => {
            t.commit();
            res.json({
                mensaje: "successfully",
                detmensaje: "Registro eliminado satisfactoriamente",
                authData: authData,
                body: response
            });
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }
})


module.exports = routes;
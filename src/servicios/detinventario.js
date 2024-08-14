const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const det_inventario = require("../model/model_detinventario")
const inventario = require("../model/model_inventario")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
const { QueryTypes } = require('sequelize');
let fechaActual = new Date();
require("dotenv").config()


routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    await database.query(`select * from vw_det_inventario `,
        { type: QueryTypes.SELECT }).then((response) => {
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

routes.get('/getinvdetsuc/:idinventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const idsucursal = authData?.rsusuario?.idsucursal;
    await database.query(`select * from vw_det_inventario where idsucursal=${idsucursal} and idinventario=${req.params.idinventario}`, { type: QueryTypes.SELECT })
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

    await det_inventario.findAll({}).then((response) => {
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
});

routes.get('/get/:idinventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        if (req.params.idinventario) {
            //const det_inventarios = await det_inventario.findByPk(req.params.idinventario);
            const query = `select * from det_inventario where idinventario = ${req.params.idinventario} and estado ='AC'`;
            await database.query(query,
                {
                    model: det_inventario,
                    mapToModel: true // pass true here if you have any mapped fields
                }).then((response) => {
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
        } else {
            res.json({
                mensaje: "error",
                error: error,
                detmensaje: `Error idinventario null`
            });
        }
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})

routes.post('/post/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {

        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_insert = strFecha;
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;
        await det_inventario.create(req.body, { transaction: t }).then(response => {
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

routes.put('/put/:iddet_inventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        const det_inventarios = await det_inventario.update(req.body, { where: { iddet_inventario: req.params.iddet_inventario } }, {
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

routes.put('/inactiva/:iddet_inventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {

        //Captura parametro
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;
        const { cantidad, idinventario, estado } = req.body;
        //Query de actualizacion de cabecera
        const query = `update inventario set cantidad_total=(cantidad_total - ${cantidad})  where idinventario = ${idinventario}`;
        await database.query(query, {
            transaction: t
        });
        //Inactivacion de detalle
        await det_inventario.update(req.body, { where: { iddet_inventario: req.params.iddet_inventario } }, {
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
});

routes.delete('/del/:iddet_inventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await det_inventario.destroy({ where: { iddet_inventario: req.params.iddet_inventario } }, {
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
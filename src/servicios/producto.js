const express = require('express');
const routes = express.Router();
const producto = require("../model/model_producto")
const proveedor = require("../model/model_proveedor")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
require("dotenv").config()
let fechaActual = new Date();

routes.get('/get/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await producto.findAll({ include: proveedor }).then((response) => {
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

routes.get('/get/:idproducto', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await producto.findByPk(req.params.idproducto, { include: proveedor })
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

routes.post('/post/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    //console.log('Entra en producto------------------------------------------')
    const t = await database.transaction();
    try {

        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_insert = strFecha;
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;

        await producto.create(req.body, {
            transaction: t
        })
            .then(async response => {
                t.commit();
                await database.query('CALL cargaInventarioCab(@a)');
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

routes.put('/put/:idproducto', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    //console.log(req.body)
    try {
        const t = await database.transaction();

        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;
        await producto.update(req.body, { where: { idproducto: req.params.idproducto }, transaction: t })
            .then(response => {
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

routes.delete('/del/:idproducto', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await producto.destroy({ where: { idproducto: req.params.idproducto }, transaction: t })
            .then(response => {
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
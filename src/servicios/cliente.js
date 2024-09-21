const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const cliente = require("../model/model_cliente")
const ciudad = require("../model/model_ciudad")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
const { QueryTypes } = require('sequelize');
let fechaActual = new Date();
require("dotenv").config()
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


routes.get('/search/:param', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await database.query(`select * from vw_deuda where ruc ='${req.params.param}' or upper(razon_social) like upper('%${req.params.param}%') `, { type: QueryTypes.SELECT })
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

routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await database.query(`select * from vw_cliente where estado='AC'`, { type: QueryTypes.SELECT })
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


routes.get('/likeCliente/:ruc', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    await cliente.findAll({
        where: {
            ruc: {
                [Op.like]: `${req.params.ruc}%`
            }
        }
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
})

routes.get('/get/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    // Obtener los parámetros de paginación de la solicitud
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;

    try {
        let response;
        if (!page || !limit) {
            // Si no se especifican page y limit, obtener todos los registros
            response = await cliente.findAll({
                include: ciudad
            });
        } else {
            // Realizar la consulta con paginación
            response = await cliente.findAndCountAll({
                include: ciudad,
                limit: limit,
                offset: offset
            });
        }

        // Responder con datos y paginación si corresponde
        res.json({
            mensaje: "successfully",
            authData: authData,
            body: response.rows || response,
            pagination: response.count ? {
                totalItems: response.count,
                totalPages: Math.ceil(response.count / limit),
                currentPage: page,
                pageSize: limit
            } : undefined
        });
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
});


routes.get('/get/:idcliente', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await cliente.findByPk(req.params.idcliente, { include: ciudad }).then((response) => {
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
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_insert = strFecha;
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData.sub;
        await cliente.create(req.body, {
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

routes.put('/put/:idcliente', keycloak.protect(), async (req, res) => {

    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData.sub;;
        await cliente.update(req.body, { where: { idcliente: req.params.idcliente } }, {
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

routes.delete('/del/:idcliente', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await cliente.destroy({ where: { idcliente: req.params.idcliente } }, {
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
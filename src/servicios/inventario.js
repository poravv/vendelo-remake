const express = require('express');
const routes = express.Router();
const inventario = require("../model/model_inventario")
const sucursal = require("../model/model_sucursal")
const articulo = require("../model/model_articulo")
const detinventario = require("../model/model_detinventario")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
const { QueryTypes } = require('sequelize');
const det_inventario = require('../model/model_detinventario');
let fechaActual = new Date();
require("dotenv").config()

routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const idsucursal = authData.idsucursal;;
    await database.query(`select * from vw_analisis_inv where idsucursal=${idsucursal}`, { type: QueryTypes.SELECT })
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
    await inventario.findAll({
        include: [
            { model: sucursal },
            { model: articulo },
            { model: detinventario },
        ]
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
});


routes.get('/getinvsuc/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const idsucursal = authData.idsucursal;

    console.log(idsucursal);

    // Obtener los parámetros de paginación de la solicitud
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const offset = (page - 1) * limit;

    try {
        // Ejecutar el procedimiento almacenado
        await database.query('CALL cargaInventarioCab(@a)');

        let response;
        if (!page || !limit) {
            // Si no se especifican page y limit, obtener todos los registros
            response = await inventario.findAll({
                where: { idsucursal: idsucursal },
                include: [
                    { model: sucursal },
                    { model: articulo },
                    { model: detinventario }
                ]
            });
        } else {
            // Realizar la consulta con paginación
            response = await inventario.findAndCountAll({
                where: { idsucursal: idsucursal },
                include: [
                    { model: sucursal },
                    { model: articulo },
                    { model: detinventario }
                ],
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


routes.get('/get/:idinventario', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: articulo },
            { model: detinventario },
        ]
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
});

routes.get('/getidarticulo/:idarticulo', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        const idsucursal = authData.idsucursal;;
        const query = `select * from inventario where idarticulo = ${req.params.idarticulo} and idsucursal= ${idsucursal} and estado ='AC'`;
        await database.query(query,
            {
                model: inventario,
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
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
});

routes.get('/getDet/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await inventario.findAll({
        include: [
            { model: sucursal },
            { model: articulo },
            { model: detinventario },
        ]
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
});

routes.post('/post/', keycloak.protect(), async (req, res) => {

    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        req.body.idsucursal = authData.idsucursal;;
        await inventario.create(req.body, { transaction: t }).then(response => {
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


routes.put('/put/:idinventario', keycloak.protect(), async (req, res) => {

    const t = await database.transaction();
    const tdet = await database.transaction();

    try {
        const oldInventario = await inventario.findByPk(req.body.idinventario);
        const cantidad_actual = parseInt(req.body.cantidad_total);
        const cantidad_total = parseInt(oldInventario.cantidad_total) + parseInt(cantidad_actual);
        req.body.cantidad_total = cantidad_total;
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        await inventario.update(req.body, { where: { idinventario: req.params.idinventario }, transaction: t })
            .then(async response => {
                
                

                let det_inventario_save={};
                det_inventario_save.idinventario= parseInt(req.params.idinventario);
                console.log(parseInt(req.params.idinventario))
                det_inventario_save.fecha_insert = new Date(strFecha);
                det_inventario_save.fecha_upd = new Date(strFecha);
                det_inventario_save.idusuario_upd = authData.sub;
                det_inventario_save.cantidad=cantidad_actual;
                det_inventario_save.estado="AC";
                await det_inventario.create(det_inventario_save, { transaction: tdet })
                t.commit();
                tdet.commit();
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
        tdet.rollback();
        t.rollback();
    }
});

routes.put('/inactiva/:idinventario', keycloak.protect(), async (req, res) => {

    const t = await database.transaction();
    const t1 = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        //Query de actualizacion de cabecera
        const queryCab = `update inventario set cantidad_total = 0 where idinventario = ${req.params.idinventario}`;
        await database.query(queryCab, { type: QueryTypes.UPDATE }, {
            transaction: t
        });
        //Inactivacion de detalle
        const queryDet = `update det_inventario set estado='AN' where idinventario = ${req.params.idinventario}`;
        await database.query(queryDet, { type: QueryTypes.UPDATE }, {
            transaction: t1
        });

        t.commit();
        t1.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro actualizado satisfactoriamente",
            authData: authData
        });
    } catch (error) {
        t.rollback();
        t1.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})

routes.delete('/del/:idinventario', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await inventario.destroy({ where: { idinventario: req.params.idinventario }, transaction: t })
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
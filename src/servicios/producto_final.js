const express = require('express');
const routes = express.Router();
const producto_final = require("../model/model_producto_final")
const receta = require("../model/model_receta")
const database = require('../database')
const { QueryTypes } = require("sequelize")
const { keycloak } = require('../middleware/keycloak_validate');
const articulo = require('../model/model_articulo');
require("dotenv").config()

routes.get('/getsql/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await database.query(`select * from producto_final where estado='AC'`, { type: QueryTypes.SELECT })
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
});

routes.get('/productoventa/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const idsucursal = authData.idsucursal;;
    await database.query(`select * from vw_venta_prod_stock where estado ='AC' and idsucursal=${idsucursal} `,
        {
            model: producto_final,
            mapToModel: true
        }, { type: QueryTypes.SELECT })
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
});

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
            response = await producto_final.findAll({
                include: [
                    {
                        model: receta,
                        include: [{ model: articulo }]
                    },
                ]
            });
        } else {
            // Realizar la consulta con paginación
            response = await producto_final.findAndCountAll({
                include: [
                    {
                        model: receta,
                        include: [{ model: articulo }]
                    },
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


routes.get('/get/:idproducto_final', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await producto_final.findByPk(req.params.idproducto_final)
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
    const t = await database.transaction();
    try {
        const recetas = req.body.receta;
        delete req.body.receta;
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await producto_final.create(req.body, {
            transaction: t
        }).then(response => {
            t.commit();
            recetas.map(async (data) => {
                let persist = {}
                persist.idarticulo = data.idarticulo;
                persist.idproducto_final = response.idproducto_final;
                persist.receta_estado="AC";
                persist.estado="AC";
                persist.cantidad = data.cantidad;

                console.log(persist)
                await receta.create(persist);
            })

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

routes.put('/put/:idproducto_final', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await producto_final.update(req.body, { where: { idproducto_final: req.params.idproducto_final } }, {
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

routes.put('/inactiva/:idproducto_final', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    //console.log("Entra en inactiva", req.params.idproducto_final);
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const tcab = await database.transaction();
        await producto_final.update(req.body, { where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: tcab
        });

        tcab.commit();

        const queryDet = `update producto_final set estado='IN' where idproducto_final = ${req.params.idproducto_final}`;

        await database.query(queryDet, {
            transaction: t
        }, { type: QueryTypes.SELECT });

        t.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro inactivado satisfactoriamente",
            authData: authData,
        })

    } catch (error) {
        t.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }
})

routes.delete('/del/:idproducto_final', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await producto_final.destroy({ where: { idproducto_final: req.params.idproducto_final } }, {
            transaction: t
        });
        t.commit();
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro eliminado satisfactoriamente",
            authData: authData,
        })

    } catch (error) {
        res.json({ estado: 'error', mensjae: error });
        t.rollback();
    }
})


module.exports = routes;
const express = require('express');
const routes = express.Router();
const inventario = require("../model/model_inventario")
const sucursal = require("../model/model_sucursal")
const producto = require("../model/model_producto")
const detinventario = require("../model/model_detinventario")
const database = require('../database')
const verificaToken = require('../middleware/token_extractor');
const { QueryTypes } = require('sequelize');
require("dotenv").config()

routes.get('/getsql/', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const idsucursal = authData?.rsusuario?.idsucursal;
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

routes.get('/get/', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
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


routes.get('/getinvsuc/', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const idsucursal = authData?.rsusuario?.idsucursal;

    await database.query('CALL cargaInventarioCab(@a)');
    await inventario.findAll({
        where: { idsucursal: idsucursal },
        include: [
            { model: sucursal },
            { model: producto },
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

routes.get('/get/:idinventario', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await inventario.findByPk(req.params.idinventario, {
        include: [
            { model: sucursal },
            { model: producto },
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

routes.get('/getidproducto/:idproducto', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        const idsucursal = authData?.rsusuario?.idsucursal;
        const query = `select * from inventario where idproducto = ${req.params.idproducto} and idsucursal= ${idsucursal} and estado ='AC'`;
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

routes.get('/getDet/', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await inventario.findAll({
        include: [
            { model: sucursal },
            { model: producto },
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

routes.post('/post/', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        req.body.idsucursal = authData?.rsusuario?.idsucursal;
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


routes.put('/put/:idinventario', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();

    try {
        await inventario.update(req.body, { where: { idinventario: req.params.idinventario }, transaction: t })
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
});

routes.put('/inactiva/:idinventario', verificaToken, async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    const t1 = await database.transaction();
    try {
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

routes.delete('/del/:idinventario', verificaToken, async (req, res) => {
    const t = await database.transaction();
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
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
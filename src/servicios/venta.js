const express = require('express');
const routes = express.Router();
const jwt = require("jsonwebtoken");
const venta = require("../model/model_venta")
const usuario = require("../model/model_usuario")
const cliente = require("../model/model_cliente")
const detventa = require("../model/model_detventa")
const producto_final = require("../model/model_producto_final")
const database = require('../database');
const { keycloak } = require('../middleware/keycloak_validate');
const comisiones = require('../model/model_comisiones');
const vw_venta = require('../model/model_vw_venta');
require("dotenv").config()
let fechaActual = new Date();

routes.get('/getpedidos/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await vw_venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
        ],
        where: { estado: 'PA' },
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


routes.get('/get/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await vw_venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
        ],
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

routes.get('/getvenusu', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const idusuario = authData?.rsusuario?.idusuario;
    await vw_venta.findAll({
        where: { idusuario: idusuario, estado: 'AS' },
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
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

routes.get('/getvenasig', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const idusuario = authData?.rsusuario?.idusuario;
    const ventas = await vw_venta.findAll({
        where: { idusuario: idusuario, estado: 'AS' },
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
            { model: comisiones, where: { idusuario: idusuario } },
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

routes.get('/getvenusupa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    const idusuario = authData?.rsusuario?.idusuario;
    const ventas = await vw_venta.findAll({
        where: { idusuario: idusuario, estado: 'PA' },
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
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

/*venta o retorno*/
routes.post('/operacionventa/:idproducto_final/:operacion/:total', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        const idusuario = authData?.rsusuario?.idusuario;
        await database.query('CALL addventainventario(' + req.params.idproducto_final + ',"' + req.params.operacion + '",' + idusuario + ',' + req.params.total + ',@a)')
            .then(response => {
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Operación exitosa",
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
    }
});


routes.post('/verificaproceso/:idusuario-:tabla', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        await database.query(`CALL verificaProcesos(${req.params.idusuario},'${req.params.tabla}',@a)`)
            .then(response => {
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Venta procesada con exito",
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
    }
});



routes.get('/get/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const ventas = await venta.findByPk(req.params.idventa, {
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
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
})

routes.get('/getDet/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const ventas = await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: detventa, include: [{ model: producto_final }] },
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
})

routes.post('/post/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    //console.log(req.body);
    const t = await database.transaction();
    try {

        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        const { comision } = req.body;
        //console.log(comision)
        req.body.estado = "PA";

        if (comision === "0.10") {
            req.body.estado = "PA";
        }
        if (comision === "1.00") {
            req.body.estado = "AS";
        }

        req.body.fecha = strFecha;
        req.body.fecha_upd = strFecha;
        req.body.idusuario = authData?.rsusuario?.idusuario;
        req.body.idusuario_insert = authData?.rsusuario?.idusuario;
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;
        const ventas = await venta.create(req.body, { transaction: t })
        t.commit();
        if (req.body.estado === "AS") {
            await comisiones.create({ idusuario: req.body.idusuario, idventa: ventas.idventa, estado: "AC" })
        }
        res.json({
            estado: "successfully",
            mensaje: "Registro almacenado",
            body: ventas
        })
    } catch (error) {
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
        t.rollback();
    }

})

routes.put('/put/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData?.rsusuario?.idusuario;
        await venta.update(req.body, { where: { idventa: req.params.idventa }, transaction: t })
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

routes.put('/inactiva/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        //Captura parametro 
        const { idventa, idusuario } = req.body;
        //Query de actualizacion de cabecera
        const query = `CALL inactivapedidoventa(${idventa},${idusuario},@a)`;
        //console.log(query);

        await database.query(query, {
            transaction: t
        }).then(response => {
            t.commit();
            res.json({
                mensaje: "successfully",
                detmensaje: "Registro inactivado",
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

routes.delete('/del/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    const t = await database.transaction();
    try {
        await venta.destroy({ where: { idventa: req.params.idventa }, transaction: t })
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
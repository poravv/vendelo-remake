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
const det_venta = require('../model/model_detventa');
const pago = require('../model/model_pago');
const moment = require('moment');
const sys_config = require('../model/model_sys_config');
require("dotenv").config()
let fechaActual = new Date();

routes.get('/getpedidos/', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }

    await vw_venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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
    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }
    await vw_venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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
    const idusuario = authData.sub;

    try {
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }

    await vw_venta.findAll({
        where: {
            idusuario: idusuario
            //, estado: 'AS' 
        },
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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
    const idusuario = authData.sub;
    try {
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }
    await vw_venta.findAll({
        where: { idusuario: idusuario, estado: 'AS' },
        include: [
            { model: usuario },
            { model: pago },
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
    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }
    const idusuario = authData.sub;
    await vw_venta.findAll({
        where: { idusuario: idusuario, estado: 'PA' },
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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

routes.post('/verificaproceso/:idusuario-:tabla', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        await database.query(`CALL verificaProcesos('${req.params.idusuario}','${req.params.tabla}',@a)`)
            .then(response => {
                res.json({
                    mensaje: "successfully",
                    detmensaje: "Procesado",
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
    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }
    await venta.findByPk(req.params.idventa, {
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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
    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }
    await venta.findAll({
        include: [
            { model: usuario },
            { model: cliente },
            { model: pago },
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
    try {
        const idusuario = authData.sub;
        await database.query(`CALL verificaProcesos('${idusuario}','inventario',@a)`)
    } catch (error) {
        console.log(error)
    }

    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        //const { comision } = req.body;
        //console.log(comision)

        /*
        if (comision === "0.10") {
            req.body.estado = "PA"; //Pendiente de asignacion
        }
        if (comision === "1.00") {
            req.body.estado = "AS"; //Asignado
        }
        */

        let ventaCab = {};
        let ventaDet = {};
        const { comision, costo_envio, idcliente, iva_total, nro_comprobante, detalle, total, tipo_venta, cuotas } = req.body;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        ventaCab.fecha = strFecha;
        ventaCab.total = total;
        ventaCab.total = total;
        ventaCab.fecha_upd = strFecha;
        ventaCab.idusuario = authData.sub;
        ventaCab.idsucursal = authData.idsucursal;
        ventaCab.idusuario_insert = authData.sub;
        ventaCab.idusuario_upd = authData.sub;
        ventaCab.idcliente = idcliente;
        ventaCab.costo_envio = costo_envio;
        ventaCab.iva_total = iva_total;
        ventaCab.tipo_venta = tipo_venta;
        ventaCab.nro_comprobante = nro_comprobante;
        ventaCab.cuotas = cuotas;
        ventaCab.estado = "AC";

        //console.log(ventaCab)
        //console.log(detalle)

        await venta.create(ventaCab, { transaction: t }).then(async (response) => {
            await detalle.map(async (data) => {
                ventaDet.idventa = response.idventa;
                ventaDet.idproducto_final = data.idproducto_final;
                ventaDet.cantidad = data.cantidad;
                ventaDet.estado = "AC";
                ventaDet.descuento = data.descuento;
                ventaDet.subtotal = data.subtotal;
                await det_venta.create(ventaDet);
                //operacion venta
                await database.query('CALL addventainventario(' + data.idproducto_final + ',"procesado","' + ventaCab.idusuario + '",' + ventaCab.idsucursal + ', 0,@a)');

                if(cuotas||tipo_venta=='CR'){
                    const fechaInicio = new Date();
                    crearPagos(total, cuotas, fechaInicio, response.idventa);
                }

            })
        })

        t.commit();
        //if (req.body.estado === "AS") {
        //  await comisiones.create({ idusuario: req.body.idusuario, idventa: ventas.idventa, estado: "AC" })
        //}
        res.json({
            mensaje: "successfully",
            detmensaje: "Registro almacenado satisfactoriamente",
            //body: ventas
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

async function crearPagos(montoTotal, cuotas, fechaInicio, idventa) {

    const montoPorCuota = montoTotal / cuotas;
    
    /*
    const mora = await sys_config.findOne({
        where: { descripcion: 'mora' }
    })
    */

    for (let i = 1; i <= cuotas; i++) {

        let fechaVencimiento = moment   (fechaInicio).add(i, 'months').toDate();

        let nuevoPago = {
            cuota: i,
            vencimiento: fechaVencimiento,
            idventa: idventa,
            monto_pago: montoPorCuota,
            estado:'PP'
            // otros campos necesarios para el pago
        };

        //console.log('--------------->')
        //console.log(nuevoPago);
        
        await pago.create(nuevoPago);

        console.log(`Pago ${i} creado con fecha de vencimiento: ${fechaVencimiento}`);
    }
}

/*venta o retorno*/
routes.post('/operacionventa/:idproducto_final/:operacion/:total', keycloak.protect(), async (req, res) => {

    const token = req.kauth.grant.access_token;
    const authData = token.content;
    try {
        const idusuario = authData.sub;
        const idsucursal = authData.idsucursal;
        await database.query('CALL addventainventario(' + req.params.idproducto_final + ',"' + req.params.operacion + '","' + idusuario + '",' + idsucursal + ',' + req.params.total + ',@a)')
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

routes.put('/put/:idventa', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData.sub;
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
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
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
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
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
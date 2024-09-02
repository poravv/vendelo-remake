const express = require('express');
const routes = express.Router();
const Pago = require("../model/model_pago")
const database = require('../database')
const { keycloak } = require('../middleware/keycloak_validate');
let fechaActual = new Date();
require("dotenv").config()
const Sequelize = require('sequelize');
const Venta = require('../model/model_venta');
const clientes = require('../model/model_cliente');
const Op = Sequelize.Op;

routes.get('/getdeuda/:idventa', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;

    await Pago.findAll({
        where: {
            idventa: req.params.idventa,
            estado: {
                [Op.ne]: 'PA'
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

    await Pago.findAll().then((response) => {
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

routes.get('/get/:idpago', keycloak.protect(), async (req, res) => {
    const token = req.kauth.grant.access_token;
    const authData = token.content;
    await Pago.findByPk(req.params.idpago).then((response) => {
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

routes.post('/post', keycloak.protect(), async (req, res) => {
    const pagos = req.body.pagos;

    if (!Array.isArray(pagos) || pagos.length === 0) {
        return res.status(400).send('El cuerpo de la solicitud debe contener un array de pagos');
    }

    const t = await database.transaction();
    try {
        let ticket = {}
        let arrayPagos = []
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const fechaActual = new Date();
        const strFecha = `${fechaActual.getFullYear()}-${fechaActual.getMonth() + 1}-${fechaActual.getDate()}`;

        for (const pago of pagos) {
            pago.fecha_pago = strFecha;
            pago.idusuario_upd = authData.sub;

            // Obtener el monto a pagar y el monto pagado
            const deuda = await Pago.findOne({ where: { idpago: pago.idpago } });
            const montoAPagar = (deuda.monto_pago ?? 0) - (deuda.pagado ?? 0);

            //console.log('----->',deuda.idventa)

            // Actualizar el estado basado en el monto pagado
            if (pago.pagado >= montoAPagar) {
                pago.idventa = deuda.idventa;
                pago.vencimiento = deuda.vencimiento;
                pago.cuota = deuda.cuota;
                pago.estado = 'PA';
                pago.monto_pago = deuda.monto_pago
                pago.pagado = deuda.monto_pago;
            } else {
                pago.idventa = deuda.idventa;
                pago.vencimiento = deuda.vencimiento;
                pago.cuota = deuda.cuota;
                pago.estado = 'PAR';
                pago.monto_pago = deuda.monto_pago
                pago.pagado = Number(pago.pagado ?? 0) + Number(deuda.pagado ?? 0);
                //console.log('----->', pago.pagado)
            }

            arrayPagos.push(pago);

            await Pago.update(pago, {
                where: { idpago: pago.idpago },
                transaction: t
            });
        }

        //console.log(arrayPagos)

        const venta = await Venta.findOne({
            include: [
                { model: clientes },
            ],
            where: { idventa: arrayPagos[0].idventa }
        })

        console.log(venta);

        ticket.venta = venta;
        ticket.pagos = arrayPagos;

        await t.commit();

        //const deuda = await Pago.findOne({ where: { idpago: pago.idpago } });


        res.json({
            mensaje: "successfully",
            detmensaje: "Registros actualizados satisfactoriamente",
            authData: authData,
            body: ticket
        });
    } catch (error) {
        await t.rollback();
        res.json({
            mensaje: "error",
            error: error,
            detmensaje: `Error en el servidor, ${error}`
        });
    }

})

routes.put('/put/:idpago', keycloak.protect(), async (req, res) => {

    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
        req.body.fecha_upd = strFecha;
        req.body.idusuario_upd = authData.sub;;
        await Pago.update(req.body, { where: { idpago: req.params.idpago } }, {
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

routes.delete('/del/:idpago', keycloak.protect(), async (req, res) => {
    const t = await database.transaction();
    try {
        const token = req.kauth.grant.access_token;
        const authData = token.content;
        await Pago.destroy({ where: { idpago: req.params.idpago } }, {
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